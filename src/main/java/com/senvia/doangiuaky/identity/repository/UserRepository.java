package com.senvia.doangiuaky.identity.repository;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRoleAndAccountStatus(UserRole role, AccountStatus accountStatus);

    List<User> findAllByRoleAndAccountStatusOrderByFullNameAsc(UserRole role, AccountStatus accountStatus);

    List<User> findAllByOrderByCreatedAtDesc();

    List<User> findAllByAccountStatusOrderByCreatedAtDesc(AccountStatus status);

    List<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrderByCreatedAtDesc(
            String fullName, String email);

    List<User> findByAccountStatusAndFullNameContainingIgnoreCaseOrAccountStatusAndEmailContainingIgnoreCaseOrderByCreatedAtDesc(
            AccountStatus fullNameStatus,
            String fullName,
            AccountStatus emailStatus,
            String email);
}
