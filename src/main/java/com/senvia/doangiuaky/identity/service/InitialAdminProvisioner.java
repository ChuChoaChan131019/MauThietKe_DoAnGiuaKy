package com.senvia.doangiuaky.identity.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.dto.RegistrationForm;
import com.senvia.doangiuaky.identity.entity.User;
import com.senvia.doangiuaky.identity.repository.UserRepository;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Locale;

@Component
public class InitialAdminProvisioner implements ApplicationRunner {

    private final String email;
    private final String password;
    private final String fullName;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Validator validator;

    public InitialAdminProvisioner(
            @Value("${app.identity.bootstrap-admin.email:}") String email,
            @Value("${app.identity.bootstrap-admin.password:}") String password,
            @Value("${app.identity.bootstrap-admin.full-name:Platform Administrator}") String fullName,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            Validator validator) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.validator = validator;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!StringUtils.hasText(email) && !StringUtils.hasText(password)) {
            return;
        }
        if (!StringUtils.hasText(email) || !StringUtils.hasText(password)) {
            throw new IllegalStateException("Configure both INITIAL_ADMIN_EMAIL and INITIAL_ADMIN_PASSWORD.");
        }

        RegistrationForm validationForm = new RegistrationForm();
        validationForm.setFullName(fullName);
        validationForm.setEmail(email);
        validationForm.setPassword(password);
        validationForm.setConfirmPassword(password);
        if (!validator.validate(validationForm).isEmpty()) {
            throw new IllegalStateException("Initial admin settings do not meet account validation requirements.");
        }
        if (password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72) {
            throw new IllegalStateException("INITIAL_ADMIN_PASSWORD exceeds the BCrypt input limit.");
        }

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);
        userRepository.findByEmailIgnoreCase(normalizedEmail).ifPresentOrElse(user -> {
            if (user.getRole() != UserRole.ADMIN) {
                throw new IllegalStateException("Initial admin email already belongs to a non-admin account.");
            }
        }, () -> {
            User admin = new User();
            admin.setFullName(fullName.trim());
            admin.setEmail(normalizedEmail);
            admin.setPasswordHash(passwordEncoder.encode(password));
            admin.setRole(UserRole.ADMIN);
            admin.setAccountStatus(AccountStatus.ACTIVE);
            userRepository.saveAndFlush(admin);
        });
    }
}
