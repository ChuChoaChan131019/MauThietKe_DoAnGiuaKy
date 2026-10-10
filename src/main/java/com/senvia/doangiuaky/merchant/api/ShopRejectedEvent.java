package com.senvia.doangiuaky.merchant.api;

import java.time.Instant;
import java.util.UUID;

/** Public event emitted after an admin rejects a pending shop request. */
public record ShopRejectedEvent(
        UUID eventId,
        Long shopId,
        Long ownerId,
        String shopName,
        String rejectionReason,
        Long rejectedById,
        Instant rejectedAt) {
}
