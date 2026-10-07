package com.senvia.doangiuaky.identity.security;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class SessionInvalidatorTest {

    @Test
    void expiresEveryRegisteredSessionForTheLockedUser() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(21L);
        when(user.getFullName()).thenReturn("Buyer");
        when(user.getEmail()).thenReturn("buyer@example.com");
        when(user.getPasswordHash()).thenReturn("not-exposed");
        when(user.getRole()).thenReturn(UserRole.USER);
        when(user.getAccountStatus()).thenReturn(AccountStatus.ACTIVE);
        IdentityPrincipal principal = new IdentityPrincipal(user);
        SessionInformation firstSession = mock(SessionInformation.class);
        SessionInformation secondSession = mock(SessionInformation.class);
        SessionRegistry registry = mock(SessionRegistry.class);
        when(registry.getAllPrincipals()).thenReturn(List.of(principal));
        when(registry.getAllSessions(principal, false)).thenReturn(List.of(firstSession, secondSession));

        new SessionInvalidator(registry).invalidate(21L);

        verify(firstSession).expireNow();
        verify(secondSession).expireNow();
    }
}
