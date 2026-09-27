# Thiết kế cơ sở dữ liệu

## 1. Tổng quan

Hệ thống sử dụng PostgreSQL, dự kiến triển khai trên Supabase. Schema ban đầu gồm 14 bảng, tên bảng dùng dạng số nhiều và dữ liệu tiền tệ dùng `NUMERIC` thay vì `float` hoặc `double`.

## 2. Danh sách bảng

| Bảng | Module sở hữu | Mục đích |
| --- | --- | --- |
| `users` | `identity` | Tài khoản người mua, chủ gian hàng và quản trị viên |
| `shops` | `merchant` | Gian hàng và quy trình xét duyệt |
| `categories` | `merchant` | Danh mục sản phẩm |
| `products` | `merchant` | Thông tin sản phẩm thuộc gian hàng |
| `product_images` | `merchant` | Tham chiếu ảnh sản phẩm trên Cloudinary |
| `carts` | `shopping` | Giỏ hàng hiện tại của người dùng |
| `cart_items` | `shopping` | Sản phẩm và số lượng trong giỏ |
| `favorites` | `shopping` | Danh sách sản phẩm yêu thích |
| `orders` | `ordering` | Đơn hàng được tách theo gian hàng |
| `order_items` | `ordering` | Chi tiết và giá chụp tại thời điểm đặt hàng |
| `payments` | `ordering` | Kết quả thanh toán COD hoặc chuyển khoản mô phỏng |
| `order_status_histories` | `ordering` | Lịch sử thay đổi trạng thái đơn |
| `notifications` | `engagement` | Thông báo trong hệ thống |
| `reviews` | `engagement` | Điểm và nhận xét sản phẩm sau khi mua |

## 3. Quan hệ chính

```text
users 1 ─── 0..1 shops
users 1 ─── 1 carts
carts 1 ─── * cart_items
shops 1 ─── * products
categories 1 ─── * products
products 1 ─── * product_images
users 1 ─── * orders
shops 1 ─── * orders
orders 1 ─── * order_items
orders 1 ─── 1 payments
orders 1 ─── * order_status_histories
users 1 ─── * notifications
users * ─── * products  (qua favorites)
users * ─── * products  (qua reviews và order_items)
```

## 4. Ràng buộc quan trọng

- `users.email` là duy nhất.
- `shops.owner_id` là duy nhất; mỗi người dùng có tối đa một gian hàng.
- `carts.user_id` là duy nhất; mỗi người dùng có một giỏ hàng hiện tại.
- Cặp `cart_items(cart_id, product_id)` là duy nhất.
- Cặp `favorites(user_id, product_id)` là duy nhất.
- Cặp `reviews(user_id, order_item_id)` là duy nhất.
- `payments.order_id` là duy nhất; mỗi đơn có một kết quả thanh toán.
- Giá và số lượng không được âm; số lượng đặt mua phải lớn hơn 0.
- Không xóa tùy tiện dữ liệu đã phát sinh giao dịch; ưu tiên trạng thái ẩn hoặc khóa.
- `order_items` lưu tên và giá snapshot để lịch sử đơn không thay đổi khi sản phẩm được sửa.

## 5. Trạng thái nghiệp vụ

### Tài khoản

```text
ACTIVE | LOCKED
```

### Gian hàng

```text
PENDING | APPROVED | REJECTED | LOCKED
```

### Sản phẩm

```text
ACTIVE | HIDDEN | OUT_OF_STOCK
```

### Đơn hàng

```text
PENDING → CONFIRMED → PREPARING → SHIPPING → COMPLETED
    └──────────────→ CANCELLED
```

Các bước hợp lệ:

| Hiện tại | Tiếp theo |
| --- | --- |
| `PENDING` | `CONFIRMED` hoặc `CANCELLED` |
| `CONFIRMED` | `PREPARING` hoặc `CANCELLED` |
| `PREPARING` | `SHIPPING` |
| `SHIPPING` | `COMPLETED` |
| `COMPLETED` | Không có |
| `CANCELLED` | Không có |

### Thanh toán

```text
PENDING | COD_PENDING | PAID | FAILED
```

## 6. Quy tắc migration và dữ liệu mẫu

1. Mọi thay đổi schema phải được quản lý bằng migration trong `src/main/resources/db/migration`.
2. Tên migration dùng `VyyyyMMddHHmm__module_description.sql`, ví dụ `V202609271430__merchant_create_shops.sql`.
3. Chỉ chủ module được tạo migration cho bảng module sở hữu.
4. Migration có khóa ngoại chéo module phải được cả hai chủ module review.
5. Không chỉnh trực tiếp production database mà không có script tương ứng.
6. Migration phải được review cùng entity và repository liên quan.
7. Dữ liệu mẫu không sử dụng email, số điện thoại hoặc mật khẩu thật.
8. Trước buổi bảo vệ phải xuất bản sao schema và dữ liệu demo.

Dữ liệu demo tối thiểu:

- Một tài khoản Admin và ba tài khoản User.
- Hai gian hàng `APPROVED`, một `PENDING` và một `REJECTED`.
- Ba danh mục và mười hai sản phẩm.
- Đơn hàng ở nhiều trạng thái để trình diễn luồng xử lý và thống kê.
