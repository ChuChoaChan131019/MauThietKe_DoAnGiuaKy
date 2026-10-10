package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.merchant.api.ShopApprovedEvent;
import com.senvia.doangiuaky.merchant.repository.ShopRepository;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.RecordApplicationEvents;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@RecordApplicationEvents
class ShopApprovalServiceIntegrationTest {

    @Autowired
    private ShopApprovalService shopApprovalService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ApplicationEvents applicationEvents;

    @Test
    @Transactional
    void approvesPendingShopAndPersistsApprovalAuditFields() {
        Long adminId = insertUser("approval-admin@example.com", "ADMIN");
        Long ownerId = insertUser("approval-owner@example.com", "USER");
        Long shopId = insertShop(ownerId, "Integration approval shop");

        shopApprovalService.approve(shopId, adminId);
        shopRepository.flush();

        Map<String, Object> row = jdbcTemplate.queryForMap(
                "select status, approved_by from shops where id = ?", shopId);
        assertEquals("APPROVED", row.get("STATUS"));
        assertEquals(adminId, ((Number) row.get("APPROVED_BY")).longValue());
        assertNotNull(jdbcTemplate.queryForObject(
                "select approved_at from shops where id = ?", Object.class, shopId));

        ShopApprovedEvent event = applicationEvents.stream(ShopApprovedEvent.class)
                .findFirst()
                .orElseThrow();
        assertNotNull(event.eventId());
        assertEquals(shopId, event.shopId());
        assertEquals(ownerId, event.ownerId());
        assertEquals(adminId, event.approvedById());
    }

    private Long insertUser(String email, String role) {
        jdbcTemplate.update("""
                insert into users (full_name, email, password_hash, role, account_status, created_at, updated_at)
                values (?, ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, "Test " + role, email, "$2a$10$exampleHashForSchemaTest", role);
        return jdbcTemplate.queryForObject("select id from users where email = ?", Long.class, email);
    }

    private Long insertShop(Long ownerId, String shopName) {
        jdbcTemplate.update("""
                insert into shops (owner_id, shop_name, phone, address, status, submitted_at, created_at, updated_at)
                values (?, ?, ?, ?, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, ownerId, shopName, "0900000000", "Test address");
        return jdbcTemplate.queryForObject("select id from shops where owner_id = ?", Long.class, ownerId);
    }
}
