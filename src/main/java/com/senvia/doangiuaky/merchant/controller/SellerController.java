package com.senvia.doangiuaky.merchant.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SellerController {

    @GetMapping("/seller")
    public String seller() {
        return "merchant/seller/index";
    }
}
