package com.senvia.doangiuaky.identity.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.identity.entity.User;
import com.senvia.doangiuaky.identity.repository.UserRepository;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class IdentityApiServiceTest {

    @Test
    void apiReturnsOnlyPublicSummaryFields() {
        UserRepository repository = mock(UserRepository.class);
        User user = mock(User.class);
        when(user.getId()).thenReturn(7L);
        when(user.getFullName()).thenReturn("Admin User");
        when(user.getRole()).thenReturn(UserRole.ADMIN);
        when(user.getAccountStatus()).thenReturn(AccountStatus.ACTIVE);
        when(repository.findById(7L)).thenReturn(Optional.of(user));
        IdentityApiService api = new IdentityApiService(repository);

        UserSummary result = api.findUser(7L).orElseThrow();

        assertEquals(new UserSummary(7L, "Admin User", UserRole.ADMIN, AccountStatus.ACTIVE), result);
        assertFalse(List.of(UserSummary.class.getRecordComponents()).stream()
                .anyMatch(component -> component.getName().contains("password")));
    }

    @Test
    void activeAdminQueryReturnsOnlyActiveAdminUsers() {
        UserRepository repository = mock(UserRepository.class);
        User activeAdmin = mock(User.class);
        when(activeAdmin.getId()).thenReturn(7L);
        when(activeAdmin.getFullName()).thenReturn("Admin User");
        when(activeAdmin.getRole()).thenReturn(UserRole.ADMIN);
        when(activeAdmin.getAccountStatus()).thenReturn(AccountStatus.ACTIVE);
        when(repository.findAllByRoleAndAccountStatusOrderByFullNameAsc(UserRole.ADMIN, AccountStatus.ACTIVE))
                .thenReturn(List.of(activeAdmin));
        IdentityApiService api = new IdentityApiService(repository);

        assertEquals(1, api.findActiveAdmins().size());
        assertEquals(UserRole.ADMIN, api.findActiveAdmins().getFirst().role());
    }

    @Test
    void findUserByEmailNormalizesBeforeLookup() {
        UserRepository repository = mock(UserRepository.class);
        User user = mock(User.class);
        when(user.getId()).thenReturn(11L);
        when(user.getFullName()).thenReturn("Buyer User");
        when(user.getRole()).thenReturn(UserRole.USER);
        when(user.getAccountStatus()).thenReturn(AccountStatus.ACTIVE);
        when(repository.findByEmailIgnoreCase("buyer@example.com")).thenReturn(Optional.of(user));
        IdentityApiService api = new IdentityApiService(repository);

        assertEquals(11L, api.findUserByEmail("  BUYER@example.com ").orElseThrow().userId());
    }
}
