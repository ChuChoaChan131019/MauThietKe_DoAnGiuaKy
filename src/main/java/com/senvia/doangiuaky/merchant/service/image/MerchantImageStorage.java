package com.senvia.doangiuaky.merchant.service.image;

import org.springframework.web.multipart.MultipartFile;

/** Storage boundary for merchant-owned logo and product images. */
public interface MerchantImageStorage {

    MerchantImageAsset uploadShopLogo(Long ownerId, MultipartFile file);

    MerchantImageAsset uploadProductImage(Long ownerId, MultipartFile file);

    void delete(String publicId);
}
