package com.senvia.doangiuaky.shopping.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ShoppingController {

    @GetMapping("/cart")
    public String cart(Model model) {
        return "cart/index";
    }
}
