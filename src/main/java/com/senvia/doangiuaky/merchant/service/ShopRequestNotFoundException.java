package com.senvia.doangiuaky.merchant.service;

/** Raised when an Admin requests a shop request that is not pending or does not exist. */
public class ShopRequestNotFoundException extends RuntimeException {

    public ShopRequestNotFoundException(String message) {
        super(message);
    }
}
