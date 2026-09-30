package com.senvia.doangiuaky.merchant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        // Mock Categories
        model.addAttribute("categories", List.of(
            Map.of("name", "Thời trang", "img", "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80"),
            Map.of("name", "Làm đẹp", "img", "https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=400&q=80"),
            Map.of("name", "Nhà cửa", "img", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80"),
            Map.of("name", "Công nghệ", "img", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"),
            Map.of("name", "Phụ kiện", "img", "https://images.unsplash.com/photo-1599643478524-fb66f7aa26d5?w=400&q=80"),
            Map.of("name", "Lifestyle", "img", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&q=80")
        ));

        // Mock Products
        model.addAttribute("products", List.of(
            Map.of("id", 1, "name", "Canvas Tote Bag", "brand", "NOLA", "price", new BigDecimal("1190000"), "isNew", true, "discount", 0, "image", "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80"),
            Map.of("id", 2, "name", "Linen Shirt", "brand", "MORI", "price", new BigDecimal("890000"), "isNew", false, "discount", 15, "oldPrice", new BigDecimal("1050000"), "image", "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&q=80"),
            Map.of("id", 3, "name", "Brass Table Lamp", "brand", "KANSO", "price", new BigDecimal("1290000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80"),
            Map.of("id", 4, "name", "Signature Parfum", "brand", "MAISON 28", "price", new BigDecimal("2490000"), "isNew", true, "discount", 0, "image", "https://images.unsplash.com/photo-1594035910387-fea47714263f?w=600&q=80"),
            Map.of("id", 5, "name", "Ceramic Vase", "brand", "FORM", "price", new BigDecimal("690000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&q=80"),
            Map.of("id", 6, "name", "Wall Frame", "brand", "ASTER", "price", new BigDecimal("790000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80"),
            Map.of("id", 7, "name", "Leather Wallet", "brand", "NOLA", "price", new BigDecimal("950000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80"),
            Map.of("id", 8, "name", "Desk Organizer", "brand", "MORI", "price", new BigDecimal("550000"), "isNew", false, "discount", 0, "image", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80")
        ));

        return "index";
    }
}
