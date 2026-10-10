package com.senvia.doangiuaky.merchant.service;

/** Raised when the actor is not an active admin allowed to approve a shop. */
public final class ShopApprovalAuthorizationException extends RuntimeException {

    public ShopApprovalAuthorizationException(String message) {
        super(message);
    }
}
