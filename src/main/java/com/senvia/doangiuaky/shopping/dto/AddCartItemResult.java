package com.senvia.doangiuaky.shopping.dto;

public record AddCartItemResult(
        CartItemView item,
        boolean quantityClamped,
        String message) {
}
