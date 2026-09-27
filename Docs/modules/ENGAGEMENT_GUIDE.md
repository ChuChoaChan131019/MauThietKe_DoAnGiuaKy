# Hướng dẫn module Engagement

[← Playbook chung](../DEVELOPMENT_PLAYBOOK.md)

## Phạm vi

- **Chủ sở hữu:** Thành viên 5.
- **Requirement:** [NOTI 01–06](../SRS.md#sec_1019), [REV 01–04](../SRS.md#sec_1020), [STAT 01–05](../SRS.md#sec_1021) và các màn hình tổng hợp quản trị.
- **Bảng:** `notifications`, `reviews`.
- **Package:** `com.senvia.doangiuaky.engagement`.
- **Template:** `templates/engagement`.

Module quản lý thông báo, đánh giá, dashboard và các view tổng hợp. Nó không sở hữu lại nghiệp vụ shop, product hoặc order.

## Phụ thuộc và public contract

- Dùng `identity.api` để xác định người nhận/người đánh giá.
- Dùng `merchant.api` để hiển thị shop/product và số lượng sản phẩm.
- Dùng `ordering.api` để xác minh order item thuộc đơn COMPLETED và lấy thống kê đơn/doanh thu.
- Lắng nghe event shop/order để tạo notification.

## Thứ tự triển khai

1. Tạo migration/entity/repository cho notification và review.
2. Triển khai listener ShopRequested, ShopReviewed, OrderCreated và OrderStatusChanged.
3. Làm danh sách, số chưa đọc, đánh dấu một/tất cả thông báo đã đọc.
4. Làm tạo review sau khi xác minh buyer, order COMPLETED và chưa đánh giá.
5. Làm danh sách review và điểm trung bình sản phẩm.
6. Làm dashboard shop bằng public API của merchant/ordering.
7. Làm màn hình tổng hợp admin bằng public API, không gọi repository chéo module.
8. Hoàn thiện template notification, review và dashboard.

## Kiểm tra bắt buộc

- Notification thuộc riêng receiver; user khác không đọc hoặc đánh dấu được.
- Event tạo đúng người nhận và không tạo trùng khi xử lý lặp.
- Review chỉ được tạo cho order item thuộc đơn COMPLETED của buyer.
- Rating nằm trong 1–5; một order item chỉ được review một lần.
- Điểm trung bình chỉ tính review hợp lệ.
- Dashboard shop chỉ hiển thị số liệu của shop đang đăng nhập.
- Doanh thu chỉ lấy từ đơn COMPLETED.

## Bàn giao

- NOTI 01–06, REV 01–04 và STAT 01–05 có test chính/phân quyền.
- Listener Observer được test độc lập với event.
- Dashboard chỉ dùng public API, không import Entity/Repository module khác.
- Thành viên 1 review quyền user/admin; thành viên 2 và 4 review contract dữ liệu dashboard/review.
