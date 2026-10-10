# Plan — Issue #13: SHOP 04 — Admin xem yêu cầu shop đang chờ

## 1. Mục tiêu và phạm vi

- **Requirement:** `SHOP 04`.
- **Issue:** `#13` — Admin xem danh sách và chi tiết các yêu cầu mở shop đang ở trạng thái `PENDING`.
- **Module/bảng sở hữu:** `merchant` / `shops`.
- **Code/view sở hữu:** `com.senvia.doangiuaky.merchant` / `templates/merchant`.
- **Actor:** `ADMIN`.
- **Dependency:** `identity.api`; Khang review quyền.
- **Route:** `GET /admin/shop-requests` và `GET /admin/shop-requests/{id}`.
- **Không nằm trong issue này:** duyệt, từ chối, gửi lại, khóa/mở khóa shop, notification, product/catalog và dashboard Admin.

Issue #13 chỉ triển khai luồng đọc. Không thay đổi trạng thái shop và không đưa nút có hành vi approve/reject thật vào PR này.

## 2. Acceptance criteria và Definition of Done

### Acceptance criteria

1. Chỉ `ADMIN` truy cập được danh sách và chi tiết.
2. Danh sách chỉ chứa shop có trạng thái `PENDING`.
3. Chi tiết trả đúng dữ liệu của yêu cầu `PENDING` được chọn.
4. ID không tồn tại hoặc shop không còn `PENDING` được xử lý rõ ràng.
5. Không lộ password hash, `logoPublicId`, Entity, Repository hoặc metadata nội bộ không cần thiết.
6. Có route/controller và template thuộc module `merchant`.
7. Có test cho luồng thành công, dữ liệu rỗng, không tìm thấy và truy cập trái quyền.

### Definition of Done

- Không vi phạm ownership/dependency giữa `merchant`, `identity` và `engagement`.
- Controller không gọi Repository trực tiếp và không chứa nghiệp vụ lọc/mapping phức tạp.
- Chỉ dùng `identity.api`, không import Entity/Repository/Service nội bộ của Identity.
- Test liên quan và build chạy thành công.
- PR liên kết `#13`, ghi cách test và có Khang review phần authorization.
- Không có secret, file build hoặc thay đổi ngoài phạm vi.

## 3. Dependency và blocker cần xác nhận trước khi merge

GitHub đang đánh dấu issue #13 bị chặn bởi:

- `#14 — SHOP 03`: nền `Shop`, trạng thái `PENDING` và State Pattern.
- `#66 — AUTH 07`: chặn account khóa và request sai role/quyền.

Hiện source đã có `Shop`, `ShopStatus.PENDING`, migration `shops` và rule `/admin/**` yêu cầu role `ADMIN`. Tuy nhiên trạng thái GitHub của các issue dependency vẫn chưa hoàn tất đồng bộ:

- `#14` vẫn hiển thị Open/In Progress dù code nền đã xuất hiện trong repository.
- `#66` vẫn hiển thị Todo; không tự nhận issue này đã hoàn thành chỉ vì `SecurityConfig` hiện có rule role.

Có thể chuẩn bị code #13 trên branch riêng, nhưng trước khi merge phải xác nhận #14/#66 đã hoàn thành hoặc được maintainer cho phép bỏ trạng thái blocked.

## 4. Hiện trạng source và khoảng trống

### Phần đã có

- `Shop` đã có dữ liệu: `id`, `ownerId`, `shopName`, `description`, `logoUrl`, `logoPublicId`, `phone`, `address`, `status`, `submittedAt` và metadata lifecycle.
- `ShopStatus` đã có `PENDING`, `APPROVED`, `REJECTED`, `LOCKED`.
- `ShopRepository` đã có `findByOwnerId` và `existsByOwnerId`.
- `IdentityApi.findUser(ownerId)` trả `UserSummary` gồm ID, họ tên, role và account status.
- `SecurityConfig` đã bảo vệ `/admin/**` bằng role `ADMIN`.
- Hai template giao diện mẫu cho danh sách/chi tiết đã tồn tại trong `templates/engagement`.

### Khoảng trống

- Chưa có query lấy danh sách shop theo `PENDING`.
- Chưa có service đọc danh sách/chi tiết dành cho Admin.
- Chưa có DTO riêng để ngăn template nhận trực tiếp `Shop Entity`.
- `Shop` chưa expose `submittedAt` qua getter phục vụ mapping.
- `/admin/shop-requests` hiện bị chiếm bởi `engagement.AdminController` và đọc từ `HashMap` giả.
- Route mock còn thay đổi trạng thái approve/reject bằng HTTP GET, vượt phạm vi #13 và không an toàn.
- Template mock nằm sai module so với UI acceptance mới của issue #13.

## 5. Quyết định thiết kế

Luồng triển khai đúng ownership của issue:

```text
Merchant AdminShopRequestController
        ↓
Merchant AdminShopRequestService
        ↓
ShopRepository
        ↓
shops

AdminShopRequestService
        ↓
identity.api.IdentityApi
```

Không cần tạo `merchant.api` cho chính controller Merchant sử dụng. Public contract chỉ cần khi module khác tiêu thụ nghiệp vụ Merchant; issue #13 là vertical slice nội bộ của `merchant` và chỉ phụ thuộc ra ngoài qua `identity.api`.

### DTO dự kiến

Đặt DTO trong `merchant.dto`, tách danh sách và chi tiết:

- `PendingShopRequestSummary`
  - `shopId`
  - `shopName`
  - `ownerName`
  - `submittedAt`
  - `status`
- `PendingShopRequestDetail`
  - các trường summary
  - `description`
  - `logoUrl`
  - `phone`
  - `address`

Không đưa `logoPublicId`, `approvedById`, `lockedById`, password, principal hoặc Entity vào model/template. Email owner không có trong `UserSummary` và không phải acceptance bắt buộc, nên không mở rộng Identity contract chỉ để giữ dữ liệu mock cũ.

## 6. Thiết kế triển khai theo lớp

### 6.1 Entity và Repository

- Bổ sung getter `getSubmittedAt()` cho `Shop` nếu service cần mapping ngày gửi.
- Thêm query có điều kiện trạng thái ngay tại Repository, ví dụ:
  - `findAllByStatusOrderBySubmittedAtAsc(ShopStatus status)`.
  - `findByIdAndStatus(Long id, ShopStatus status)`.
- Không dùng `findAll()` rồi lọc trong Java.
- Không cần migration mới vì schema hiện đã có đủ trường.
- Chưa thêm index chỉ cho dữ liệu demo; chỉ thêm khi có bằng chứng query cần tối ưu.

### 6.2 Service

Tạo `AdminShopRequestService` trong `merchant.service`:

- `listPendingRequests()` chạy transaction read-only.
- `getPendingRequest(Long shopId)` chạy transaction read-only.
- Luôn query với `ShopStatus.PENDING`.
- Map Entity sang DTO trước khi trả controller.
- Dùng `IdentityApi.findUser(ownerId)` để lấy tên người gửi.
- Không nhận status từ query parameter, vì SHOP 04 chỉ xem yêu cầu đang chờ.
- Shop không tồn tại hoặc không còn `PENDING` ném exception domain rõ ràng.
- Nếu dữ liệu owner không tồn tại trái với FK/domain, trả lỗi dữ liệu có kiểm soát; không lộ exception/database detail ra UI.

### 6.3 Controller

Tạo `AdminShopRequestController` trong `merchant.controller`:

- `GET /admin/shop-requests`
  - gọi service lấy danh sách PENDING;
  - đưa DTO vào model;
  - trả `merchant/admin/shop-requests`.
- `GET /admin/shop-requests/{id}`
  - gọi service lấy detail PENDING;
  - trả `merchant/admin/shop-request-detail`;
  - map not found thành HTTP 404 hoặc trang lỗi 404 chuẩn.

Controller không nhận `action`, `status`, `reason` và không có endpoint thay đổi trạng thái trong issue này.

Authorization dùng rule `/admin/**` hiện có. Không sửa `SecurityConfig` nếu test xác nhận anonymous bị chuyển đến login và USER nhận 403.

### 6.4 Template

Tạo template thuộc Merchant:

- `templates/merchant/admin/shop-requests.html`.
- `templates/merchant/admin/shop-request-detail.html`.

Có thể tái sử dụng bố cục giao diện mock hiện tại, nhưng phải thay toàn bộ dữ liệu cứng bằng model thật:

- Danh sách có empty state khi chưa có yêu cầu.
- Ngày gửi lấy từ `submittedAt` và format rõ ràng.
- Detail hiển thị logo bằng `logoUrl`, tên shop, mô tả, liên hệ, địa chỉ, owner và trạng thái.
- Không hiển thị tab Approved/Rejected trong issue chỉ đọc PENDING.
- Không có form approve/reject hoặc mutation bằng GET.
- Escape dữ liệu bằng Thymeleaf `th:text`; không render HTML người dùng nhập bằng `th:utext`.

### 6.5 Dọn route mock bị trùng

Trong `engagement.AdminController`:

- Gỡ hai mapping `/admin/shop-requests` và `/admin/shop-requests/{id}` để tránh duplicate route.
- Gỡ logic approve/reject bằng GET liên quan hai route này.
- Không chuyển business rule shop sang engagement.
- Giữ phần dashboard/mock khác nguyên trạng nếu không bắt buộc cho việc compile và chạy #13; dashboard Admin là ngoài phạm vi issue.

Hai template shop-request cũ trong `templates/engagement` được xóa sau khi template Merchant thay thế, tránh tồn tại hai bản giao diện cùng mục đích.

Lưu ý: dashboard hiện còn số lượng và link mẫu tới request ID cứng. Không mở rộng #13 thành refactor dashboard; ghi nhận đây là technical debt/issue riêng nếu cần dữ liệu thật.

## 7. Test plan

### Repository test

- Lưu shop PENDING và truy vấn thấy trong danh sách.
- Shop APPROVED/REJECTED/LOCKED không xuất hiện.
- Kết quả sắp xếp ổn định theo `submittedAt`.
- `findByIdAndStatus` không trả shop sai trạng thái.

### Service test

- Danh sách PENDING được map đúng summary DTO.
- Detail PENDING được map đúng dữ liệu.
- `IdentityApi.findUser` được dùng để lấy `ownerName`.
- ID không tồn tại → exception not found.
- Shop tồn tại nhưng không còn PENDING → xử lý như not found trong phạm vi route này.
- DTO không có `logoPublicId` hoặc metadata xét duyệt/khóa.

### Controller/security test

- Anonymous gọi list/detail → redirect `/login`.
- USER gọi list/detail → 403.
- ADMIN gọi list → 200, đúng view và model.
- ADMIN gọi detail hợp lệ → 200, đúng view và model.
- Danh sách rỗng vẫn trả 200 và hiển thị empty state.
- ID không tồn tại → 404/trang lỗi đã chọn.
- Không còn handler GET làm approve/reject.

### Regression test

- Luồng User gửi yêu cầu `/merchant/register` và xem `/merchant/shop-status` vẫn chạy.
- ApplicationContext khởi động không có lỗi duplicate mapping.
- Các link `/admin/shop-requests` từ navigation vẫn trỏ đến route mới.

## 8. Trình tự thực hiện

1. Đồng bộ branch từ `origin/main`, giữ nguyên các file `PLAN_ISSUE_*.md` cá nhân chưa track.
2. Tạo branch riêng, dự kiến `feature/merchant/13-admin-pending-requests`.
3. Xác nhận dependency #14/#66 với maintainer và người review quyền.
4. Viết test Repository/Service trước cho danh sách và detail PENDING.
5. Bổ sung query Repository, getter cần thiết, DTO và service.
6. Viết controller Merchant và test authorization/controller.
7. Chuyển/rewrite template sang `templates/merchant/admin/`.
8. Gỡ hai route và hai template mock tương ứng khỏi engagement.
9. Chạy test tập trung, full test, package và kiểm tra diff.
10. Tạo PR liên kết `Closes #13`, ghi rõ test đã chạy và nhờ Khang review authorization.

## 9. File dự kiến thay đổi

### Tạo mới

- `src/main/java/com/senvia/doangiuaky/merchant/controller/AdminShopRequestController.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/AdminShopRequestService.java`
- `src/main/java/com/senvia/doangiuaky/merchant/dto/PendingShopRequestSummary.java`
- `src/main/java/com/senvia/doangiuaky/merchant/dto/PendingShopRequestDetail.java`
- Exception domain riêng nếu `ShopNotFoundException` hiện tại mang thông điệp dành cho User đăng ký và không phù hợp Admin.
- `src/main/resources/templates/merchant/admin/shop-requests.html`
- `src/main/resources/templates/merchant/admin/shop-request-detail.html`
- Test controller/service tương ứng trong `src/test/java/com/senvia/doangiuaky/merchant/`.

### Chỉnh sửa

- `src/main/java/com/senvia/doangiuaky/merchant/entity/Shop.java`
- `src/main/java/com/senvia/doangiuaky/merchant/repository/ShopRepository.java`
- `src/main/java/com/senvia/doangiuaky/engagement/controller/AdminController.java`
- `src/test/java/com/senvia/doangiuaky/merchant/repository/ShopRepositoryTest.java`

### Xóa/thay thế

- `src/main/resources/templates/engagement/admin-shop-requests.html`
- `src/main/resources/templates/engagement/admin-shop-request-detail.html`

### Không dự kiến thay đổi

- `pom.xml`.
- `application.properties`.
- Migration `shops`.
- `identity.api` contract.
- `SecurityConfig`, nếu test authorization hiện tại pass.
- Logic approve/reject/resubmit/lock/unlock.

## 10. Lệnh kiểm tra

```powershell
.\mvnw.cmd test
.\mvnw.cmd clean package
git diff --check
git status
```

Nếu full test phụ thuộc datasource bên ngoài, vẫn phải chạy test tập trung cho merchant/controller và báo rõ lỗi môi trường; không vô hiệu test hoặc auto-configuration để che lỗi.

## 11. Hoàn thành issue khi

- `/admin/shop-requests` đọc dữ liệu PENDING thật từ database.
- `/admin/shop-requests/{id}` hiển thị đúng detail PENDING.
- Route/controller/template đều thuộc module Merchant như issue yêu cầu.
- Không còn hai route mock shop-request trong engagement.
- Anonymous và USER bị chặn; ADMIN truy cập được.
- Not found và shop sai trạng thái được xử lý rõ ràng.
- Template không nhận Entity và không lộ trường nội bộ.
- Không có mutation approve/reject trong GET hoặc trong phạm vi #13.
- Test liên quan, build và `git diff --check` pass.
- Dependency #14/#66 được xác nhận trước khi merge.
