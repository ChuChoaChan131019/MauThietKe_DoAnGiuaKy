package com.senvia.doangiuaky.engagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

@Controller
public class AdminController {

    private final Map<String, Map<String, String>> mockShopRequests = Map.of(
        "1", Map.of("shopName", "MORI Store", "desc", "Cửa hàng cung cấp các sản phẩm làm đẹp chiết xuất thiên nhiên.", "address", "456 Đường Nguyễn Huệ, Quận 1, TPHCM", "owner", "Lê Văn C", "phone", "0987654321", "email", "levanc@example.com", "status", "PENDING"),
        "2", Map.of("shopName", "Kanso Basic", "desc", "Cửa hàng thời trang phong cách tối giản.", "address", "123 Lê Lợi, Quận 1, TPHCM", "owner", "Phạm Thị D", "phone", "0901234567", "email", "phamthid@example.com", "status", "PENDING")
    );

    @GetMapping("/admin/dashboard")
    public String adminDashboard() { return "engagement/admin-dashboard"; }

    @GetMapping("/admin/shop-requests")
    public String adminShopRequests() { return "engagement/admin-shop-requests"; }

    @GetMapping("/admin/shop-requests/{id}")
    public String adminShopRequestDetail(@PathVariable("id") String id, Model model) { 
        if (!mockShopRequests.containsKey(id)) {
            model.addAttribute("error", "Yêu cầu mở gian hàng không tồn tại hoặc đã bị xóa.");
            return "engagement/admin-shop-request-detail";
        }
        model.addAttribute("id", id);
        model.addAttribute("request", mockShopRequests.get(id));
        return "engagement/admin-shop-request-detail"; 
    }

    @GetMapping("/admin/shops")
    public String adminShops() { return "engagement/admin-shops"; }
}
