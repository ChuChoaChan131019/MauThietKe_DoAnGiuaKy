package com.senvia.doangiuaky.identity.security;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

public final class IdentityPrincipal implements UserDetails {

    private final Long userId;
    private final String fullName;
    private final String email;
    private final String passwordHash;
    private final UserRole role;
    private final AccountStatus accountStatus;

    public IdentityPrincipal(User user) {
        userId = user.getId();
        fullName = user.getFullName();
        email = user.getEmail();
        passwordHash = user.getPasswordHash();
        role = user.getRole();
        accountStatus = user.getAccountStatus();
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public UserRole getRole() {
        return role;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountStatus == AccountStatus.ACTIVE;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return accountStatus == AccountStatus.ACTIVE;
    }

    @Override
    public boolean equals(Object other) {
        return this == other || other instanceof IdentityPrincipal that
                && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId);
    }

    @Override
    public String toString() {
        return "IdentityPrincipal[userId=" + userId + ", role=" + role + "]";
    }
}
