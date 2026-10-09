package com.senvia.doangiuaky.merchant.service.image;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.senvia.doangiuaky.common.config.CloudinaryProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

/** Cloudinary adapter for merchant-owned images. */
@Service
public class CloudinaryMerchantImageStorage implements MerchantImageStorage {

    private static final Logger logger = LoggerFactory.getLogger(CloudinaryMerchantImageStorage.class);
    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024;
    private static final String MERCHANT_FOLDER = "senvia/merchant";

    private final Cloudinary cloudinary;
    private final CloudinaryProperties properties;

    public CloudinaryMerchantImageStorage(Cloudinary cloudinary, CloudinaryProperties properties) {
        this.cloudinary = cloudinary;
        this.properties = properties;
    }

    @Override
    public MerchantImageAsset uploadShopLogo(Long ownerId, MultipartFile file) {
        return upload(ownerId, file, "shop-logos");
    }

    @Override
    public MerchantImageAsset uploadProductImage(Long ownerId, MultipartFile file) {
        return upload(ownerId, file, "product-images");
    }

    @Override
    public void delete(String publicId) {
        requireConfigured();
        if (!StringUtils.hasText(publicId)) {
            throw new MerchantImageStorageException("Không xác định được ảnh cần xóa.");
        }
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            Object status = result.get("result");
            if (!"ok".equals(status) && !"not found".equals(status)) {
                throw new MerchantImageStorageException("Không thể xóa ảnh khỏi Cloudinary.");
            }
        } catch (IOException exception) {
            throw new MerchantImageStorageException("Không thể xóa ảnh khỏi Cloudinary.", exception);
        } catch (RuntimeException exception) {
            if (exception instanceof MerchantImageStorageException storageException) {
                throw storageException;
            }
            throw new MerchantImageStorageException("Không thể xóa ảnh khỏi Cloudinary.", exception);
        }
    }

    private MerchantImageAsset upload(Long ownerId, MultipartFile file, String assetFolder) {
        requireOwner(ownerId);
        requireConfigured();
        byte[] content = validateFile(file);
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    content,
                    ObjectUtils.asMap(
                            "folder", MERCHANT_FOLDER + "/" + assetFolder,
                            "public_id", ownerId + "/" + UUID.randomUUID(),
                            "resource_type", "image",
                            "allowed_formats", "jpg,png"));
            Object secureUrl = result.get("secure_url");
            Object publicId = result.get("public_id");
            if (!(secureUrl instanceof String url) || !StringUtils.hasText(url)
                    || !(publicId instanceof String id) || !StringUtils.hasText(id)) {
                throw new MerchantImageStorageException("Cloudinary không trả về thông tin ảnh hợp lệ.");
            }
            return new MerchantImageAsset(url, id);
        } catch (IOException exception) {
            String category = classifyUploadFailure(exception);
            logger.warn("Cloudinary không thể tải {} cho owner {} ({}; loại lỗi: {}).",
                    assetFolder, ownerId, category, exception.getClass().getSimpleName());
            throw new MerchantImageStorageException("Không thể tải ảnh merchant lên Cloudinary.", exception);
        } catch (RuntimeException exception) {
            if (exception instanceof MerchantImageStorageException storageException) {
                throw storageException;
            }
            logger.warn("Cloudinary không thể tải {} cho owner {} ({}; loại lỗi: {}).",
                    assetFolder, ownerId, classifyUploadFailure(exception), exception.getClass().getSimpleName());
            throw new MerchantImageStorageException("Không thể tải ảnh merchant lên Cloudinary.", exception);
        }
    }

    private void requireConfigured() {
        if (!StringUtils.hasText(properties.cloudName())
                || !StringUtils.hasText(properties.apiKey())
                || !StringUtils.hasText(properties.apiSecret())) {
            throw new MerchantImageStorageException("Dịch vụ upload ảnh chưa được cấu hình.");
        }
    }

    private static void requireOwner(Long ownerId) {
        if (ownerId == null || ownerId <= 0) {
            throw new MerchantImageStorageException("Không xác định được chủ sở hữu ảnh.");
        }
    }

    private static byte[] validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new MerchantImageStorageException("Vui lòng chọn ảnh.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new MerchantImageStorageException("Ảnh không được vượt quá 2 MB.");
        }
        String contentType = file.getContentType();
        if (!"image/jpeg".equalsIgnoreCase(contentType) && !"image/png".equalsIgnoreCase(contentType)) {
            throw new MerchantImageStorageException("Ảnh chỉ hỗ trợ định dạng JPEG hoặc PNG.");
        }

        final byte[] content;
        try {
            content = file.getBytes();
        } catch (IOException exception) {
            throw new MerchantImageStorageException("Không thể đọc ảnh đã tải lên.", exception);
        }

        try (ImageInputStream input = ImageIO.createImageInputStream(new ByteArrayInputStream(content))) {
            if (input == null) {
                throw invalidImage();
            }
            Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
            if (!readers.hasNext()) {
                throw invalidImage();
            }
            ImageReader reader = readers.next();
            try {
                reader.setInput(input);
                String format = reader.getFormatName().toLowerCase(Locale.ROOT);
                boolean jpeg = "jpeg".equals(format) || "jpg".equals(format);
                boolean png = "png".equals(format);
                if ((!"image/jpeg".equalsIgnoreCase(contentType) || !jpeg)
                        && (!"image/png".equalsIgnoreCase(contentType) || !png)) {
                    throw invalidImage();
                }
            } finally {
                reader.dispose();
            }
        } catch (IOException exception) {
            throw new MerchantImageStorageException("Không thể đọc ảnh đã tải lên.", exception);
        }
        return content;
    }

    private static MerchantImageStorageException invalidImage() {
        return new MerchantImageStorageException("Tệp tải lên không phải ảnh JPEG hoặc PNG hợp lệ.");
    }

    private static String classifyUploadFailure(Exception exception) {
        Throwable current = exception;
        while (current != null) {
            String message = String.valueOf(current.getMessage()).toLowerCase(Locale.ROOT);
            if (message.contains("401") || message.contains("403") || message.contains("signature")
                    || message.contains("api key") || message.contains("api_key")
                    || message.contains("api_secret") || message.contains("authorization")
                    || message.contains("unauthorized") || message.contains("credential")) {
                return "lỗi xác thực Cloudinary";
            }
            if (message.contains("timeout") || message.contains("connect") || message.contains("unknown host")) {
                return "lỗi kết nối tới Cloudinary";
            }
            current = current.getCause();
        }
        return "lỗi phản hồi từ Cloudinary";
    }
}
