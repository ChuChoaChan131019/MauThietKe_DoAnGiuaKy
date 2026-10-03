package com.senvia.doangiuaky.identity.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AccountController {

    @GetMapping("/account")
    public String account() {
        return "redirect:/account/profile";
    }

    @GetMapping("/account/profile")
    public String accountProfile() { return "identity/profile"; }

    @GetMapping("/account/change-password")
    public String accountChangePassword() { return "identity/change-password"; }

    
    public String accountWishlist() { return "shopping/wishlist"; }

    
    public String accountOrders() { return "ordering/orders"; }

    
    public String accountOrderDetail() { return "ordering/order-detail"; }

    
    public String accountNotifications() { return "engagement/notifications"; }

    
    public String accountReview() { return "engagement/review-form"; }
}
