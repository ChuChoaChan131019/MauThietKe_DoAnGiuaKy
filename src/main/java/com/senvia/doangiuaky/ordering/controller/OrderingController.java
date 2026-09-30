package com.senvia.doangiuaky.ordering.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OrderingController {

    @GetMapping("/checkout")
    public String checkout() {
        return "ordering/checkout/index";
    }
}
