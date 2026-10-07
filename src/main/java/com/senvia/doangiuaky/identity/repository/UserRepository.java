package com.senvia.doangiuaky.identity.repository;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRoleAndAccountStatus(UserRole role, AccountStatus accountStatus);

    List<User> findAllByRoleAndAccountStatusOrderByFullNameAsc(UserRole role, AccountStatus accountStatus);

    @Query("""
            select u from User u
            where (:status is null or u.accountStatus = :status)
              and (:query is null
                   or lower(u.fullName) like lower(concat('%', :query, '%'))
                   or lower(u.email) like lower(concat('%', :query, '%')))
            order by u.createdAt desc
            """)
    List<User> searchAccounts(
            @Param("query") String query,
            @Param("status") AccountStatus status);
}
