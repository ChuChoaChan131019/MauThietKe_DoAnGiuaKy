package com.senvia.doangiuaky.shopping.dto;

import java.math.BigDecimal;
import java.util.List;

public record CartView(
        List<CartShopView> shops,
        int totalQuantity,
        BigDecimal subtotal) {

    public static CartView empty() {
        return new CartView(List.of(), 0, BigDecimal.ZERO);
    }

    public boolean hasItems() {
        return shops.stream().anyMatch(shop -> !shop.items().isEmpty());
    }

    public boolean hasCheckoutableItems() {
        return totalQuantity > 0;
    }

    public boolean isEmpty() {
        return !hasItems();
    }
}
