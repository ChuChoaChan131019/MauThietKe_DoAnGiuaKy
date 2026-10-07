package com.senvia.doangiuaky.identity.security;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.entity.User;
import com.senvia.doangiuaky.identity.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class IdentityUserDetailsServiceTest {

    @Test
    void loginLookupTrimsAndNormalizesEmail() {
        UserRepository repository = mock(UserRepository.class);
        User user = mock(User.class);
        when(user.getId()).thenReturn(12L);
        when(user.getEmail()).thenReturn("buyer@example.com");
        when(user.getFullName()).thenReturn("Buyer");
        when(user.getPasswordHash()).thenReturn("$2a$hash");
        when(user.getRole()).thenReturn(UserRole.USER);
        when(user.getAccountStatus()).thenReturn(AccountStatus.ACTIVE);
        when(repository.findByEmailIgnoreCase("buyer@example.com")).thenReturn(Optional.of(user));

        IdentityUserDetailsService service = new IdentityUserDetailsService(repository);
        IdentityPrincipal principal = (IdentityPrincipal) service.loadUserByUsername(" Buyer@Example.com ");

        assertEquals("buyer@example.com", principal.getUsername());
        verify(repository).findByEmailIgnoreCase("buyer@example.com");
    }

    @Test
    void loginLookupRejectsUnknownEmail() {
        UserRepository repository = mock(UserRepository.class);
        when(repository.findByEmailIgnoreCase("missing@example.com")).thenReturn(Optional.empty());

        IdentityUserDetailsService service = new IdentityUserDetailsService(repository);

        assertThrows(UsernameNotFoundException.class,
                () -> service.loadUserByUsername("missing@example.com"));
    }
}
