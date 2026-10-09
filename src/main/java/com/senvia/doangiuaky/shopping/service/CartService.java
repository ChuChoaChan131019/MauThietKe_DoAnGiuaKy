package com.senvia.doangiuaky.shopping.service;

import com.senvia.doangiuaky.identity.api.AccountStatus;
import com.senvia.doangiuaky.identity.api.IdentityApi;
import com.senvia.doangiuaky.identity.api.UserRole;
import com.senvia.doangiuaky.identity.api.UserSummary;
import com.senvia.doangiuaky.merchant.api.CartProductView;
import com.senvia.doangiuaky.merchant.api.MerchantApi;
import com.senvia.doangiuaky.shopping.dto.AddCartItemResult;
import com.senvia.doangiuaky.shopping.dto.CartItemView;
import com.senvia.doangiuaky.shopping.dto.CartShopView;
import com.senvia.doangiuaky.shopping.dto.CartView;
import com.senvia.doangiuaky.shopping.entity.Cart;
import com.senvia.doangiuaky.shopping.entity.CartItem;
import com.senvia.doangiuaky.shopping.repository.CartItemRepository;
import com.senvia.doangiuaky.shopping.repository.CartRepository;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final IdentityApi identityApi;
    private final Supplier<MerchantApi> merchantApiSupplier;
    private final Map<Long, Object> cartLocks = new ConcurrentHashMap<>();

    @Autowired
    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            IdentityApi identityApi,
            ObjectProvider<MerchantApi> merchantApiProvider) {
        this(cartRepository, cartItemRepository, identityApi,
                () -> merchantApiProvider.getIfAvailable(() -> productId -> java.util.Optional.empty()));
    }

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            IdentityApi identityApi,
            MerchantApi merchantApi) {
        this(cartRepository, cartItemRepository, identityApi, () -> merchantApi);
    }

    private CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            IdentityApi identityApi,
            Supplier<MerchantApi> merchantApiSupplier) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.identityApi = identityApi;
        this.merchantApiSupplier = merchantApiSupplier;
    }

    @Transactional
    public AddCartItemResult addItem(Long currentUserId, Long productId, int requestedQuantity) {
        validatePositiveId(currentUserId, "Không xác định được người dùng.");
        validatePositiveId(productId, "Sản phẩm không hợp lệ.");
        if (requestedQuantity <= 0) {
            throw new CartOperationException("Số lượng phải lớn hơn 0.");
        }

        UserSummary buyer = identityApi.findUser(currentUserId)
                .orElseThrow(() -> new CartOperationException("Tài khoản không tồn tại."));
        validateBuyer(buyer);

        CartProductView product = merchantApiSupplier.get().findProductForCart(productId)
                .orElseThrow(() -> new CartOperationException("Sản phẩm không tồn tại."));
        validateSaleability(product);
        if (currentUserId.equals(product.shopOwnerId())) {
            throw new CartOperationException("Bạn không thể mua sản phẩm của chính shop mình.");
        }

        Object lock = cartLocks.computeIfAbsent(currentUserId, ignored -> new Object());
        synchronized (lock) {
            Cart cart = cartRepository.findByUserIdForUpdate(currentUserId)
                    .orElseGet(() -> cartRepository.save(new Cart(currentUserId)));
            CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                    .orElseGet(() -> new CartItem(cart.getId(), productId, 0));

            long requestedTotal = (long) item.getQuantity() + requestedQuantity;
            int finalQuantity = (int) Math.min(requestedTotal, product.stockQuantity());
            if (finalQuantity <= 0) {
                throw new CartOperationException("Sản phẩm đã hết hàng.");
            }

            item.setQuantity(finalQuantity);
            cartItemRepository.save(item);

            boolean clamped = requestedTotal > product.stockQuantity();
            String message = clamped
                    ? "Số lượng đã được điều chỉnh theo tồn kho hiện tại."
                    : "Đã thêm sản phẩm vào giỏ hàng.";
            return new AddCartItemResult(CartItemView.from(item, product), clamped, message);
        }
    }

    @Transactional(readOnly = true)
    public CartView getCart(Long currentUserId) {
        validatePositiveId(currentUserId, "Không xác định được người dùng.");
        UserSummary buyer = identityApi.findUser(currentUserId)
                .orElseThrow(() -> new CartOperationException("Tài khoản không tồn tại."));
        validateBuyer(buyer);

        Cart cart = cartRepository.findByUserId(currentUserId).orElse(null);
        if (cart == null) {
            return CartView.empty();
        }

        Map<Long, List<CartItemView>> itemsByShop = new LinkedHashMap<>();
        Map<Long, String> shopNames = new LinkedHashMap<>();
        List<CartItemView> unavailableItems = new ArrayList<>();
        for (CartItem item : cartItemRepository.findAllByCartIdOrderByIdAsc(cart.getId())) {
            java.util.Optional<CartProductView> product = merchantApiSupplier.get()
                    .findProductForCart(item.getProductId());
            if (product.isEmpty()) {
                unavailableItems.add(CartItemView.unavailable(item, "Sản phẩm không còn tồn tại."));
                continue;
            }
            CartProductView productView = product.get();
            if (!productView.isSaleable()) {
                unavailableItems.add(CartItemView.unavailable(item, saleabilityMessage(productView)));
                continue;
            }
            if (item.getQuantity() > productView.stockQuantity()) {
                unavailableItems.add(CartItemView.unavailable(item,
                        "Số lượng trong giỏ vượt tồn kho hiện tại."));
                continue;
            }
            CartItemView view = CartItemView.from(item, productView);
            itemsByShop.computeIfAbsent(productView.shopId(), ignored -> new ArrayList<>()).add(view);
            shopNames.putIfAbsent(productView.shopId(), productView.shopName());
        }
        if (!unavailableItems.isEmpty()) {
            itemsByShop.put(null, unavailableItems);
            shopNames.put(null, "Không khả dụng");
        }

        List<CartShopView> shops = itemsByShop.entrySet().stream()
                .map(entry -> new CartShopView(
                        entry.getKey(),
                        shopNames.get(entry.getKey()),
                        List.copyOf(entry.getValue()),
                        entry.getValue().stream()
                                .filter(CartItemView::available)
                                .map(CartItemView::subtotal)
                                .reduce(BigDecimal.ZERO, BigDecimal::add)))
                .toList();
        int totalQuantity = shops.stream()
                .flatMap(shop -> shop.items().stream())
                .filter(CartItemView::available)
                .mapToInt(CartItemView::quantity)
                .sum();
        BigDecimal subtotal = shops.stream()
                .map(CartShopView::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartView(shops, totalQuantity, subtotal);
    }

    private static void validatePositiveId(Long value, String message) {
        if (value == null || value <= 0) {
            throw new CartOperationException(message);
        }
    }

    private static void validateBuyer(UserSummary buyer) {
        if (buyer.role() != UserRole.USER) {
            throw new CartOperationException("Tài khoản này không được phép mua hàng.");
        }
        if (buyer.accountStatus() != AccountStatus.ACTIVE) {
            throw new CartOperationException("Tài khoản đang bị khóa.");
        }
    }

    private static void validateSaleability(CartProductView product) {
        if (product.stockQuantity() <= 0) {
            throw new CartOperationException("Sản phẩm đã hết hàng.");
        }
        if (!product.ownerActive()) {
            throw new CartOperationException("Chủ shop hiện không thể bán hàng.");
        }
        if (!product.shopApproved()) {
            throw new CartOperationException("Shop hiện không được phép bán hàng.");
        }
        if (!product.categoryActive()) {
            throw new CartOperationException("Danh mục sản phẩm hiện không hoạt động.");
        }
        if (!product.productActive()) {
            throw new CartOperationException("Sản phẩm hiện không được bán.");
        }
        if (product.currentPrice() == null || product.currentPrice().signum() <= 0) {
            throw new CartOperationException("Giá sản phẩm không hợp lệ.");
        }
    }

    private static String saleabilityMessage(CartProductView product) {
        if (product.stockQuantity() <= 0) {
            return "Sản phẩm đã hết hàng.";
        }
        if (!product.ownerActive()) {
            return "Chủ shop đang bị khóa.";
        }
        if (!product.shopApproved()) {
            return "Shop không còn được duyệt.";
        }
        if (!product.categoryActive()) {
            return "Danh mục không còn hoạt động.";
        }
        return "Sản phẩm không còn được bán.";
    }
}
