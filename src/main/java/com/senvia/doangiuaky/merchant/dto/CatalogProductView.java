package com.senvia.doangiuaky.merchant.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record CatalogProductView(
        Long id,
        String name,
        String brand,
        BigDecimal price,
        boolean isNew,
        int discount,
        BigDecimal oldPrice,
        String image,
        String description,
        int stock,
        double rating,
        int reviewCount,
        String category,
        List<Map<String, Object>> reviews) {
}
