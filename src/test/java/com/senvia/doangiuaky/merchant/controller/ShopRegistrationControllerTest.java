package com.senvia.doangiuaky.merchant.controller;

import com.senvia.doangiuaky.identity.security.IdentityPrincipal;
import com.senvia.doangiuaky.identity.security.SecurityConfig;
import com.senvia.doangiuaky.merchant.dto.ShopRegistrationForm;
import com.senvia.doangiuaky.merchant.entity.Shop;
import com.senvia.doangiuaky.merchant.service.ShopNotFoundException;
import com.senvia.doangiuaky.merchant.service.ShopRegistrationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.flash;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@WebMvcTest(ShopRegistrationController.class)
@Import(SecurityConfig.class)
class ShopRegistrationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ShopRegistrationService registrationService;

    private IdentityPrincipal userPrincipal;

    @BeforeEach
    void setUpPrincipal() {
        userPrincipal = principal(12L, "ROLE_USER");
    }

    @Test
    void anonymousUserIsRedirectedToLogin() throws Exception {
        mockMvc.perform(get("/merchant/register"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/login"));
    }

    @Test
    void adminCannotOpenRegistrationForm() throws Exception {
        mockMvc.perform(get("/merchant/register").with(user(principal(1L, "ROLE_ADMIN"))))
                .andExpect(status().isForbidden());

        verify(registrationService, never()).getOwnedShop(any());
    }

    @Test
    void userWithoutShopCanOpenRegistrationForm() throws Exception {
        when(registrationService.getOwnedShop(12L))
                .thenThrow(new ShopNotFoundException("Bạn chưa gửi yêu cầu mở gian hàng."));

        mockMvc.perform(get("/merchant/register").with(user(userPrincipal)))
                .andExpect(status().isOk())
                .andExpect(view().name("merchant/register"))
                .andExpect(model().attributeExists("shopRegistrationForm"));
    }

    @Test
    void userWithShopIsRedirectedToStatus() throws Exception {
        when(registrationService.getOwnedShop(12L)).thenReturn(mock(Shop.class));

        mockMvc.perform(get("/merchant/register").with(user(userPrincipal)))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/merchant/shop-status"));
    }

    @Test
    void validSubmissionRedirectsToStatus() throws Exception {
        MockMultipartFile logo = new MockMultipartFile(
                "logo", "logo.png", "image/png", new byte[] {1});

        mockMvc.perform(multipart("/merchant/register")
                        .file(logo)
                        .param("shopName", "My shop")
                        .param("description", "Handcrafted items")
                        .param("phone", "0900000000")
                        .param("address", "Ho Chi Minh City")
                        .with(user(userPrincipal))
                        .with(csrf()))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/merchant/shop-status"))
                .andExpect(flash().attributeExists("success"));

        verify(registrationService).submit(eq(12L), any(ShopRegistrationForm.class));
    }

    @Test
    void validationFailureDoesNotCallService() throws Exception {
        MockMultipartFile logo = new MockMultipartFile(
                "logo", "logo.png", "image/png", new byte[] {1});

        mockMvc.perform(multipart("/merchant/register")
                        .file(logo)
                        .param("shopName", "")
                        .param("description", "")
                        .param("phone", "invalid")
                        .param("address", "")
                        .with(user(userPrincipal))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(view().name("merchant/register"))
                .andExpect(model().attributeHasFieldErrors(
                        "shopRegistrationForm", "shopName", "description", "phone", "address"));

        verify(registrationService, never()).submit(any(), any());
    }

    @Test
    void submissionWithoutCsrfIsForbidden() throws Exception {
        mockMvc.perform(multipart("/merchant/register")
                        .file(new MockMultipartFile("logo", "logo.png", "image/png", new byte[] {1}))
                        .param("shopName", "My shop")
                        .param("description", "Handcrafted items")
                        .param("phone", "0900000000")
                        .param("address", "Ho Chi Minh City")
                        .with(user(userPrincipal)))
                .andExpect(status().isForbidden());

        verify(registrationService, never()).submit(any(), any());
    }

    @Test
    void statusWithoutOwnedShopRedirectsToRegistration() throws Exception {
        when(registrationService.getOwnedShop(12L))
                .thenThrow(new ShopNotFoundException("Bạn chưa gửi yêu cầu mở gian hàng."));

        mockMvc.perform(get("/merchant/shop-status").with(user(userPrincipal)))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/merchant/register"));
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
