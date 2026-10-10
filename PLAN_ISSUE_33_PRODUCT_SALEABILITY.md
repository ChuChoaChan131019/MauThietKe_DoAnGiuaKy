# Plan — Issue #33: PROD 11 — Xác định khả năng bán sản phẩm

## 1. Mục tiêu và ranh giới

- **Issue:** [#33 — Xác định khả năng bán sản phẩm](https://github.com/ChuChoaChan131019/MauThietKe_DoAnGiuaKy/issues/33).
- **Project:** [Mẫu thiết kế — Project #2](https://github.com/users/ChuChoaChan131019/projects/2).
- **Requirement:** `PROD 11`.
- **Module/bảng sở hữu:** `merchant` / `products`, `shops`, `categories`; trạng thái owner được đọc qua `identity.api`.
- **Actor/consumer:** catalog công khai và các module `shopping`, `ordering` thông qua public contract `merchant.api`.
- **Mục tiêu:** cung cấp một nguồn quyết định thống nhất cho việc sản phẩm có được phép bán hay không, thay vì để catalog, cart và checkout tự lặp lại business rule.

Một sản phẩm chỉ bán được khi đồng thời thỏa mãn:

1. Owner có `accountStatus = ACTIVE`.
2. Shop có `status = APPROVED`.
3. Category đang active.
4. Product có `status = ACTIVE`.
5. `stockQuantity > 0`.

Giá hiện tại cũng phải tồn tại và lớn hơn `0` trước khi dữ liệu được dùng để tính tiền. Đây là invariant phòng vệ đã có trong `CartProductView.isSaleable()` và phù hợp với `PROD 05`, nhưng không thay thế phạm vi validation form/service của issue #26.

Ngoài phạm vi issue này:

- CRUD category thuộc issue #23.
- Tạo/sửa/ẩn product thuộc issue #24, #25 và #27.
- Upload, thay thế hoặc xóa ảnh thuộc issue #29.
- Tìm kiếm, lọc và phân trang catalog thuộc issue #30–#32.
- Trừ kho nguyên tử, hoàn kho chống lặp và product count thuộc issue #88.
- Checkout và transaction tạo order thuộc module `ordering`.
- Không sửa nội bộ `identity`; chỉ dùng `IdentityApi`.
- Không thay đổi `pom.xml`, Cloudinary config, common fragment hoặc schema database nếu việc rà soát không phát hiện thiếu sót bắt buộc.

## 2. Acceptance criteria cần đáp ứng

1. Public API/service Merchant trả được product summary và kết quả sellability từ dữ liệu hiện tại trong database.
2. Sellability chỉ là `true` khi đủ cả năm điều kiện owner/shop/category/product/stock.
3. Chỉ cần một điều kiện không hợp lệ thì kết quả phải là `false`.
4. Catalog list và product detail không hiển thị product không bán được.
5. Cart dùng cùng contract Merchant; không tự tái tạo business rule bằng Entity/Repository Merchant.
6. Contract đủ trung lập để Ordering có thể kiểm tra lại lúc checkout mà không truy cập nội bộ module; việc trừ kho vẫn để issue #88.
7. Giá dùng `BigDecimal`; DTO không lộ Entity, Repository, `logo_public_id`, `image_public_id` hoặc dữ liệu Cloudinary nội bộ.
8. Product tồn tại nhưng tạm thời không bán được vẫn phải trả summary với `isSaleable=false`; `Optional.empty()` chỉ dành cho ID không hợp lệ hoặc product không tồn tại.
9. Có test riêng cho từng điều kiện `false`, trường hợp hợp lệ và product không tồn tại.
10. Có test chứng minh catalog và Shopping cùng dựa trên public contract thống nhất.

## 3. Baseline hiện tại trên `origin/main`

Baseline được khảo sát tại commit:

```text
113ff9b Merge pull request #93 from ChuChoaChan131019/feature/shopping/51-add-product-to-cart
```

Phần đã tồn tại nhờ PR #93:

- `Product`, `Category`, `ProductStatus` và repository tương ứng.
- Migration H2/PostgreSQL cho `categories` và `products`.
- `CartProductView` chứa giá, stock và các cờ trạng thái cần cho sellability.
- `CartProductView.isSaleable()` đã kết hợp owner/shop/category/product/stock và kiểm tra giá dương.
- `MerchantApi.findProductForCart(productId)` là public contract Shopping đang dùng.
- `DemoMerchantApi` đọc product, shop, category và owner từ database/public API.
- Catalog list/detail gọi cùng logic `toCartProductView(...).isSaleable()` trước khi render.
- `CartService` lấy dữ liệu qua `MerchantApi`, không import Entity/Repository Merchant.
- `DemoMerchantApiTest` hiện có ba ca: product hợp lệ, hết hàng và product không tồn tại.

Khoảng trống cần hoàn thiện:

- Chưa test riêng owner LOCKED.
- Chưa test riêng shop không APPROVED, bao gồm `PENDING`, `REJECTED` và `LOCKED` nếu cần đại diện từng state.
- Chưa test category inactive.
- Chưa test product `HIDDEN`.
- Chưa có unit test trực tiếp cho tổ hợp rule trong `CartProductView.isSaleable()`, đặc biệt giá null/không dương.
- Tên `DemoMerchantApi` và `findProductForCart` còn mang tính tạm thời/cart-specific. Cần quyết định có giữ tương thích hay chuẩn hóa tên trung lập mà không làm scope phình lớn.
- Chưa có contract test rõ ràng cho consumer Shopping/Ordering.

## 4. Dependency và contract cần chốt

### Dependency đã sẵn sàng

- `IdentityApi.findUser(...)` cung cấp `UserSummary.accountStatus`.
- `Shop.status`, `Category.active`, `Product.status`, `Product.stockQuantity` và `Product.price` đã có.
- Shopping đã tích hợp `MerchantApi` trong luồng thêm/xem cart.
- Database đã có constraint `price > 0`, `stock_quantity >= 0` và product status `ACTIVE/HIDDEN`.

### Contract đề xuất cho issue #33

Ưu tiên diff nhỏ và không phá consumer đã merge:

- Giữ `MerchantApi.findProductForCart(Long)` và `CartProductView` trong PR này nếu việc đổi tên buộc sửa rộng module Shopping.
- Xác nhận bằng Javadoc rằng method trả summary cả khi product tồn tại nhưng không saleable.
- Dùng duy nhất `CartProductView.isSaleable()` làm phép kết hợp các cờ; service chỉ chịu trách nhiệm đọc đúng cờ từ nguồn dữ liệu.
- Catalog tiếp tục gọi cùng logic này, không viết lại điều kiện trong controller.
- Ordering có thể tạm dùng cùng public view để kiểm tra trước checkout; việc chuẩn hóa DTO/method trung lập hơn có thể thực hiện cùng issue #88 sau khi Khoa và Linh thống nhất contract.

Nếu nhóm thống nhất đổi sang tên trung lập ngay, cần giữ backward compatibility hoặc cập nhật đồng thời consumer Shopping, ví dụ:

```java
Optional<ProductSaleabilityView> findProductForSale(Long productId);
```

Không tạo song song hai nguồn rule hoặc hai DTO có logic `isSaleable()` khác nhau.

## 5. Thiết kế nghiệp vụ

### 5.1 Bảng quyết định

| Owner | Shop | Category | Product | Stock | Kết quả |
| --- | --- | --- | --- | ---: | --- |
| ACTIVE | APPROVED | active | ACTIVE | `> 0` | Saleable |
| LOCKED | APPROVED | active | ACTIVE | `> 0` | Không saleable |
| ACTIVE | PENDING/REJECTED/LOCKED | active | ACTIVE | `> 0` | Không saleable |
| ACTIVE | APPROVED | inactive | ACTIVE | `> 0` | Không saleable |
| ACTIVE | APPROVED | active | HIDDEN | `> 0` | Không saleable |
| ACTIVE | APPROVED | active | ACTIVE | `0` | Không saleable |

Giá null, bằng `0` hoặc âm cũng không được trả là saleable ở lớp contract, dù database bình thường đã chặn dữ liệu đó.

### 5.2 Trách nhiệm từng lớp

- `MerchantApi`: công bố query read-only cho module khác.
- Public DTO: mang dữ liệu tối thiểu mà cart/checkout cần và cung cấp kết quả sellability thống nhất.
- Provider service: đọc Product → Shop → Category → owner qua `IdentityApi`, ánh xạ đúng các cờ.
- Catalog service/controller: lọc bằng cùng kết quả `isSaleable()`, không tự kiểm tra state rải rác.
- Shopping/Ordering: tin contract Merchant nhưng vẫn kiểm tra lại tại thời điểm thao tác; không cache trạng thái saleable lâu dài.

### 5.3 Semantics của kết quả

- Product ID null, không dương hoặc không tồn tại: `Optional.empty()`.
- Product tồn tại nhưng owner/shop/category/product/stock không hợp lệ: trả DTO hiện tại với `isSaleable=false` để cart có thể hiển thị cảnh báo đúng.
- Catalog công khai chỉ lấy DTO có `isSaleable=true`.
- Không xóa cart item chỉ vì product tạm thời không saleable.
- Không trừ stock trong query sellability.

## 6. Kế hoạch triển khai

1. Bảo toàn thay đổi local hiện có, đồng bộ `origin/main` và tạo branch `feature/merchant/33-product-saleability` từ main mới nhất.
2. Rà public contract hiện tại với Linh và Khoa; chốt giữ tên tương thích hay thêm tên trung lập.
3. Bổ sung unit test cho `CartProductView.isSaleable()` theo bảng quyết định.
4. Mở rộng `DemoMerchantApiTest` hoặc tạo integration/contract test riêng để chứng minh provider đọc đúng từng trạng thái từ database.
5. Bổ sung test catalog list/detail không trả product không saleable.
6. Bổ sung/điều chỉnh test Shopping để chứng minh cart nhận `isSaleable=false` từ Merchant API và từ chối/cảnh báo phù hợp; không import nội bộ Merchant.
7. Chỉ chỉnh implementation khi test chỉ ra logic hoặc semantics còn thiếu; tránh refactor không cần thiết.
8. Cập nhật Javadoc và `Docs/modules/MERCHANT_GUIDE.md` nếu public contract/semantics được làm rõ hoặc đổi tên.
9. Chạy test tập trung, toàn bộ test, package và kiểm tra module boundary.
10. Mở PR liên kết `Closes #33`; ghi rõ phần đã có từ PR #93, phần hoàn thiện trong PR này và mời Linh/Khoa review contract.

## 7. Test plan

### Unit test public DTO/rule

- Tất cả điều kiện hợp lệ, giá dương: `isSaleable=true`.
- `ownerActive=false`: `false`.
- `shopApproved=false`: `false`.
- `categoryActive=false`: `false`.
- `productActive=false`: `false`.
- `stockQuantity=0`: `false`.
- `stockQuantity<0`: `false` ở lớp contract phòng vệ, dù DB không cho lưu.
- `currentPrice=null`: `false`.
- `currentPrice=0` hoặc âm: `false`.
- Mỗi test chỉ thay đổi một điều kiện để chỉ rõ nguyên nhân thất bại.

### Provider/integration test

- Product hợp lệ trả đủ product/shop/owner/price/stock và saleable.
- Product không tồn tại hoặc ID không hợp lệ trả empty.
- Owner LOCKED trả product summary nhưng `isSaleable=false`.
- Shop PENDING/REJECTED/LOCKED trả product summary nhưng `isSaleable=false`.
- Category inactive trả product summary nhưng `isSaleable=false`.
- Product HIDDEN trả product summary nhưng `isSaleable=false`.
- Product hết hàng trả product summary nhưng `isSaleable=false`.
- Test rollback dữ liệu fixture để không làm bẩn H2 context và không phụ thuộc thứ tự chạy.

Khi tạo owner LOCKED trong integration test phải thỏa constraint metadata lock của bảng `users`; không vô hiệu constraint chỉ để test dễ hơn.

### Catalog/MVC test

- `/products` chỉ render product saleable.
- `/products/{id}` trả `404` cho product tồn tại nhưng không saleable.
- Khi owner/shop/category/product/stock đổi trạng thái, request tiếp theo phản ánh ngay dữ liệu mới.
- Controller không gọi Repository trực tiếp.

### Shopping contract test

- Cart thêm product saleable thành công.
- Merchant API trả product không saleable thì Shopping từ chối thêm.
- Product trong cart sau đó không saleable được hiển thị cảnh báo, không tính vào subtotal khả dụng.
- Không truy cập `merchant.entity`, `merchant.repository` hoặc `merchant.service` từ Shopping.

### Ordering contract readiness

- Xác nhận DTO có đủ product ID, shop ID/owner ID, giá hiện tại, stock và sellability cho bước revalidation checkout.
- Không triển khai trừ stock hoặc checkout trong issue #33.

## 8. File dự kiến thay đổi

### File có khả năng cập nhật

- `src/main/java/com/senvia/doangiuaky/merchant/api/CartProductView.java`
- `src/main/java/com/senvia/doangiuaky/merchant/api/MerchantApi.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/DemoMerchantApi.java`
- `src/test/java/com/senvia/doangiuaky/merchant/service/DemoMerchantApiTest.java`
- `src/test/java/com/senvia/doangiuaky/shopping/service/CartServiceTest.java`
- `Docs/modules/MERCHANT_GUIDE.md` nếu semantics public contract thay đổi hoặc được đặc tả rõ hơn.

### File mới dự kiến

- `src/test/java/com/senvia/doangiuaky/merchant/api/CartProductViewTest.java`
- Có thể thêm `ProductSaleabilityIntegrationTest.java` hoặc `ProductsControllerTest.java` nếu test hiện tại không có vị trí phù hợp.

### Chỉ thay đổi khi đã thống nhất contract

- `src/main/java/com/senvia/doangiuaky/shopping/service/CartService.java`
- Consumer Ordering trong tương lai.
- Tên DTO/method public nếu đổi sang tên trung lập.

Không dự kiến sửa migration, `pom.xml`, `application.properties`, Cloudinary, common resources hoặc module Identity.

## 9. Rủi ro và biện pháp kiểm soát

### Contract mang tên riêng cho Cart

`CartProductView` và `findProductForCart` chưa lý tưởng cho catalog/checkout. Không đổi tên tùy ý vì Shopping đã phụ thuộc contract này. Chỉ đổi khi Linh và Khoa cùng review; nếu chưa chốt thì giữ tương thích và để chuẩn hóa mở rộng cho #88.

### Test làm bẩn dữ liệu seed

Các test thay đổi owner/shop/category/product cần chạy trong transaction rollback hoặc tạo fixture riêng. Không dựa vào thứ tự test và không để một test làm các test sau thất bại.

### Lặp business rule

Không thêm chuỗi điều kiện thứ hai trong controller, Shopping hoặc Ordering. Phép kết hợp cuối cùng phải nằm tại một contract/domain helper duy nhất.

### N+1 query

Implementation hiện tại đọc shop/category/owner cho từng product. Issue #33 ưu tiên tính đúng. Nếu catalog lớn và cần tối ưu query/join/batch, ghi nhận riêng và chỉ tối ưu khi có test chứng minh, tránh mở rộng scope ngoài requirement.

### State thay đổi giữa cart và checkout

Sellability là dữ liệu thời điểm đọc, không phải reservation. Checkout bắt buộc gọi lại Merchant API và issue #88 chịu trách nhiệm stock update nguyên tử.

## 10. Lệnh kiểm tra

Test tập trung dự kiến:

```powershell
.\mvnw.cmd -Dtest=CartProductViewTest,DemoMerchantApiTest,CartServiceTest test
```

Kiểm tra toàn dự án:

```powershell
.\mvnw.cmd test
.\mvnw.cmd clean package
git diff --check
git status
```

Kiểm tra ranh giới module:

```powershell
rg -n "merchant\.(entity|repository|service)" src/main/java/com/senvia/doangiuaky/shopping src/main/java/com/senvia/doangiuaky/ordering
rg -n "identity\.(entity|repository|service)" src/main/java/com/senvia/doangiuaky/merchant
```

Kết quả mong đợi:

- Shopping/Ordering chỉ import `merchant.api`.
- Merchant chỉ dùng `identity.api` khi đọc trạng thái owner.
- Không có public DTO chứa Entity hoặc Cloudinary `public_id`.

## 11. Definition of Done

- Một nguồn rule duy nhất xác định sellability.
- Đủ năm điều kiện của `PROD 11`; thiếu bất kỳ điều kiện nào đều trả không saleable.
- Giá và tiền dùng `BigDecimal`; dữ liệu giá không hợp lệ không được coi là saleable.
- Catalog list/detail và Cart dùng chung kết quả từ Merchant.
- Product không saleable vẫn có thể được mô tả cho cart để hiển thị cảnh báo; product không tồn tại trả empty.
- Test riêng cho từng điều kiện false, ca thành công và ID không tồn tại.
- Không import Entity/Repository/Service nội bộ chéo module.
- Không triển khai trừ/hoàn stock của issue #88 trong PR này.
- Test tập trung, full test, package và `git diff --check` đều pass.
- Tài liệu contract được cập nhật nếu hành vi hoặc tên API thay đổi.
- PR liên kết `Closes #33`, mô tả rõ contract và có review của Linh/Khoa.

## 12. Gợi ý commit và PR

Branch:

```text
feature/merchant/33-product-saleability
```

Commit gợi ý:

```text
test(merchant): cover product saleability rules
refactor(merchant): centralize product saleability contract
test(shopping): verify merchant saleability integration
docs(merchant): document product saleability contract
```

PR cần ghi:

- Requirement `PROD 11` và issue #33.
- Public contract giữ nguyên hay đã đổi tên, cùng lý do tương thích.
- Bảng test cho từng điều kiện sellability.
- Các lệnh test đã chạy và kết quả.
- Khẳng định stock mutation/checkout nằm ngoài phạm vi.
- Reviewer: Linh cho Cart/Shopping và Khoa cho Checkout/Ordering.
