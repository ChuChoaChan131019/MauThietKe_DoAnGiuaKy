package com.senvia.doangiuaky.merchant.service;

import com.senvia.doangiuaky.merchant.api.ShopRejectedEvent;
import com.senvia.doangiuaky.merchant.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.event.ApplicationEvents;
import org.springframework.test.context.event.RecordApplicationEvents;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
@RecordApplicationEvents
class ShopRejectionServiceIntegrationTest {

    @Autowired
    private ShopRejectionService shopRejectionService;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private ApplicationEvents applicationEvents;

    @Test
    @Transactional
    void rejectsPendingShopAndPersistsReasonAndAuditData() {
        Long adminId = insertUser("rejection-admin@example.com", "ADMIN");
        Long ownerId = insertUser("rejection-owner@example.com", "USER");
        Long shopId = insertShop(ownerId, "Integration rejection shop");

        shopRejectionService.reject(shopId, adminId, "  Thiếu giấy tờ đăng ký  ");
        shopRepository.flush();

        Map<String, Object> row = jdbcTemplate.queryForMap(
                "select status, rejection_reason, approved_by, approved_at from shops where id = ?", shopId);
        assertEquals("REJECTED", row.get("STATUS"));
        assertEquals("Thiếu giấy tờ đăng ký", row.get("REJECTION_REASON"));
        assertEquals(adminId, ((Number) row.get("APPROVED_BY")).longValue());
        assertNull(row.get("APPROVED_AT"));

        ShopRejectedEvent event = applicationEvents.stream(ShopRejectedEvent.class)
                .findFirst()
                .orElseThrow();
        assertNotNull(event.eventId());
        assertEquals(shopId, event.shopId());
        assertEquals(ownerId, event.ownerId());
        assertEquals("Thiếu giấy tờ đăng ký", event.rejectionReason());
        assertEquals(adminId, event.rejectedById());
        assertNotNull(event.rejectedAt());
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
