package com.senvia.doangiuaky.identity.service.avatar;

import org.springframework.web.multipart.MultipartFile;

public interface AvatarStorage {

    AvatarAsset upload(Long userId, MultipartFile file);

    void delete(String publicId);
}
