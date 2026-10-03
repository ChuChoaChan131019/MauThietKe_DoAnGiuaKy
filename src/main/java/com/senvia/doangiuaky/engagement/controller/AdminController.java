package com.senvia.doangiuaky.engagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Map;

import java.util.HashMap;
import org.springframework.web.bind.annotation.RequestParam;

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

    @GetMapping("/admin/shop-requests")
    public String adminShopRequests(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String id,
            @RequestParam(required = false) String reason,
            @RequestParam(required = false, defaultValue = "PENDING") String status,
            Model model) {

        if (action != null && id != null && mockShopRequests.containsKey(id)) {
            if ("approve".equals(action)) {
                mockShopRequests.get(id).put("status", "APPROVED");
            } else if ("reject".equals(action) && reason != null && !reason.trim().isEmpty()) {
                mockShopRequests.get(id).put("status", "REJECTED");
                mockShopRequests.get(id).put("reason", reason);
            }
        }

        Map<String, Map<String, String>> filtered = new HashMap<>();
        for (Map.Entry<String, Map<String, String>> entry : mockShopRequests.entrySet()) {
            if (status.equals(entry.getValue().get("status"))) {
                filtered.put(entry.getKey(), entry.getValue());
            }
        }

        model.addAttribute("requests", filtered);
        long pendingCount = mockShopRequests.values().stream().filter(r -> "PENDING".equals(r.get("status"))).count();
        model.addAttribute("pendingCount", pendingCount);

        return "engagement/admin-shop-requests";
    }

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

    @GetMapping("/admin/accounts")
    public String adminAccounts() { return "engagement/admin-accounts"; }

    @GetMapping("/admin/shops")
    public String adminShops() { return "engagement/admin-shops"; }
}
