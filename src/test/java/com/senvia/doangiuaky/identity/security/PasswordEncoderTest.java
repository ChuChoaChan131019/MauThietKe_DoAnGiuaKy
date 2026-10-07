package com.senvia.doangiuaky.identity.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordEncoderTest {

    @Test
    void configuredEncoderStoresAndVerifiesBcryptHashes() {
        PasswordEncoder encoder = new SecurityConfig().passwordEncoder();
        String rawPassword = "correctHorse1";

        String hash = encoder.encode(rawPassword);

        assertTrue(hash.startsWith("$2"));
        assertFalse(hash.equals(rawPassword));
        assertTrue(encoder.matches(rawPassword, hash));
    }
}
