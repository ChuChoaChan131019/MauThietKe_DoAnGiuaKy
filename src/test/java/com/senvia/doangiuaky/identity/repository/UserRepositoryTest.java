package com.senvia.doangiuaky.identity.repository;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class UserRepositoryTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void lowerEmailIndexRejectsCaseInsensitiveDuplicates() {
        insertUser("CaseSensitive@example.com");

        assertThrows(org.springframework.dao.DataIntegrityViolationException.class,
                () -> insertUser("casesensitive@example.com"));
    }

    private void insertUser(String email) {
        jdbcTemplate.update("""
                insert into users (full_name, email, password_hash, role, account_status)
                values (?, ?, ?, ?, ?)
                """,
                "Test User",
                email,
                "$2a$10$exampleHashForSchemaTest",
                UserRole.USER.name(),
                AccountStatus.ACTIVE.name());
    }
}
