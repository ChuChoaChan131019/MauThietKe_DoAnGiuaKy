# Kế hoạch thực hiện Issue #29 — PROD 10: Quản lý ảnh bằng Cloudinary

## 1. Mục tiêu và phạm vi

Issue: [#29 — PROD 10: Quản lý ảnh bằng Cloudinary](https://github.com/ChuChoaChan131019/MauThietKe_DoAnGiuaKy/issues/29)

Yêu cầu chính:

- Ảnh thật được lưu trên Cloudinary.
- Database chỉ lưu URL và `public_id`.
- Hỗ trợ hiển thị, thay thế và xóa:
  - Logo shop.
  - Nhiều ảnh sản phẩm.
- Chỉ owner hợp lệ được thay hoặc xóa asset.
- Không lộ Cloudinary secret hoặc `public_id` nội bộ cho client.
- Có xử lý bù khi Cloudinary hoặc database thất bại.
- Có test cho storage và service.

Các bảng thuộc phạm vi module `merchant`:

- `shops`.
- `products`.
- `product_images`.

Không cần tạo public API riêng cho thao tác quản lý ảnh. `merchant.api` chỉ nên trả URL cần hiển thị; không công bố `public_id`, Entity, Repository hoặc storage service.

## 2. Trạng thái dự án hiện tại

Phần dùng chung đã có:

- Dependency `cloudinary-http44` trong `pom.xml`.
- `CloudinaryConfiguration` và `CloudinaryProperties` trong `common.config`.
- Secret được đọc từ các biến môi trường:
  - `CLOUDINARY_CLOUD_NAME`.
  - `CLOUDINARY_API_KEY`.
  - `CLOUDINARY_API_SECRET`.
- Module `identity` đã có `CloudinaryAvatarStorage`, có thể tham khảo cách validate file và gọi Cloudinary.

Phần `merchant` hiện còn là scaffold/mock:

- Chưa có Entity `Shop`, `Product`, `ProductImage`.
- Chưa có migration cho các bảng Merchant.
- Chưa có Repository và Service nghiệp vụ.
- Các form ảnh chưa kết nối backend.
- `ProductsController` vẫn dùng danh sách sản phẩm mock.
- `SellerController` mới trả về template tĩnh.

Vì vậy, issue #29 phụ thuộc thực tế vào:

1. Mapping/migration `shops` có `logo_url`, `logo_public_id`.
2. Mapping `products`, `product_images`.
3. Shop request/update service.
4. Product create/update service và kiểm tra ownership.

Nên merge hoặc rebase các phần SHOP 02, SHOP 09, PROD 03 và PROD 04 trước. Nếu phát triển song song, cần thống nhất trước cấu trúc Entity và chữ ký service để tránh conflict.

## 3. Thiết kế đề xuất

Đặt toàn bộ logic đặc thù trong module `merchant`, không chuyển business rule vào `common`:

```text
merchant/service/image/
├── MerchantImageStorage.java
├── CloudinaryMerchantImageStorage.java
├── MerchantImageAsset.java
└── MerchantImageStorageException.java
```

Contract nội bộ dự kiến:

```java
MerchantImageAsset uploadShopLogo(Long ownerId, MultipartFile file);

MerchantImageAsset uploadProductImage(Long ownerId, MultipartFile file);

void delete(String publicId);
```

Cloudinary folder/public ID do backend sinh, ví dụ:

```text
senvia/merchant/shops/{ownerId}/{uuid}
senvia/merchant/products/{ownerId}/{uuid}
```

Nguyên tắc bắt buộc:

- Không nhận `public_id` từ request.
- Request xóa ảnh sản phẩm chỉ gửi `productImageId`.
- Service tải `ProductImage → Product → Shop`, kiểm tra owner rồi mới lấy `publicId` từ database.
- Logo phải được tìm theo shop và owner tại backend; không tin shop/owner ID từ form.
- Catalog DTO chỉ trả `imageUrl`.
- Cloudinary trả `not found` khi xóa được xem là thành công để hỗ trợ idempotency.
- Validate MIME JPEG/PNG, dung lượng và nội dung ảnh thật; không chỉ tin extension hoặc `Content-Type`.

## 4. Trình tự triển khai

### Bước 1 — Chốt dependency và schema

Xác nhận các Entity nền tảng đã có:

- `Shop.logoUrl`.
- `Shop.logoPublicId`.
- `ProductImage.imageUrl`.
- `ProductImage.publicId`.
- `ProductImage.displayOrder`.
- Quan hệ `Product 1–N ProductImage`.
- Repository có query theo asset ID, product ID và shop owner ID.

Nếu migration chưa tồn tại, bổ sung riêng cho H2 và PostgreSQL theo chuẩn versioned migration. Không sửa migration đã được dùng hoặc merge.

### Bước 2 — Xây storage adapter

Tạo `CloudinaryMerchantImageStorage` với các trách nhiệm:

1. Kiểm tra Cloudinary đã được cấu hình.
2. Validate file rỗng, file quá 2 MB, MIME và nội dung thật.
3. Upload với `resource_type=image`, định dạng cho phép và public ID ngẫu nhiên.
4. Kiểm tra response bắt buộc có `secure_url` và `public_id`.
5. Xóa asset theo `public_id`.
6. Chuyển lỗi Cloudinary/IO thành exception nghiệp vụ không chứa secret.

Không cần thêm dependency hoặc sửa `pom.xml`; sử dụng bean Cloudinary chung hiện có.

### Bước 3 — Tích hợp logo shop

Trong shop create/update service:

1. Kiểm tra actor và shop ownership trước khi upload.
2. Upload logo mới.
3. Gán URL và `public_id`, sau đó gọi `saveAndFlush`.
4. Nếu lưu database hoặc transaction thất bại, xóa logo mới.
5. Nếu transaction commit thành công, mới xóa logo cũ.
6. Logo cũ chỉ được lấy từ entity trong database.

Áp dụng cho đăng ký shop, gửi lại yêu cầu và cập nhật shop APPROVED, nhưng không triển khai lại các business rule thuộc issue SHOP khác.

### Bước 4 — Tích hợp ảnh sản phẩm

Khi tạo sản phẩm:

1. Validate toàn bộ file trước khi upload.
2. Upload lần lượt và lưu danh sách asset đã upload.
3. Tạo các `ProductImage` với thứ tự hiển thị ổn định.
4. Nếu upload ảnh thứ N hoặc lưu database thất bại, xóa toàn bộ asset đã upload trong request đó.

Khi thêm, thay hoặc xóa ảnh:

- Kiểm tra product thuộc shop của principal.
- Không nhận `public_id` từ browser.
- Không cho xóa ảnh cuối cùng vì sản phẩm phải có ít nhất một ảnh.
- Thay ảnh theo thứ tự: upload ảnh mới → flush database → sau commit xóa ảnh cũ.
- Xóa ảnh theo thứ tự: xóa liên kết database trong transaction → sau commit xóa asset Cloudinary.

Cloudinary và database không thể tham gia cùng một transaction. Thiết kế nên ưu tiên database không trỏ tới asset đã bị xóa. Nếu cleanup asset cũ thất bại, ghi log đã loại secret và báo tình trạng cleanup; không rollback dữ liệu đã commit.

### Bước 5 — Nối controller và view

Sau khi các service SHOP/PROD nền tảng đã có:

- Shop form dùng `multipart/form-data` và nhận `MultipartFile logo`.
- Product form nhận `List<MultipartFile>` hoặc `MultipartFile[]`.
- Form sửa gửi `removedImageIds`, không gửi `public_id`.
- Render logo và ảnh bằng URL từ DTO.
- Hiển thị lỗi upload tại form và giữ lại dữ liệu text hợp lệ.
- Bảo đảm có CSRF, authentication và kiểm tra ownership tại service.
- Controller không gọi Repository hoặc Cloudinary trực tiếp.

### Bước 6 — Hoàn thiện xử lý lỗi và logging

- Exception gửi ra UI không chứa Cloudinary response thô, API key, secret hoặc token.
- Log chỉ ghi loại thao tác, ID nội bộ cần thiết và nguyên nhân đã được làm sạch.
- Không log byte ảnh hoặc toàn bộ request multipart.
- Xóa asset không tồn tại được xử lý idempotent.
- Cleanup failure sau commit phải được phân biệt với lỗi làm thất bại nghiệp vụ chính.

## 5. Kế hoạch kiểm thử

### Storage test

- Upload thành công trả đúng URL và public ID.
- Thiếu cấu hình Cloudinary.
- File rỗng.
- File quá dung lượng.
- MIME không hỗ trợ.
- Tệp giả ảnh hoặc MIME không khớp nội dung.
- Cloudinary trả response thiếu `secure_url` hoặc `public_id`.
- Upload ném lỗi IO/Cloudinary.
- Delete trả `ok`.
- Delete trả `not found`.
- Delete thất bại.

### Service test

- Lưu đúng URL, public ID và display order.
- Owner hợp lệ thay/xóa ảnh thành công.
- Actor của shop khác bị chặn trước khi gọi storage.
- Database lỗi sau upload sẽ xóa asset mới.
- Upload nhiều ảnh lỗi giữa chừng sẽ cleanup các ảnh đã upload trước đó.
- Rollback update xóa ảnh mới và giữ tham chiếu ảnh cũ.
- Commit update mới xóa ảnh cũ.
- Không cho xóa ảnh cuối cùng của sản phẩm.
- `public_id` giả từ client không thể ảnh hưởng asset khác.

### MVC và integration test

- Multipart request thành công.
- Validation multipart trả đúng lỗi form.
- Guest, Admin hoặc owner khác bị chặn.
- Transaction rollback đúng với H2.
- URL ảnh được đưa vào model/view đúng cách.
- CSRF được kiểm tra trên request thay đổi dữ liệu.

## 6. Phạm vi file dự kiến

Tạo mới:

```text
src/main/java/com/senvia/doangiuaky/merchant/service/image/*
src/test/java/com/senvia/doangiuaky/merchant/service/image/*
src/test/java/com/senvia/doangiuaky/merchant/service/*Image*Test.java
```

Sửa sau khi dependency đã merge:

```text
src/main/java/com/senvia/doangiuaky/merchant/entity/Shop.java
src/main/java/com/senvia/doangiuaky/merchant/entity/ProductImage.java
src/main/java/com/senvia/doangiuaky/merchant/repository/ProductImageRepository.java
src/main/java/com/senvia/doangiuaky/merchant/service/ShopService.java
src/main/java/com/senvia/doangiuaky/merchant/service/ProductService.java
src/main/java/com/senvia/doangiuaky/merchant/controller/...
src/main/resources/templates/merchant/register.html
src/main/resources/templates/merchant/shop-info.html
src/main/resources/templates/merchant/product-add.html
src/main/resources/templates/merchant/product-edit.html
```

Có điều kiện:

```text
src/main/resources/db/migration/h2/V...__merchant_*.sql
src/main/resources/db/migration/postgresql/V...__merchant_*.sql
src/main/resources/application.properties
```

Không dự kiến sửa:

- `pom.xml`.
- `common.config.CloudinaryConfiguration`.
- Public API của module khác.

## 7. Điểm cần chốt trước khi code

UI hiện cho tải tối đa 5 ảnh, mỗi ảnh tối đa 2 MB, nhưng cấu hình đang là:

```properties
spring.servlet.multipart.max-file-size=2MB
spring.servlet.multipart.max-request-size=3MB
```

Giới hạn request 3 MB không đủ cho 5 ảnh. Đề xuất:

```properties
spring.servlet.multipart.max-file-size=2MB
spring.servlet.multipart.max-request-size=11MB
```

Thay đổi `application.properties` là thay đổi config dùng chung nên cần Khang review.

## 8. Definition of Done

- [ ] Không lộ secret hoặc `public_id` qua form/DTO công khai.
- [ ] Ownership được kiểm tra ở backend trước mọi thao tác asset.
- [ ] Upload/database failure có cleanup phù hợp.
- [ ] Logo shop hiển thị, thêm và thay đúng.
- [ ] Ảnh sản phẩm hiển thị, thêm, thay, xóa và sắp thứ tự đúng.
- [ ] Không phá invariant sản phẩm có ít nhất một ảnh.
- [ ] Storage test bao phủ thành công, validation và lỗi Cloudinary.
- [ ] Service test bao phủ ownership, rollback và cleanup.
- [ ] MVC/integration test liên quan chạy thành công.
- [ ] Không có secret hoặc file sinh tự động trong diff.
- [ ] `git diff --check` thành công.
- [ ] `.\mvnw.cmd test` thành công.
- [ ] `.\mvnw.cmd clean package` thành công.
- [ ] PR liên kết issue `#29`, ghi cách test và mô tả cơ chế bù.
- [ ] Khang review mọi thay đổi ở common config hoặc `application.properties`.

## 9. Thứ tự commit gợi ý

```text
feat(merchant): add cloudinary image storage adapter
test(merchant): cover cloudinary storage validation and failures
feat(merchant): integrate shop logo lifecycle
feat(merchant): integrate product image lifecycle
test(merchant): cover image ownership and compensation
feat(merchant): connect image forms and rendering
docs(merchant): document issue 29 test and compensation behavior
```

## 10. Baseline tại thời điểm lập kế hoạch

- Working tree không có thay đổi source.
- Lệnh `.\mvnw.cmd test` thành công.
- Kết quả: 18 test, 0 failure, 0 error.
- Issue #29 đang ở trạng thái In Progress trên GitHub Project.

## 11. Tiến độ triển khai hiện tại

Đã hoàn thành trong workspace, chưa commit/push:

- `MerchantImageStorage` contract.
- `MerchantImageAsset` và `MerchantImageStorageException`.
- `CloudinaryMerchantImageStorage` với:
  - Upload logo shop và ảnh sản phẩm theo folder riêng.
  - Sinh public ID phía backend.
  - Validate JPEG/PNG và kiểm tra nội dung ảnh thật.
  - Giới hạn file 2 MB.
  - Xóa idempotent khi Cloudinary trả `not found`.
  - Không trả Cloudinary credential trong exception.
- 11 unit test cho upload/delete, validation, owner ID, response lỗi và Cloudinary failure.

Chưa thể nối lifecycle shop/product, migration, controller và view vì branch hiện tại chưa có các contract nền tảng `Shop`, `Product`, `ProductImage` và service Merchant. Các phần này cần triển khai sau khi các issue dependency được merge hoặc sau khi thống nhất contract với owner module.
