package com.senvia.doangiuaky.merchant.state;

import com.senvia.doangiuaky.merchant.entity.ShopStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ShopStateFactoryTest {

    @Test
    void resolvesLifecycleCapabilitiesForEveryShopStatus() {
        assertState(ShopStatus.PENDING, PendingShopState.class, false, false, false, false);
        assertState(ShopStatus.APPROVED, ApprovedShopState.class, true, true, false, true);
        assertState(ShopStatus.REJECTED, RejectedShopState.class, false, false, true, false);
        assertState(ShopStatus.LOCKED, LockedShopState.class, false, false, false, true);
    }

    @Test
    void rejectsNullStatus() {
        assertThrows(NullPointerException.class, () -> ShopStateFactory.resolve(null));
    }

    private void assertState(ShopStatus status, Class<? extends ShopState> stateType,
                             boolean canAddProduct, boolean canReceiveOrder,
                             boolean canResubmit, boolean canHandleExistingOrders) {
        ShopState state = ShopStateFactory.resolve(status);

        assertInstanceOf(stateType, state);
        assertEquals(status, state.status());
        assertEquals(canAddProduct, state.canAddProduct());
        assertEquals(canReceiveOrder, state.canReceiveOrder());
        assertEquals(canResubmit, state.canResubmit());
        assertEquals(canHandleExistingOrders, state.canHandleExistingOrders());
    }
}
