package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.IdentityApi;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.merchant.api.ShopRejectedEvent;
import com.senvia.doangiuaky.merchant.entity.Shop;
import com.senvia.doangiuaky.merchant.repository.ShopRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Service
public class ShopRejectionService {

    private final ShopRepository shopRepository;
    private final IdentityApi identityApi;
    private final ApplicationEventPublisher eventPublisher;

    public ShopRejectionService(ShopRepository shopRepository,
                                IdentityApi identityApi,
                                ApplicationEventPublisher eventPublisher) {
        this.shopRepository = shopRepository;
        this.identityApi = identityApi;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public void reject(Long shopId, Long adminId, String reason) {
        Objects.requireNonNull(shopId, "Shop ID must not be null");
        Objects.requireNonNull(adminId, "Admin ID must not be null");
        String normalizedReason = normalizeReason(reason);

        UserSummary admin = identityApi.findUser(adminId)
                .filter(user -> user.role() == UserRole.ADMIN
                        && user.accountStatus() == AccountStatus.ACTIVE)
                .orElseThrow(() -> new ShopRejectionAuthorizationException(
                        "Chỉ quản trị viên đang hoạt động mới được từ chối gian hàng."));

        Shop shop = shopRepository.findByIdForUpdate(shopId)
                .orElseThrow(() -> new ShopRequestNotFoundException(
                        "Không tìm thấy gian hàng cần từ chối."));

        Instant rejectedAt = Instant.now();
        shop.reject(adminId, normalizedReason);
        shopRepository.save(shop);

        eventPublisher.publishEvent(new ShopRejectedEvent(
                UUID.randomUUID(),
                shop.getId(),
                shop.getOwnerId(),
                shop.getShopName(),
                normalizedReason,
                adminId,
                rejectedAt));
    }

    private static String normalizeReason(String reason) {
        if (reason == null || reason.trim().isBlank()) {
            throw new IllegalArgumentException("Shop rejection reason must not be blank");
        }
        return reason.trim();
    }
}
