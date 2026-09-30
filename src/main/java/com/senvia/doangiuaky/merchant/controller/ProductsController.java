package com.senvia.doangiuaky.merchant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Controller
public class ProductsController {

    private final List<Map<String, Object>> mockProducts = List.of(
        Map.of("id", 1, "name", "Canvas Tote Bag", "brand", "NOLA", "price", new BigDecimal("1190000"), "isNew", true, "discount", 0, "image", "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80"),
        Map.of("id", 2, "name", "Linen Shirt", "brand", "MORI", "price", new BigDecimal("890000"), "isNew", false, "discount", 15, "oldPrice", new BigDecimal("1050000"), "image", "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80"),
        Map.of("id", 3, "name", "Brass Table Lamp", "brand", "KANSO", "price", new BigDecimal("1290000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80"),
        Map.of("id", 4, "name", "Signature Parfum", "brand", "MAISON 28", "price", new BigDecimal("2490000"), "isNew", true, "discount", 0, "image", "https://images.unsplash.com/photo-1594035910387-fea47714263f?w=600&q=80"),
        Map.of("id", 5, "name", "Ceramic Vase", "brand", "FORM", "price", new BigDecimal("690000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80"),
        Map.of("id", 6, "name", "Wall Frame", "brand", "ASTER", "price", new BigDecimal("790000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80"),
        Map.of("id", 7, "name", "Leather Wallet", "brand", "NOLA", "price", new BigDecimal("950000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80"),
        Map.of("id", 8, "name", "Desk Organizer", "brand", "MORI", "price", new BigDecimal("550000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80")
    );

    @GetMapping("/products")
    public String listProducts(Model model) {
        model.addAttribute("products", mockProducts);
        return "products/list";
    }

    @GetMapping("/products/{id}")
    public String productDetail(@PathVariable Integer id, Model model) {
        Map<String, Object> product = mockProducts.stream()
            .filter(p -> p.get("id").equals(id))
            .findFirst()
            .orElse(mockProducts.get(0));
        model.addAttribute("product", product);
        model.addAttribute("relatedProducts", mockProducts.subList(0, 4));
        return "products/detail";
    }
}
