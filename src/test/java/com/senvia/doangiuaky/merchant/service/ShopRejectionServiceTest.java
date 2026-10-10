package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.IdentityApi;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.merchant.api.ShopRejectedEvent;
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

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ShopRejectionServiceTest {

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
    void rejectsPendingShopAndPublishesEventWithTrimmedReason() {
        when(identityApi.findUser(99L)).thenReturn(Optional.of(admin));
        when(shopRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(shop));
        when(shop.getId()).thenReturn(10L);
        when(shop.getOwnerId()).thenReturn(7L);
        when(shop.getShopName()).thenReturn("Pending shop");

        new ShopRejectionService(shopRepository, identityApi, eventPublisher)
                .reject(10L, 99L, "  Thiếu thông tin địa chỉ  ");

        verify(shop).reject(eq(99L), eq("Thiếu thông tin địa chỉ"));
        verify(shopRepository).save(shop);

        ArgumentCaptor<ShopRejectedEvent> event = ArgumentCaptor.forClass(ShopRejectedEvent.class);
        verify(eventPublisher).publishEvent(event.capture());
        assertNotNull(event.getValue().eventId());
        assertEquals(10L, event.getValue().shopId());
        assertEquals(7L, event.getValue().ownerId());
        assertEquals("Pending shop", event.getValue().shopName());
        assertEquals("Thiếu thông tin địa chỉ", event.getValue().rejectionReason());
        assertEquals(99L, event.getValue().rejectedById());
        assertNotNull(event.getValue().rejectedAt());
    }

    @Test
    void rejectsMissingShopWithoutPublishingEvent() {
        when(identityApi.findUser(99L)).thenReturn(Optional.of(admin));
        when(shopRepository.findByIdForUpdate(10L)).thenReturn(Optional.empty());

        assertThrows(ShopRequestNotFoundException.class,
                () -> new ShopRejectionService(shopRepository, identityApi, eventPublisher)
                        .reject(10L, 99L, "Thiếu thông tin"));

        verify(shopRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsNonAdminOrInactiveActorBeforeLockingShop() {
        when(identityApi.findUser(99L))
                .thenReturn(Optional.of(new UserSummary(99L, "User", UserRole.USER, AccountStatus.ACTIVE)));

        assertThrows(ShopRejectionAuthorizationException.class,
                () -> new ShopRejectionService(shopRepository, identityApi, eventPublisher)
                        .reject(10L, 99L, "Thiếu thông tin"));

        verify(shopRepository, never()).findByIdForUpdate(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsLockedAdminBeforeLockingShop() {
        when(identityApi.findUser(99L))
                .thenReturn(Optional.of(new UserSummary(99L, "Locked admin", UserRole.ADMIN, AccountStatus.LOCKED)));

        assertThrows(ShopRejectionAuthorizationException.class,
                () -> new ShopRejectionService(shopRepository, identityApi, eventPublisher)
                        .reject(10L, 99L, "Thiếu thông tin"));

        verify(shopRepository, never()).findByIdForUpdate(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsAlreadyProcessedShopWithoutSavingOrPublishingAgain() {
        when(identityApi.findUser(99L)).thenReturn(Optional.of(admin));
        when(shopRepository.findByIdForUpdate(10L)).thenReturn(Optional.of(new AlreadyProcessedShop()));

        assertThrows(InvalidShopStateTransitionException.class,
                () -> new ShopRejectionService(shopRepository, identityApi, eventPublisher)
                        .reject(10L, 99L, "Lý do mới"));

        verify(shopRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsBlankReasonBeforeCheckingActorOrShop() {
        ShopRejectionService service = new ShopRejectionService(shopRepository, identityApi, eventPublisher);

        assertThrows(IllegalArgumentException.class, () -> service.reject(10L, 99L, "  \t  "));

        verify(identityApi, never()).findUser(any());
        verify(shopRepository, never()).findByIdForUpdate(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsNullIdentifiers() {
        ShopRejectionService service = new ShopRejectionService(shopRepository, identityApi, eventPublisher);

        assertThrows(NullPointerException.class, () -> service.reject(null, 99L, "Thiếu thông tin"));
        assertThrows(NullPointerException.class, () -> service.reject(10L, null, "Thiếu thông tin"));
    }

    private static final class AlreadyProcessedShop extends Shop {

        @Override
        public void reject(Long adminId, String reason) {
            throw new InvalidShopStateTransitionException(ShopStatus.REJECTED, ShopStatus.REJECTED);
        }
    }
}
