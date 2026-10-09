package com.senvia.doangiuaky.merchant.service;

/** Raised when a user is not eligible to submit a shop registration request. */
public class ShopRegistrationException extends RuntimeException {

    public ShopRegistrationException(String message) {
        super(message);
    }
}
