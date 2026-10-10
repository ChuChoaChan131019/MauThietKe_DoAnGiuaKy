# Kế hoạch thực hiện Issue #16 — SHOP 02: Nhập thông tin yêu cầu gian hàng

## 1. Mục tiêu và phạm vi

Issue: [#16 — SHOP 02: Nhập thông tin yêu cầu gian hàng](https://github.com/ChuChoaChan131019/MauThietKe_DoAnGiuaKy/issues/16)

Requirement chính:

- USER nhập tên gian hàng, mô tả, logo, số điện thoại và địa chỉ.
- Dữ liệu được validate ở backend và hiển thị lỗi đúng trường trên giao diện.
- Logo được upload lên Cloudinary; database chỉ lưu `logo_url` và `logo_public_id`.
- Yêu cầu được lưu vào bảng `shops` với trạng thái `PENDING` đã có từ SHOP 03.
- Upload lỗi thì không lưu shop; lưu database hoặc transaction lỗi thì phải xóa asset vừa upload để không tạo dữ liệu rác.
- Khách và ADMIN không được gửi form; service không tin owner ID từ request.

Module và dữ liệu sở hữu:

- Module: `merchant`.
- Bảng: `shops`.
- View: `templates/merchant/register.html` và trạng thái sau gửi tại `templates/merchant/shop-status.html`.
- Dependency hợp lệ: `identity.api` và cấu hình kỹ thuật Cloudinary trong `common.config`.

Ngoài phạm vi issue #16:

- Phát `ShopRequestedEvent` và tạo notification cho Admin: #15/#70.
- Sửa và gửi lại shop `REJECTED`: #17.
- Admin xem, duyệt hoặc từ chối: #13, #19, #20.
- Cập nhật shop `APPROVED`, thay logo cũ và xóa asset cũ sau commit: #22/#29.
- Ảnh sản phẩm: #24, #25 và phần còn lại của #29.

## 2. Nguồn yêu cầu và quy tắc nghiệp vụ

Nguồn chuẩn đã đối chiếu:

- `Docs/SRS.md`: SHOP 01–03, UC 02, quy tắc chuyển `Không có → PENDING`, schema `shops`.
- `Docs/ARCHITECTURE.md`: controller gọi service; transaction và ownership nằm ở service; module khác chỉ dùng public API.
- `Docs/PROJECT_STRUCTURE_GUIDE.md`: DTO/controller/service/repository/template/test đặt trong module `merchant`.
- `Docs/MODULE_OWNERSHIP.md` và `Docs/modules/MERCHANT_GUIDE.md`: Merchant sở hữu shop, logo và lifecycle; chỉ dùng `identity.api` khi cần dữ liệu tài khoản.
- `Docs/PHAN_CONG_CONG_VIEC.md`: mỗi USER tối đa một shop; phải test Cloudinary/database failure.
- `Docs/DEVELOPMENT_PLAYBOOK.md`, `Docs/GIT_WORKFLOW.md`, `Docs/CONTRIBUTING.md`: triển khai vertical slice, test UI/quyền/rollback và PR vào `main`.

Quy tắc cần giữ:

1. Owner lấy từ `IdentityPrincipal`, tuyệt đối không nhận `ownerId` từ form.
2. Chỉ tài khoản `USER` đang `ACTIVE` được gửi yêu cầu.
3. Mỗi user tối đa một dòng trong `shops`; kiểm tra ở service và giữ UNIQUE `shops.owner_id` làm hàng rào chống race condition.
4. Shop mới luôn `PENDING`; không cho form quyết định status.
5. Form không nhận hoặc trả `logo_public_id`; đây là metadata nội bộ.
6. Tên, mô tả, điện thoại, địa chỉ phải trim trước khi lưu.
7. Logo bắt buộc, tối đa 2 MB, chỉ JPEG/PNG và phải là dữ liệu ảnh thật.
8. Chỉ lưu shop sau khi upload logo thành công.
9. Nếu lưu/commit database thất bại, cố gắng xóa asset vừa upload; lỗi cleanup không được che mất lỗi nghiệp vụ gốc hoặc làm lộ credential.
10. Sau thành công dùng Post/Redirect/Get để tránh submit lặp khi refresh.

## 3. Hiện trạng dự án

### 3.1 Phần đã có và có thể tái sử dụng

- Migration H2/PostgreSQL đã tạo bảng `shops` với đầy đủ cột của #16 và UNIQUE `owner_id`.
- `Shop.createPending(...)` luôn tạo shop `PENDING`.
- State Pattern đã bảo đảm PENDING không được thêm sản phẩm hoặc nhận đơn.
- `SecurityConfig` đã giới hạn `/merchant/**` cho role USER.
- `IdentityPrincipal` cung cấp `userId`; `IdentityApi` cung cấp user/role/account status công khai.
- Template `merchant/register.html` đã có bố cục form nhưng đang hoàn toàn tĩnh.
- Template `merchant/shop-status.html` đã có giao diện PENDING nhưng đang nhận status từ query parameter mock.
- Cấu hình Cloudinary, dependency Cloudinary và giới hạn multipart đã có; không cần sửa config.
- Workspace có adapter `MerchantImageStorage`/`CloudinaryMerchantImageStorage` và 11 unit test của #29, nhưng các file này đang untracked, chưa phải baseline Git đáng tin cậy.

### 3.2 Khoảng trống cần triển khai

- `ShopRepository` chưa có `findByOwnerId`/`existsByOwnerId`.
- Chưa có form DTO và validation cho SHOP 02.
- Chưa có service submit yêu cầu và xử lý bù Cloudinary ↔ database.
- `SellerController` chỉ trả template tĩnh; chưa có POST `/merchant/register`.
- Form chưa có `th:object`, `th:field`, `action`, `method`, `enctype`, CSRF và lỗi validation.
- Form mock có trường email và checkbox điều khoản không thuộc schema/acceptance SHOP 02.
- Trang trạng thái cho phép giả status qua query parameter và chưa đọc shop theo owner.
- Chưa có test service/MVC cho luồng thành công, validation, duplicate, quyền và rollback asset.

### 3.3 Dependency và điểm giao với issue khác

- #64 và #66 đã đóng, nên dependency Security của #15 không còn chặn kỹ thuật.
- #15 vẫn OPEN và sở hữu quy tắc “USER chưa có shop, chặn duplicate/trái quyền”. #16 bắt buộc lưu database nên không thể bỏ các guard này. PR #16 phải ghi rõ phần overlap; không tạo thêm service cạnh tranh sau này.
- Khuyến nghị trước khi code #16: đưa storage adapter đang untracked của #29 vào một commit/PR nền tảng và chỉ ghi `Relates #29`, chưa đóng #29. Nếu nhóm muốn một PR vertical slice duy nhất, có thể đưa đúng các file storage cần cho logo vào PR #16 và ghi rõ dependency #29.
- Không phát notification trong #16. #15 sẽ bổ sung `ShopRequestedEvent` có `eventId`; #70 lắng nghe sau commit.

## 4. Thiết kế triển khai

### 4.1 DTO và validation

Tạo `merchant.dto.ShopRegistrationForm` gồm:

| Trường | Validation dự kiến | Ghi chú |
| --- | --- | --- |
| `shopName` | `@NotBlank`, `@Size(max = 150)` | Trim trước khi lưu |
| `description` | `@NotBlank`, giới hạn hợp lý (đề xuất 2000) | SRS/UC 02 xem đây là dữ liệu yêu cầu |
| `phone` | `@NotBlank`, `@Size(max = 20)`, pattern số liên hệ | Cho phép `+`, số, khoảng trắng, `-`, `(`, `)`; không dùng regex quá chặt theo một nhà mạng |
| `address` | `@NotBlank`, giới hạn hợp lý (đề xuất 2000) | Trim trước khi lưu |
| `logo` | Bắt buộc tại service/storage | Không chứa URL hoặc `public_id` từ client |

Không lưu email trong `shops`; bỏ input email khỏi form hoặc chỉ hiển thị thông tin tài khoản dạng readonly khi có contract phù hợp. Không thêm checkbox điều khoản vào DTO nếu chưa có requirement lưu/kiểm chứng điều khoản.

### 4.2 Repository

Bổ sung vào `ShopRepository`:

- `Optional<Shop> findByOwnerId(Long ownerId)`.
- `boolean existsByOwnerId(Long ownerId)`.

UNIQUE database vẫn là nguồn bảo đảm cuối cùng khi hai request đồng thời cùng vượt qua pre-check.

### 4.3 Service đăng ký shop

Tạo `merchant.service.ShopRegistrationService` và exception nghiệp vụ có thông báo an toàn.

Luồng `submit(ownerId, form)`:

1. Kiểm tra owner tồn tại, role USER và account ACTIVE qua `IdentityApi.findUser` hoặc public contract tương đương.
2. Kiểm tra `existsByOwnerId`; nếu đã có shop thì từ chối trước khi upload.
3. Upload logo bằng `MerchantImageStorage.uploadShopLogo(ownerId, logo)`.
4. Tạo `Shop.createPending(...)` từ dữ liệu đã trim và metadata Cloudinary.
5. `saveAndFlush` để lỗi UNIQUE/constraint xuất hiện trong transaction hiện tại.
6. Nếu save/flush lỗi, xóa logo vừa upload rồi ném exception an toàn; không log secret hoặc response Cloudinary thô.
7. Đăng ký transaction synchronization để xóa logo mới nếu transaction rollback sau `saveAndFlush` nhưng trước commit.
8. Trả kết quả tối thiểu (ID/status) hoặc để controller redirect; không trả Entity ra ngoài module.

Service cũng cung cấp query nội bộ tối thiểu cho controller:

- `findStatusByOwnerId(ownerId)` hoặc DTO trạng thái nhỏ.
- `hasShop(ownerId)`/`findByOwnerId(ownerId)` thông qua service, không để controller gọi repository.

Xử lý duplicate race:

- Pre-check cho UX rõ ràng.
- Bắt `DataIntegrityViolationException` do UNIQUE `owner_id`, cleanup logo mới, sau đó trả lỗi “Bạn đã có yêu cầu/gian hàng”.

### 4.4 Controller và route

Tạo controller riêng, ví dụ `ShopRegistrationController`, thay vì tiếp tục nhồi nghiệp vụ vào `SellerController` mock.

`GET /merchant/register`:

- Lấy `ownerId` từ `@AuthenticationPrincipal IdentityPrincipal`.
- Nếu chưa có shop: tạo `shopRegistrationForm` và render `merchant/register`.
- Nếu đã có PENDING/REJECTED/LOCKED: redirect `/merchant/shop-status`.
- Nếu đã APPROVED: redirect `/merchant/dashboard`.

`POST /merchant/register`:

- Nhận `@Valid @ModelAttribute`, `BindingResult`; multipart logo nằm trong form hoặc request param thống nhất.
- Nếu lỗi field: render lại form, giữ dữ liệu text và hiển thị lỗi đúng trường; không upload.
- Nếu logo/storage lỗi: render lại form, thêm lỗi cho `logo`; không lưu shop.
- Nếu duplicate do request lặp/race: redirect trang trạng thái hoặc hiển thị thông báo rõ ràng; không tạo dòng/asset thứ hai.
- Thành công: redirect `/merchant/shop-status` và flash message.

`GET /merchant/shop-status`:

- Không nhận status từ query parameter.
- Đọc status thật theo owner qua service.
- Nếu chưa có shop: redirect `/merchant/register`.
- Model dùng tên riêng như `ownedShopStatus` để tránh `MockModelInterceptor` hiện tại ghi đè thuộc tính `shopStatus`.

Loại bỏ các mapping trùng `/merchant/register` và `/merchant/shop-status` khỏi `SellerController` sau khi controller thật được tạo.

### 4.5 View

Cập nhật `templates/merchant/register.html`:

- `th:action="@{/merchant/register}"`, `method="post"`, `enctype="multipart/form-data"`.
- `th:object="${shopRegistrationForm}"`, `th:field` cho các trường text và file.
- Tên `name`/field khớp DTO; CSRF để Thymeleaf/Spring Security sinh tự động.
- Hiển thị `th:errors` ngay dưới từng trường và lỗi logo/storage rõ ràng.
- Giữ lại dữ liệu text sau validation/upload failure; trình duyệt bắt buộc người dùng chọn lại file vì lý do bảo mật.
- `accept="image/jpeg,image/png"`; ghi rõ giới hạn 2 MB.
- Bỏ dữ liệu/mock banner và trường không thuộc requirement nếu không có backend tương ứng.

Cập nhật `templates/merchant/shop-status.html`:

- Render theo status thật từ service (`ownedShopStatus`).
- PENDING hiển thị xác nhận đã gửi và không cho submit lại.
- Không triển khai chỉnh sửa REJECTED trong #16; nút đó thuộc #17.

Không sửa fragment/common trong #16 nếu chưa cần. Header mock có thể còn hiển thị link đăng ký, nhưng backend GET sẽ redirect đúng và không tạo duplicate. Việc thay mock model bằng shop status toàn cục nên làm ở #15 hoặc một task integration có Khang review.

### 4.6 Migration, config và public contract

- Không tạo migration mới: schema #14 đã đủ cột/ràng buộc.
- Không sửa migration cũ đã merge.
- Không sửa `pom.xml` hoặc `application.properties`: Cloudinary và multipart đã cấu hình.
- Không cần public API mới của Merchant cho #16.
- Chỉ dùng `identity.api`; không import `User`, `UserRepository`, `IdentityService` hoặc `IdentityPrincipal` vào service Merchant. `IdentityPrincipal` chỉ được dùng tại tầng controller để lấy user ID.

## 5. Trình tự thực hiện

### Bước 0 — Chuẩn hóa baseline Git

1. Merge/đóng PR #86 trước hoặc tạo branch #16 trực tiếp từ `origin/main` mới nhất.
2. Không mang các plan/file Cloudinary untracked vào commit ngoài ý muốn.
3. Chốt cách đưa adapter #29 vào baseline: prerequisite PR hoặc cùng PR #16 có ghi `Relates #29`.
4. Branch đề xuất: `feature/merchant/16-shop-request-form`.

### Bước 1 — Repository và domain tối thiểu

1. Thêm query theo `ownerId`.
2. Bổ sung getter cần thiết cho service/test; không thêm setter status công khai.
3. Mở rộng repository test cho find/exists theo owner và UNIQUE owner.

### Bước 2 — Form và service

1. Tạo form DTO/validation.
2. Tạo exception/result nội bộ tối thiểu.
3. Tạo service submit, kiểm tra Identity/duplicate và xử lý bù Cloudinary.
4. Viết unit test service trước khi nối controller.

### Bước 3 — Controller và view

1. Tạo controller GET/POST và route status thật.
2. Gỡ route mock trùng trong `SellerController`.
3. Bind form Thymeleaf, multipart, CSRF và lỗi từng trường.
4. Nối trang status vào dữ liệu thật.

### Bước 4 — Test và kiểm thử thủ công

1. Chạy unit/repository/MVC test liên quan.
2. Chạy full test suite.
3. Test thủ công H2 và PostgreSQL/Supabase với USER/ADMIN/anonymous.
4. Kiểm tra Cloudinary dashboard không có asset rác sau lỗi DB/duplicate.

## 6. Kế hoạch kiểm thử

### 6.1 DTO/MVC validation

- Tên trống hoặc dài hơn 150 bị từ chối.
- Mô tả trống/quá dài bị từ chối.
- Điện thoại trống, sai định dạng hoặc dài hơn 20 bị từ chối.
- Địa chỉ trống/quá dài bị từ chối.
- Logo trống, file rỗng, quá 2 MB, MIME sai hoặc nội dung giả ảnh bị từ chối.
- Khi lỗi, text người dùng đã nhập vẫn được render; `public_id` không xuất hiện trong HTML.

### 6.2 Service test

- ACTIVE USER chưa có shop: upload logo, save đúng metadata, status PENDING.
- User không tồn tại, không ACTIVE hoặc role ADMIN: từ chối trước upload/save.
- Owner đã có shop: từ chối trước upload.
- Cloudinary upload lỗi: repository không được gọi.
- Database save/flush lỗi: gọi delete đúng `public_id` vừa upload.
- Transaction rollback sau flush: asset mới được cleanup.
- Cleanup lỗi không làm lộ secret và không che lỗi database gốc.
- Dữ liệu được trim; owner ID lấy từ tham số tin cậy của controller, không từ form.

### 6.3 Repository/integration test

- `findByOwnerId` và `existsByOwnerId` trả đúng shop.
- UNIQUE owner vẫn chặn hai shop cho cùng user.
- Persist logo URL/public ID và PENDING đúng trên H2.
- Smoke test PostgreSQL/Supabase để bắt khác biệt dialect/binding mà H2 không phát hiện.

### 6.4 Security/MVC test

- Anonymous GET/POST `/merchant/register` bị chuyển tới login.
- ADMIN GET/POST bị 403.
- USER GET chưa có shop nhận form 200.
- Form sai trả lại view và không gọi service submit.
- Storage/service lỗi hiển thị lỗi an toàn trên form.
- Submit thành công redirect `/merchant/shop-status`.
- USER đã có PENDING không thể submit lần hai.
- Trang status đọc DB, không thể giả trạng thái bằng query parameter.
- POST thiếu/sai CSRF bị từ chối.

### 6.5 Manual test

1. Đăng nhập USER mới, mở `/merchant/register`.
2. Thử bỏ trống/sai phone/sai file và kiểm tra lỗi cạnh trường.
3. Gửi JPEG/PNG hợp lệ, kiểm tra redirect và trạng thái PENDING.
4. Kiểm tra dòng `shops` lưu đúng URL/public ID, không lưu file nhị phân.
5. Refresh/back/submit lại và xác nhận không có shop hoặc asset trùng.
6. Đăng nhập ADMIN và thử truy cập route để xác nhận 403.
7. Mô phỏng lỗi DB sau upload trong test và kiểm tra asset đã được cleanup.

## 7. Phạm vi file dự kiến

File mới:

- `src/main/java/com/senvia/doangiuaky/merchant/dto/ShopRegistrationForm.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/ShopRegistrationService.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/ShopRegistrationException.java`
- `src/main/java/com/senvia/doangiuaky/merchant/controller/ShopRegistrationController.java`
- `src/test/java/com/senvia/doangiuaky/merchant/service/ShopRegistrationServiceTest.java`
- `src/test/java/com/senvia/doangiuaky/merchant/controller/ShopRegistrationControllerTest.java`

File sửa:

- `src/main/java/com/senvia/doangiuaky/merchant/entity/Shop.java`
- `src/main/java/com/senvia/doangiuaky/merchant/repository/ShopRepository.java`
- `src/main/java/com/senvia/doangiuaky/merchant/controller/SellerController.java`
- `src/main/resources/templates/merchant/register.html`
- `src/main/resources/templates/merchant/shop-status.html`
- `src/test/java/com/senvia/doangiuaky/merchant/repository/ShopRepositoryTest.java`

File dependency #29 nếu chưa merge trước:

- `src/main/java/com/senvia/doangiuaky/merchant/service/image/MerchantImageStorage.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/image/MerchantImageAsset.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/image/MerchantImageStorageException.java`
- `src/main/java/com/senvia/doangiuaky/merchant/service/image/CloudinaryMerchantImageStorage.java`
- `src/test/java/com/senvia/doangiuaky/merchant/service/image/CloudinaryMerchantImageStorageTest.java`

Không dự kiến sửa:

- Migration H2/PostgreSQL đã merge.
- `pom.xml`, `application.properties` và Cloudinary secret/config.
- `templates/fragments/*`, `common/*`, module Identity nội bộ.
- Admin shop request mock của Engagement.

## 8. Lệnh xác minh

```powershell
.\mvnw.cmd test "-Dtest=ShopRegistrationServiceTest,ShopRegistrationControllerTest,ShopRepositoryTest,CloudinaryMerchantImageStorageTest"
.\mvnw.cmd test
.\mvnw.cmd clean package
git diff --check
git status --short
```

## 9. Definition of Done cho #16

- [ ] Form có đủ tên, mô tả, logo, điện thoại, địa chỉ và lỗi validation rõ ràng.
- [ ] USER hợp lệ tạo đúng một shop PENDING; khách/ADMIN/owner không hợp lệ bị chặn ở backend.
- [ ] Logo hợp lệ được upload và chỉ URL/public ID được lưu trong database.
- [ ] Upload lỗi không lưu shop; database/transaction lỗi không để asset rác.
- [ ] Refresh hoặc submit lặp không tạo shop/logo thứ hai.
- [ ] Trang trạng thái sau gửi đọc status thật từ database.
- [ ] Không lộ secret, Cloudinary response thô hoặc `public_id` trên form/DTO công khai.
- [ ] Test service, repository, MVC/security và full suite chạy thành công.
- [ ] Test thủ công trên PostgreSQL/Supabase và Cloudinary thật bằng dữ liệu test.
- [ ] PR liên kết #16, ghi `Relates #15/#29` nếu có overlap, có cách test và ảnh UI.
- [ ] PR nhắm `main` theo `Docs/GIT_WORKFLOW.md`; Khang review phần Identity/public contract/Cloudinary config nếu bị tác động.

## 10. Rủi ro và lưu ý khi triển khai

- Không sửa migration #14 đã chạy; mọi thay đổi schema tương lai phải là migration mới cho cả H2/PostgreSQL.
- Không tin thuộc tính `shopStatus` từ `MockModelInterceptor` hoặc query parameter; dùng model riêng lấy từ database.
- Không dùng `existsByOwnerId` như bảo đảm duy nhất; UNIQUE database mới chặn được race.
- Không xóa asset cũ trong #16 vì đây là create mới; replace/delete logo thuộc #17/#22/#29.
- Không đánh dấu #29 Done sau #16: ảnh sản phẩm và lifecycle thay/xóa vẫn chưa hoàn tất.
- Không đóng #15 tự động nếu PR chỉ ghi `Relates #15`; chỉ đóng khi toàn bộ acceptance SHOP 01 đã được test và review.
