package com.senvia.doangiuaky.merchant.controller;

import com.senvia.doangiuaky.merchant.dto.ShopRegistrationForm;
import com.senvia.doangiuaky.merchant.service.ShopRegistrationException;
import com.senvia.doangiuaky.merchant.service.ShopRegistrationService;
import com.senvia.doangiuaky.merchant.service.ShopNotFoundException;
import com.senvia.doangiuaky.merchant.service.image.MerchantImageStorageException;
import com.senvia.doangiuaky.identity.security.IdentityPrincipal;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ShopRegistrationController {

    private final ShopRegistrationService registrationService;

    public ShopRegistrationController(ShopRegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    @GetMapping("/merchant/register")
    public String form(@AuthenticationPrincipal IdentityPrincipal principal, Model model) {
        try {
            registrationService.getOwnedShop(principal.getUserId());
            return "redirect:/merchant/shop-status";
        } catch (ShopNotFoundException ignored) {
            if (!model.containsAttribute("shopRegistrationForm")) {
                model.addAttribute("shopRegistrationForm", new ShopRegistrationForm());
            }
            return "merchant/register";
        }
    }

    @PostMapping("/merchant/register")
    public String submit(@AuthenticationPrincipal IdentityPrincipal principal,
                         @Valid @ModelAttribute("shopRegistrationForm") ShopRegistrationForm form,
                         BindingResult bindingResult, Model model, RedirectAttributes redirectAttributes) {
        if (form.getLogo() == null || form.getLogo().isEmpty()) {
            bindingResult.rejectValue("logo", "logo.required", "Vui lòng chọn logo gian hàng.");
        }
        if (bindingResult.hasErrors()) {
            return "merchant/register";
        }
        try {
            registrationService.submit(principal.getUserId(), form);
        } catch (MerchantImageStorageException | ShopRegistrationException exception) {
            model.addAttribute("registrationError", exception.getMessage());
            return "merchant/register";
        }
        redirectAttributes.addFlashAttribute("success", "Yêu cầu mở gian hàng đã được gửi và đang chờ duyệt.");
        return "redirect:/merchant/shop-status";
    }

    @GetMapping("/merchant/shop-status")
    public String status(@AuthenticationPrincipal IdentityPrincipal principal, Model model) {
        try {
            model.addAttribute("ownedShop", registrationService.getOwnedShop(principal.getUserId()));
            return "merchant/shop-status";
        } catch (ShopNotFoundException exception) {
            return "redirect:/merchant/register";
        }
    }
}
