package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.merchant.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class DemoMerchantApiTest {

    @Autowired
    private DemoMerchantApi merchantApi;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void returnsSaleableDatabaseProductThroughPublicContract() {
        Long productId = productRepository.findByName("Canvas Tote Bag").orElseThrow().getId();

        var product = merchantApi.findProductForCart(productId);

        assertTrue(product.isPresent());
        assertEquals("Canvas Tote Bag", product.orElseThrow().productName());
        assertTrue(product.orElseThrow().isSaleable());
    }

    @Test
    void returnsExistingOutOfStockProductAsUnavailableSummary() {
        Long productId = productRepository.findByName("Linen Shirt").orElseThrow().getId();

        var product = merchantApi.findProductForCart(productId);

        assertTrue(product.isPresent());
        assertEquals(0, product.orElseThrow().stockQuantity());
        assertTrue(!product.orElseThrow().isSaleable());
    }

    @Test
    void returnsEmptyForUnknownProduct() {
        assertTrue(merchantApi.findProductForCart(Long.MAX_VALUE).isEmpty());
    }
}
