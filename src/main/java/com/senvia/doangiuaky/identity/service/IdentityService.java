package com.senvia.doangiuaky.identity.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.dto.ChangePasswordForm;
import com.senvia.doangiuaky.identity.dto.ProfileForm;
import com.senvia.doangiuaky.identity.dto.RegistrationForm;
import com.senvia.doangiuaky.identity.entity.User;
import com.senvia.doangiuaky.identity.repository.UserRepository;
import com.senvia.doangiuaky.identity.service.avatar.AvatarAsset;
import com.senvia.doangiuaky.identity.service.avatar.AvatarStorage;
import com.senvia.doangiuaky.identity.service.avatar.AvatarStorageException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.sql.SQLException;
import java.util.Objects;

@Service
public class IdentityService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AvatarStorage avatarStorage;

    public IdentityService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AvatarStorage avatarStorage) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.avatarStorage = avatarStorage;
    }

    @Transactional
    public void register(RegistrationForm form) {
        if (!Objects.equals(form.getPassword(), form.getConfirmPassword())) {
            throw new InvalidPasswordException("Mật khẩu xác nhận không khớp.");
        }
        String email = normalizeEmail(form.getEmail());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateEmailException();
        }
        validateBcryptPassword(form.getPassword());

        User user = new User();
        user.setFullName(form.getFullName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(form.getPassword()));
        user.setRole(UserRole.USER);
        user.setAccountStatus(AccountStatus.ACTIVE);

        try {
            userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException exception) {
            Throwable cause = exception.getMostSpecificCause();
            String causeMessage = (exception.getMessage() + " " + cause.getMessage()).toLowerCase(Locale.ROOT);
            if (cause instanceof SQLException sqlException
                    && "23505".equals(sqlException.getSQLState())
                    && causeMessage.contains("uk_users_email_lower")) {
                throw new DuplicateEmailException();
            }
            throw exception;
        }
    }

    @Transactional(readOnly = true)
    public ProfileForm getProfile(Long userId) {
        User user = findUser(userId);
        ProfileForm form = new ProfileForm();
        form.setFullName(user.getFullName());
        form.setPhone(user.getPhone());
        form.setAddress(user.getAddress());
        return form;
    }

    @Transactional(readOnly = true)
    public String getAvatarUrl(Long userId) {
        return findUser(userId).getAvatarUrl();
    }

    @Transactional
    public void updateProfile(Long userId, ProfileForm form, MultipartFile avatarFile) {
        User user = findUser(userId);
        user.setFullName(form.getFullName().trim());
        user.setPhone(blankToNull(form.getPhone()));
        user.setAddress(blankToNull(form.getAddress()));

        if (avatarFile != null && !avatarFile.isEmpty()) {
            AvatarAsset newAvatar = avatarStorage.upload(userId, avatarFile);
            String previousPublicId = user.getAvatarPublicId();
            user.setAvatarUrl(newAvatar.secureUrl());
            user.setAvatarPublicId(newAvatar.publicId());
            try {
                userRepository.saveAndFlush(user);
            } catch (DataAccessException exception) {
                try {
                    avatarStorage.delete(newAvatar.publicId());
                } catch (AvatarStorageException cleanupException) {
                    exception.addSuppressed(cleanupException);
                }
                throw exception;
            }
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    if (StringUtils.hasText(previousPublicId)) {
                        try {
                            avatarStorage.delete(previousPublicId);
                        } catch (AvatarStorageException exception) {
                            throw new AvatarStorageException(
                                    "Ảnh mới đã được lưu nhưng không thể xóa ảnh đại diện cũ khỏi Cloudinary.",
                                    exception);
                        }
                    }
                }

                @Override
                public void afterCompletion(int status) {
                    if (status != TransactionSynchronization.STATUS_COMMITTED) {
                        avatarStorage.delete(newAvatar.publicId());
                    }
                }
            });
            return;
        }

        userRepository.save(user);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordForm form) {
        User user = findUser(userId);
        if (!passwordEncoder.matches(form.getCurrentPassword(), user.getPasswordHash())) {
            throw new InvalidPasswordException("Mật khẩu hiện tại không đúng.");
        }
        if (!form.getNewPassword().equals(form.getConfirmPassword())) {
            throw new InvalidPasswordException("Mật khẩu xác nhận không khớp.");
        }
        validateBcryptPassword(form.getNewPassword());
        if (passwordEncoder.matches(form.getNewPassword(), user.getPasswordHash())) {
            throw new InvalidPasswordException("Mật khẩu mới phải khác mật khẩu hiện tại.");
        }
        user.setPasswordHash(passwordEncoder.encode(form.getNewPassword()));
        userRepository.save(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AccountOperationException("Tài khoản không tồn tại."));
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private static void validateBcryptPassword(String password) {
        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new InvalidPasswordException("Mật khẩu không được vượt quá 72 byte.");
        }
    }
}
