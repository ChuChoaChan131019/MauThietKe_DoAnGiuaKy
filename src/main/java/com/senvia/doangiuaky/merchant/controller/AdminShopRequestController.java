package com.senvia.doangiuaky.merchant.controller;

import com.senvia.doangiuaky.identity.security.IdentityPrincipal;
import com.senvia.doangiuaky.merchant.dto.ShopRejectionForm;
import com.senvia.doangiuaky.merchant.service.AdminShopRequestService;
import com.senvia.doangiuaky.merchant.service.ShopApprovalAuthorizationException;
import com.senvia.doangiuaky.merchant.service.ShopApprovalService;
import com.senvia.doangiuaky.merchant.service.ShopRejectionAuthorizationException;
import com.senvia.doangiuaky.merchant.service.ShopRejectionService;
import com.senvia.doangiuaky.merchant.service.ShopRequestNotFoundException;
import com.senvia.doangiuaky.merchant.state.InvalidShopStateTransitionException;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class AdminShopRequestController {

    private final AdminShopRequestService shopRequestService;
    private final ShopApprovalService shopApprovalService;
    private final ShopRejectionService shopRejectionService;

    public AdminShopRequestController(AdminShopRequestService shopRequestService,
                                      ShopApprovalService shopApprovalService,
                                      ShopRejectionService shopRejectionService) {
        this.shopRequestService = shopRequestService;
        this.shopApprovalService = shopApprovalService;
        this.shopRejectionService = shopRejectionService;
    }

    @GetMapping("/admin/shop-requests")
    public String list(Model model) {
        var requests = shopRequestService.listPendingRequests();
        model.addAttribute("requests", requests);
        model.addAttribute("pendingCount", requests.size());
        return "merchant/admin/shop-requests";
    }

    @GetMapping("/admin/shop-requests/{id}")
    public String detail(@PathVariable("id") Long id, Model model) {
        try {
            model.addAttribute("request", shopRequestService.getPendingRequest(id));
            model.addAttribute("rejectionForm", new ShopRejectionForm());
            return "merchant/admin/shop-request-detail";
        } catch (ShopRequestNotFoundException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, exception.getMessage(), exception);
        }
    }

    @PostMapping("/admin/shop-requests/{id}/approve")
    public String approve(@PathVariable("id") Long id,
                          @AuthenticationPrincipal IdentityPrincipal principal,
                          RedirectAttributes redirectAttributes) {
        try {
            shopApprovalService.approve(id, principal.getUserId());
            redirectAttributes.addFlashAttribute(
                    "successMessage", "Đã phê duyệt gian hàng thành công.");
        } catch (ShopRequestNotFoundException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, exception.getMessage(), exception);
        } catch (InvalidShopStateTransitionException exception) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage", "Yêu cầu này không còn ở trạng thái chờ duyệt.");
        } catch (ShopApprovalAuthorizationException exception) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, exception.getMessage(), exception);
        }
        return "redirect:/admin/shop-requests";
    }

    @PostMapping("/admin/shop-requests/{id}/reject")
    public String reject(@PathVariable("id") Long id,
                         @AuthenticationPrincipal IdentityPrincipal principal,
                         @Valid @ModelAttribute("rejectionForm") ShopRejectionForm form,
                         BindingResult bindingResult,
                         Model model,
                         RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            try {
                model.addAttribute("request", shopRequestService.getPendingRequest(id));
                return "merchant/admin/shop-request-detail";
            } catch (ShopRequestNotFoundException exception) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, exception.getMessage(), exception);
            }
        }

        try {
            shopRejectionService.reject(id, principal.getUserId(), form.getReason());
            redirectAttributes.addFlashAttribute(
                    "successMessage", "Đã từ chối yêu cầu mở gian hàng.");
        } catch (ShopRequestNotFoundException exception) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, exception.getMessage(), exception);
        } catch (InvalidShopStateTransitionException exception) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage", "Yêu cầu này không còn ở trạng thái chờ duyệt.");
        } catch (ShopRejectionAuthorizationException exception) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, exception.getMessage(), exception);
        }
        return "redirect:/admin/shop-requests";
    }
}
