package com.senvia.doangiuaky.merchant.service;

/** Raised when the actor is not an active Admin allowed to reject a shop. */
public final class ShopRejectionAuthorizationException extends RuntimeException {

    public ShopRejectionAuthorizationException(String message) {
        super(message);
    }
}
