package com.senvia.doangiuaky.shopping.service;

import com.senvia.doangiuaky.shopping.entity.Cart;
import com.senvia.doangiuaky.shopping.entity.CartItem;
import com.senvia.doangiuaky.shopping.repository.CartItemRepository;
import com.senvia.doangiuaky.shopping.repository.CartRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class CartServiceConcurrencyTest {

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void concurrentFirstAddsCreateOneCartAndKeepBothQuantities() throws Exception {
        Long userId = insertUser();
        CyclicBarrier start = new CyclicBarrier(2);
        ExecutorService executor = Executors.newFixedThreadPool(2);
        List<Future<?>> futures = new ArrayList<>();

        try {
            for (int i = 0; i < 2; i++) {
                futures.add(executor.submit(() -> {
                    start.await();
                    cartService.addItem(userId, 1L, 1);
                    return null;
                }));
            }
            for (Future<?> future : futures) {
                future.get(10, TimeUnit.SECONDS);
            }
        } finally {
            executor.shutdownNow();
        }

        Cart cart = cartRepository.findByUserId(userId).orElseThrow();
        List<CartItem> items = cartItemRepository.findAllByCartIdOrderByIdAsc(cart.getId());

        assertEquals(1, cartRepository.countByUserId(userId));
        assertEquals(1, items.size());
        assertEquals(2, items.getFirst().getQuantity());
    }

    private Long insertUser() {
        String email = "concurrent-" + UUID.randomUUID() + "@example.com";
        jdbcTemplate.update("""
                insert into users (full_name, email, password_hash, role, account_status,
                                   created_at, updated_at)
                values (?, ?, ?, 'USER', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                """, "Concurrent Cart User", email, "not-a-real-password-hash");
        return jdbcTemplate.queryForObject("select id from users where email = ?", Long.class, email);
    }
}
