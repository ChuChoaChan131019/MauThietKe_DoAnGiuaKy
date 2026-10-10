# Plan — Issue #14: SHOP 03 — Khởi tạo shop ở trạng thái PENDING

## 1. Mục tiêu và ranh giới

- **Requirement:** `SHOP 03`.
- **Issue:** `#14` — yêu cầu mở shop mới luôn có trạng thái `PENDING`; chưa được thêm sản phẩm hoặc nhận đơn mới.
- **Module/bảng sở hữu:** `merchant` / `shops`.
- **Actor của luồng tạo shop:** `USER`; quy tắc khởi tạo sẽ được gọi bởi luồng gửi yêu cầu ở `SHOP 01` và form ở `SHOP 02`.
- **Không nằm trong issue này:** endpoint/form gửi yêu cầu shop, upload logo, kiểm tra một user một shop, approval/reject/lock, event notification, product/catalog và Merchant API cho module khác.

## 2. Nguồn yêu cầu và quyết định thiết kế

### Acceptance criteria của issue

1. Shop mới có state mặc định `PENDING`.
2. `canAddProduct=false` và `canReceiveOrder=false`.
3. Có unit test cho State.
4. Test thành công, validation/lỗi và truy cập trái quyền nếu áp dụng.

### Quy tắc liên quan

- State lifecycle đã chốt: `PENDING → APPROVED`, `PENDING → REJECTED → PENDING`, `APPROVED → LOCKED → APPROVED`.
- `PENDING`, `REJECTED`, `LOCKED` không được sửa catalog hoặc nhận đơn mới.
- `LOCKED` vẫn được xử lý đơn đã tồn tại; đây là hành vi nền cho issue `SHOP 10`, không triển khai flow order trong issue này.
- `shops.owner_id` phải unique để các issue `SHOP 01/02` có thể bảo đảm một user tối đa một shop.

### Dependency và contract

- Không gọi Entity/Repository/Service nội bộ của `identity`.
- Entity `Shop` chỉ lưu `ownerId` kiểu `Long`; `SHOP 01` sẽ dùng `identity.api` để kiểm tra USER/ACTIVE trước khi tạo shop.
- Chưa thêm public API/event: `SHOP 03` chỉ dựng model và State Pattern nội bộ. Contract Merchant cho Shopping/Ordering sẽ thuộc các issue product/stock sau.
- Không sửa `common`, `SecurityConfig`, Cloudinary config hay templates mock trong issue này.

## 3. Hiện trạng và khoảng trống

- `merchant.entity`, `merchant.repository` và `merchant.state` mới chỉ có `package-info.java`.
- Chưa có migration `shops`; hiện database chỉ có migration `users`.
- Các route/template merchant hiện có là mock, không phải luồng persistence có thể đáp ứng acceptance của #14.
- Có các file Cloudinary Merchant chưa commit từ issue #29; không tích hợp chúng vào #14 để giữ phạm vi tách biệt.

## 4. Thiết kế triển khai

### 4.1 Migration

Tạo migration cùng version cho PostgreSQL và H2, sau migration Identity hiện có:

- `src/main/resources/db/migration/postgresql/V<next>__merchant_create_shops.sql`
- `src/main/resources/db/migration/h2/V<next>__merchant_create_shops.sql`

Tạo bảng `shops` bám SRS: `id`, `owner_id`, `shop_name`, `description`, `logo_url`, `logo_public_id`, `phone`, `address`, `status`, các metadata rejection/approval/lock, `submitted_at`, `created_at`, `updated_at`.

Ràng buộc nền bắt buộc trong migration:

- FK `owner_id → users(id)` và `UNIQUE(owner_id)`.
- `status NOT NULL DEFAULT 'PENDING'` với check chỉ nhận `PENDING`, `APPROVED`, `REJECTED`, `LOCKED`.
- Cột approval/rejection/lock để nullable cho đến khi các state transition tương ứng được thực hiện ở issue sau.

### 4.2 Domain và State Pattern

Tạo trong `merchant.entity`:

- `ShopStatus` enum: `PENDING`, `APPROVED`, `REJECTED`, `LOCKED`.
- `Shop` JPA entity lưu status enum bằng `EnumType.STRING`; dùng `ownerId` scalar thay vì mapping sang `identity.entity.User`.
- Constructor/factory tạo shop luôn đặt `status=PENDING`, bất kể caller không truyền status.

Tạo trong `merchant.state`:

- `ShopState`: interface cho `status()`, `canAddProduct()`, `canReceiveOrder()`, `canResubmit()` và `canHandleExistingOrders()`.
- `PendingShopState`, `ApprovedShopState`, `RejectedShopState`, `LockedShopState`: mỗi class đóng gói quyền theo trạng thái.
- `ShopStateFactory` hoặc resolver: nhận `ShopStatus`, trả State tương ứng; reject null/unknown status bằng lỗi domain rõ ràng.

`Shop` hoặc một domain service mỏng chỉ ủy quyền các phép kiểm tra capability cho State resolver. Không đưa luật State vào controller và không dùng chuỗi `if/else` theo status tại các caller.

### 4.3 Repository và service tối thiểu

- Thêm `ShopRepository` trong `merchant.repository` để chuẩn bị persistence; chưa thêm query public/API không thuộc acceptance.
- Thêm service/factory nội bộ chỉ khi cần để tạo shop và truy xuất state một cách nhất quán.
- Không tạo endpoint mới ở #14: form/controller thuộc `SHOP 01/02`; tránh tạo UI có dữ liệu giả.

## 5. Trình tự thực hiện

1. Chọn version migration kế tiếp, tạo migration PostgreSQL/H2 và chạy validate schema.
2. Thêm `ShopStatus`, `Shop` và `ShopRepository`; bảo đảm JPA mapping không import class nội bộ Identity.
3. Cài `ShopState` cùng bốn implementation và factory/resolver trong `merchant.state`.
4. Thêm capability delegation từ `Shop`/service để một call trả kết quả khác theo status.
5. Viết unit test State trước cho `PENDING`, sau đó bao phủ bảng hành vi bốn state để chứng minh State Pattern.
6. Viết persistence test xác nhận status default `PENDING` và database reject status không hợp lệ/owner trùng (theo khả năng H2/Flyway).
7. Chạy test module, full test, kiểm tra migration H2 và `git diff --check`.
8. Đối chiếu acceptance/DoD, ghi rõ rằng UI/request workflow sẽ do #15/#16 nối vào domain nền này.

## 6. Bảng hành vi State cần test

| State | Add product | Receive new order | Resubmit | Handle existing order |
| --- | --- | --- | --- | --- |
| `PENDING` | No | No | No | No |
| `APPROVED` | Yes | Yes | No | Yes |
| `REJECTED` | No | No | Yes | No |
| `LOCKED` | No | No | No | Yes |

Mục tiêu bắt buộc của #14 là hàng `PENDING`; các hàng còn lại là bộ khung State Pattern đã được SRS chốt, không đồng nghĩa mở các endpoint transition trước issue tương ứng.

## 7. Test và tiêu chí nghiệm thu

### Unit test

- Factory/resolver trả đúng State cho cả bốn `ShopStatus`.
- `PendingShopState`: `canAddProduct=false`, `canReceiveOrder=false`.
- Capability của các state khác đúng bảng trên, để tránh regression khi #19/#20/#18 triển khai transition.
- Null/unsupported status bị từ chối rõ ràng.

### Persistence test

- Tạo `Shop` hợp lệ không chỉ định status vẫn lưu `PENDING`.
- `owner_id` unique và status check hoạt động theo migration.
- Context/Flyway validate được với migration H2.

### Lệnh kiểm tra

```powershell
.\mvnw.cmd test
.\mvnw.cmd clean package
git diff --check
git status
```

## 8. File dự kiến thay đổi

- `src/main/resources/db/migration/postgresql/V<next>__merchant_create_shops.sql`
- `src/main/resources/db/migration/h2/V<next>__merchant_create_shops.sql`
- `src/main/java/com/senvia/doangiuaky/merchant/entity/Shop.java`
- `src/main/java/com/senvia/doangiuaky/merchant/entity/ShopStatus.java`
- `src/main/java/com/senvia/doangiuaky/merchant/repository/ShopRepository.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/ShopState.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/PendingShopState.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/ApprovedShopState.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/RejectedShopState.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/LockedShopState.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/ShopStateFactory.java`
- Test mới trong `src/test/java/com/senvia/doangiuaky/merchant/state/` và, nếu cần, `merchant/repository/`.

## 9. Hoàn thành issue khi

- Shop mới luôn persist `PENDING`.
- Kiểm tra State trả `false` cho thêm product/nhận đơn khi PENDING.
- State đặt hoàn toàn trong `merchant.state`; không có dependency nội bộ chéo module.
- Migration chạy trên H2/PostgreSQL; test liên quan và build pass.
- Diff không chứa secret, file build hay thay đổi lẫn sang #15/#16/#29.

