# Hướng dẫn module Ordering

[← Playbook chung](../DEVELOPMENT_PLAYBOOK.md)

## Phạm vi

- **Chủ sở hữu:** Thành viên 4.
- **Requirement:** [PAY 01–06](../SRS.md#sec_1017), [ORDER 01–09](../SRS.md#sec_1018) và dữ liệu nguồn cho [STAT 02–04](../SRS.md#sec_1021).
- **Bảng:** `orders`, `order_items`, `payments`, `order_status_histories`.
- **Package:** `com.senvia.doangiuaky.ordering`.
- **Template:** `templates/ordering`.

Module quản lý checkout, tách đơn theo shop, snapshot giá, thanh toán mô phỏng, vòng đời đơn và lịch sử trạng thái.

## Phụ thuộc và public contract

- Dùng `identity.api` để xác định buyer và quyền truy cập.
- Dùng `shopping.api` để lấy cart snapshot và xóa mục đã mua.
- Dùng `merchant.api` để kiểm tra shop/product, trừ hoặc hoàn tồn kho.
- Cung cấp qua `ordering.api`: xác minh đơn COMPLETED cho review, thống kê đơn/doanh thu và event tạo/thay đổi đơn.

## Thứ tự triển khai

1. Tạo migration/entity/repository và enum trạng thái.
2. Triển khai State transition đơn cùng unit test.
3. Triển khai COD và bank transfer bằng Strategy Pattern.
4. Làm checkout transaction: kiểm tra lại dữ liệu, nhóm theo shop, tạo order/items/payment, trừ kho và xóa cart.
5. Làm danh sách/chi tiết đơn của buyer và đơn bán của shop.
6. Làm xác nhận/chuyển trạng thái/hủy đơn, ghi lịch sử và hoàn kho đúng một lần.
7. Phát event OrderCreated và OrderStatusChanged.
8. Công bố contract xác minh mua hàng và thống kê.
9. Hoàn thiện template checkout, kết quả đặt hàng và quản lý đơn.

## Kiểm tra bắt buộc

- Giỏ nhiều shop tạo đúng một đơn cho mỗi shop.
- Giá/tên sản phẩm được snapshot; tổng tiền dùng BigDecimal.
- Lỗi giữa checkout làm rollback đơn, payment, tồn kho và cart.
- Chỉ buyer/chủ shop hợp lệ xem hoặc xử lý đơn tương ứng.
- Chỉ chuyển trạng thái theo luồng hợp lệ; COMPLETED/CANCELLED là kết thúc.
- Hủy hợp lệ hoàn kho đúng một lần.
- Doanh thu chỉ tính đơn COMPLETED của đúng shop.

## Bàn giao

- PAY 01–06 và ORDER 01–09 có test chính, rollback và phân quyền.
- Strategy có unit test cho COD và bank transfer.
- Contract/event đủ cho engagement mà không lộ Order Repository.
- Thành viên 3 review cart contract; thành viên 2 review stock contract; thành viên 5 review event/statistics contract.
