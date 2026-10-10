package com.senvia.doangiuaky.engagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

import java.util.HashMap;

@Controller
public class AdminController {

    private static final Map<String, Map<String, String>> mockShopRequests = new HashMap<>();

    static {
        Map<String, String> req1 = new HashMap<>();
        req1.put("shopName", "MORI Store"); req1.put("desc", "Cửa hàng cung cấp các sản phẩm làm đẹp chiết xuất thiên nhiên.");
        req1.put("address", "456 Đường Nguyễn Huệ, Quận 1, TPHCM"); req1.put("owner", "Lê Văn C");
        req1.put("phone", "0987654321"); req1.put("email", "levanc@example.com"); req1.put("status", "PENDING");
        mockShopRequests.put("1", req1);

        Map<String, String> req2 = new HashMap<>();
        req2.put("shopName", "Kanso Basic"); req2.put("desc", "Cửa hàng thời trang phong cách tối giản.");
        req2.put("address", "123 Lê Lợi, Quận 1, TPHCM"); req2.put("owner", "Phạm Thị D");
        req2.put("phone", "0901234567"); req2.put("email", "phamthid@example.com"); req2.put("status", "PENDING");
        mockShopRequests.put("2", req2);
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboard(Model model) {
        long pendingCount = mockShopRequests.values().stream().filter(r -> "PENDING".equals(r.get("status"))).count();
        model.addAttribute("pendingCount", pendingCount);
        return "engagement/admin-dashboard";
    }

    @GetMapping("/admin/accounts")
    public String adminAccounts() { return "engagement/admin-accounts"; }

    @GetMapping("/admin/shops")
    public String adminShops() { return "engagement/admin-shops"; }
}
