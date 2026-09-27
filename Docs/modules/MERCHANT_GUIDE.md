# Hướng dẫn module Merchant

[← Playbook chung](../DEVELOPMENT_PLAYBOOK.md)

## Phạm vi

- **Chủ sở hữu:** Thành viên 2.
- **Requirement:** [SHOP 01–09](../SRS.md#sec_1014), [PROD 01–10](../SRS.md#sec_1015).
- **Bảng:** `shops`, `categories`, `products`, `product_images`.
- **Package:** `com.senvia.doangiuaky.merchant`.
- **Template:** `templates/merchant`.

Module quản lý vòng đời gian hàng, danh mục, sản phẩm, tồn kho và tích hợp Cloudinary.

## Phụ thuộc và public contract

- Dùng `identity.api` để kiểm tra user/admin và chủ sở hữu.
- Cung cấp qua `merchant.api`: thông tin shop, product summary, giá/tồn kho/trạng thái, kiểm tra khả năng bán và thao tác tồn kho cần cho checkout.
- Phát event khi yêu cầu mở shop được gửi hoặc kết quả xét duyệt thay đổi.

Không công bố Cloudinary secret, Entity hoặc Repository.

## Thứ tự triển khai

1. Tạo migration và entity cho shop/category/product/product image.
2. Triển khai State Pattern và unit test chuyển trạng thái shop.
3. Làm luồng gửi, xem, sửa và gửi lại yêu cầu mở shop.
4. Làm luồng admin duyệt, từ chối có lý do, khóa và mở khóa.
5. Làm CRUD/ẩn danh mục cho admin.
6. Làm CRUD/ẩn sản phẩm, kiểm tra ownership và shop APPROVED.
7. Tích hợp upload/xóa ảnh Cloudinary và rollback hợp lý khi upload/lưu lỗi.
8. Làm danh sách, chi tiết, tìm kiếm, lọc và phân trang sản phẩm.
9. Công bố contract/event để `shopping`, `ordering`, `engagement` sử dụng.

## Kiểm tra bắt buộc

- Một user có tối đa một shop.
- Chỉ Admin chuyển trạng thái xét duyệt; từ chối bắt buộc có lý do.
- Shop không APPROVED không được đăng sản phẩm hoặc nhận đơn mới.
- Chủ shop không sửa sản phẩm của shop khác.
- Giá phải lớn hơn 0; tồn kho không âm; sản phẩm có ít nhất một ảnh.
- Tìm kiếm, lọc và phân trang không trả sản phẩm bị ẩn ngoài trường hợp quản trị.
- Thao tác trừ/hoàn kho có contract rõ và không cập nhật sai sản phẩm.

## Bàn giao

- SHOP 01–09 và PROD 01–10 có test chính/phân quyền.
- State Pattern thể hiện hành vi khác nhau theo trạng thái shop.
- Contract product/shop đủ cho cart và checkout mà không lộ Repository.
- Thành viên 4 review contract tồn kho; thành viên 5 review event thông báo.
