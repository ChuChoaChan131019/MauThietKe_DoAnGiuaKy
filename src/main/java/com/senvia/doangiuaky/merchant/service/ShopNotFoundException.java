package com.senvia.doangiuaky.merchant.service;

/** Raised when the authenticated user does not own a shop request. */
public class ShopNotFoundException extends ShopRegistrationException {

    public ShopNotFoundException(String message) {
        super(message);
    }
}
