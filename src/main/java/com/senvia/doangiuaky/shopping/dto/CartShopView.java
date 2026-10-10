package com.senvia.doangiuaky.shopping.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartShopView(
        Long shopId,
        String shopName,
        List<CartItemView> items,
        BigDecimal subtotal) {
}
