package com.senvia.doangiuaky.merchant.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MerchantController {
    @GetMapping("/admin/categories")
    public String adminCategories() { return "merchant/admin-categories"; }
}
