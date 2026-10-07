package com.senvia.doangiuaky.identity.security;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.entity.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class IdentityPrincipalTest {

    @Test
    void lockedAccountIsNotEnabledForAuthentication() {
        User user = new User();
        user.setEmail("locked@example.com");
        user.setFullName("Locked User");
        user.setPasswordHash("hash");
        user.setRole(UserRole.USER);
        user.setAccountStatus(AccountStatus.LOCKED);

        IdentityPrincipal principal = new IdentityPrincipal(user);

        assertFalse(principal.isAccountNonLocked());
        assertFalse(principal.isEnabled());
        assertEquals("ROLE_USER", principal.getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void activeAccountIsEnabled() {
        User user = new User();
        user.setEmail("active@example.com");
        user.setFullName("Active User");
        user.setPasswordHash("hash");
        user.setRole(UserRole.ADMIN);
        user.setAccountStatus(AccountStatus.ACTIVE);

        IdentityPrincipal principal = new IdentityPrincipal(user);

        assertTrue(principal.isAccountNonLocked());
        assertTrue(principal.isEnabled());
        assertEquals("ROLE_ADMIN", principal.getAuthorities().iterator().next().getAuthority());
        assertEquals("IdentityPrincipal[userId=null, role=ADMIN]", principal.toString());
    }
}
