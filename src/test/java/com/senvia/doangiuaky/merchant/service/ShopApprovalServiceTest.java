package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.IdentityApi;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.merchant.api.ShopApprovedEvent;
import com.senvia.doangiuaky.merchant.entity.Shop;
import com.senvia.doangiuaky.merchant.entity.ShopStatus;
import com.senvia.doangiuaky.merchant.repository.ShopRepository;
import com.senvia.doangiuaky.merchant.state.InvalidShopStateTransitionException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShopApprovalServiceTest {

    @Mock
    private ShopRepository shopRepository;

    @Mock
    private IdentityApi identityApi;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private Shop shop;

    private final UserSummary admin = new UserSummary(
            99L, "Admin", UserRole.ADMIN, AccountStatus.ACTIVE);

    @Test
    void approvesPendingShopAndPublishesEventWithAuditData() {
        when(identityApi.findUser(99L)).thenReturn(Optional.of(admin));
        when(shopRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(shop));
        when(shop.getId()).thenReturn(10L);
        when(shop.getOwnerId()).thenReturn(7L);
        when(shop.getShopName()).thenReturn("Pending shop");

        new ShopApprovalService(shopRepository, identityApi, eventPublisher).approve(10L, 99L);

        ArgumentCaptor<Instant> approvedAt = ArgumentCaptor.forClass(Instant.class);
        verify(shop).approve(eq(99L), approvedAt.capture());
        verify(shopRepository).save(shop);

        ArgumentCaptor<ShopApprovedEvent> event = ArgumentCaptor.forClass(ShopApprovedEvent.class);
        verify(eventPublisher).publishEvent(event.capture());
        assertNotNull(event.getValue().eventId());
        assertEquals(10L, event.getValue().shopId());
        assertEquals(7L, event.getValue().ownerId());
        assertEquals("Pending shop", event.getValue().shopName());
        assertEquals(99L, event.getValue().approvedById());
        assertEquals(approvedAt.getValue(), event.getValue().approvedAt());
    }

    @Test
    void rejectsMissingShopWithoutPublishingEvent() {
        when(identityApi.findUser(99L)).thenReturn(Optional.of(admin));
        when(shopRepository.findByIdForUpdate(10L)).thenReturn(Optional.empty());

        assertThrows(ShopRequestNotFoundException.class,
                () -> new ShopApprovalService(shopRepository, identityApi, eventPublisher)
                        .approve(10L, 99L));

        verify(shopRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsNonAdminOrInactiveActorBeforeLockingShop() {
        when(identityApi.findUser(99L))
                .thenReturn(Optional.of(new UserSummary(99L, "User", UserRole.USER, AccountStatus.ACTIVE)));

        assertThrows(ShopApprovalAuthorizationException.class,
                () -> new ShopApprovalService(shopRepository, identityApi, eventPublisher)
                        .approve(10L, 99L));

        verify(shopRepository, never()).findByIdForUpdate(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsLockedAdminBeforeLockingShop() {
        when(identityApi.findUser(99L))
                .thenReturn(Optional.of(new UserSummary(99L, "Locked admin", UserRole.ADMIN, AccountStatus.LOCKED)));

        assertThrows(ShopApprovalAuthorizationException.class,
                () -> new ShopApprovalService(shopRepository, identityApi, eventPublisher)
                        .approve(10L, 99L));

        verify(shopRepository, never()).findByIdForUpdate(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsAlreadyProcessedShopWithoutSavingOrPublishingAgain() {
        when(identityApi.findUser(99L)).thenReturn(Optional.of(admin));
        when(shopRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(shop));
        doThrow(new InvalidShopStateTransitionException(ShopStatus.APPROVED, ShopStatus.APPROVED))
                .when(shop).approve(any(), any());

        assertThrows(InvalidShopStateTransitionException.class,
                () -> new ShopApprovalService(shopRepository, identityApi, eventPublisher)
                        .approve(10L, 99L));

        verify(shopRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsNullIdentifiers() {
        ShopApprovalService service = new ShopApprovalService(shopRepository, identityApi, eventPublisher);

        assertThrows(NullPointerException.class, () -> service.approve(null, 99L));
        assertThrows(NullPointerException.class, () -> service.approve(10L, null));
    }
}
