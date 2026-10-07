package com.senvia.doangiuaky.identity.controller;

import com.senvia.doangiuaky.identity.dto.ChangePasswordForm;
import com.senvia.doangiuaky.identity.dto.ProfileForm;
import com.senvia.doangiuaky.identity.security.IdentityPrincipal;
import com.senvia.doangiuaky.identity.service.IdentityService;
import com.senvia.doangiuaky.identity.service.InvalidPasswordException;
import com.senvia.doangiuaky.identity.service.avatar.AvatarStorageException;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.Objects;

@Controller
public class AccountController {

    private final IdentityService identityService;

    public AccountController(IdentityService identityService) {
        this.identityService = identityService;
    }

    @GetMapping("/account")
    public String account() {
        return "redirect:/account/profile";
    }

    @GetMapping("/account/profile")
    public String accountProfile(@AuthenticationPrincipal IdentityPrincipal principal, Model model) {
        if (!model.containsAttribute("profileForm")) {
            model.addAttribute("profileForm", identityService.getProfile(principal.getUserId()));
        }
        model.addAttribute("avatarUrl", identityService.getAvatarUrl(principal.getUserId()));
        return "identity/profile";
    }

    @PostMapping("/account/profile")
    public String updateProfile(
            @AuthenticationPrincipal IdentityPrincipal principal,
            @Valid @ModelAttribute("profileForm") ProfileForm form,
            BindingResult bindingResult,
            @RequestParam(name = "avatar", required = false) MultipartFile avatar,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("avatarUrl", identityService.getAvatarUrl(principal.getUserId()));
            return "identity/profile";
        }

        try {
            identityService.updateProfile(principal.getUserId(), form, avatar);
        } catch (AvatarStorageException exception) {
            model.addAttribute("avatarUrl", identityService.getAvatarUrl(principal.getUserId()));
            model.addAttribute("avatarError", exception.getMessage());
            return "identity/profile";
        }
        redirectAttributes.addFlashAttribute("success", "Thông tin hồ sơ đã được cập nhật.");
        return "redirect:/account/profile";
    }

    @GetMapping("/account/change-password")
    public String accountChangePassword(Model model) {
        if (!model.containsAttribute("passwordForm")) {
            model.addAttribute("passwordForm", new ChangePasswordForm());
        }
        return "identity/change-password";
    }

    @PostMapping("/account/change-password")
    public String changePassword(
            @AuthenticationPrincipal IdentityPrincipal principal,
            @Valid @ModelAttribute("passwordForm") ChangePasswordForm form,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes) {
        if (!Objects.equals(form.getNewPassword(), form.getConfirmPassword())) {
            bindingResult.rejectValue("confirmPassword", "password.mismatch", "Mật khẩu xác nhận không khớp.");
        }
        if (bindingResult.hasErrors()) {
            return "identity/change-password";
        }

        try {
            identityService.changePassword(principal.getUserId(), form);
        } catch (InvalidPasswordException exception) {
            model.addAttribute("passwordError", exception.getMessage());
            return "identity/change-password";
        }
        redirectAttributes.addFlashAttribute("success", "Mật khẩu đã được cập nhật.");
        return "redirect:/account/change-password";
    }
}
