# Kế hoạch triển khai CART 01

## 1. Thông tin đầu việc

| Thuộc tính | Nội dung |
| --- | --- |
| Issue | [#51 CART 01 Thêm sản phẩm đang bán vào giỏ](https://github.com/ChuChoaChan131019/MauThietKe_DoAnGiuaKy/issues/51) |
| Project | MauThietKe, trạng thái khi đọc: In Progress |
| Parent issue | #10 |
| Module sở hữu | `shopping` |
| Thành viên phụ trách | Đỗ Đặng Diệu Linh (2312663) |
| Requirement chính | `CART 01` |
| Use case | `UC 05 Thêm sản phẩm vào giỏ` |
| Bảng sở hữu | `carts`, `cart_items` |
| Review bắt buộc | TV1/Merchant: Trần Thị Phương Trang; TV4/Identity: Doàn Trương Duy Khang; TV2/Ordering: Lê Anh Khoa chỉ khi phát sinh contract checkout |

Kế hoạch này được lập từ nội dung issue #51, SRS ECOM 01 phiên bản 1.4 trong `Dac_ta_yeu_cau_phan_mem_Ecommerce(AI).docx`, `Docs/SRS.md`, `Docs/MODULE_OWNERSHIP.md`, `Docs/PHAN_CONG_CONG_VIEC.md` và `Docs/modules/SHOPPING_GUIDE.md`.

## 2. Kết quả cần đạt

USER đã đăng nhập có thể thêm một sản phẩm đang bán vào cart của chính mình. Hệ thống phải tạo hoặc lấy đúng một cart cho user, tạo hoặc cộng dồn đúng một dòng cart item cho product, kiểm tra khả năng bán từ Merchant API và không làm thay đổi tồn kho thật.

Luồng phải bị từ chối ở backend khi người thao tác là khách, ADMIN, chủ shop thêm sản phẩm của chính shop, hoặc product không còn đủ điều kiện bán. Cart chỉ lưu product và quantity; giá hiển thị phải đọc từ product hiện tại.

## 3. Requirement và acceptance criteria

### 3.1 Requirement trực tiếp

- `CART 01`: Người dùng thêm sản phẩm đang bán vào giỏ hàng.
- `UC 05`: User đã đăng nhập chọn **Thêm vào giỏ**; hệ thống đọc cart, tạo item nếu chưa có hoặc tăng quantity nếu đã có, kiểm tra không vượt stock và hiển thị cart/tạm tính.
- Acceptance của issue #51:
  - Tạo hoặc lấy một cart duy nhất cho mỗi user.
  - Chặn khách, ADMIN và owner tự mua.
  - Kiểm tra khả năng bán qua Merchant API.
  - Có test cho luồng thành công, validation/lỗi và truy cập trái quyền.

### 3.2 Requirement liên quan phải giữ đúng

| Mã | Áp dụng cho CART 01 |
| --- | --- |
| `CART 02` | Product đã có trong cart phải cộng quantity, không tạo dòng trùng. |
| `CART 04` | Tổng quantity không vượt stock hiện tại. |
| `CART 05`, `CART 07` | Cart không lưu giá; subtotal đọc theo giá hiện tại và phản ánh thay đổi giá. |
| `PROD 11` | Product chỉ bán khi owner `ACTIVE`, shop `APPROVED`, category active, product `ACTIVE`, stock > 0. |
| `BR 03`, `BR 07`, `BR 21`, `BR 23`, `BR 24` | Không nhận product từ shop/category/product/owner không hợp lệ; ADMIN và owner không được mua product của chính shop. |
| `AT 05` | Chỉ cung cấp bằng chứng cho phần **thêm vào giỏ, kiểm tra tồn kho và đọc giá hiện tại**. Toàn bộ AT 05 (sửa/xóa item và cảnh báo trước checkout) hoàn thành ở các vertical slice `CART 03`, `CART 06`, `CART 07`, không dùng issue #51 để tuyên bố đã hoàn tất toàn bộ AT 05. |

### 3.3 Không thuộc vertical slice này

- `CART 03`: cập nhật quantity thủ công và xóa item, trừ phần dữ liệu/service cần thiết để trang cart hiển thị.
- `CART 06`: cảnh báo đầy đủ trước checkout cho product ẩn/hết hàng.
- `PAY 01–08`, tạo order/payment, trừ stock khi checkout và rollback checkout.
- Favorite, Buyer Order History và thay đổi nghiệp vụ Merchant ngoài contract cần cho cart.

Các mục ngoài phạm vi phải để service/API có điểm mở rộng, nhưng không được kéo logic order, payment hoặc stock deduction vào `shopping`.

Issue #51 chỉ được đóng khi phần add-to-cart đạt DoD của issue. Việc chưa hoàn thành `CART 03`, `CART 06` hoặc các phần còn lại của `AT 05` phải được theo dõi ở issue/vertical slice riêng, không coi là blocker của CART 01 nếu contract mở rộng không bị phá vỡ.

## 4. Trạng thái repository và khoảng trống

Hiện tại:

- `shopping` mới có `ShoppingController` với `GET /cart` và route wishlist; chưa có entity, repository, DTO, service hoặc public API cart.
- `merchant.api` mới là package marker; chưa có product/shop contract để shopping gọi.
- `ProductsController` đang dùng `Map` mock và dữ liệu in-memory; đây không thể là nguồn sự thật cho cart.
- `templates/cart/index.html` đang là mock UI, có dữ liệu cố định và nút giả lập; tài liệu cấu trúc yêu cầu template module shopping ở `templates/shopping/`.
- `identity.api` có `findUser(Long)`, `userExists`, `isUserActive`, `findActiveAdmins`, nhưng chưa có contract framework-neutral để shopping lấy user hiện tại từ email/session mà không import `identity.security.IdentityPrincipal`.
- Repository hiện mới có migration `users`; migration/tables của `shops`, `categories` và `products` chưa có trong snapshot này. Vì vậy migration shopping có FK tới `products` chưa thể chạy độc lập trên branch hiện tại.
- Repository đã có migration vendor riêng cho H2/PostgreSQL và Flyway chạy theo `spring.flyway.locations`; migration shopping phải tạo song song cho hai vendor và chỉ tích hợp sau migration Merchant tạo bảng `products`.

Khoảng trống cần chốt trước khi code là public contract của Identity và Merchant, cùng thứ tự migration chéo module. Không dùng Entity, Repository hoặc Service nội bộ của module khác để bù khoảng trống. Nếu migration Merchant chưa được tích hợp, chỉ được hoàn thiện contract/unit test; chưa được merge migration Shopping tham chiếu `products`.

## 5. Contract cần review trước khi triển khai

### 5.1 Identity API

Contract cần chốt là:

```java
Optional<UserSummary> findUserByEmail(String normalizedEmail);
```

Identity provider chịu trách nhiệm trim/lowercase email trước khi truy vấn; email không tồn tại trả `Optional.empty()`. Shopping controller chỉ nhận `Authentication`/`Principal` của Spring để lấy username, sau đó gọi `identity.api`. Shopping không import `IdentityPrincipal`, `User`, `UserRepository` hoặc service nội bộ của Identity.

`UserSummary` phải đủ để kiểm tra `userId`, `role` và `accountStatus`; không đưa password hash, token hay Entity vào contract. Cần thống nhất behavior khi email không còn tồn tại hoặc account bị khóa: từ chối request và không ghi cart item.

### 5.2 Merchant API

Contract canonical cần chốt là một DTO chỉ đọc `CartProductView` trong `merchant.api`:

```text
productId
shopId
shopOwnerId
shopName
productName
imageUrl
currentPrice: BigDecimal
stockQuantity: int
ownerActive: boolean
shopApproved: boolean
categoryActive: boolean
productActive: boolean
```

API canonical:

```text
Optional<CartProductView> findProductForCart(productId)
```

`Optional.empty()` chỉ dùng cho product không tồn tại. Product tồn tại nhưng không bán được phải trả summary cùng các cờ trạng thái để Shopping tạo thông báo đúng nguyên nhân. Contract là read-only, không có side effect và không trả Merchant Entity hoặc Repository. Merchant là nguồn sự thật cho owner, shop, category, product và stock; Shopping kiểm tra thêm buyer là `USER/ACTIVE`, ADMIN và self-purchase.

### 5.3 Shopping API cho bước sau

Không expose `shopping.api` checkout trong issue #51. `getCheckoutSnapshot` và `removeItemsAfterCheckoutSuccess` là contract của vertical slice checkout riêng; chỉ thiết kế service nội bộ sao cho không cản trở việc bổ sung contract sau khi Ordering thống nhất snapshot, rollback và ownership với TV3.

## 6. Thiết kế dữ liệu và transaction

### 6.1 Schema dự kiến

Tạo migration mới, không sửa migration đã có. Version phải lớn hơn `V202610071500` và dùng cùng version giữa H2/PostgreSQL:

```text
src/main/resources/db/migration/h2/V<timestamp>__shopping_create_carts.sql
src/main/resources/db/migration/postgresql/V<timestamp>__shopping_create_carts.sql
```

Hai bảng sở hữu bởi `shopping`:

```text
carts
- id BIGINT/BIGSERIAL, primary key
- user_id BIGINT, foreign key users(id), NOT NULL, UNIQUE
- created_at, updated_at, NOT NULL

cart_items
- id BIGINT/BIGSERIAL, primary key
- cart_id BIGINT, foreign key carts(id), NOT NULL
- product_id BIGINT, foreign key products(id), NOT NULL
- quantity INTEGER, NOT NULL, CHECK (quantity > 0)
- created_at, updated_at, NOT NULL
- UNIQUE (cart_id, product_id)
```

FK tới `users` và `products` cần được TV4/TV1 review cùng thứ tự migration. `users` phải tồn tại trước `carts`; `products` phải tồn tại trước `cart_items`. Không merge migration Shopping tham chiếu `products` trước khi migration Merchant đã có mặt trong baseline tích hợp. Không lưu `unit_price`, `subtotal`, shop snapshot hoặc product snapshot trong cart item.

### 6.2 Transaction và cạnh tranh

- `addItem` là `@Transactional`.
- Lấy hoặc tạo cart theo `user_id` trong cùng transaction; `UNIQUE(carts.user_id)` là lớp bảo vệ cuối cùng. Vì lock không khóa được row chưa tồn tại, phải có chiến lược get-or-create an toàn: retry lookup trong transaction mới sau khi insert bị conflict hoặc dùng cơ chế upsert tương đương cho cả H2 và PostgreSQL.
- Sau khi cart tồn tại, khóa cart bằng cơ chế pessimistic/write lock hoặc tương đương trong command add, để hai request cùng user không làm mất cập nhật quantity.
- Tìm cart item theo `(cart_id, product_id)` và cộng quantity; `UNIQUE(cart_id, product_id)` chống duplicate row.
- Tính `newQuantity = currentQuantity + requestedQuantity`; nếu product vẫn saleable và `newQuantity > stockQuantity`, clamp về `stockQuantity` và trả warning. Nếu stock bằng 0 hoặc product không saleable, từ chối trước khi ghi; tuyệt đối không tạo quantity 0.
- Không gọi API trừ stock trong CART 01. Tồn kho chỉ bị trừ trong checkout của `ordering`.
- Nếu insert/update cart item thất bại, rollback thay đổi cart trong transaction; không để cart có quantity 0 hoặc quantity vượt stock.

## 7. Luồng triển khai theo vertical slice

### Bước 0 — Chốt dependency và contract

1. TV3 trình bày use case và DTO cần cho add-to-cart.
2. TV1 và TV3 chốt `CartProductView`, `findProductForCart`, field hiện tại, null/error behavior và saleability flags.
3. TV4 và TV3 chốt `findUserByEmail`, chuẩn hóa email và behavior khi user không tồn tại/LOCKED.
4. TV1/TV4 review thứ tự migration và FK; xác nhận baseline có `users`/`products` trước khi chạy integration.
5. Ghi rõ contract, lỗi saleability và owner self-purchase trước khi tạo code.

**Điểm dừng:** chưa triển khai shopping service nếu chưa có contract review của TV1/TV4.

### Bước 1 — Migration và entity

1. Chỉ tạo migration H2/PostgreSQL sau khi migration Merchant tạo `products` đã được tích hợp hoặc có baseline test chính thức tương đương.
2. Tạo `Cart` và `CartItem` trong `shopping.entity`.
3. Dùng quan hệ/ID phù hợp nhưng không ánh xạ sang Entity Merchant hoặc Identity.
4. Đặt constraint `UNIQUE(user_id)`, `UNIQUE(cart_id, product_id)` và `CHECK(quantity > 0)` ở database.

### Bước 2 — Repository

1. `CartRepository.findByUserId` cho query đọc và `findByUserIdForUpdate` (hoặc tương đương) cho command add.
2. `CartItemRepository.findByCartIdAndProductId`.
3. Query lấy cart cùng item cho trang cart; cân nhắc lock cart trong command add.
4. Test mapping, unique constraint và behavior khi cart chưa tồn tại.

### Bước 3 — DTO và service

1. Tạo `AddCartItemRequest` với `productId` bắt buộc và `quantity` là số nguyên dương. Form “Thêm nhanh” phải gửi explicit `quantity=1`; request thiếu quantity không được âm thầm biến thành dữ liệu hợp lệ.
2. Tạo DTO response/view không lộ Entity; số tiền dùng `BigDecimal`.
3. `CartService.addItem(currentUserId, productId, quantity)`:
   - xác minh user tồn tại, `USER`, `ACTIVE`;
   - từ chối ADMIN;
   - gọi Merchant API lấy product/khả năng bán;
   - từ chối owner thêm product của shop mình;
   - tạo/lấy cart;
   - tạo item hoặc cộng quantity;
   - không lưu giá và không trừ stock;
   - trả kết quả/warning để controller redirect về cart.
4. `CartService.getCart(currentUserId)` đọc giá hiện tại từ Merchant API và nhóm dữ liệu theo shop cho UI.
5. Chuẩn hóa exception nghiệp vụ cho product không tồn tại/không bán được, stock không đủ, user không tồn tại/LOCKED, request không hợp lệ và cart không thuộc quyền. Lỗi form dùng flash message/redirect theo convention hiện tại; không đưa chi tiết nội bộ hoặc credential vào response.

### Bước 4 — Controller và view

1. Giữ `GET /cart` nhưng chuyển từ mock data sang `CartService.getCart`.
2. Thêm POST command, đề xuất `POST /cart/items`, nhận `productId` và `quantity`.
3. Áp dụng `@Valid`, CSRF và kiểm tra quyền ở backend; không coi việc ẩn nút là authorization.
4. Chuyển view về `templates/shopping/cart.html` và cập nhật controller trả view mới; chỉ giữ `templates/cart/index.html` nếu có quyết định tương thích legacy được ghi rõ trong PR.
5. Thay toàn bộ dữ liệu cố định trong cart mock bằng `th:each` theo cart DTO.
6. Cập nhật nút “Thêm nhanh”/“Thêm vào giỏ” từ mock alert thành form POST có product ID.
7. Hiển thị trạng thái rỗng, success, lỗi saleability, stock clamp và giá hiện tại; không hiển thị cart item đã bị chặn như một item hợp lệ.
8. Không sửa fragment/common asset nếu chưa có review; CSS riêng đặt trong thư mục module shopping khi cần.

### Bước 5 — Test

**Unit service**

- User ACTIVE thêm product hợp lệ khi cart chưa tồn tại: tạo đúng một cart và một item.
- User thêm lại cùng product: tăng quantity, không tạo dòng thứ hai.
- User yêu cầu quantity làm vượt stock: giữ ở mức stock tối đa hợp lệ và có warning theo UC 05.
- Product hết hàng, HIDDEN, category inactive, shop không APPROVED hoặc owner LOCKED: từ chối.
- Product không tồn tại và buyer LOCKED: từ chối, không ghi cart item.
- ADMIN: từ chối ở service dù request cố gọi trực tiếp.
- Owner shop: từ chối thêm product của chính shop.
- Price/stock thay đổi sau lần thêm: cart đọc giá/stock mới từ Merchant API, không dùng snapshot cart.
- Lỗi Merchant API hoặc lỗi repository: không để dữ liệu dở dang.
- `productId` thiếu/null, quantity thiếu, không phải số nguyên, bằng 0 hoặc âm: bị từ chối trước transaction write.

**Repository/integration**

- H2 migration tạo đúng schema.
- Migration chỉ chạy thành công khi thứ tự `users`/Merchant/products/shopping đúng; test phải bao phủ FK và Flyway vendor đang dùng.
- Một user không tạo được cart thứ hai.
- Một cart không có duplicate product.
- `quantity <= 0` bị chặn ở service và database.
- Hai request đồng thời cho cùng cart/product không làm mất quantity hoặc tạo duplicate.
- Hai request đồng thời khi cart chưa tồn tại không tạo duplicate cart và vẫn giữ đủ tổng quantity.

**MVC/security**

- Guest bị chuyển tới login hoặc nhận 401/403 theo convention hiện tại.
- USER gọi POST hợp lệ được redirect về `/cart` và thấy item.
- ADMIN bị chặn route và service.
- Buyer LOCKED, product không tồn tại và Merchant API lỗi không làm thay đổi cart.
- Không thể thay `userId` trong request để thêm vào cart người khác.
- CSRF và validation lỗi không làm thay đổi dữ liệu.

**Manual/demo**

- User B đăng nhập, thêm product còn bán từ hai shop; cart hiển thị đúng nhóm shop và giá hiện tại.
- Thử product hết hàng/ẩn, owner bị khóa và product của shop User B; mỗi trường hợp có thông báo rõ.
- Khởi động lại bằng H2 và chạy test với profile/config repository hiện tại.

## 8. Phạm vi file dự kiến

### Shopping sở hữu

```text
src/main/java/com/senvia/doangiuaky/shopping/controller/ShoppingController.java
src/main/java/com/senvia/doangiuaky/shopping/dto/
src/main/java/com/senvia/doangiuaky/shopping/entity/
src/main/java/com/senvia/doangiuaky/shopping/repository/
src/main/java/com/senvia/doangiuaky/shopping/service/
src/main/resources/db/migration/h2/V<timestamp>__shopping_create_carts.sql
src/main/resources/db/migration/postgresql/V<timestamp>__shopping_create_carts.sql
src/main/resources/templates/shopping/
src/main/resources/static/css/modules/shopping/
src/test/java/com/senvia/doangiuaky/shopping/
```

### File phối hợp, chỉ thay đổi khi contract/tài nguyên được review

```text
src/main/java/com/senvia/doangiuaky/identity/api/IdentityApi.java
src/main/java/com/senvia/doangiuaky/identity/service/IdentityApiService.java
src/main/java/com/senvia/doangiuaky/merchant/api/
src/main/java/com/senvia/doangiuaky/merchant/service/
Docs/modules/SHOPPING_GUIDE.md
Docs/modules/MERCHANT_GUIDE.md
Docs/PHAN_CONG_CONG_VIEC.md
```

### File legacy/shared cần thay thế hoặc review riêng

```text
src/main/resources/templates/cart/index.html
src/main/resources/templates/fragments/product-card.html
src/main/resources/templates/products/detail.html
src/main/resources/static/css/pages/ordering.css
```

Cart template và CSS phải thuộc `shopping`; CSS cart hiện nằm trong `pages/ordering.css` cần được chuyển hoặc sao chép có kiểm soát sang `static/css/modules/shopping/`, không sửa module Ordering chỉ vì tên file legacy. `fragments/product-card.html` và `products/detail.html` chỉ được đổi nút thêm giỏ thành form POST sau khi resource owner review. Không sửa `pom.xml`, `application.properties` hoặc common fragment/asset nếu không phát sinh dependency đã được review.

## 9. Rủi ro và cách xử lý

| Rủi ro | Ảnh hưởng | Cách xử lý |
| --- | --- | --- |
| Merchant API chưa tồn tại | Shopping không biết product có bán được hay không | Chốt contract TV1 trước; dùng mock contract trong unit test, không gọi mock controller từ service. |
| Identity API chưa lấy được user hiện tại | Dễ dẫn tới import `IdentityPrincipal` nội bộ | TV4 bổ sung public contract; controller chỉ dùng `Principal`/`Authentication`. |
| Dữ liệu product hiện tại là `Map` mock | Cart có thể lưu product không tồn tại trong DB | Chỉ cho add qua Merchant API; không dùng `ProductsController.mockProducts` làm nguồn dữ liệu. |
| Race condition tạo cart/item | Duplicate cart hoặc mất quantity | Get-or-create có retry/upsert an toàn cho row chưa tồn tại, lock cart sau khi có row, unique constraint + transaction + test concurrent. |
| Price/stock snapshot sai | Vi phạm `CART 05/07`, ảnh hưởng checkout | Không lưu price trong `cart_items`; luôn đọc lại Merchant API. |
| Đổi template legacy sai ownership | Vi phạm cấu trúc module hoặc làm hỏng UI mock khác | Chốt phương án move/redirect với owner tài nguyên trước khi sửa. |
| Trộn checkout vào cart | Vi phạm ownership với ordering | CART 01 chỉ thêm item; checkout dùng `shopping.api` ở issue/vertical slice riêng. |

## 10. Definition of Done cho issue #51

- [ ] Contract Identity/Merchant được chủ module liên quan review.
- [ ] Contract đã chọn một API canonical, có null/error behavior, field/type và không trả Entity/Repository.
- [ ] Thứ tự migration và FK `users`/`products` được TV1/TV4 xác nhận; migration chạy được trên vendor/profile được hỗ trợ.
- [ ] `carts` và `cart_items` có migration H2/PostgreSQL, constraint và test.
- [ ] Mỗi USER có tối đa một cart; mỗi product chỉ có một dòng trong cart.
- [ ] Add-to-cart kiểm tra đầy đủ role, account status, self-purchase và saleability từ Merchant API.
- [ ] Quantity không âm/0 và không vượt stock; khi request vượt stock, hệ thống clamp về mức tối đa hợp lệ và hiển thị warning theo UC 05.
- [ ] Product stock = 0 hoặc không saleable bị từ chối không ghi dữ liệu; chỉ clamp khi product vẫn saleable.
- [ ] Cart không lưu giá; giá hiện tại và subtotal dùng `BigDecimal`.
- [ ] Controller không gọi Repository, không chứa nghiệp vụ và không tin vào `userId` từ request.
- [ ] Không import Entity/Repository/Service nội bộ module khác.
- [ ] Có unit, repository/integration và MVC/security test cho success, validation, unauthorized và conflict.
- [ ] Có test cho user LOCKED/không tồn tại, product không tồn tại, Merchant API lỗi, input thiếu/sai và race tạo cart.
- [ ] Cart view không còn dữ liệu mock cố định trong luồng đã triển khai.
- [ ] Chạy `./mvnw test` hoặc `.\mvnw.cmd test`, `git diff --check`; không có secret, `target/` hoặc file IDE.
- [ ] PR liên kết issue #51, ghi migration/contract/test, có review của TV1 và TV4; TV2 review nếu contract checkout được thêm.
- [ ] Issue #51 không tuyên bố hoàn tất toàn bộ `AT 05`; phần CART 03/06/07 được ghi nhận ở issue riêng.

## 11. Trình tự bàn giao đề xuất

1. Tạo branch `feature/shopping/51-cart-01` từ `develop`.
2. Mở comment/PR nhỏ để chốt Identity API, Merchant API và thứ tự migration/FK.
3. Sau khi contract và baseline migration được review, triển khai migration → entity/repository → DTO/service → controller/view → test.
4. Chạy test module với mock contract, sau đó chạy integration flow trên baseline có Merchant contract/migration thật.
5. Cập nhật guide nếu contract hoặc behavior public thay đổi.
6. Mở PR liên kết issue #51, đính kèm kết quả test và ảnh UI nếu có thay đổi giao diện.
7. Chỉ merge sau khi TV1/TV4 review; không push trực tiếp lên `main` hoặc `develop`.
