package com.senvia.doangiuaky.merchant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class ProductsController {

    private Map<String, Object> createProduct(int id, String name, String brand, BigDecimal price, boolean isNew, int discount, BigDecimal oldPrice, String image, String desc, int stock, double rating, int reviewCount, String category, List<Map<String, Object>> reviews) {
        Map<String, Object> p = new HashMap<>();
        p.put("id", id);
        p.put("name", name);
        p.put("brand", brand);
        p.put("price", price);
        p.put("isNew", isNew);
        p.put("discount", discount);
        if (oldPrice != null) p.put("oldPrice", oldPrice);
        p.put("image", image);
        p.put("description", desc);
        p.put("stock", stock);
        p.put("rating", rating);
        p.put("reviewCount", reviewCount);
        p.put("category", category);
        p.put("reviews", reviews);
        return p;
    }

    private final List<Map<String, Object>> mockProducts = List.of(
        createProduct(1, "Canvas Tote Bag", "NOLA", new BigDecimal("1190000"), true, 0, null, "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80", "Túi tote canvas cao cấp với thiết kế tối giản", 45, 4.5, 24, "Thời trang", List.of(
            Map.of("user", "Nguyễn Văn A", "date", "24/10/2023", "rating", 5, "content", "Túi đẹp, chất vải dày dặn đúng như mô tả.")
        )),
        createProduct(2, "Linen Shirt", "MORI", new BigDecimal("890000"), false, 15, new BigDecimal("1050000"), "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80", "Áo sơ mi chất liệu linen thoáng mát.", 0, 0.0, 0, "Thời trang", List.of()),
        createProduct(3, "Brass Table Lamp", "KANSO", new BigDecimal("1290000"), false, 0, null, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80", "Đèn bàn đồng nguyên khối mang phong cách cổ điển.", 5, 5.0, 2, "Nhà cửa", List.of()),
        createProduct(4, "Signature Parfum", "MAISON 28", new BigDecimal("2490000"), true, 0, null, "https://images.unsplash.com/photo-1594035910387-fea47714263f?w=600&q=80", "Nước hoa unisex hương gỗ tự nhiên.", 12, 4.8, 120, "Làm đẹp", List.of()),
        createProduct(5, "Ceramic Vase", "FORM", new BigDecimal("690000"), false, 0, null, "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80", "Bình hoa gốm sứ thủ công.", 20, 4.0, 5, "Nhà cửa", List.of()),
        createProduct(6, "Wall Frame", "ASTER", new BigDecimal("790000"), false, 0, null, "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80", "Khung tranh treo tường gỗ sồi.", 15, 4.5, 10, "Nhà cửa", List.of()),
        createProduct(7, "Leather Wallet", "NOLA", new BigDecimal("950000"), false, 0, null, "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80", "Ví da thật cao cấp.", 30, 4.9, 50, "Thời trang", List.of()),
        createProduct(8, "Desk Organizer", "MORI", new BigDecimal("550000"), false, 0, null, "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80", "Kệ để bàn tiện dụng.", 50, 4.7, 18, "Nhà cửa", List.of())
    );

    @GetMapping("/products")
    public String listProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer min,
            @RequestParam(required = false) Integer max,
            @RequestParam(required = false) String category,
            Model model) {
            
        List<Map<String, Object>> filteredProducts = mockProducts.stream().filter(p -> {
            boolean match = true;
            if (q != null && !q.isBlank()) {
                match = match && ((String) p.get("name")).toLowerCase().contains(q.toLowerCase());
            }
            if (min != null) {
                match = match && ((BigDecimal) p.get("price")).compareTo(new BigDecimal(min)) >= 0;
            }
            if (max != null) {
                match = match && ((BigDecimal) p.get("price")).compareTo(new BigDecimal(max)) <= 0;
            }
            if (category != null && !category.isBlank() && !category.equals("Tất cả sản phẩm")) {
                match = match && p.get("category").equals(category);
            }
            return match;
        }).collect(Collectors.toList());

        model.addAttribute("products", filteredProducts);
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
