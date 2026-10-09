package com.senvia.doangiuaky.merchant.api;

import java.util.Optional;

/** Public, side-effect-free catalog contract for other modules. */
@FunctionalInterface
public interface MerchantApi {

    /**
     * Returns a product summary even when the product exists but is not saleable.
     * An empty result means that the product does not exist.
     */
    Optional<CartProductView> findProductForCart(Long productId);
}
