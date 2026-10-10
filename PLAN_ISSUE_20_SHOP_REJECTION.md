# Plan — Issue #20: SHOP 06 — Admin từ chối gian hàng

## 1. Mục tiêu và ranh giới

- **Issue:** [#20 — Admin từ chối gian hàng](https://github.com/ChuChoaChan131019/MauThietKe_DoAnGiuaKy/issues/20).
- **Requirement:** `SHOP 06`.
- **Module/bảng sở hữu:** `merchant` / `shops`.
- **Actor:** Admin có role `ADMIN` và tài khoản `ACTIVE`.
- **Mục tiêu:** Admin từ chối đúng một yêu cầu đang `PENDING`, bắt buộc nhập lý do hợp lệ, chuyển shop sang `REJECTED`, lưu người xử lý và phát event có `eventId` cho module Engagement.

Ngoài phạm vi issue này:

- Phê duyệt shop thuộc `SHOP 05` / issue #19 và đã hoàn thành trong PR #97.
- User chỉnh sửa, gửi lại yêu cầu bị từ chối thuộc `SHOP 07`.
- Tạo notification và listener after-commit thuộc `NOTI 02` / issue #71.
- Khóa/mở khóa shop thuộc `SHOP 08`.
- Không sửa code nội bộ của `identity` hoặc `engagement`.
- Không thay đổi `pom.xml`, cấu hình dùng chung, common fragment hoặc schema nếu không phát hiện yêu cầu mới.

## 2. Requirement và acceptance criteria

Nguồn chuẩn: `SHOP 06`, UC 03, BR 04, BR 05 và quy tắc State trong `Docs/SRS.md`.

1. Chỉ shop đang `PENDING` mới được chuyển sang `REJECTED`.
2. Lý do từ chối phải được trim và không được rỗng hoặc chỉ chứa khoảng trắng.
3. Từ chối thành công phải cập nhật nhất quán trong cùng transaction:
   - `status = REJECTED`;
   - `rejection_reason = lý do đã trim`;
   - `approved_by = adminId` vì SRS định nghĩa đây là Admin đã duyệt hoặc xử lý yêu cầu;
   - `approved_at = null` vì yêu cầu không được phê duyệt;
   - `updated_at` được cập nhật theo lifecycle hiện tại của entity.
4. Thao tác lặp hoặc thao tác trên shop không còn `PENDING` phải bị từ chối, không ghi đè lý do/người xử lý và không phát event lần hai.
5. Sau transition hợp lệ, phát đúng một `ShopRejectedEvent` có `eventId` duy nhất.
6. Chỉ Admin được gọi route từ chối; anonymous bị chuyển tới đăng nhập, USER nhận `403`.
7. Trang chi tiết có form nhập lý do, hiển thị lỗi validation tại chỗ và có phản hồi thành công/lỗi rõ ràng.
8. Có test cho domain state, trim/blank reason, transaction, event, thao tác lặp, phân quyền và CSRF.

## 3. Dependency và cách tạo branch

### Dependency thực tế

- PR #96 đã cung cấp danh sách và trang chi tiết yêu cầu `PENDING` dùng dữ liệu thật.
- PR #97 của issue #19 đã merge vào `main` tại commit `0962d77`; có sẵn:
  - `InvalidShopStateTransitionException`;
  - State transition cho approve;
  - `ShopRepository.findByIdForUpdate(...)` dùng `PESSIMISTIC_WRITE`;
  - `ShopApprovalService`, route approve, CSRF, flash message và test nền.
- `/admin/**` đã được `SecurityConfig` bảo vệ bằng role `ADMIN`.
- Issue #71 sẽ dùng `ShopRejectedEvent` để tạo notification cho owner; listener không nằm trong issue #20.

### Branch đề xuất

```text
feature/merchant/20-reject-shop
```

Tạo branch mới từ `origin/main` sau khi đồng bộ. Không tiếp tục code trực tiếp trên branch issue #19 dù source hiện tại gần giống nhau.

Worktree hiện có `Docs/SETUP.md` và các file plan cá nhân chưa commit; khi triển khai phải giữ nguyên và không đưa chúng vào commit/PR của issue #20.

## 4. Thiết kế nghiệp vụ

### 4.1 State transition

Transition hợp lệ duy nhất trong issue:

```text
PENDING --Admin reject(reason)--> REJECTED
```

Mở rộng State Pattern đang có:

- `ShopState` thêm hành vi `reject()` mặc định ném `InvalidShopStateTransitionException(status(), REJECTED)`.
- `PendingShopState` là state duy nhất override `reject()` và trả về `REJECTED`.
- `ApprovedShopState`, `RejectedShopState`, `LockedShopState` dùng hành vi mặc định để từ chối transition.
- `Shop.reject(adminId, reason)` chịu trách nhiệm bảo vệ invariant và cập nhật trạng thái/audit.

Không kiểm tra trạng thái bằng các khối `if (status == ...)` rải rác trong controller/service.

### 4.2 Chuẩn hóa lý do

Validation phải có hai lớp:

1. DTO/form dùng Bean Validation để trả lỗi thân thiện trên giao diện.
2. Service/domain vẫn trim và kiểm tra lại để bảo vệ use case khi được gọi ngoài MVC hoặc bị bypass form.

Quy tắc chuẩn hóa:

```text
normalizedReason = reason.trim()
normalizedReason.isBlank() => reject request
```

SRS và schema hiện tại không quy định độ dài tối đa cho `rejection_reason` (`TEXT`), vì vậy không tự đặt giới hạn nghiệp vụ mới trong issue này. Nếu muốn giới hạn phải cập nhật SRS/schema và xác nhận riêng.

### 4.3 Dữ liệu audit

Schema hiện tại không có `rejected_by` hoặc `rejected_at`:

- Dùng `approved_by` để lưu Admin xử lý, đúng mô tả hiện tại trong SRS.
- Giữ `approved_at = null` khi trạng thái là `REJECTED`.
- `updated_at` thể hiện thời điểm bản ghi được cập nhật.
- Không thêm migration chỉ để đổi tên hoặc bổ sung cột ngoài requirement.

Entity nên cập nhật các field chỉ sau khi State xác nhận transition hợp lệ, để exception không làm thay đổi một phần object.

### 4.4 Chống xử lý lặp và cạnh tranh đồng thời

Tái sử dụng `ShopRepository.findByIdForUpdate(shopId)` từ PR #97 trong transaction ghi:

1. Kiểm tra Admin qua `identity.api`.
2. Đọc và khóa shop bằng `PESSIMISTIC_WRITE`.
3. Chuẩn hóa/validate lý do.
4. Gọi `Shop.reject(...)`.
5. Persist thay đổi.
6. Publish event đúng một lần.
7. Commit transaction.

Nếu hai Admin xử lý cùng lúc, request thứ hai phải chờ lock; sau đó thấy shop đã `APPROVED` hoặc `REJECTED` và bị từ chối trước khi save/event.

## 5. DTO, service và xử lý lỗi

### DTO/form

Tạo `merchant.dto.ShopRejectionForm` với field `reason`:

- `@NotBlank(message = "Vui lòng nhập lý do từ chối.")`.
- Getter/setter hoặc cấu trúc tương thích với Thymeleaf `th:object`.
- Không nhận `adminId`, `shopId`, status hoặc audit field từ client.

### Service

Tạo `ShopRejectionService` riêng, có `@Transactional`, chịu trách nhiệm:

- kiểm tra `shopId`, `adminId` và lý do;
- xác nhận actor là Admin `ACTIVE` qua `IdentityApi`;
- khóa và tải shop;
- gọi domain transition;
- lưu shop;
- tạo và publish `ShopRejectedEvent`.

Không ghép logic reject vào `AdminShopRequestService` vì service đó đang là query service `readOnly`. Không gọi Repository trực tiếp từ controller.

### Ánh xạ lỗi

- Shop không tồn tại: `404`.
- Shop không còn `PENDING`: flash error và redirect về danh sách đang chờ.
- Lý do blank từ form: render lại trang chi tiết, giữ nội dung đã nhập và hiển thị lỗi cạnh field.
- Lý do không hợp lệ khi gọi trực tiếp service: ném exception nghiệp vụ, rollback và không publish event.
- Actor không tồn tại, không phải Admin hoặc bị `LOCKED`: `403`.
- Lỗi save/event trong transaction: rollback trạng thái, lý do và người xử lý.

## 6. Public event contract

Tạo event bất biến trong `merchant.api`:

```java
public record ShopRejectedEvent(
        UUID eventId,
        Long shopId,
        Long ownerId,
        String shopName,
        String rejectionReason,
        Long rejectedById,
        Instant rejectedAt) {
}
```

Ý nghĩa:

- `eventId`: UUID mới cho mỗi transition thành công, phục vụ idempotency.
- `ownerId`: receiver của notification issue #71.
- `shopId`: reference tới shop.
- `shopName` và `rejectionReason`: đủ để Engagement tạo nội dung mà không đọc Entity/Repository Merchant.
- `rejectedById`, `rejectedAt`: audit/event trace; `rejectedAt` là thời điểm event nghiệp vụ xảy ra, không yêu cầu cột database mới.

Event được publish sau khi domain transition thành công trong transaction. Listener issue #71 phải dùng `@TransactionalEventListener(phase = AFTER_COMMIT)` và unique `(event_id, receiver_id)` để không tạo notification khi rollback hoặc tạo trùng.

Không triển khai listener hay sửa module Engagement trong issue này.

## 7. Route và giao diện

### Route

```text
POST /admin/shop-requests/{id}/reject
```

- `shopId` lấy từ path.
- `adminId` lấy từ `@AuthenticationPrincipal IdentityPrincipal`, không lấy từ form.
- Lý do lấy từ `@Valid @ModelAttribute("rejectionForm")`.
- Có `BindingResult` ngay sau form parameter để xử lý validation.
- Form POST có CSRF token.
- Thành công dùng Post/Redirect/Get về `/admin/shop-requests` và flash success.

GET `/admin/shop-requests/{id}` cần thêm một `rejectionForm` rỗng vào model. Khi validation lỗi, controller tải lại `PendingShopRequestDetail`, giữ `BindingResult` và render `merchant/admin/shop-request-detail`.

### Template Admin

Cập nhật `templates/merchant/admin/shop-request-detail.html`:

- Giữ nút `Phê duyệt` hiện có.
- Thêm form `Từ chối` với textarea lý do bắt buộc.
- Hiển thị lỗi Bean Validation ngay dưới textarea.
- Nút từ chối có style cảnh báo và confirm ngắn trước submit.
- Hai form approve/reject độc lập, không để textarea bị gửi vào route approve.

Danh sách `shop-requests.html` đã có flash success/error từ PR #97 nên chỉ tái sử dụng. Sau khi từ chối, shop tự biến mất khỏi danh sách vì query chỉ lấy `PENDING`.

### Giao diện phía owner

`templates/merchant/shop-status.html` đã có phần hiển thị `ownedShop.rejectionReason` khi status là `REJECTED`. Issue #20 chỉ cần bảo đảm dữ liệu thật được lưu đúng; không triển khai luồng chỉnh sửa/gửi lại của SHOP 07.

## 8. Trình tự triển khai

1. Đồng bộ `origin/main` sau merge PR #97 và tạo `feature/merchant/20-reject-shop`.
2. Chốt schema `ShopRejectedEvent` với owner Engagement trước khi listener issue #71 phụ thuộc vào nó.
3. Tạo `ShopRejectionForm` và exception validation/authorization phù hợp.
4. Mở rộng `ShopState` và `PendingShopState` cho transition reject.
5. Thêm `Shop.reject(adminId, reason)` và getter audit cần cho test.
6. Tạo `ShopRejectionService`, tái sử dụng query khóa từ PR #97.
7. Thêm POST route reject và xử lý validation/error trong `AdminShopRequestController`.
8. Cập nhật template chi tiết với textarea, lỗi inline và nút từ chối.
9. Viết unit, MVC và integration test.
10. Chạy full test/package, kiểm tra module boundary và test UI thủ công.
11. Mở PR `Closes #20`, ghi rõ event contract, không có migration và dependency issue #71.

## 9. Test plan

### Domain/State test

- `PendingShopState.reject()` trả `REJECTED`.
- `APPROVED`, `REJECTED`, `LOCKED` từ chối reject.
- `Shop.reject` lưu lý do đã trim, `approvedById`, xóa `approvedAt` và đổi status đúng.
- Admin ID null, reason null/rỗng/chỉ khoảng trắng bị từ chối.
- Transition lỗi không làm thay đổi status, reason hoặc audit fields.

### Service test

- Admin ACTIVE từ chối shop PENDING thành công.
- Service dùng query khóa bản ghi.
- Event có UUID và đúng shopId, ownerId, shopName, reason đã trim, rejectedById, rejectedAt.
- Shop không tồn tại: không save, không publish event.
- Shop đã APPROVED/REJECTED/LOCKED: không save, không publish event.
- Admin không tồn tại, không phải ADMIN hoặc bị LOCKED: không khóa/thay đổi shop và không publish event.
- Lý do blank: không thay đổi shop và không publish event.
- Gọi lặp: lần đầu thành công, lần sau bị từ chối và chỉ có một event.

### Repository/integration test

- Sau flush/commit: `status=REJECTED`, `rejection_reason` đã trim, `approved_by=adminId`, `approved_at IS NULL`.
- Owner đọc trang trạng thái nhận đúng lý do đã lưu.
- Exception sau transition làm transaction rollback toàn bộ dữ liệu.
- Test cạnh tranh nếu khả thi; tối thiểu phải chứng minh query lock được dùng và thao tác lặp không tạo event thứ hai.
- Không tạo migration mới vì schema đã có `REJECTED`, `rejection_reason` và `approved_by`.

### MVC/security test

- Anonymous POST có CSRF hợp lệ bị redirect `/login`.
- USER POST nhận `403` và service không được gọi.
- Admin POST thiếu CSRF nhận `403`.
- Admin submit reason hợp lệ gọi service với shopId, principal userId và reason.
- Reason rỗng/chỉ khoảng trắng render lại detail, có field error và không gọi service.
- Thành công redirect về danh sách và có success flash.
- Shop không tồn tại trả `404`.
- State không hợp lệ redirect với error flash.
- GET detail có `rejectionForm` và vẫn hiển thị form approve hiện tại.

### Manual UI test

1. User tạo shop `PENDING`.
2. Admin mở chi tiết, submit form từ chối không có lý do và thấy lỗi inline.
3. Admin nhập lý do có khoảng trắng đầu/cuối và từ chối thành công.
4. Xác nhận shop biến mất khỏi danh sách PENDING và database lưu reason đã trim cùng Admin xử lý.
5. User mở trang trạng thái và thấy đúng lý do từ dữ liệu database.
6. Gửi lại POST reject cùng shop ID và xác nhận hệ thống từ chối, không ghi đè reason/event.
7. Đăng nhập USER và xác nhận không thể truy cập route Admin.

## 10. File dự kiến thay đổi

### File mới

- `src/main/java/com/senvia/doangiuaky/merchant/api/ShopRejectedEvent.java`
- `src/main/java/com/senvia/doangiuaky/merchant/dto/ShopRejectionForm.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/ShopRejectionService.java`
- Exception riêng cho authorization/invalid reason nếu cần, đặt trong package Merchant phù hợp.
- `src/test/java/com/senvia/doangiuaky/merchant/service/ShopRejectionServiceTest.java`
- `src/test/java/com/senvia/doangiuaky/merchant/service/ShopRejectionServiceIntegrationTest.java`

### File cập nhật

- `src/main/java/com/senvia/doangiuaky/merchant/entity/Shop.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/ShopState.java`
- `src/main/java/com/senvia/doangiuaky/merchant/state/PendingShopState.java`
- `src/main/java/com/senvia/doangiuaky/merchant/controller/AdminShopRequestController.java`
- `src/main/resources/templates/merchant/admin/shop-request-detail.html`
- `src/test/java/com/senvia/doangiuaky/merchant/state/ShopStateFactoryTest.java`
- `src/test/java/com/senvia/doangiuaky/merchant/controller/AdminShopRequestControllerTest.java`
- Repository/integration test hiện có nếu cần kiểm tra persistence hoặc lock.

Không dự kiến sửa migration, `SecurityConfig`, `pom.xml`, module Engagement, common resources hoặc `shop-requests.html` nếu flash hiện tại đủ dùng.

## 11. Lệnh kiểm tra

```powershell
.\mvnw.cmd test
.\mvnw.cmd clean package
git diff --check
git status
git diff origin/main...HEAD
```

Kiểm tra ranh giới module:

```powershell
rg -n "identity\.(entity|repository|service)|engagement\.(entity|repository|service)" src/main/java/com/senvia/doangiuaky/merchant
```

Kết quả mong đợi: Merchant chỉ dùng `identity.api`; Engagement chỉ tiêu thụ `ShopRejectedEvent` qua `merchant.api` ở issue #71.

## 12. Definition of Done

- Chỉ `PENDING -> REJECTED` được phép và transition nằm trong State Pattern.
- Reason được trim, không rỗng và được validate cả ở form lẫn backend use case.
- Status, reason, Admin xử lý và audit được lưu nhất quán trong cùng transaction.
- Thao tác lặp/đồng thời không ghi đè dữ liệu và không tạo event trùng.
- `ShopRejectedEvent` có `eventId`, đủ dữ liệu cho notification và không lộ Entity nội bộ.
- Route POST chỉ Admin truy cập được, có CSRF và không nhận Admin ID từ client.
- UI hiển thị lỗi validation rõ ràng; owner xem được lý do thật sau khi bị từ chối.
- Test liên quan, full test và package đều pass.
- PR chỉ chứa phạm vi issue #20, liên kết `Closes #20`, ghi cách test và không chứa secret/file sinh tự động/file cá nhân.
