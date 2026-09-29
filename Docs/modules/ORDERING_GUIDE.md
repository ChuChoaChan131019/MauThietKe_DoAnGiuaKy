# Hướng dẫn module Ordering

[← Playbook chung](../DEVELOPMENT_PLAYBOOK.md)

## Phạm vi

- **Chủ sở hữu:** Thành viên 4.
- **Requirement:** [PAY 01–08](../SRS.md#sec_1017), [ORDER 01–09](../SRS.md#sec_1018) và dữ liệu nguồn cho [STAT 02–04](../SRS.md#sec_1021).
- **Bảng:** `orders`, `order_items`, `payments`, `order_status_histories`.
- **Package:** `com.senvia.doangiuaky.ordering`.
- **Template:** `templates/ordering`.

Module quản lý checkout all-or-nothing, tách đơn theo shop, snapshot giá, thanh toán mô phỏng, vòng đời đơn và lịch sử trạng thái.

## Phụ thuộc và public contract

- Dùng `identity.api` để xác định buyer và quyền truy cập.
- Dùng `shopping.api` để lấy cart snapshot và xóa mục đã mua.
- Dùng `merchant.api` để kiểm tra shop/product, trừ hoặc hoàn tồn kho.
- Cung cấp qua `ordering.api`: xác minh đơn COMPLETED cho review, thống kê đơn/doanh thu và event tạo/thay đổi đơn.

## Thứ tự triển khai

1. Tạo migration/entity/repository và enum trạng thái.
2. Triển khai State transition đơn cùng unit test.
3. Triển khai COD và bank transfer bằng Strategy Pattern; `payments` là nguồn chuẩn duy nhất cho method/status.
4. Làm checkout transaction all-or-nothing: kiểm tra lại owner/shop/category/product, giá và tồn kho; nhóm theo shop; tạo order/items/payment; trừ kho nguyên tử và xóa cart.
5. Làm danh sách/chi tiết đơn của buyer và đơn bán của shop.
6. Làm xác nhận/chuyển trạng thái/hủy đơn: Buyer, chủ shop hoặc Admin chỉ hủy PENDING/CONFIRMED/PREPARING với lý do; ghi lịch sử, hoàn kho và cập nhật payment đúng một lần.
7. Phát event OrderCreated và OrderStatusChanged.
8. Công bố contract xác minh mua hàng và thống kê.
9. Hoàn thiện template checkout, kết quả đặt hàng và quản lý đơn.

## Kiểm tra bắt buộc

- Giỏ nhiều shop tạo đúng một đơn cho mỗi shop.
- Cart dùng giá hiện tại; nếu giá đổi sau màn hình xác nhận thì dừng để buyer xác nhận lại, còn giá/tên khi đặt thành công được snapshot bằng BigDecimal.
- Bất kỳ nhóm shop hoặc bước checkout nào lỗi đều rollback toàn bộ đơn, payment, tồn kho và cart.
- Chỉ buyer/chủ shop hợp lệ xem hoặc xử lý đơn tương ứng.
- Chủ shop xử lý PENDING → CONFIRMED → PREPARING → SHIPPING → COMPLETED; chuyển khoản phải PAID trước CONFIRMED, COD được xác nhận ở COD_PENDING.
- Chỉ PENDING, CONFIRMED và PREPARING được hủy; SHIPPING, COMPLETED và CANCELLED không được hủy.
- Hủy hợp lệ hoàn kho đúng một lần.
- Hủy payment PENDING/COD_PENDING chuyển CANCELLED; hủy payment PAID chuyển REFUNDED; COD chuyển PAID khi đơn COMPLETED.
- Doanh thu chỉ tính đơn COMPLETED của đúng shop.

## Bàn giao

- PAY 01–08 và ORDER 01–09 có test chính, rollback và phân quyền.
- Strategy có unit test cho COD và bank transfer.
- Contract/event đủ cho engagement mà không lộ Order Repository.
- Thành viên 3 review cart contract; thành viên 2 review stock contract; thành viên 5 review event/statistics contract.
