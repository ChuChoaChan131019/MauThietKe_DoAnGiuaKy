package com.senvia.doangiuaky.merchant.api;

import java.math.BigDecimal;

/**
 * Read-only product contract used by Shopping when adding or displaying a cart item.
 * Merchant remains the source of truth for all catalog and stock fields.
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
