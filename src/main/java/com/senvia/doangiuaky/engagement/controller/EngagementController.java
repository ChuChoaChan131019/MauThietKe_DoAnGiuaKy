package com.senvia.doangiuaky.engagement.controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class EngagementController {
    @GetMapping("/account/notifications")
    public String notifications() { return "engagement/notifications"; }
    @GetMapping("/account/review")
    public String review() { return "engagement/review-form"; }
}
