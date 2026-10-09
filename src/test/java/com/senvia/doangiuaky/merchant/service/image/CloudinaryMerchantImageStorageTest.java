package com.senvia.doangiuaky.merchant.service.image;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.senvia.doangiuaky.common.config.CloudinaryProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class CloudinaryMerchantImageStorageTest {

    private Cloudinary cloudinary;
    private Uploader uploader;
    private CloudinaryMerchantImageStorage storage;

    @BeforeEach
    void setUp() {
        cloudinary = mock(Cloudinary.class);
        uploader = mock(Uploader.class);
        when(cloudinary.uploader()).thenReturn(uploader);
        storage = new CloudinaryMerchantImageStorage(
                cloudinary,
                new CloudinaryProperties("cloud", "key", "secret"));
    }

    @Test
    void uploadsShopLogoAndReturnsCloudinaryMetadata() throws IOException {
        when(uploader.upload(any(byte[].class), any(Map.class)))
                .thenReturn(Map.of("secure_url", "https://res.cloudinary.com/demo/logo.png", "public_id", "shops/4/logo"));

        MerchantImageAsset asset = storage.uploadShopLogo(4L, validPng("logo"));

        assertEquals("https://res.cloudinary.com/demo/logo.png", asset.secureUrl());
        assertEquals("shops/4/logo", asset.publicId());
        verify(uploader).upload(any(byte[].class), any(Map.class));
    }

    @Test
    void usesProductImageFolderForProductUploads() throws IOException {
        when(uploader.upload(any(byte[].class), any(Map.class)))
                .thenReturn(Map.of("secure_url", "https://res.cloudinary.com/demo/product.png", "public_id", "products/4/image"));

        storage.uploadProductImage(4L, validPng("product"));

        verify(uploader).upload(any(byte[].class), org.mockito.ArgumentMatchers.argThat(options ->
                String.valueOf(options.get("folder")).endsWith("/product-images")));
    }

    @Test
    void rejectsInvalidImageBeforeCallingCloudinary() {
        MockMultipartFile file = new MockMultipartFile(
                "image", "image.txt", "text/plain", "not-an-image".getBytes());

        assertThrows(MerchantImageStorageException.class, () -> storage.uploadProductImage(4L, file));
        verify(cloudinary, never()).uploader();
    }

    @Test
    void rejectsEmptyImageBeforeCallingCloudinary() {
        MockMultipartFile file = new MockMultipartFile("image", "empty.png", "image/png", new byte[0]);

        assertThrows(MerchantImageStorageException.class, () -> storage.uploadProductImage(4L, file));
        verify(cloudinary, never()).uploader();
    }

    @Test
    void rejectsImageLargerThanTwoMegabytesBeforeCallingCloudinary() {
        byte[] oversized = new byte[2 * 1024 * 1024 + 1];
        MockMultipartFile file = new MockMultipartFile("image", "large.png", "image/png", oversized);

        assertThrows(MerchantImageStorageException.class, () -> storage.uploadProductImage(4L, file));
        verify(cloudinary, never()).uploader();
    }

    @Test
    void rejectsIncompleteCloudinaryUploadResponse() throws IOException {
        when(uploader.upload(any(byte[].class), any(Map.class)))
                .thenReturn(Map.of("secure_url", "https://res.cloudinary.com/demo/image.png"));

        assertThrows(MerchantImageStorageException.class,
                () -> storage.uploadProductImage(4L, validPng("product")));
    }

    @Test
    void rejectsMissingConfiguration() {
        CloudinaryMerchantImageStorage unconfigured = new CloudinaryMerchantImageStorage(
                cloudinary,
                new CloudinaryProperties("", "", ""));

        assertThrows(MerchantImageStorageException.class,
                () -> unconfigured.uploadShopLogo(4L, validPng("logo")));
        verify(cloudinary, never()).uploader();
    }

    @Test
    void treatsMissingCloudinaryAssetAsSuccessfulDelete() throws IOException {
        when(uploader.destroy(eq("shops/4/logo"), any(Map.class)))
                .thenReturn(Map.of("result", "not found"));

        storage.delete("shops/4/logo");

        verify(uploader).destroy("shops/4/logo", Map.of());
    }

    @Test
    void wrapsCloudinaryDeleteFailureWithoutExposingCredentials() throws IOException {
        when(uploader.destroy(eq("shops/4/logo"), any(Map.class)))
                .thenReturn(Map.of("result", "error"));

        MerchantImageStorageException exception = assertThrows(
                MerchantImageStorageException.class, () -> storage.delete("shops/4/logo"));

        assertEquals("Không thể xóa ảnh khỏi Cloudinary.", exception.getMessage());
    }

    @Test
    void wrapsCloudinaryUploadFailureWithoutExposingCredentials() throws IOException {
        when(uploader.upload(any(byte[].class), any(Map.class)))
                .thenThrow(new IOException("secret=should-not-be-returned"));

        MerchantImageStorageException exception = assertThrows(
                MerchantImageStorageException.class, () -> storage.uploadProductImage(4L, validPng("product")));

        assertEquals("Không thể tải ảnh merchant lên Cloudinary.", exception.getMessage());
    }

    @Test
    void rejectsInvalidOwnerBeforeCallingCloudinary() {
        assertThrows(MerchantImageStorageException.class,
                () -> storage.uploadShopLogo(0L, validPng("logo")));
        verify(cloudinary, never()).uploader();
    }

    private static MockMultipartFile validPng(String name) {
        byte[] png = Base64.getDecoder().decode(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=");
        return new MockMultipartFile("image", name + ".png", "image/png", png);
    }
}
