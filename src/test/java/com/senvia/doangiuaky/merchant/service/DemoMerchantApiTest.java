package com.senvia.doangiuaky.merchant.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class DemoMerchantApiTest {

    private final DemoMerchantApi merchantApi = new DemoMerchantApi();

    @Test
    void returnsSaleableDemoProductThroughPublicContract() {
        var product = merchantApi.findProductForCart(1L);

        assertTrue(product.isPresent());
        assertEquals("Canvas Tote Bag", product.orElseThrow().productName());
        assertTrue(product.orElseThrow().isSaleable());
    }

    @Test
    void returnsExistingOutOfStockProductAsUnavailableSummary() {
        var product = merchantApi.findProductForCart(2L);

        assertTrue(product.isPresent());
        assertEquals(0, product.orElseThrow().stockQuantity());
        assertTrue(!product.orElseThrow().isSaleable());
    }

    @Test
    void returnsEmptyForUnknownProduct() {
        assertTrue(merchantApi.findProductForCart(999L).isEmpty());
    }
}
