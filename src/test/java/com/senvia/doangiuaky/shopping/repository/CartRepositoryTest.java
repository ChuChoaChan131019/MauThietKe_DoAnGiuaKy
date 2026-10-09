package com.senvia.doangiuaky.shopping.repository;

import com.senvia.doangiuaky.shopping.entity.Cart;
import com.senvia.doangiuaky.shopping.entity.CartItem;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
class CartRepositoryTest {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void oneUserCannotHaveTwoCarts() {
        Long userId = insertUser("cart-one@example.com");
        cartRepository.saveAndFlush(new Cart(userId));

        assertThrows(DataIntegrityViolationException.class,
                () -> cartRepository.saveAndFlush(new Cart(userId)));
    }

    @Test
    void oneCartCannotHaveDuplicateProductRowsOrNonPositiveQuantity() {
        Long userId = insertUser("cart-two@example.com");
        Cart cart = cartRepository.saveAndFlush(new Cart(userId));
        cartItemRepository.saveAndFlush(new CartItem(cart.getId(), 2001L, 1));

        assertThrows(DataIntegrityViolationException.class,
                () -> cartItemRepository.saveAndFlush(new CartItem(cart.getId(), 2001L, 1)));
        assertThrows(DataIntegrityViolationException.class,
                () -> cartItemRepository.saveAndFlush(new CartItem(cart.getId(), 2002L, 0)));
    }

    private Long insertUser(String email) {
        jdbcTemplate.update("""
                insert into users (full_name, email, password_hash, role, account_status, created_at, updated_at)
                values (?, ?, ?, 'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, "Cart User", email, "not-a-real-password-hash");
        return jdbcTemplate.queryForObject("select id from users where email = ?", Long.class, email);
    }
}
