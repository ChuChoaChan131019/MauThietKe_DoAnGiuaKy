package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.identity.api.IdentityApi;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.merchant.api.MerchantShopRequestApi;
import com.senvia.doangiuaky.merchant.api.PendingShopRequestCard;
import com.senvia.doangiuaky.merchant.dto.PendingShopRequestDetail;
import com.senvia.doangiuaky.merchant.dto.PendingShopRequestSummary;
import com.senvia.doangiuaky.merchant.entity.Shop;
import com.senvia.doangiuaky.merchant.entity.ShopStatus;
import com.senvia.doangiuaky.merchant.repository.ShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AdminShopRequestService implements MerchantShopRequestApi {

    private final ShopRepository shopRepository;
    private final IdentityApi identityApi;

    public AdminShopRequestService(ShopRepository shopRepository, IdentityApi identityApi) {
        this.shopRepository = shopRepository;
        this.identityApi = identityApi;
    }

    public List<PendingShopRequestSummary> listPendingRequests() {
        return pendingShops()
                .stream()
                .map(this::toSummary)
                .toList();
    }

    @Override
    public List<PendingShopRequestCard> findPendingShopRequests() {
        return pendingShops()
                .stream()
                .map(shop -> new PendingShopRequestCard(
                        shop.getId(),
                        shop.getShopName(),
                        ownerName(shop),
                        shop.getSubmittedAt()))
                .toList();
    }

    public PendingShopRequestDetail getPendingRequest(Long shopId) {
        return shopRepository.findByIdAndStatus(shopId, ShopStatus.PENDING)
                .map(this::toDetail)
                .orElseThrow(() -> new ShopRequestNotFoundException(
                        "Không tìm thấy yêu cầu mở gian hàng đang chờ."));
    }

    private PendingShopRequestSummary toSummary(Shop shop) {
        return new PendingShopRequestSummary(
                shop.getId(),
                shop.getShopName(),
                ownerName(shop),
                shop.getSubmittedAt(),
                shop.getStatus());
    }

    private PendingShopRequestDetail toDetail(Shop shop) {
        return new PendingShopRequestDetail(
                shop.getId(),
                shop.getShopName(),
                shop.getDescription(),
                shop.getLogoUrl(),
                shop.getPhone(),
                shop.getAddress(),
                ownerName(shop),
                shop.getSubmittedAt(),
                shop.getStatus());
    }

    private String ownerName(Shop shop) {
        UserSummary owner = identityApi.findUser(shop.getOwnerId())
                .orElseThrow(() -> new ShopRequestNotFoundException(
                        "Không tìm thấy thông tin người gửi yêu cầu."));
        return owner.fullName();
    }

    private List<Shop> pendingShops() {
        return shopRepository.findAllByStatusOrderBySubmittedAtAsc(ShopStatus.PENDING);
    }
}
