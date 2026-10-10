package com.senvia.doangiuaky.merchant.api;

import java.math.BigDecimal;

/**
 * Read-only product contract used by catalog consumers when checking or displaying a product.
 * Merchant remains the source of truth for owner, shop, category, catalog and stock fields.
 *
 * <p>A product is saleable only when the owner is active, the shop is approved, the category and
 * product are active, stock is positive, and the current price is positive. The summary is still
 * returned when a product exists but is not saleable so cart consumers can display a warning.</p>
 */
public record CartProductView(
        Long productId,
        Long shopId,
        Long shopOwnerId,
        String shopName,
        String productName,
        String imageUrl,
        BigDecimal currentPrice,
        int stockQuantity,
        boolean ownerActive,
        boolean shopApproved,
        boolean categoryActive,
        boolean productActive) {

    public boolean isSaleable() {
        return ownerActive
                && shopApproved
                && categoryActive
                && productActive
                && stockQuantity > 0
                && currentPrice != null
                && currentPrice.signum() > 0;
    }
}
