# Hướng dẫn đóng góp

Cảm ơn bạn đã đóng góp cho E-commerce Marketplace. Tài liệu này áp dụng cho toàn bộ thành viên nhóm.

## 1. Trước khi bắt đầu

1. Chọn hoặc tạo GitHub Issue mô tả công việc.
2. Xác nhận phạm vi và người review.
3. Đọc [SETUP.md](SETUP.md) để cấu hình môi trường.
4. Đọc [ARCHITECTURE.md](ARCHITECTURE.md) và [GIT_WORKFLOW.md](GIT_WORKFLOW.md).
5. Đọc [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md) để xác nhận module và người review.
6. Đọc [DEVELOPMENT_PLAYBOOK.md](DEVELOPMENT_PLAYBOOK.md) và guide của module được giao.
7. Tạo nhánh mới từ `develop`.

## 2. Tiêu chuẩn mã nguồn

- Sử dụng Java 21 và quy ước đặt tên Java chuẩn.
- Package luôn bắt đầu bằng `com.senvia.doangiuaky`.
- Không đặt nghiệp vụ hoặc truy vấn dữ liệu trực tiếp trong Controller.
- Validate dữ liệu đầu vào bằng DTO phù hợp.
- Không trả entity có trường nhạy cảm trực tiếp ra giao diện.
- Không dùng `double` hoặc `float` cho tiền tệ.
- Không ghi password, token, API key hoặc chuỗi kết nối vào log.
- Các Service thay đổi nhiều bảng phải xem xét `@Transactional`.
- Module khác chỉ được sử dụng contract trong `<module>.api`; không import Entity hoặc Repository chéo module.
- State Pattern đặt trong `merchant.state`, Strategy trong `ordering.strategy`, listener Observer trong `engagement.event`.
- Template và static asset phải nằm trong thư mục module sở hữu.

## 3. Kiểm thử

Mỗi tính năng cần mức kiểm thử phù hợp:

- Unit test cho Service và mẫu thiết kế.
- Repository test cho truy vấn tùy chỉnh.
- MVC test cho endpoint quan trọng.
- Kiểm thử thủ công cho giao diện và luồng người dùng.

Chạy toàn bộ test trước khi mở pull request:

```powershell
.\mvnw.cmd test
```

## 4. Definition of Done

Một công việc chỉ được xem là hoàn thành khi:

- Đáp ứng acceptance criteria của issue.
- Mã biên dịch và kiểm thử thành công.
- Không làm lộ dữ liệu nhạy cảm.
- Có xử lý lỗi và validation phù hợp.
- Có test cho nghiệp vụ quan trọng.
- Đã cập nhật tài liệu liên quan.
- Được chủ module review nếu thay đổi public API hoặc tài nguyên thuộc module khác.
- Hoàn tất checklist bàn giao trong guide của module.
- Pull request được review và merge vào `develop`.

## 5. Báo lỗi

Issue báo lỗi cần ghi:

- Môi trường và phiên bản Java.
- Các bước tái hiện.
- Kết quả mong đợi.
- Kết quả thực tế.
- Log đã loại bỏ thông tin nhạy cảm.
- Ảnh hoặc video nếu lỗi liên quan giao diện.

## 6. Đề xuất tính năng

Mô tả vấn đề cần giải quyết trước khi mô tả giải pháp. Đề xuất phải nêu ảnh hưởng đến dữ liệu, phân quyền, giao diện và phạm vi kiểm thử. Thay đổi lớn cần được nhóm thống nhất trước khi triển khai.
