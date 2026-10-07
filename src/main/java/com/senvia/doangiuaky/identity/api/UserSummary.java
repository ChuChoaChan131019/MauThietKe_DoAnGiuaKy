package com.senvia.doangiuaky.identity.api;

public record UserSummary(
        Long userId,
        String fullName,
        UserRole role,
        AccountStatus accountStatus) {
}
