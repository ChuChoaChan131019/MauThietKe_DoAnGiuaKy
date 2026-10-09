package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.merchant.api.CartProductView;
import com.senvia.doangiuaky.merchant.api.MerchantApi;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Optional;

/**
 * Merchant adapter for the demo catalog currently rendered by ProductsController.
 * Shopping consumes the catalog through the public MerchantApi contract.
 */
@Service
public class DemoMerchantApi implements MerchantApi {

    private static final Map<Long, CartProductView> PRODUCTS = Map.of(
            1L, product(1L, 101L, 1001L, "NOLA Store", "Canvas Tote Bag",
                    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&q=80", "1190000", 45),
            2L, product(2L, 102L, 1002L, "MORI Store", "Linen Shirt",
                    "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80", "890000", 0),
            3L, product(3L, 103L, 1003L, "KANSO Store", "Brass Table Lamp",
                    "https://images.unsplash.com/photo-1513506003901-1e6a35d10d3f?w=600&q=80", "1290000", 5),
            4L, product(4L, 104L, 1004L, "MAISON 28 Store", "Signature Parfum",
                    "https://images.unsplash.com/photo-1541643600914-78b084683702?w=600&q=80", "2490000", 12),
            5L, product(5L, 105L, 1005L, "FORM Store", "Ceramic Vase",
                    "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600&q=80", "690000", 20),
            6L, product(6L, 106L, 1006L, "ASTER Store", "Wall Frame",
                    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", "790000", 15),
            7L, product(7L, 101L, 1001L, "NOLA Store", "Leather Wallet",
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", "950000", 30),
            8L, product(8L, 102L, 1002L, "MORI Store", "Desk Organizer",
                    "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=600&q=80", "550000", 50));

    @Override
    public Optional<CartProductView> findProductForCart(Long productId) {
        return Optional.ofNullable(PRODUCTS.get(productId));
    }

    private static CartProductView product(
            Long productId,
            Long shopId,
            Long shopOwnerId,
            String shopName,
            String productName,
            String imageUrl,
            String price,
            int stockQuantity) {
        return new CartProductView(
                productId,
                shopId,
                shopOwnerId,
                shopName,
                productName,
                imageUrl,
                new BigDecimal(price),
                stockQuantity,
                true,
                true,
                true,
                true);
    }
}
