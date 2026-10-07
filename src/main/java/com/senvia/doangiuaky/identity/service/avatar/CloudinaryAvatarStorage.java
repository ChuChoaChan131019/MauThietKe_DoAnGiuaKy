package com.senvia.doangiuaky.identity.service.avatar;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.senvia.doangiuaky.common.config.CloudinaryProperties;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryAvatarStorage implements AvatarStorage {

    private static final long MAX_FILE_SIZE = 2 * 1024 * 1024;

    private final Cloudinary cloudinary;
    private final CloudinaryProperties properties;

    public CloudinaryAvatarStorage(Cloudinary cloudinary, CloudinaryProperties properties) {
        this.cloudinary = cloudinary;
        this.properties = properties;
    }

    @Override
    public AvatarAsset upload(Long userId, MultipartFile file) {
        requireConfigured();
        validateFile(file);
        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "senvia/avatars",
                            "public_id", userId + "/" + UUID.randomUUID(),
                            "resource_type", "image",
                            "allowed_formats", "jpg,png"));
            Object secureUrl = result.get("secure_url");
            Object publicId = result.get("public_id");
            if (!(secureUrl instanceof String url) || !(publicId instanceof String id)) {
                throw new AvatarStorageException("Cloudinary không trả về thông tin ảnh hợp lệ.");
            }
            return new AvatarAsset(url, id);
        } catch (IOException exception) {
            throw new AvatarStorageException("Không thể tải ảnh đại diện lên Cloudinary.", exception);
        }
    }

    @Override
    public void delete(String publicId) {
        requireConfigured();
        try {
            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            Object status = result.get("result");
            if (!"ok".equals(status) && !"not found".equals(status)) {
                throw new AvatarStorageException("Không thể xóa ảnh đại diện cũ khỏi Cloudinary.");
            }
        } catch (IOException exception) {
            throw new AvatarStorageException("Không thể xóa ảnh đại diện cũ khỏi Cloudinary.", exception);
        }
    }

    private void requireConfigured() {
        if (!StringUtils.hasText(properties.cloudName())
                || !StringUtils.hasText(properties.apiKey())
                || !StringUtils.hasText(properties.apiSecret())) {
            throw new AvatarStorageException("Dịch vụ upload ảnh chưa được cấu hình.");
        }
    }

    private static void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AvatarStorageException("Vui lòng chọn ảnh đại diện.");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new AvatarStorageException("Ảnh đại diện không được vượt quá 2 MB.");
        }
        String contentType = file.getContentType();
        if (!"image/jpeg".equalsIgnoreCase(contentType) && !"image/png".equalsIgnoreCase(contentType)) {
            throw new AvatarStorageException("Ảnh đại diện chỉ hỗ trợ định dạng JPEG hoặc PNG.");
        }
        try (ImageInputStream input = ImageIO.createImageInputStream(new ByteArrayInputStream(file.getBytes()))) {
            if (input == null) {
                throw new AvatarStorageException("Tệp tải lên không phải ảnh JPEG hoặc PNG hợp lệ.");
            }
            Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
            if (!readers.hasNext()) {
                throw new AvatarStorageException("Tệp tải lên không phải ảnh JPEG hoặc PNG hợp lệ.");
            }
            ImageReader reader = readers.next();
            try {
                reader.setInput(input);
                String format = reader.getFormatName().toLowerCase(Locale.ROOT);
                if (!"jpeg".equals(format) && !"jpg".equals(format) && !"png".equals(format)) {
                    throw new AvatarStorageException("Ảnh đại diện chỉ hỗ trợ định dạng JPEG hoặc PNG.");
                }
                if ("image/jpeg".equalsIgnoreCase(contentType)
                        && !"jpeg".equals(format) && !"jpg".equals(format)
                        || "image/png".equalsIgnoreCase(contentType) && !"png".equals(format)) {
                    throw new AvatarStorageException("Định dạng ảnh không khớp với nội dung tệp.");
                }
            } finally {
                reader.dispose();
            }
        } catch (IOException exception) {
            throw new AvatarStorageException("Không thể đọc ảnh đại diện đã tải lên.", exception);
        }
    }
}
