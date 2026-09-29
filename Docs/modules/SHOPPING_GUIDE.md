# Hướng dẫn module Shopping

[← Playbook chung](../DEVELOPMENT_PLAYBOOK.md)

## Phạm vi

- **Chủ sở hữu:** Thành viên 3.
- **Requirement:** [CART 01–07](../SRS.md#sec_1016), [FAV 01–03](../SRS.md#sec_1020).
- **Bảng:** `carts`, `cart_items`, `favorites`.
- **Package:** `com.senvia.doangiuaky.shopping`.
- **Template:** `templates/shopping`.

Module quản lý giỏ hàng hiện tại và danh sách sản phẩm yêu thích của người dùng.

## Phụ thuộc và public contract

- Dùng `identity.api` để lấy người dùng hiện tại.
- Dùng `merchant.api` để đọc trạng thái, giá, tồn kho, shop và thông tin hiển thị sản phẩm.
- Cung cấp qua `shopping.api` snapshot checkout theo shop và thao tác xóa các mục đã mua sau khi đặt hàng thành công.

Shopping không tự cập nhật tồn kho và không tạo Order.

## Thứ tự triển khai

1. Tạo migration/entity/repository cho cart, cart item và favorite.
2. Triển khai tạo hoặc lấy một cart duy nhất theo user.
3. Triển khai thêm sản phẩm, cộng dồn số lượng và kiểm tra tồn kho.
4. Triển khai cập nhật số lượng, xóa mục và nhóm hiển thị theo shop; subtotal luôn dùng giá sản phẩm hiện tại.
5. Cảnh báo sản phẩm ẩn, hết hàng hoặc vượt tồn kho trước checkout.
6. Triển khai thêm/xóa/xem favorite và chống bản ghi trùng.
7. Công bố checkout snapshot và thao tác xóa mục cho `ordering`.
8. Hoàn thiện template cart và favorite.

## Kiểm tra bắt buộc

- Chưa đăng nhập không được sửa cart/favorite.
- Một user có một cart; một product không tạo hai dòng trong cùng cart.
- Số lượng phải lớn hơn 0 và không vượt tồn kho hiện tại.
- Cart item không lưu giá; thay đổi giá sản phẩm phải phản ánh ngay khi đọc giỏ.
- Chủ shop không được thêm sản phẩm của chính shop mình vào giỏ.
- User không đọc hoặc sửa cart/favorite của người khác.
- Favorite trùng bị ngăn bởi service và unique constraint.
- Xóa mục sau checkout chỉ xảy ra khi ordering báo thành công.

## Bàn giao

- CART 01–07 và FAV 01–03 có test chính/ngoại lệ.
- Cart hiển thị subtotal và nhóm đúng theo shop.
- `shopping.api` không lộ Cart Entity hoặc Repository.
- Thành viên 4 review checkout contract; thành viên 2 review cách đọc product/shop.
