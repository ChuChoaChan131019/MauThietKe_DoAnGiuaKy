# Playbook phát triển dự án

[← Danh mục tài liệu](README.md)

Tài liệu này là nguồn chuẩn cho vòng đời một feature, từ nhận issue đến bàn giao pull request. Quy tắc Git nằm tại [GIT_WORKFLOW.md](GIT_WORKFLOW.md); tiêu chuẩn hoàn thành nằm tại [CONTRIBUTING.md](CONTRIBUTING.md).

## 1. Nhận và xác định phạm vi

1. Chọn/tạo issue có requirement ID và acceptance criteria.
2. Xác định actor, tiền điều kiện, luồng chính, ngoại lệ và hậu điều kiện.
3. Xác định module, bảng, chủ sở hữu và người review.
4. Liệt kê dependency, public contract/event và tài nguyên dùng chung bị tác động.
5. Liệt kê endpoint/view, validation, quyền và test cần có.

Nguồn tra cứu:

- Nghiệp vụ: [SRS.md](SRS.md).
- Kiến trúc: [ARCHITECTURE.md](ARCHITECTURE.md).
- Ownership: [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md).
- Vị trí file: [PROJECT_STRUCTURE_GUIDE.md](PROJECT_STRUCTURE_GUIDE.md).
- Công việc module: guide tương ứng trong `modules/`.

## 2. Chuẩn bị thực hiện

1. Hoàn tất môi trường theo [SETUP.md](SETUP.md).
2. Tạo branch theo [GIT_WORKFLOW.md](GIT_WORKFLOW.md).
3. Đọc source, test và cấu hình hiện tại liên quan.
4. Nếu phụ thuộc module khác, thống nhất contract tối thiểu trước khi code.
5. Ghi phạm vi file dự kiến và trường hợp lỗi vào issue.

## 3. Triển khai vertical slice

Thực hiện theo thứ tự áp dụng được:

1. Migration có phiên bản.
2. Entity và enum của module.
3. Repository và query.
4. DTO/form và validation.
5. Service, transaction, business rule và ownership.
6. Public API hoặc integration event.
7. Controller và kiểm tra quyền.
8. Thymeleaf template, CSS và JavaScript của module.
9. Unit/repository/MVC/integration test.
10. Tài liệu bị ảnh hưởng.

Mỗi PR nên hoàn thành một luồng nhỏ có thể kiểm thử từ đầu đến cuối, không gom nhiều feature độc lập.

## 4. Thay đổi chéo module

1. Mô tả dữ liệu/hành vi cần dùng trong issue.
2. Hai chủ module thống nhất interface, DTO, command hoặc event tối thiểu.
3. Module cung cấp triển khai contract và test độc lập.
4. Module sử dụng mock contract để phát triển song song.
5. Hai bên review contract và chạy test liên quan khi tích hợp.

Không import Entity, Repository hoặc Service nội bộ để né việc thiết kế contract. Event chỉ dùng cho phản ứng không cần kết quả đồng bộ ngay.

## 5. Xác minh trước bàn giao

- Đối chiếu acceptance criteria và business rule.
- Chạy test phù hợp; kiểm tra rollback và phân quyền nếu liên quan.
- Kiểm tra diff không vượt phạm vi.
- Kiểm tra migration, contract, config, tài nguyên chung và tài liệu.
- Kiểm tra không có secret, file build hoặc dữ liệu cá nhân thật.
- Kiểm thử UI thủ công nếu có thay đổi giao diện.

Checklist chất lượng đầy đủ nằm tại [CONTRIBUTING.md](CONTRIBUTING.md).

## 6. Bàn giao pull request

1. Đồng bộ branch với `develop`.
2. Ghi tóm tắt, requirement, cách test và ảnh UI nếu có.
3. Mời đúng chủ module/người review.
4. Xử lý toàn bộ comment và chạy lại test.
5. Merge theo [GIT_WORKFLOW.md](GIT_WORKFLOW.md).
6. Cập nhật trạng thái issue/task.

## 7. Trình tự tích hợp toàn dự án

1. `identity` và `merchant` công bố contract nền tảng.
2. Các module triển khai nội bộ và test bằng mock contract.
3. Tích hợp `shopping` → `ordering` → `merchant`.
4. Tích hợp event `merchant`/`ordering` → `engagement`.
5. Chạy [kịch bản demo SRS](SRS.md#sec_1050), dữ liệu mẫu và kiểm thử phân quyền.

## 8. Guide module

- [Merchant](modules/MERCHANT_GUIDE.md)
- [Ordering](modules/ORDERING_GUIDE.md)
- [Shopping](modules/SHOPPING_GUIDE.md)
- [Identity](modules/IDENTITY_GUIDE.md)
- [Engagement](modules/ENGAGEMENT_GUIDE.md)
