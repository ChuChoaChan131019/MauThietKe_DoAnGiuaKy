package com.senvia.doangiuaky.merchant.dto;

import com.senvia.doangiuaky.merchant.entity.ShopStatus;

import java.time.Instant;

/** Safe list representation of a pending shop request for Admin UI. */
public record PendingShopRequestSummary(
        Long shopId,
        String shopName,
        String ownerName,
        Instant submittedAt,
        ShopStatus status) {
}
