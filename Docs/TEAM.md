# Nhóm phát triển

## Thông tin chung

- **Nhóm:** 2
- **Môn học:** Mẫu thiết kế
- **Giảng viên hướng dẫn:** Đoàn Minh Khuê
- **Quy mô nhóm:** 5 thành viên

## Danh sách thành viên

> Thay các giá trị trong dấu ngoặc vuông trước khi công khai repository.

| STT | Họ và tên              | Mã sinh viên | Vai trò chính              | Phạm vi phụ trách                                                                                  | GitHub                                  |
| --: | ------------------------- | -------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------- |
|   1 | [Họ tên thành viên 1] | [MSSV]         | Team Leader / Identity Owner | [`identity`](modules/IDENTITY_GUIDE.md), `common`, kiến trúc và review tài nguyên dùng chung | [@username](https://github.com/username) |
|   2 | [Họ tên thành viên 2] | [MSSV]         | Merchant Module Owner        | [`merchant`](modules/MERCHANT_GUIDE.md): gian hàng, danh mục, sản phẩm và State Pattern         | [@username](https://github.com/username) |
|   3 | [Họ tên thành viên 3] | [MSSV]         | Shopping Module Owner        | [`shopping`](modules/SHOPPING_GUIDE.md): giỏ hàng và sản phẩm yêu thích                       | [@username](https://github.com/username) |
|   4 | [Họ tên thành viên 4] | [MSSV]         | Ordering Module Owner        | [`ordering`](modules/ORDERING_GUIDE.md): checkout, đơn hàng, thanh toán và Strategy Pattern     | [@username](https://github.com/username) |
|   5 | [Họ tên thành viên 5] | [MSSV]         | Engagement Module Owner      | [`engagement`](modules/ENGAGEMENT_GUIDE.md): thông báo, đánh giá, quản trị và báo cáo      | [@username](https://github.com/username) |

Mỗi thành viên chịu trách nhiệm trọn vẹn backend, template, CSS/JavaScript và kiểm thử của module mình. Vai trò trên không giới hạn việc hỗ trợ module khác, nhưng mọi thay đổi chéo module phải được chủ module review.

## Ma trậ

n trách nhiệm

| Hạng mục                  | Phụ trách chính | Người review | Trạng thái         |
| --------------------------- | ------------------ | -------------- | -------------------- |
| `common` và `identity` | Thành viên 1     | Thành viên 2 | Đã dựng bộ khung |
| `merchant`                | Thành viên 2     | Thành viên 4 | Đã dựng bộ khung |
| `shopping`                | Thành viên 3     | Thành viên 4 | Đã dựng bộ khung |
| `ordering`                | Thành viên 4     | Thành viên 3 | Đã dựng bộ khung |
| `engagement`              | Thành viên 5     | Thành viên 1 | Đã dựng bộ khung |

## Quy tắc ghi nhận đóng góp

- Mỗi công việc phải có issue hoặc task mô tả đầu ra mong đợi.
- Commit và pull request phải sử dụng tài khoản GitHub của đúng người thực hiện.
- Pull request ghi rõ phần đã làm, cách kiểm thử và ảnh giao diện nếu có.
- Người review không đồng thời là tác giả duy nhất của pull request.
- Chỉ chủ module được thay đổi trực tiếp entity, repository, migration và template thuộc module đó; thay đổi từ người khác cần chủ module review.
- `pom.xml`, `application.properties`, `common`, template fragment và static common cần thành viên 1 review.
- Thành viên cập nhật trạng thái công việc trước mỗi lần họp nhóm.

## Kênh trao đổi

| Kênh                         | Mục đích                                 |
| ----------------------------- | ------------------------------------------- |
| GitHub Issues                 | Theo dõi lỗi, tính năng và công việc |
| GitHub Pull Requests          | Review và tích hợp mã nguồn            |
| [Điền kênh nhóm]          | Trao đổi nhanh và thông báo lịch họp |
| [Điền nơi lưu biên bản] | Lưu quyết định và biên bản họp      |
