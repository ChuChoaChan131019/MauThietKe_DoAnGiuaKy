# Kế hoạch thực hiện Issue #15 — SHOP 01: Gửi yêu cầu mở gian hàng

## 1. Mục tiêu và phạm vi

Issue: [#15 — SHOP 01: Gửi yêu cầu mở gian hàng](https://github.com/ChuChoaChan131019/MauThietKe_DoAnGiuaKy/issues/15)

Requirement chính:

- USER chưa có shop được gửi một yêu cầu mở gian hàng.
- Mỗi user chỉ được sở hữu tối đa một shop/yêu cầu shop.
- Khách, ADMIN, tài khoản không tồn tại hoặc không còn ACTIVE không được gửi yêu cầu.
- Owner phải lấy từ phiên đăng nhập, không nhận `ownerId` từ form/request.
- Yêu cầu mới được tạo ở trạng thái `PENDING` theo SHOP 03.
- Sau khi gửi thành công, người dùng được chuyển tới trang trạng thái thật của shop.

Module và dữ liệu sở hữu:

- Module: `merchant`.
- Bảng: `shops`.
- Route chính: `GET/POST /merchant/register`, `GET /merchant/shop-status`.
- Dependency hợp lệ: `identity.api` để xác minh user, role và account status.

Ngoài phạm vi riêng của issue #15:

- Chi tiết trường form, validation nội dung và upload logo: #16 / SHOP 02.
- State Pattern và shop mới `PENDING`: #14 / SHOP 03 đã cung cấp nền tảng.
- Phát `ShopRequestedEvent` và notification Admin: issue tích hợp/event tương ứng.
- Sửa và gửi lại shop `REJECTED`: #17 / SHOP 07.
- Admin xem, duyệt hoặc từ chối yêu cầu: các issue SHOP 04–06.
- Cập nhật thông tin shop `APPROVED`: SHOP 09.

## 2. Nguồn yêu cầu và acceptance criteria

Nguồn chuẩn đã đối chiếu:

- `Docs/SRS.md`: SHOP 01–03 và UC 02.
- `Docs/ARCHITECTURE.md`: Controller → Service → Repository; module Merchant chỉ phụ thuộc `identity.api`.
- `Docs/PROJECT_STRUCTURE_GUIDE.md`: vị trí controller, DTO, entity, repository, service, template và test.
- `Docs/MODULE_OWNERSHIP.md`: Merchant sở hữu bảng `shops` và toàn bộ vòng đời shop.
- `Docs/modules/MERCHANT_GUIDE.md`: một user tối đa một shop; chỉ Admin đổi trạng thái xét duyệt.
- `Docs/PHAN_CONG_CONG_VIEC.md`: user tạo tối đa một shop, yêu cầu mới `PENDING`.
- `Docs/DEVELOPMENT_PLAYBOOK.md`, `Docs/GIT_WORKFLOW.md`, `Docs/CONTRIBUTING.md`: vertical slice, test, review và Definition of Done.

Acceptance criteria từ issue:

1. Chặn khách và ADMIN.
2. Không tạo yêu cầu trùng khi user đã có shop/yêu cầu `PENDING` hoặc `APPROVED`.
3. Kiểm tra ownership và eligibility ở tầng Service, không chỉ dựa vào UI/Security filter.
4. Có test cho luồng thành công, validation/lỗi và truy cập trái quyền.
5. Có route/controller/template cho thao tác và trạng thái mà người dùng cần xem.
6. Transaction/idempotency phù hợp, không để dữ liệu hoặc asset rác khi lỗi.

## 3. Quan hệ giữa issue #15 và #16

#15 và #16 là hai lát cắt của cùng một luồng POST:

| Issue | Trách nhiệm chính |
| --- | --- |
| #15 / SHOP 01 | Ai được gửi; lấy owner từ principal; chống duplicate; tạo đúng một shop; redirect trạng thái |
| #16 / SHOP 02 | Form gồm trường gì; validation nội dung; upload logo; lưu URL và `public_id`; hiển thị lỗi |

Không tạo hai controller hoặc hai service cạnh tranh cho cùng route. `ShopRegistrationService.submit(...)` phải là use case chuẩn duy nhất. Phần #16 cung cấp `ShopRegistrationForm` và storage adapter để use case #15 sử dụng.

Nếu tách PR:

1. #16 cung cấp DTO/form/storage contract cần thiết.
2. #15 nối use case submit, authorization, duplicate guard và status redirect.
3. Chỉ đóng từng issue khi acceptance riêng của issue đó đã đủ test và review.

Nếu nhóm chọn một PR vertical slice chung, PR phải liên kết cả #15 và #16, ghi rõ acceptance nào được hoàn tất cho từng issue.

## 4. Hiện trạng dự án

### 4.1 Nền tảng đã có

- `Shop` và `ShopStatus` đã được triển khai từ #14.
- `Shop.createPending(...)` luôn khởi tạo shop ở `PENDING`.
- `shops.owner_id` có unique constraint ở migration H2 và PostgreSQL.
- State Pattern đã bảo đảm shop `PENDING` không thêm product hoặc nhận order.
- `SecurityConfig` giới hạn `/merchant/**` cho role USER.
- `IdentityPrincipal` cung cấp `userId` tin cậy từ phiên đăng nhập.
- `IdentityApi` có `findUser(...)` và `isUserActive(...)`.
- Template `merchant/register.html` và `merchant/shop-status.html` đã tồn tại.

### 4.2 Bản nháp đang có trong workspace

Workspace hiện có thay đổi chưa commit của #16/#29, gồm:

- `ShopRegistrationController`.
- `ShopRegistrationService`.
- `ShopRegistrationForm`.
- `MerchantImageStorage` và Cloudinary adapter.
- Query `findByOwnerId`/`existsByOwnerId`.
- Binding form và status view vào dữ liệu thật.
- Unit test service và storage.

Không được mặc định xem các file untracked này là baseline đã merge. Trước khi code #15 phải xác định chúng thuộc PR/branch nào, tránh commit nhầm thay đổi của người khác hoặc tạo implementation trùng.

### 4.3 Khoảng trống/rủi ro trong bản nháp

- Chưa có MVC/security test cho anonymous, ADMIN, USER, CSRF và redirect.
- `GET /merchant/register` đang bắt chung `ShopRegistrationException`; lỗi nghiệp vụ/hệ thống có thể bị hiểu nhầm thành “chưa có shop”.
- Cleanup logo mới chỉ xử lý lỗi xảy ra trực tiếp quanh `saveAndFlush`; cần bảo vệ trường hợp transaction rollback sau flush nhưng trước commit.
- Service đang trả `Shop` entity cho controller. Nên cân nhắc DTO/result nội bộ tối thiểu để view không phụ thuộc metadata nội bộ như `logoPublicId`.
- Chưa có test submit đồng thời/unique race ở mức tích hợp.
- Test liên quan đã chạy đạt trong workspace, nhưng chưa đủ Definition of Done của #15 và chưa thay thế full clean build.

## 5. Thiết kế đề xuất

### 5.1 Public contract và dependency

Không cần thêm public Merchant API cho #15. Đây là use case nội bộ của module Merchant.

Merchant chỉ dùng:

- `IdentityApi.findUser(ownerId)` để xác nhận user tồn tại và đọc role/status.
- `IdentityApi.isUserActive(ownerId)` nếu cần kiểm tra trạng thái mới nhất.

Không import `User`, `UserRepository`, `IdentityService` hoặc service nội bộ của module Identity.

`IdentityPrincipal` chỉ được dùng ở Controller để lấy `userId`; Service nhận `ownerId` đã xác thực nhưng vẫn kiểm tra eligibility bằng `identity.api`.

### 5.2 Repository

`ShopRepository` cần:

- `Optional<Shop> findByOwnerId(Long ownerId)`.
- `boolean existsByOwnerId(Long ownerId)`.

`existsByOwnerId` chỉ phục vụ lỗi UX sớm. Unique constraint `shops.owner_id` mới là hàng rào cuối cùng chống hai request đồng thời.

Không cần migration mới vì schema #14 đã có đủ cột và unique owner.

### 5.3 Service/use case chuẩn

Dùng một service duy nhất, đề xuất giữ tên `ShopRegistrationService`.

Luồng `submit(ownerId, form)`:

1. Từ chối `ownerId` null/không hợp lệ.
2. Đọc user qua `IdentityApi`.
3. Chỉ chấp nhận `USER` đang `ACTIVE`.
4. Kiểm tra `existsByOwnerId`; nếu có shop ở bất kỳ trạng thái nào thì không tạo dòng mới.
5. Validate/upload logo qua storage adapter của #16/#29.
6. Chuẩn hóa dữ liệu text và gọi `Shop.createPending(...)`.
7. `saveAndFlush` để lỗi constraint xuất hiện trong transaction hiện tại.
8. Bắt `DataIntegrityViolationException` do duplicate race và chuyển thành lỗi nghiệp vụ an toàn.
9. Nếu database/transaction thất bại sau upload, cố gắng xóa asset mới; lỗi cleanup không che lỗi gốc và không làm lộ credential.
10. Trả result/DTO tối thiểu gồm shop ID và status, không trả metadata nội bộ không cần thiết.

Service query cho controller:

- `findOwnedShopStatus(ownerId)` hoặc result DTO nhỏ.
- Phân biệt rõ `ShopNotFoundException` với lỗi eligibility/infrastructure; controller không bắt exception chung để suy ra “chưa có shop”.

### 5.4 Controller và route

`GET /merchant/register`:

- Lấy `ownerId` từ `@AuthenticationPrincipal IdentityPrincipal`.
- Nếu chưa có shop: render `merchant/register` với form.
- Nếu đã có `PENDING`, `REJECTED` hoặc `LOCKED`: redirect `/merchant/shop-status`.
- Nếu đã `APPROVED`: có thể redirect `/merchant/dashboard` hoặc `/merchant/shop-status`; phải thống nhất với UX hiện hành và test rõ.

`POST /merchant/register`:

- Nhận `@Valid @ModelAttribute ShopRegistrationForm`.
- Nếu validation lỗi: render lại form; không gọi service submit/upload.
- Gọi duy nhất `ShopRegistrationService.submit(principal.getUserId(), form)`.
- Duplicate hoặc eligibility lỗi: hiển thị thông báo an toàn hoặc redirect status nếu shop đã tồn tại.
- Thành công: Post/Redirect/Get tới `/merchant/shop-status` và flash success message.

`GET /merchant/shop-status`:

- Đọc shop/status thật theo principal qua service.
- Nếu chưa có shop: redirect `/merchant/register`.
- Không nhận status từ query parameter.
- Không để người dùng truy cập trạng thái shop của owner khác.

### 5.5 Security và authorization

Ba lớp bảo vệ:

1. Security filter: `/merchant/**` yêu cầu role USER; anonymous về login, ADMIN nhận 403.
2. Controller: owner ID chỉ lấy từ authenticated principal.
3. Service: xác minh user tồn tại, role USER và account ACTIVE qua `identity.api`; không tin hoàn toàn session cũ.

Không nhận các trường sau từ client:

- `ownerId`.
- `status`.
- `submittedAt`.
- `logoPublicId`.
- Trường xét duyệt/khóa.

## 6. Trình tự triển khai

### Bước 0 — Chuẩn hóa Git/workspace

1. Xác định owner của các thay đổi uncommitted #16/#29 hiện tại.
2. Làm trên branch sạch từ `main`: `feature/merchant/15-submit-shop-request`.
3. Không mang `Docs/SETUP.md`, plan khác hoặc thay đổi Identity không liên quan vào PR.
4. Nếu phụ thuộc #16/#29 chưa merge, thống nhất merge order hoặc đưa đúng file dependency cần thiết vào PR và ghi `Relates #16/#29`.

### Bước 1 — Repository và result/exception

1. Bổ sung query theo owner nếu chưa có trong baseline.
2. Tạo exception/result nội bộ đủ để phân biệt duplicate, không tìm thấy và eligibility failure.
3. Không tạo abstraction mới nếu exception/result hiện tại có thể làm rõ bằng thay đổi nhỏ.

### Bước 2 — Hoàn thiện Service

1. Kiểm tra user/role/status qua `identity.api`.
2. Chặn duplicate trước upload.
3. Tạo shop `PENDING` và lưu trong transaction.
4. Xử lý unique race.
5. Đăng ký cleanup asset khi transaction rollback sau upload/flush.
6. Không log secret hoặc response Cloudinary thô.

### Bước 3 — Controller và view integration

1. Chuẩn hóa GET/POST `/merchant/register` trong một controller.
2. Gỡ route mock trùng khỏi `SellerController`.
3. Nối status view vào dữ liệu thật theo owner.
4. Giữ phần validation field/upload thuộc #16, nhưng use case submit chỉ có một implementation.

### Bước 4 — Test tự động

1. Unit test Service.
2. Repository/integration test unique owner và persistence.
3. MVC/security test route, quyền, CSRF, validation và redirect.
4. Transaction rollback/cleanup test.
5. Chạy full suite từ clean build.

### Bước 5 — Kiểm thử thủ công và PR

1. Test USER mới gửi thành công và thấy `PENDING`.
2. Refresh/back/submit lại không tạo dòng hoặc logo thứ hai.
3. Anonymous bị chuyển login; ADMIN bị 403.
4. USER bị khóa không gửi được dù session cũ còn tồn tại.
5. Kiểm tra database đúng owner/status và Cloudinary không còn asset rác sau lỗi mô phỏng.
6. Mở PR có issue, cách test, ảnh UI và review đúng owner.

## 7. Kế hoạch kiểm thử chi tiết

### 7.1 Service test

- ACTIVE USER chưa có shop: tạo đúng một shop `PENDING`.
- Owner ID không lấy từ form.
- User không tồn tại: từ chối trước repository save/upload.
- ADMIN: từ chối trước save/upload.
- USER không ACTIVE: từ chối trước save/upload.
- Owner đã có `PENDING`: từ chối trước upload.
- Owner đã có `APPROVED`: từ chối trước upload.
- Owner đã có `REJECTED` hoặc `LOCKED`: không tạo dòng thứ hai; luồng sửa/gửi lại thuộc issue khác.
- Hai request cùng vượt pre-check: unique constraint chặn request thứ hai và trả lỗi nghiệp vụ.
- Upload lỗi: không lưu shop.
- Save/flush lỗi: xóa logo mới.
- Rollback sau flush: xóa logo mới.
- Cleanup lỗi: không che lỗi database gốc và không lộ credential.

### 7.2 Repository/integration test

- `findByOwnerId` và `existsByOwnerId` trả đúng dữ liệu.
- Unique `owner_id` chặn hai shop cho cùng user.
- Shop mới lưu `PENDING`, owner ID và timestamps đúng.
- State PENDING không cho thêm product/nhận order.
- Chạy trên H2; smoke test PostgreSQL để phát hiện khác biệt dialect/constraint.

### 7.3 MVC/security test

- Anonymous GET/POST `/merchant/register` bị chuyển login.
- ADMIN GET/POST bị 403.
- USER chưa có shop nhận form 200.
- USER đã có shop không nhận form tạo mới.
- Form validation lỗi không gọi service.
- Submit thành công redirect `/merchant/shop-status`.
- Trang status đọc dữ liệu thật, không thể giả bằng query parameter.
- POST thiếu/sai CSRF bị từ chối.
- Service duplicate/eligibility lỗi hiển thị thông báo an toàn.

### 7.4 Manual test

1. Đăng nhập USER mới.
2. Mở `/merchant/register` và gửi form hợp lệ.
3. Xác nhận redirect, flash message và status `PENDING`.
4. Kiểm tra bảng `shops` chỉ có một dòng đúng owner.
5. Refresh/back rồi submit lại; xác nhận không có dòng/asset thứ hai.
6. Đăng nhập ADMIN và thử route; xác nhận 403.
7. Khóa USER sau khi đăng nhập, thử gửi bằng session cũ; service phải từ chối.

## 8. Phạm vi file dự kiến

File có thể tạo/sửa trong `merchant`:

- `src/main/java/com/senvia/doangiuaky/merchant/controller/ShopRegistrationController.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/ShopRegistrationService.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/ShopRegistrationException.java`
- `src/main/java/com/senvia/doangiuaky/merchant/dto/ShopRegistrationForm.java` — phần phối hợp #16
- `src/main/java/com/senvia/doangiuaky/merchant/repository/ShopRepository.java`
- `src/main/java/com/senvia/doangiuaky/merchant/controller/SellerController.java` — chỉ gỡ route mock trùng
- `src/main/resources/templates/merchant/register.html` — phần phối hợp #16
- `src/main/resources/templates/merchant/shop-status.html`
- `src/test/java/com/senvia/doangiuaky/merchant/service/ShopRegistrationServiceTest.java`
- `src/test/java/com/senvia/doangiuaky/merchant/repository/ShopRepositoryTest.java`
- `src/test/java/com/senvia/doangiuaky/merchant/controller/ShopRegistrationControllerTest.java`
- Test integration rollback nếu unit test không chứng minh được transaction synchronization.

Dependency #16/#29 chỉ đưa vào PR khi chưa có baseline tương ứng:

- `merchant.service.image.MerchantImageStorage` và DTO/exception liên quan.
- Cloudinary adapter và test riêng của nó.

Không dự kiến sửa:

- Migration #14 đã merge.
- `pom.xml` và `application.properties`.
- `common`, fragment hoặc asset dùng chung.
- Source nội bộ của Identity.
- Event/notification của Engagement.

## 9. Lệnh xác minh

```powershell
.\mvnw.cmd test "-Dtest=ShopRegistrationServiceTest,ShopRegistrationControllerTest,ShopRepositoryTest,CloudinaryMerchantImageStorageTest"
.\mvnw.cmd test
.\mvnw.cmd clean package
git diff --check
git status --short
```

Test ApplicationContext/repository phải chạy với datasource test phù hợp. Kiểm tra PostgreSQL/Supabase và Cloudinary thật dùng credential qua biến môi trường, không ghi vào source/log.

## 10. Definition of Done cho #15

- [ ] Chỉ USER ACTIVE chưa có shop gửi được yêu cầu.
- [ ] Anonymous và ADMIN bị chặn đúng ở route; service vẫn tự kiểm tra eligibility.
- [ ] Owner lấy từ principal, không nhận từ form.
- [ ] Mỗi owner có tối đa một shop; pre-check và unique constraint đều hoạt động.
- [ ] Shop mới luôn `PENDING` và chưa thể thêm product/nhận order.
- [ ] Submit lặp/race không tạo dòng hoặc logo thứ hai.
- [ ] Lỗi upload/database/rollback không để asset rác.
- [ ] Trang status đọc dữ liệu thật của đúng owner.
- [ ] Không import Entity/Repository/Service nội bộ của Identity.
- [ ] Unit, repository, MVC/security và integration test liên quan chạy thành công.
- [ ] Full test/clean package chạy ở mức môi trường cho phép; blocker còn lại được ghi rõ.
- [ ] Không có secret, file build hoặc thay đổi ngoài phạm vi.
- [ ] PR liên kết #15, ghi `Relates #16/#29` nếu có dependency, có cách test và ảnh UI.
- [ ] Khang review phần Identity/Security/Cloudinary config nếu bị tác động.
- [ ] PR được review và merge vào `main` trước khi đóng issue.

## 11. Rủi ro và lưu ý

- Không xem `existsByOwnerId` là bảo đảm duy nhất; race condition phải được chặn bởi unique constraint.
- Không tạo một service riêng cho #15 bên cạnh service #16; cùng một thao tác POST chỉ có một use case chuẩn.
- Không bắt exception quá rộng để điều khiển luồng “có/không có shop”.
- Không tin trạng thái từ query parameter hoặc model mock.
- Không đóng #16/#29 chỉ vì #15 dùng một phần implementation của chúng.
- Không tự đưa event/notification vào #15 nếu issue event chưa được thống nhất contract.
- Không commit các file plan cá nhân nếu nhóm không muốn lưu plan trong lịch sử Git; file này phục vụ lưu trữ cá nhân theo yêu cầu.
