package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.IdentityApi;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.merchant.api.PendingShopRequestCard;
import com.senvia.doangiuaky.merchant.dto.PendingShopRequestDetail;
import com.senvia.doangiuaky.merchant.dto.PendingShopRequestSummary;
import com.senvia.doangiuaky.merchant.entity.Shop;
import com.senvia.doangiuaky.merchant.entity.ShopStatus;
import com.senvia.doangiuaky.merchant.repository.ShopRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AdminShopRequestServiceTest {

    private final ShopRepository shopRepository = mock(ShopRepository.class);
    private final IdentityApi identityApi = mock(IdentityApi.class);
    private AdminShopRequestService service;

    @BeforeEach
    void setUp() {
        service = new AdminShopRequestService(shopRepository, identityApi);
    }

    @Test
    void listsOnlyPendingRequestsAndMapsOwnerName() {
        Shop shop = shop(10L, 7L, "Pending shop");
        when(shopRepository.findAllByStatusOrderBySubmittedAtAsc(ShopStatus.PENDING))
                .thenReturn(List.of(shop));
        when(identityApi.findUser(7L))
                .thenReturn(Optional.of(new UserSummary(7L, "Nguyễn Văn A", UserRole.USER, AccountStatus.ACTIVE)));

        List<PendingShopRequestSummary> result = service.listPendingRequests();

        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).shopId());
        assertEquals("Pending shop", result.get(0).shopName());
        assertEquals("Nguyễn Văn A", result.get(0).ownerName());
        assertEquals(ShopStatus.PENDING, result.get(0).status());
        verify(shopRepository).findAllByStatusOrderBySubmittedAtAsc(ShopStatus.PENDING);
    }

    @Test
    void exposesPendingRequestsThroughPublicApiForAdminDashboard() {
        Shop shop = shop(10L, 7L, "Pending shop");
        when(shopRepository.findAllByStatusOrderBySubmittedAtAsc(ShopStatus.PENDING))
                .thenReturn(List.of(shop));
        when(identityApi.findUser(7L))
                .thenReturn(Optional.of(new UserSummary(7L, "Nguyễn Văn A", UserRole.USER, AccountStatus.ACTIVE)));

        List<PendingShopRequestCard> result = service.findPendingShopRequests();

        assertEquals(List.of(new PendingShopRequestCard(
                10L,
                "Pending shop",
                "Nguyễn Văn A",
                Instant.parse("2026-10-08T10:00:00Z"))), result);
        verify(shopRepository).findAllByStatusOrderBySubmittedAtAsc(ShopStatus.PENDING);
    }

    @Test
    void mapsDetailWithoutExposingInternalLogoPublicId() {
        Shop shop = shop(10L, 7L, "Pending shop");
        when(shopRepository.findByIdAndStatus(10L, ShopStatus.PENDING)).thenReturn(Optional.of(shop));
        when(identityApi.findUser(7L))
                .thenReturn(Optional.of(new UserSummary(7L, "Nguyễn Văn A", UserRole.USER, AccountStatus.ACTIVE)));

        PendingShopRequestDetail result = service.getPendingRequest(10L);

        assertEquals("https://images.example/logo.png", result.logoUrl());
        assertEquals("0900000000", result.phone());
        assertEquals("Test address", result.address());
        assertFalse(List.of(result.getClass().getRecordComponents()).stream()
                .anyMatch(component -> component.getName().equals("logoPublicId")));
    }

    @Test
    void treatsMissingOrNonPendingRequestAsNotFound() {
        when(shopRepository.findByIdAndStatus(10L, ShopStatus.PENDING)).thenReturn(Optional.empty());

        assertThrows(ShopRequestNotFoundException.class, () -> service.getPendingRequest(10L));
        verify(shopRepository).findByIdAndStatus(10L, ShopStatus.PENDING);
    }

    private static Shop shop(Long id, Long ownerId, String shopName) {
        Shop shop = mock(Shop.class);
        when(shop.getId()).thenReturn(id);
        when(shop.getOwnerId()).thenReturn(ownerId);
        when(shop.getShopName()).thenReturn(shopName);
        when(shop.getDescription()).thenReturn("Description");
        when(shop.getLogoUrl()).thenReturn("https://images.example/logo.png");
        when(shop.getPhone()).thenReturn("0900000000");
        when(shop.getAddress()).thenReturn("Test address");
        when(shop.getStatus()).thenReturn(ShopStatus.PENDING);
        when(shop.getSubmittedAt()).thenReturn(Instant.parse("2026-10-08T10:00:00Z"));
        return shop;
    }
}
