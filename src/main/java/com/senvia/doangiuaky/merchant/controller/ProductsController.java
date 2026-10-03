package com.senvia.doangiuaky.merchant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Comparator;

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
        createProduct(1, "Canvas Tote Bag", "NOLA", new BigDecimal("1190000"), true, 0, null, "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80", "Túi tote canvas cao cấp với thiết kế tối giản", 45, 4.5, 24, "Thời trang", List.of(
            Map.of("user", "Nguyễn Văn A", "date", "24/10/2023", "rating", 5, "content", "Túi đẹp, chất vải dày dặn đúng như mô tả.")
        )),
        createProduct(2, "Linen Shirt", "MORI", new BigDecimal("890000"), false, 15, new BigDecimal("1050000"), "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", "Áo sơ mi chất liệu linen thoáng mát.", 0, 0.0, 0, "Thời trang", List.of()),
        createProduct(3, "Brass Table Lamp", "KANSO", new BigDecimal("1290000"), false, 0, null, "https://images.unsplash.com/photo-1513506003901-1e6a35d10d3f?w=600&q=80", "Đèn bàn đồng nguyên khối mang phong cách cổ điển.", 5, 5.0, 2, "Nhà cửa", List.of()),
        createProduct(4, "Signature Parfum", "MAISON 28", new BigDecimal("2490000"), true, 0, null, "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80", "Nước hoa unisex hương gỗ tự nhiên.", 12, 4.8, 120, "Làm đẹp", List.of()),
        createProduct(5, "Ceramic Vase", "FORM", new BigDecimal("690000"), false, 0, null, "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80", "Bình hoa gốm sứ thủ công.", 20, 4.0, 5, "Nhà cửa", List.of()),
        createProduct(6, "Wall Frame", "ASTER", new BigDecimal("790000"), false, 0, null, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", "Khung tranh treo tường gỗ sồi.", 15, 4.5, 10, "Nhà cửa", List.of()),
        createProduct(7, "Leather Wallet", "NOLA", new BigDecimal("950000"), false, 0, null, "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", "Ví da thật cao cấp.", 30, 4.9, 50, "Thời trang", List.of()),
        createProduct(8, "Desk Organizer", "MORI", new BigDecimal("550000"), false, 0, null, "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&q=80", "Kệ để bàn tiện dụng.", 50, 4.7, 18, "Nhà cửa", List.of())
    );

    @GetMapping("/products")
    public String listProducts(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Integer min,
            @RequestParam(required = false) Integer max,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) List<String> brand,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(required = false, defaultValue = "1") Integer page,
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
            if (brand != null && !brand.isEmpty()) {
                match = match && brand.contains(p.get("brand"));
            }
            return match;
        }).collect(Collectors.toList());

        if ("price_asc".equals(sort)) {
            filteredProducts.sort(Comparator.comparing(p -> (BigDecimal) p.get("price")));
        } else if ("price_desc".equals(sort)) {
            filteredProducts.sort(Comparator.comparing((Map<String, Object> p) -> (BigDecimal) p.get("price")).reversed());
        }

        int pageSize = 6;
        int totalItems = filteredProducts.size();
        int totalPages = (int) Math.ceil((double) totalItems / pageSize);
        if (totalPages == 0) totalPages = 1;
        if (page < 1) page = 1;
        if (page > totalPages) page = totalPages;

        int start = (page - 1) * pageSize;
        int end = Math.min(start + pageSize, totalItems);

        List<Map<String, Object>> pagedProducts = filteredProducts.subList(start, end);

        model.addAttribute("products", pagedProducts);
        model.addAttribute("totalItems", totalItems);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("currentPage", page);
        model.addAttribute("sort", sort);
        model.addAttribute("selectedBrands", brand != null ? brand : List.of());

        Map<String, Long> brandCounts = mockProducts.stream()
            .collect(Collectors.groupingBy(p -> (String) p.get("brand"), Collectors.counting()));
        model.addAttribute("brandCounts", brandCounts);

        model.addAttribute("q", q);
        model.addAttribute("min", min);
        model.addAttribute("max", max);
        model.addAttribute("category", category);

        return "products/list";
    }

    @GetMapping("/products/{id}")
    public String productDetail(@PathVariable Integer id, Model model) {
        Map<String, Object> product = mockProducts.stream()
            .filter(p -> p.get("id").equals(id))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"));
        model.addAttribute("product", product);
        model.addAttribute("relatedProducts", mockProducts.subList(0, 4));
        return "products/detail";
    }
}
