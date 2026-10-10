package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.IdentityApi;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.merchant.api.ShopApprovedEvent;
import com.senvia.doangiuaky.merchant.entity.Shop;
import com.senvia.doangiuaky.merchant.repository.ShopRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

@Service
public class ShopApprovalService {

    private final ShopRepository shopRepository;
    private final IdentityApi identityApi;
    private final ApplicationEventPublisher eventPublisher;

    public ShopApprovalService(ShopRepository shopRepository,
                               IdentityApi identityApi,
                               ApplicationEventPublisher eventPublisher) {
        this.shopRepository = shopRepository;
        this.identityApi = identityApi;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public void approve(Long shopId, Long adminId) {
        Objects.requireNonNull(shopId, "Shop ID must not be null");
        Objects.requireNonNull(adminId, "Admin ID must not be null");

        UserSummary admin = identityApi.findUser(adminId)
                .filter(user -> user.role() == UserRole.ADMIN
                        && user.accountStatus() == AccountStatus.ACTIVE)
                .orElseThrow(() -> new ShopApprovalAuthorizationException(
                        "Chỉ quản trị viên đang hoạt động mới được phê duyệt gian hàng."));

        Shop shop = shopRepository.findByIdForUpdate(shopId)
                .orElseThrow(() -> new ShopRequestNotFoundException(
                        "Không tìm thấy gian hàng cần phê duyệt."));

        Instant approvedAt = Instant.now();
        shop.approve(adminId, approvedAt);
        shopRepository.save(shop);

        eventPublisher.publishEvent(new ShopApprovedEvent(
                UUID.randomUUID(),
                shop.getId(),
                shop.getOwnerId(),
                shop.getShopName(),
                adminId,
                approvedAt));
    }
}
