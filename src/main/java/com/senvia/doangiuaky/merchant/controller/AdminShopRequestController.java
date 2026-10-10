package com.senvia.doangiuaky.merchant.controller;

import com.senvia.doangiuaky.merchant.service.AdminShopRequestService;
import com.senvia.doangiuaky.merchant.service.ShopRequestNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class AdminShopRequestController {

    private final AdminShopRequestService shopRequestService;

    public AdminShopRequestController(AdminShopRequestService shopRequestService) {
        this.shopRequestService = shopRequestService;
    }

    @GetMapping("/admin/shop-requests")
    public String list(Model model) {
        var requests = shopRequestService.listPendingRequests();
        model.addAttribute("requests", requests);
        model.addAttribute("pendingCount", requests.size());
        return "merchant/admin/shop-requests";
    }

    @GetMapping("/admin/shop-requests/{id}")
    public String detail(@PathVariable("id") Long id, Model model) {
        try {
            model.addAttribute("request", shopRequestService.getPendingRequest(id));
            return "merchant/admin/shop-request-detail";
        } catch (ShopRequestNotFoundException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, exception.getMessage(), exception);
        }
    }
}
