package com.senvia.doangiuaky.merchant.service.image;

/** Metadata returned by Cloudinary after a merchant image upload. */
public record MerchantImageAsset(String secureUrl, String publicId) {
}
