package com.senvia.doangiuaky.merchant.state;

import com.senvia.doangiuaky.merchant.entity.ShopStatus;

/** Raised when a shop attempts a lifecycle transition that its state does not allow. */
public final class InvalidShopStateTransitionException extends RuntimeException {

    private final ShopStatus currentStatus;
    private final ShopStatus targetStatus;

    public InvalidShopStateTransitionException(ShopStatus currentStatus, ShopStatus targetStatus) {
        super("Cannot transition shop from " + currentStatus + " to " + targetStatus + ".");
        this.currentStatus = currentStatus;
        this.targetStatus = targetStatus;
    }

    public ShopStatus getCurrentStatus() {
        return currentStatus;
    }

    public ShopStatus getTargetStatus() {
        return targetStatus;
    }
}
