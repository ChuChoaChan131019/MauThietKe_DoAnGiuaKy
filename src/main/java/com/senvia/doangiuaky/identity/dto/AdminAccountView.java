package com.senvia.doangiuaky.identity.dto;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;

import java.time.Instant;

public record AdminAccountView(
        Long id,
        String fullName,
        String email,
        UserRole role,
        AccountStatus accountStatus,
        String lockReason,
        String lockedByName,
        Instant lockedAt) {
}
