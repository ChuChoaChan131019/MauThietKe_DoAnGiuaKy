package com.senvia.doangiuaky.merchant.repository;

import com.senvia.doangiuaky.merchant.entity.Shop;
import com.senvia.doangiuaky.merchant.entity.ShopStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
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
    void schemaRejectsDuplicateOwnerAndInvalidStatus() {
        Long ownerId = insertUser("unique-shop-owner@example.com");
        insertShop(ownerId, "First shop", "PENDING");

        assertThrows(DataIntegrityViolationException.class,
                () -> insertShop(ownerId, "Second shop", "PENDING"));

        Long anotherOwnerId = insertUser("invalid-status-owner@example.com");
        assertThrows(DataIntegrityViolationException.class,
                () -> insertShop(anotherOwnerId, "Invalid status shop", "INVALID"));
    }

    private Long insertUser(String email) {
        jdbcTemplate.update("""
                insert into users (full_name, email, password_hash, role, account_status, created_at, updated_at)
                values (?, ?, ?, 'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, "Test User", email, "$2a$10$exampleHashForSchemaTest");
        return jdbcTemplate.queryForObject("select id from users where email = ?", Long.class, email);
    }

    private void insertShop(Long ownerId, String shopName, String status) {
        jdbcTemplate.update("""
                insert into shops (owner_id, shop_name, phone, address, status, submitted_at, created_at, updated_at)
                values (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, ownerId, shopName, "0900000000", "Test address", status);
    }
}
