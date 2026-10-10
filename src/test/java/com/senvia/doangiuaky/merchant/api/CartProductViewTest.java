package com.senvia.doangiuaky.merchant.api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.math.BigDecimal;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CartProductViewTest {

    @ParameterizedTest(name = "{0}")
    @MethodSource("unsaleableProducts")
    void isSaleableIsFalseWhenOneRequiredConditionIsInvalid(
            String reason, CartProductView product) {
        assertFalse(product.isSaleable(), reason);
    }

    @Test
    void isSaleableIsTrueWhenAllConditionsAreValid() {
        assertTrue(product(true, true, true, true, 3, new BigDecimal("100000")).isSaleable());
    }

    private static Stream<Arguments> unsaleableProducts() {
        return Stream.of(
                Arguments.of("owner is locked", product(false, true, true, true, 3,
                        new BigDecimal("100000"))),
                Arguments.of("shop is not approved", product(true, false, true, true, 3,
                        new BigDecimal("100000"))),
                Arguments.of("category is inactive", product(true, true, false, true, 3,
                        new BigDecimal("100000"))),
                Arguments.of("product is hidden", product(true, true, true, false, 3,
                        new BigDecimal("100000"))),
                Arguments.of("stock is zero", product(true, true, true, true, 0,
                        new BigDecimal("100000"))),
                Arguments.of("stock is negative", product(true, true, true, true, -1,
                        new BigDecimal("100000"))),
                Arguments.of("price is null", product(true, true, true, true, 3, null)),
                Arguments.of("price is zero", product(true, true, true, true, 3,
                        BigDecimal.ZERO)),
                Arguments.of("price is negative", product(true, true, true, true, 3,
                        new BigDecimal("-1"))));
    }

    private static CartProductView product(
            boolean ownerActive,
            boolean shopApproved,
            boolean categoryActive,
            boolean productActive,
            int stock,
            BigDecimal price) {
        return new CartProductView(
                20L,
                30L,
                40L,
                "Shop",
                "Product",
                null,
                price,
                stock,
                ownerActive,
                shopApproved,
                categoryActive,
                productActive);
    }
}
