package com.senvia.doangiuaky.identity.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class IdentityController {

    @GetMapping("/login")
    public String login() {
        return "identity/login";
    }

    @GetMapping("/register")
    public String register() {
        return "identity/register";
    }
}
