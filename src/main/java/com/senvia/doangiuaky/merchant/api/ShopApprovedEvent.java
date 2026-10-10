package com.senvia.doangiuaky.merchant.api;

import java.time.Instant;
import java.util.UUID;

/** Public event emitted after an admin approves a pending shop request. */
public record ShopApprovedEvent(
        UUID eventId,
        Long shopId,
        Long ownerId,
        String shopName,
        Long approvedById,
        Instant approvedAt) {
}
