package com.senvia.doangiuaky.identity.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.entity.User;
import com.senvia.doangiuaky.identity.repository.UserRepository;
import com.senvia.doangiuaky.identity.security.SessionInvalidator;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AdminAccountServiceTest {

    private final UserRepository userRepository = mock(UserRepository.class);
    private final SessionInvalidator sessionInvalidator = mock(SessionInvalidator.class);
    private final AdminAccountService service = new AdminAccountService(userRepository, sessionInvalidator);

    @AfterEach
    void clearTransactionSynchronization() {
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.clearSynchronization();
        }
        TransactionSynchronizationManager.setActualTransactionActive(false);
    }

    @Test
    void lockRejectsAdminTargets() {
        User admin = mock(User.class);
        when(admin.getId()).thenReturn(5L);
        when(admin.getRole()).thenReturn(UserRole.ADMIN);
        when(userRepository.findById(5L)).thenReturn(Optional.of(admin));

        assertThrows(AccountOperationException.class, () -> service.lock(5L, 9L, "Policy violation"));

        verify(userRepository, never()).saveAndFlush(admin);
    }

    @Test
    void lockRejectsTheCurrentAdmin() {
        User user = mock(User.class);
        when(user.getId()).thenReturn(9L);
        when(userRepository.findById(9L)).thenReturn(Optional.of(user));

        assertThrows(AccountOperationException.class, () -> service.lock(9L, 9L, "Policy violation"));

        verify(userRepository, never()).saveAndFlush(user);
    }

    @Test
    void lockPersistsReasonActorAndTimeBeforeInvalidatingSessions() {
        User target = mock(User.class);
        User actor = mock(User.class);
        when(target.getId()).thenReturn(5L);
        when(target.getRole()).thenReturn(UserRole.USER);
        when(target.getAccountStatus()).thenReturn(AccountStatus.ACTIVE);
        when(actor.getId()).thenReturn(9L);
        when(userRepository.findById(5L)).thenReturn(Optional.of(target));
        when(userRepository.findById(9L)).thenReturn(Optional.of(actor));
        TransactionSynchronizationManager.initSynchronization();

        service.lock(5L, 9L, "  Policy violation  ");

        verify(target).setAccountStatus(AccountStatus.LOCKED);
        verify(target).setLockReason("Policy violation");
        verify(target).setLockedBy(actor);
        verify(target).setLockedAt(org.mockito.ArgumentMatchers.notNull());
        verify(userRepository).saveAndFlush(target);
        verify(sessionInvalidator, never()).invalidate(5L);
        List<TransactionSynchronization> synchronizations =
                TransactionSynchronizationManager.getSynchronizations();
        assertNotNull(synchronizations);
        synchronizations.forEach(TransactionSynchronization::afterCommit);
        verify(sessionInvalidator).invalidate(5L);
    }

    @Test
    void searchWithoutFiltersUsesTheDedicatedQueryWithoutNullParameters() {
        when(userRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of());

        assertEquals(List.of(), service.search(null, null));

        verify(userRepository).findAllByOrderByCreatedAtDesc();
    }
}
