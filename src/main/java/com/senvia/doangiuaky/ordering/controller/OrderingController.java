package com.senvia.doangiuaky.ordering.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OrderingController {

    @GetMapping("/checkout")
    public String checkout() {
        return "ordering/checkout/index";
    }

    @GetMapping("/checkout/success")
    public String checkoutSuccess() {
        return "ordering/checkout-success";
    }

    @GetMapping("/account/orders")
    public String orders() { return "ordering/orders"; }

    @GetMapping("/account/orders/detail")
    public String orderDetail() { return "ordering/order-detail"; }

    @GetMapping("/merchant/orders")
    public String merchantOrders() { return "ordering/seller-orders"; }

    @GetMapping("/merchant/orders/detail")
    public String merchantOrderDetail(@org.springframework.web.bind.annotation.RequestParam(defaultValue = "COD") String payment, @org.springframework.web.bind.annotation.RequestParam(defaultValue = "PENDING") String status, org.springframework.ui.Model model) { model.addAttribute("payment", payment); model.addAttribute("status", status); return "ordering/seller-order-detail"; }

    @GetMapping("/admin/orders")
    public String adminOrders() { return "ordering/admin-orders"; }
}


