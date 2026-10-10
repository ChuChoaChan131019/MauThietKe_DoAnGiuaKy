# Plan — Issue #19: SHOP 05 — Admin phê duyệt gian hàng

## 1. Mục tiêu và ranh giới

- **Issue:** [#19 — Admin phê duyệt gian hàng](https://github.com/ChuChoaChan131019/MauThietKe_DoAnGiuaKy/issues/19).
- **Requirement:** `SHOP 05`.
- **Module/bảng sở hữu:** `merchant` / `shops`.
- **Actor:** Admin có tài khoản `ACTIVE` và quyền `ADMIN`.
- **Mục tiêu:** Admin chuyển đúng một yêu cầu từ `PENDING` sang `APPROVED`, lưu người duyệt và thời điểm duyệt, sau đó phát event có `eventId` cho module Engagement.

Ngoài phạm vi issue này:

- Từ chối shop và nhập lý do thuộc `SHOP 06` / issue #20.
- Tạo notification và listener after-commit thuộc `NOTI 02` / issue #71.
- Khóa/mở khóa shop, cập nhật shop và CRUD sản phẩm thuộc các issue riêng.
- Không sửa trực tiếp code nội bộ của `identity` hoặc `engagement`.
- Không thay đổi `pom.xml`, cấu hình Cloudinary, common fragment hoặc schema database nếu không phát hiện thiếu sót mới.

## 2. Acceptance criteria cần đáp ứng

1. Chỉ shop đang `PENDING` mới được phê duyệt.
2. Phê duyệt thành công phải cập nhật đồng thời:
   - `status = APPROVED`;
   - `approved_by = adminId`;
   - `approved_at = thời điểm duyệt`;
   - `updated_at` được cập nhật theo cơ chế hiện tại của entity.
3. Nếu yêu cầu đã được xử lý hoặc không còn `PENDING`, thao tác lặp phải bị từ chối và không phát event lần hai.
4. Sau khi cập nhật hợp lệ, phát đúng một `ShopApprovedEvent` có `eventId` duy nhất.
5. Chỉ Admin được gọi route duyệt; anonymous bị chuyển tới đăng nhập, USER nhận `403`.
6. Có giao diện duyệt trong template thuộc module `merchant`, có thông báo thành công/lỗi rõ ràng.
7. Có test cho thành công, shop không tồn tại, trạng thái không hợp lệ, thao tác lặp, phân quyền, CSRF và event.

## 3. Dependency và thứ tự thực hiện

### Dependency thực tế

- Nền domain/migration `shops`, State Pattern và trạng thái `PENDING/APPROVED` đã có từ issue #14.
- Luồng gửi yêu cầu shop đã có từ issue #15/#16.
- Màn hình danh sách/chi tiết yêu cầu thật nằm trong PR #96 của issue #13. Issue #19 nên bắt đầu từ `main` sau khi PR #96 merge; nếu làm trước thì phải dùng stacked branch và khai báo rõ dependency PR.
- `AUTH 07` / issue #66 đã hoàn thành, nên `/admin/**` đã được bảo vệ bởi Spring Security.
- Issue #71 sẽ sử dụng event của issue #19 để tạo notification. Phúc cần review schema event trước khi merge.

GitHub hiện chưa khai báo relationship cho #19, nhưng về implementation #19 phụ thuộc trực tiếp vào màn hình chi tiết của #13/PR #96.

### Branch đề xuất

```text
feature/merchant/19-approve-shop
```

Tạo branch từ `main` sau khi đồng bộ và xác nhận PR #96 đã được merge.

## 4. Thiết kế nghiệp vụ

### 4.1 State transition

Luồng hợp lệ duy nhất của issue:

```text
PENDING --Admin approve--> APPROVED
```

Không viết kiểm tra trạng thái rải rác trong controller. Mở rộng State Pattern hiện tại:

- `ShopState` cung cấp hành vi chuyển trạng thái khi phê duyệt; mặc định từ chối transition.
- `PendingShopState` là state duy nhất cho phép chuyển sang `APPROVED`.
- `ApprovedShopState`, `RejectedShopState` và `LockedShopState` từ chối thao tác approve bằng domain exception rõ ràng.
- `Shop.approve(adminId, approvedAt)` lấy trạng thái kế tiếp từ State, sau đó cập nhật status và audit fields.

Khi duyệt thành công nên xóa `rejectionReason` cũ nếu shop từng bị từ chối rồi gửi lại, tránh để metadata từ lần xét duyệt trước tồn tại trên shop đã được duyệt.

### 4.2 Chống duyệt lặp và cạnh tranh đồng thời

Chỉ kiểm tra `status == PENDING` trong Java là chưa đủ nếu hai Admin gửi request gần như cùng lúc. Repository nên cung cấp query khóa bản ghi trong transaction:

```text
findByIdForUpdate(shopId)
```

Triển khai bằng `PESSIMISTIC_WRITE` hoặc cơ chế tương đương được kiểm thử trên PostgreSQL và H2. Luồng service:

1. Mở transaction ghi.
2. Kiểm tra Admin hợp lệ qua `identity.api`.
3. Đọc và khóa shop.
4. Gọi domain transition `Shop.approve(...)`.
5. Persist thay đổi.
6. Phát event đúng một lần.
7. Commit transaction.

Request thứ hai phải chờ transaction đầu hoàn tất, sau đó đọc thấy `APPROVED` và bị từ chối trước khi phát event.

### 4.3 Kiểm tra Admin

- Route `/admin/**` tiếp tục dùng rule hiện có trong `SecurityConfig`.
- Controller lấy `adminId` từ `IdentityPrincipal`, không nhận admin ID từ form/request.
- Service dùng public contract `IdentityApi` để xác nhận người thao tác tồn tại, có role `ADMIN` và account `ACTIVE`.
- Không import `identity.entity.User`, `UserRepository` hoặc service nội bộ của Identity.

## 5. Public event contract

Tạo event bất biến trong `merchant.api`, dự kiến:

```java
public record ShopApprovedEvent(
        UUID eventId,
        Long shopId,
        Long ownerId,
        String shopName,
        Long approvedById,
        Instant approvedAt) {
}
```

Quy tắc:

- `eventId` tạo mới bằng UUID cho mỗi lần transition thành công.
- `ownerId` là receiver mà issue #71 cần để tạo notification.
- `shopId` là reference tới shop; `shopName` dùng để tạo nội dung mà Engagement không cần truy cập entity Merchant.
- `approvedById` và `approvedAt` phục vụ audit/event trace.
- Không đưa entity, repository, logo public ID hoặc trường nội bộ khác vào event.
- Event được publish bên trong transaction sau khi domain transition thành công.
- Listener của issue #71 phải dùng `@TransactionalEventListener(AFTER_COMMIT)` và unique `(event_id, receiver_id)`; không triển khai listener trong issue #19.
- Thống nhất schema này với Phúc trước khi merge vì đây là public contract chéo module.

## 6. Service và xử lý lỗi

Tạo `ShopApprovalService` riêng thay vì biến service query hiện tại thành service vừa đọc vừa ghi. Service mới chịu trách nhiệm transaction, authorization theo dữ liệu, state transition và publish event.

Phân loại lỗi dự kiến:

- Shop không tồn tại: trả `404`.
- Shop không còn `PENDING`: từ chối thao tác, không update và không publish event; UI hiển thị thông báo yêu cầu đã được xử lý.
- Admin không tồn tại, bị khóa hoặc không có role ADMIN: `403`/access denied.
- Lỗi trong transaction hoặc event publication: rollback thay đổi status/audit fields.

Không bắt exception rồi tiếp tục commit. Mọi exception nghiệp vụ trước khi hoàn tất phải để transaction rollback phù hợp.

## 7. Route và giao diện

### Route

```text
POST /admin/shop-requests/{id}/approve
```

- Dùng POST vì đây là thao tác thay đổi trạng thái.
- Lấy Admin hiện tại bằng `@AuthenticationPrincipal IdentityPrincipal`.
- Form phải có CSRF token; Thymeleaf/Spring Security tự chèn token cho form POST.
- Thành công dùng Post/Redirect/Get về `/admin/shop-requests` và flash message.
- Lỗi state không hợp lệ hiển thị flash message rõ ràng; lỗi không tồn tại giữ semantics `404`.

### Template

Cập nhật `templates/merchant/admin/shop-request-detail.html`:

- Thay ghi chú “chỉ xem” bằng nút `Phê duyệt`.
- Form submit tới route approve với `request.shopId` thật.
- Có thể thêm xác nhận ngắn trước khi submit để tránh bấm nhầm.
- Không thêm nút từ chối trong issue này.

Cập nhật `templates/merchant/admin/shop-requests.html` để hiển thị flash message thành công/lỗi sau redirect. Sau khi duyệt, shop không còn xuất hiện trong danh sách PENDING và `pendingCount` giảm theo dữ liệu database.

## 8. Trình tự triển khai

1. Đồng bộ `main`, bảo đảm PR #96 đã merge và tạo branch `feature/merchant/19-approve-shop`.
2. Chốt `ShopApprovedEvent` với owner Engagement trước khi code listener phụ thuộc.
3. Thêm domain exception và mở rộng `ShopState`/`PendingShopState` cho transition approve.
4. Thêm `Shop.approve(adminId, approvedAt)` cùng getter audit cần cho test.
5. Thêm repository query khóa shop khi duyệt.
6. Tạo `ShopApprovalService` với transaction ghi, kiểm tra Admin qua `identity.api`, chuyển state và publish event.
7. Thêm POST route vào `AdminShopRequestController` và ánh xạ lỗi/redirect phù hợp.
8. Cập nhật template chi tiết và danh sách để có form duyệt cùng flash message.
9. Viết test domain, service, repository/integration và MVC.
10. Chạy toàn bộ test/build, kiểm tra module boundary và test UI thủ công.
11. Mở PR liên kết `Closes #19`, ghi rõ event schema và mời Phúc review public contract.

## 9. Test plan

### Domain/State test

- `PendingShopState` cho phép approve và trả `APPROVED`.
- `APPROVED`, `REJECTED`, `LOCKED` từ chối approve.
- `Shop.approve` cập nhật đúng status, approvedById, approvedAt và xóa rejectionReason cũ nếu có.
- Admin ID hoặc thời điểm duyệt null bị từ chối.

### Service test

- Admin ACTIVE duyệt shop PENDING thành công.
- Service dùng query khóa bản ghi.
- Event có UUID, shopId, ownerId, shopName, approvedById và approvedAt đúng với dữ liệu đã lưu.
- Shop không tồn tại: không save, không publish event.
- Shop đã APPROVED/REJECTED/LOCKED: không thay đổi audit fields và không publish event.
- Admin không hợp lệ/LOCKED/không phải ADMIN: không thay đổi shop và không publish event.
- Gọi lặp: lần đầu thành công, lần sau bị từ chối, tổng cộng chỉ một event.

### Repository/integration test

- Dữ liệu sau commit có `status=APPROVED`, `approved_by` và `approved_at` đúng.
- Transaction lỗi phải rollback status và audit fields.
- Nếu khả thi, test hai transaction cạnh tranh để chứng minh chỉ một transition/event thành công.
- PostgreSQL migration hiện tại đã có đủ cột và FK; không tạo migration mới nếu schema không đổi.

### MVC/security test

- Anonymous POST bị redirect tới `/login`.
- USER POST nhận `403` và service không được gọi.
- Admin POST có CSRF gọi đúng service với shop ID và user ID từ principal.
- POST thiếu CSRF nhận `403`.
- Thành công redirect về danh sách và có success message.
- Shop không tồn tại trả `404`; state không hợp lệ hiển thị lỗi phù hợp.

### Manual UI test

1. Tạo một shop PENDING bằng tài khoản USER.
2. Đăng nhập Admin, mở trang chi tiết và bấm phê duyệt.
3. Xác nhận shop biến mất khỏi danh sách PENDING, counter giảm và database lưu đủ audit fields.
4. Gửi lại POST cùng shop ID và xác nhận hệ thống từ chối, không phát event thứ hai.
5. Đăng nhập USER và xác nhận không thể gọi URL Admin.

## 10. File dự kiến thay đổi

### File mới

- `src/main/java/com/senvia/doangiuaky/merchant/api/ShopApprovedEvent.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/ShopApprovalService.java`
- Domain/service exception phù hợp trong `merchant.state` hoặc `merchant.service`.
- `src/test/java/com/senvia/doangiuaky/merchant/service/ShopApprovalServiceTest.java`

### File cập nhật

- `src/main/java/com/senvia/doangiuaky/merchant/entity/Shop.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/ShopState.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/PendingShopState.java`
- Các State còn lại nếu interface cần hành vi mặc định/override rõ ràng.
- `src/main/java/com/senvia/doangiuaky/merchant/repository/ShopRepository.java`
- `src/main/java/com/senvia/doangiuaky/merchant/controller/AdminShopRequestController.java`
- `src/main/resources/templates/merchant/admin/shop-request-detail.html`
- `src/main/resources/templates/merchant/admin/shop-requests.html`
- `src/test/java/com/senvia/doangiuaky/merchant/state/ShopStateFactoryTest.java`
- `src/test/java/com/senvia/doangiuaky/merchant/controller/AdminShopRequestControllerTest.java`
- `src/test/java/com/senvia/doangiuaky/merchant/repository/ShopRepositoryTest.java` hoặc integration test riêng nếu cần kiểm tra locking/rollback.

Không dự kiến sửa migration, `SecurityConfig`, `pom.xml`, module Engagement hoặc common resources.

## 11. Lệnh kiểm tra

```powershell
.\mvnw.cmd test
.\mvnw.cmd clean package
git diff --check
git status
```

Kiểm tra thêm:

```powershell
rg -n "identity\.(entity|repository|service)|engagement\.(entity|repository|service)" src/main/java/com/senvia/doangiuaky/merchant
```

Kết quả mong đợi là Merchant chỉ phụ thuộc `identity.api`, còn Engagement chỉ tiêu thụ `ShopApprovedEvent` qua `merchant.api` ở issue #71.

## 12. Definition of Done

- Chỉ `PENDING -> APPROVED` được phép và State Pattern kiểm soát transition.
- Lưu đúng `approved_by`, `approved_at`, status và dữ liệu audit trong cùng transaction.
- Thao tác lặp/kết hợp đồng thời không tạo transition hoặc event trùng.
- `ShopApprovedEvent` có `eventId` và schema được owner Engagement review.
- Route POST chỉ Admin truy cập được, có CSRF và không nhận admin ID từ client.
- UI duyệt hoạt động với dữ liệu thật và hiển thị phản hồi rõ ràng.
- Test liên quan, full test và package đều pass.
- PR chỉ chứa phạm vi issue #19, liên kết issue và không chứa secret/file sinh tự động.
