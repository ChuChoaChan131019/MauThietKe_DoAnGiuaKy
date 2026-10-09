package com.senvia.doangiuaky.shopping.controller;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.IdentityApi;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.shopping.dto.AddCartItemResult;
import com.senvia.doangiuaky.shopping.dto.CartItemView;
import com.senvia.doangiuaky.shopping.service.CartService;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.security.Principal;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ShoppingControllerTest {

    @Test
    void invalidQuantityIsRejectedBeforeServiceCall() throws Exception {
        CartService cartService = mock(CartService.class);
        IdentityApi identityApi = mock(IdentityApi.class);
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new ShoppingController(cartService, identityApi)).build();

        mvc.perform(post("/cart/items")
                        .principal(principal("buyer@example.com"))
                        .param("productId", "20")
                        .param("quantity", "0"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/cart"));

        verify(cartService, never()).addItem(eq(10L), eq(20L), eq(0));
    }

    @Test
    void validPostResolvesCurrentUserFromIdentityApiAndRedirects() throws Exception {
        CartService cartService = mock(CartService.class);
        IdentityApi identityApi = mock(IdentityApi.class);
        when(identityApi.findUserByEmail("buyer@example.com"))
                .thenReturn(java.util.Optional.of(new UserSummary(10L, "Buyer", UserRole.USER, AccountStatus.ACTIVE)));
        when(cartService.addItem(10L, 20L, 2)).thenReturn(new AddCartItemResult(
                new CartItemView(20L, 30L, "Shop", "Product", null,
                        new BigDecimal("100000"), 5, 2, new BigDecimal("200000"), true, null),
                false,
                "Đã thêm sản phẩm vào giỏ hàng."));
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new ShoppingController(cartService, identityApi)).build();

        mvc.perform(post("/cart/items")
                        .principal(principal("buyer@example.com"))
                        .param("productId", "20")
                        .param("quantity", "2"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/cart"));

        verify(cartService).addItem(10L, 20L, 2);
    }

    private static Principal principal(String name) {
        return () -> name;
    }
}
