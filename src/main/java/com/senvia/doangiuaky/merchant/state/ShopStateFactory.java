package com.senvia.doangiuaky.merchant.state;

import com.senvia.doangiuaky.merchant.entity.ShopStatus;

import java.util.Objects;

/** Resolves persisted shop statuses to their lifecycle behavior. */
public final class ShopStateFactory {

    private static final ShopState PENDING = new PendingShopState();
    private static final ShopState APPROVED = new ApprovedShopState();
    private static final ShopState REJECTED = new RejectedShopState();
    private static final ShopState LOCKED = new LockedShopState();

    private ShopStateFactory() {
    }

    public static ShopState resolve(ShopStatus status) {
        return switch (Objects.requireNonNull(status, "Shop status must not be null")) {
            case PENDING -> PENDING;
            case APPROVED -> APPROVED;
            case REJECTED -> REJECTED;
            case LOCKED -> LOCKED;
        };
    }
}
