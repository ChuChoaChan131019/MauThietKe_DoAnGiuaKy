package com.senvia.doangiuaky.merchant.api;

import java.time.Instant;

/** Public, read-only shop request data used by admin views in other modules. */
public record PendingShopRequestCard(
        Long shopId,
        String shopName,
        String ownerName,
        Instant submittedAt) {
}
