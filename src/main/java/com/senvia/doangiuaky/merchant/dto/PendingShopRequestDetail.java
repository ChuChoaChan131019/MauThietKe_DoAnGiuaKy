package com.senvia.doangiuaky.merchant.dto;

import com.senvia.doangiuaky.merchant.entity.ShopStatus;

import java.time.Instant;

/** Safe detail representation of a pending shop request for Admin UI. */
public record PendingShopRequestDetail(
        Long shopId,
        String shopName,
        String description,
        String logoUrl,
        String phone,
        String address,
        String ownerName,
        Instant submittedAt,
        ShopStatus status) {
}
