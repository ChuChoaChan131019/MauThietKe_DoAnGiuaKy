package com.senvia.doangiuaky.merchant.controller;

import com.senvia.doangiuaky.identity.security.IdentityPrincipal;
import com.senvia.doangiuaky.identity.security.SecurityConfig;
import com.senvia.doangiuaky.merchant.dto.PendingShopRequestDetail;
import com.senvia.doangiuaky.merchant.dto.PendingShopRequestSummary;
import com.senvia.doangiuaky.merchant.entity.ShopStatus;
import com.senvia.doangiuaky.merchant.service.AdminShopRequestService;
import com.senvia.doangiuaky.merchant.service.ShopApprovalService;
import com.senvia.doangiuaky.merchant.service.ShopRejectionService;
import com.senvia.doangiuaky.merchant.service.ShopRequestNotFoundException;
import com.senvia.doangiuaky.merchant.state.InvalidShopStateTransitionException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.flash;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@WebMvcTest(AdminShopRequestController.class)
@Import(SecurityConfig.class)
class AdminShopRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminShopRequestService shopRequestService;

    @MockitoBean
    private ShopApprovalService shopApprovalService;

    @MockitoBean
    private ShopRejectionService shopRejectionService;

    private IdentityPrincipal adminPrincipal;
    private IdentityPrincipal userPrincipal;

    @BeforeEach
    void setUpPrincipals() {
        adminPrincipal = principal(1L, "ROLE_ADMIN");
        userPrincipal = principal(2L, "ROLE_USER");
    }

    @Test
    void anonymousUserIsRedirectedToLogin() throws Exception {
        mockMvc.perform(get("/admin/shop-requests"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));

        verify(shopRequestService, never()).listPendingRequests();
    }

    @Test
    void userCannotViewPendingRequests() throws Exception {
        mockMvc.perform(get("/admin/shop-requests").with(user(userPrincipal)))
                .andExpect(status().isForbidden());

        verify(shopRequestService, never()).listPendingRequests();
    }

    @Test
    void adminCanViewPendingRequestList() throws Exception {
        PendingShopRequestSummary request = new PendingShopRequestSummary(
                10L, "Pending shop", "Nguyễn Văn A",
                Instant.parse("2026-10-08T10:00:00Z"), ShopStatus.PENDING);
        when(shopRequestService.listPendingRequests()).thenReturn(List.of(request));

        mockMvc.perform(get("/admin/shop-requests").with(user(adminPrincipal)))
                .andExpect(status().isOk())
                .andExpect(view().name("merchant/admin/shop-requests"))
                .andExpect(model().attribute("pendingCount", 1))
                .andExpect(model().attribute("requests", List.of(request)));
    }

    @Test
    void adminCanViewAnEmptyPendingRequestList() throws Exception {
        when(shopRequestService.listPendingRequests()).thenReturn(List.of());

        mockMvc.perform(get("/admin/shop-requests").with(user(adminPrincipal)))
                .andExpect(status().isOk())
                .andExpect(view().name("merchant/admin/shop-requests"))
                .andExpect(model().attribute("pendingCount", 0))
                .andExpect(model().attribute("requests", List.of()));
    }

    @Test
    void adminCanViewPendingRequestDetail() throws Exception {
        PendingShopRequestDetail request = new PendingShopRequestDetail(
                10L, "Pending shop", "Description", "https://images.example/logo.png",
                "0900000000", "Test address", "Nguyễn Văn A",
                Instant.parse("2026-10-08T10:00:00Z"), ShopStatus.PENDING);
        when(shopRequestService.getPendingRequest(10L)).thenReturn(request);

        mockMvc.perform(get("/admin/shop-requests/10").with(user(adminPrincipal)))
                .andExpect(status().isOk())
                .andExpect(view().name("merchant/admin/shop-request-detail"))
                .andExpect(model().attribute("request", request))
                .andExpect(model().attributeExists("rejectionForm"));
    }

    @Test
    void missingRequestReturnsNotFound() throws Exception {
        when(shopRequestService.getPendingRequest(99L))
                .thenThrow(new ShopRequestNotFoundException("Không tìm thấy yêu cầu mở gian hàng đang chờ."));

        mockMvc.perform(get("/admin/shop-requests/99").with(user(adminPrincipal)))
                .andExpect(status().isNotFound());
    }

    @Test
    void anonymousUserIsRedirectedToLoginWhenCsrfIsValid() throws Exception {
        mockMvc.perform(post("/admin/shop-requests/10/approve").with(csrf()))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));

        verify(shopApprovalService, never()).approve(10L, 1L);
    }

    @Test
    void userCannotApprovePendingRequest() throws Exception {
        mockMvc.perform(post("/admin/shop-requests/10/approve")
                        .with(user(userPrincipal))
                        .with(csrf()))
                .andExpect(status().isForbidden());

        verify(shopApprovalService, never()).approve(10L, 2L);
    }

    @Test
    void adminCanApprovePendingRequest() throws Exception {
        mockMvc.perform(post("/admin/shop-requests/10/approve")
                        .with(user(adminPrincipal))
                        .with(csrf()))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin/shop-requests"))
                .andExpect(flash().attribute("successMessage", "Đã phê duyệt gian hàng thành công."));

        verify(shopApprovalService).approve(10L, 1L);
    }

    @Test
    void adminCannotApproveWithoutCsrfToken() throws Exception {
        mockMvc.perform(post("/admin/shop-requests/10/approve").with(user(adminPrincipal)))
                .andExpect(status().isForbidden());

        verify(shopApprovalService, never()).approve(10L, 1L);
    }

    @Test
    void repeatedApprovalRedirectsWithErrorMessage() throws Exception {
        doThrow(new InvalidShopStateTransitionException(ShopStatus.APPROVED, ShopStatus.APPROVED))
                .when(shopApprovalService).approve(10L, 1L);

        mockMvc.perform(post("/admin/shop-requests/10/approve")
                        .with(user(adminPrincipal))
                        .with(csrf()))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin/shop-requests"))
                .andExpect(flash().attribute("errorMessage", "Yêu cầu này không còn ở trạng thái chờ duyệt."));
    }

    @Test
    void approvingMissingRequestReturnsNotFound() throws Exception {
        doThrow(new ShopRequestNotFoundException("Không tìm thấy gian hàng cần phê duyệt."))
                .when(shopApprovalService).approve(99L, 1L);

        mockMvc.perform(post("/admin/shop-requests/99/approve")
                        .with(user(adminPrincipal))
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    void userCannotRejectPendingRequest() throws Exception {
        mockMvc.perform(post("/admin/shop-requests/10/reject")
                        .with(user(userPrincipal))
                        .with(csrf())
                        .param("reason", "Missing information"))
                .andExpect(status().isForbidden());

        verify(shopRejectionService, never()).reject(10L, 2L, "Missing information");
    }

    @Test
    void adminCanRejectPendingRequest() throws Exception {
        mockMvc.perform(post("/admin/shop-requests/10/reject")
                        .with(user(adminPrincipal))
                        .with(csrf())
                        .param("reason", "  Missing information  "))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin/shop-requests"))
                .andExpect(flash().attribute("successMessage", "Đã từ chối yêu cầu mở gian hàng."));

        verify(shopRejectionService).reject(10L, 1L, "  Missing information  ");
    }

    @Test
    void adminCannotRejectWithoutCsrfToken() throws Exception {
        mockMvc.perform(post("/admin/shop-requests/10/reject")
                        .with(user(adminPrincipal))
                        .param("reason", "Missing information"))
                .andExpect(status().isForbidden());

        verify(shopRejectionService, never()).reject(10L, 1L, "Missing information");
    }

    @Test
    void blankRejectionReasonRendersDetailWithValidationError() throws Exception {
        PendingShopRequestDetail request = new PendingShopRequestDetail(
                10L, "Pending shop", "Description", null,
                "0900000000", "Test address", "Nguyễn Văn A",
                Instant.parse("2026-10-08T10:00:00Z"), ShopStatus.PENDING);
        when(shopRequestService.getPendingRequest(10L)).thenReturn(request);

        mockMvc.perform(post("/admin/shop-requests/10/reject")
                        .with(user(adminPrincipal))
                        .with(csrf())
                        .param("reason", "   "))
                .andExpect(status().isOk())
                .andExpect(view().name("merchant/admin/shop-request-detail"))
                .andExpect(model().attribute("request", request))
                .andExpect(model().attributeHasFieldErrors("rejectionForm", "reason"));

        verify(shopRejectionService, never()).reject(10L, 1L, "   ");
    }

    @Test
    void repeatedRejectionRedirectsWithErrorMessage() throws Exception {
        doThrow(new InvalidShopStateTransitionException(ShopStatus.REJECTED, ShopStatus.REJECTED))
                .when(shopRejectionService).reject(10L, 1L, "New reason");

        mockMvc.perform(post("/admin/shop-requests/10/reject")
                        .with(user(adminPrincipal))
                        .with(csrf())
                        .param("reason", "New reason"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/admin/shop-requests"))
                .andExpect(flash().attribute("errorMessage", "Yêu cầu này không còn ở trạng thái chờ duyệt."));
    }

    @Test
    void rejectingMissingRequestReturnsNotFound() throws Exception {
        doThrow(new ShopRequestNotFoundException("Shop not found"))
                .when(shopRejectionService).reject(99L, 1L, "Missing information");

        mockMvc.perform(post("/admin/shop-requests/99/reject")
                        .with(user(adminPrincipal))
                        .with(csrf())
                        .param("reason", "Missing information"))
                .andExpect(status().isNotFound());
    }

    private static IdentityPrincipal principal(Long userId, String authority) {
        IdentityPrincipal principal = mock(IdentityPrincipal.class);
        when(principal.getUserId()).thenReturn(userId);
        when(principal.getUsername()).thenReturn("user" + userId + "@example.com");
        when(principal.getPassword()).thenReturn("password");
        when(principal.isAccountNonExpired()).thenReturn(true);
        when(principal.isAccountNonLocked()).thenReturn(true);
        when(principal.isCredentialsNonExpired()).thenReturn(true);
        when(principal.isEnabled()).thenReturn(true);
        when(principal.getAuthorities()).thenAnswer(ignored ->
                List.of(new SimpleGrantedAuthority(authority)));
        return principal;
    }
}
