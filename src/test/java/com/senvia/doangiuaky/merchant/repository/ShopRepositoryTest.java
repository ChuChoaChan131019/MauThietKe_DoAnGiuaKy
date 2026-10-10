package com.senvia.doangiuaky.merchant.repository;

import com.senvia.doangiuaky.merchant.entity.Shop;
import com.senvia.doangiuaky.merchant.entity.ShopStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class ShopRepositoryTest {

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void newShopPersistsPendingAndCannotAddProductsOrReceiveOrders() {
        Long ownerId = insertUser("pending-shop-owner@example.com");
        Shop shop = Shop.createPending(ownerId, "Pending shop", null, null, null, "0900000000", "Ho Chi Minh City");

        Shop persisted = shopRepository.saveAndFlush(shop);

        assertEquals(ShopStatus.PENDING, persisted.getStatus());
        assertFalse(persisted.canAddProduct());
        assertFalse(persisted.canReceiveOrder());
    }

    @Test
    void schemaDefaultsStatusToPendingWhenStatusIsOmitted() {
        Long ownerId = insertUser("database-default-status-owner@example.com");

        jdbcTemplate.update("""
                insert into shops (owner_id, shop_name, phone, address, submitted_at, created_at, updated_at)
                values (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, ownerId, "Database default shop", "0900000000", "Test address");

        assertEquals("PENDING", jdbcTemplate.queryForObject(
                "select status from shops where owner_id = ?", String.class, ownerId));
    }

    @Test
    void schemaRejectsDuplicateOwnerAndInvalidStatus() {
        Long ownerId = insertUser("unique-shop-owner@example.com");
        insertShop(ownerId, "First shop", "PENDING");

        assertThrows(DataIntegrityViolationException.class,
                () -> insertShop(ownerId, "Second shop", "PENDING"));

        Long anotherOwnerId = insertUser("invalid-status-owner@example.com");
        assertThrows(DataIntegrityViolationException.class,
                () -> insertShop(anotherOwnerId, "Invalid status shop", "INVALID"));
    }

    @Test
    void findsShopAndChecksExistenceByOwner() {
        Long ownerId = insertUser("find-shop-owner@example.com");
        Shop persisted = shopRepository.saveAndFlush(Shop.createPending(
                ownerId, "Findable shop", "Description", "https://images.example/logo.png",
                "senvia/logo-find", "0900000000", "Test address"));

        assertTrue(shopRepository.existsByOwnerId(ownerId));
        assertEquals(persisted.getId(), shopRepository.findByOwnerId(ownerId).orElseThrow().getId());
    }

    @Test
    void findsPendingShopByStatusAndDoesNotReturnOtherStates() {
        Long pendingOwnerId = insertUser("pending-query-owner@example.com");
        Long approvedOwnerId = insertUser("approved-query-owner@example.com");
        Long pendingShopId = insertShop(pendingOwnerId, "Pending query shop", "PENDING");
        Long approvedShopId = insertShop(approvedOwnerId, "Approved query shop", "APPROVED");

        assertTrue(shopRepository.findByIdAndStatus(pendingShopId, ShopStatus.PENDING).isPresent());
        assertTrue(shopRepository.findByIdAndStatus(approvedShopId, ShopStatus.PENDING).isEmpty());
        assertTrue(shopRepository.findAllByStatusOrderBySubmittedAtAsc(ShopStatus.PENDING).stream()
                .anyMatch(shop -> shop.getId().equals(pendingShopId)));
        assertFalse(shopRepository.findAllByStatusOrderBySubmittedAtAsc(ShopStatus.PENDING).stream()
                .anyMatch(shop -> shop.getId().equals(approvedShopId)));
    }

    @Test
    @Transactional
    void locksShopWhenLoadingItForApproval() {
        Long ownerId = insertUser("approval-lock-owner@example.com");
        Long shopId = insertShop(ownerId, "Approval lock shop", "PENDING");

        assertEquals(shopId, shopRepository.findByIdForUpdate(shopId).orElseThrow().getId());
    }

    private Long insertUser(String email) {
        jdbcTemplate.update("""
                insert into users (full_name, email, password_hash, role, account_status, created_at, updated_at)
                values (?, ?, ?, 'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, "Test User", email, "$2a$10$exampleHashForSchemaTest");
        return jdbcTemplate.queryForObject("select id from users where email = ?", Long.class, email);
    }

    private Long insertShop(Long ownerId, String shopName, String status) {
        jdbcTemplate.update("""
                insert into shops (owner_id, shop_name, phone, address, status, submitted_at, created_at, updated_at)
                values (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, ownerId, shopName, "0900000000", "Test address", status);
        return jdbcTemplate.queryForObject("select id from shops where owner_id = ?", Long.class, ownerId);
    }
}
