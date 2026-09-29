# Hướng dẫn module Engagement

[← Playbook](../DEVELOPMENT_PLAYBOOK.md) · [Phân công](../PHAN_CONG_CONG_VIEC.md)

## Phạm vi

- **Chủ sở hữu:** Huỳnh Thiên Phúc (2113010).
- **Requirement:** NOTI 01–07, REV 01–04, STAT 01–05.
- **Phối hợp:** Admin giám sát/cancel order qua `ordering.api`.
- **Bảng:** `notifications`, `reviews`.
- **Code/view:** `com.senvia.doangiuaky.engagement`, `templates/engagement`.

## Dependency

- Dùng `identity.api` cho receiver/reviewer/Admin ACTIVE.
- Dùng `merchant.api` cho shop/product/product count.
- Dùng `ordering.api` cho review verification, order query/cancel và statistics.
- Listener xử lý shop/order/review event sau commit.
- Không truy cập Entity/Repository/Service nội bộ module khác.

## Thứ tự feature

1. Migration Notification/Review.
2. Listener ShopRequested, ShopReviewed, OrderCreated, OrderStatusChanged, ReviewCreated.
3. Notification list/unread/read-one/read-all.
4. Review create/validation/list/average.
5. Shop dashboard.
6. Admin order list/filter/detail/cancel orchestration.
7. Integration test event và public contract.

## Quy tắc đặc thù

- Event có `eventId`; unique `(event_id, receiver_id)`.
- Listener chạy sau commit và xử lý lặp không tạo notification trùng.
- Notification thuộc riêng receiver.
- Review chỉ cho order item COMPLETED của đúng buyer/product.
- Rating 1–5; unique `order_item_id`; không sửa/xóa trong MVP.
- Dashboard chỉ hiện đúng shop; revenue chỉ từ COMPLETED.
- Admin UI gọi Ordering API; không tự hủy/hoàn stock/refund.

## Kiểm thử/bàn giao

Test listener sau commit/idempotency, receiver ownership, review validation/unique/average, dashboard đúng shop và Admin query/cancel qua API. Doàn Trương Duy Khang review quyền; Trần Thị Phương Trang review product/shop; Lê Anh Khoa review order/statistics.

Checklist chất lượng chung xem [CONTRIBUTING.md](../CONTRIBUTING.md).
