package com.senvia.doangiuaky.identity.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.IdentityApi;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.identity.entity.User;
import com.senvia.doangiuaky.identity.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class IdentityApiService implements IdentityApi {

    private final UserRepository userRepository;

    public IdentityApiService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public Optional<UserSummary> findUser(Long userId) {
        return userRepository.findById(userId).map(IdentityApiService::toSummary);
    }

    @Override
    public boolean userExists(Long userId) {
        return userRepository.existsById(userId);
    }

    @Override
    public boolean isUserActive(Long userId) {
        return userRepository.findById(userId)
                .map(user -> user.getAccountStatus() == AccountStatus.ACTIVE)
                .orElse(false);
    }

    @Override
    public List<UserSummary> findActiveAdmins() {
        return userRepository.findAllByRoleAndAccountStatusOrderByFullNameAsc(
                        UserRole.ADMIN, AccountStatus.ACTIVE)
                .stream()
                .map(IdentityApiService::toSummary)
                .toList();
    }

    private static UserSummary toSummary(User user) {
        return new UserSummary(user.getId(), user.getFullName(), user.getRole(), user.getAccountStatus());
    }
}
