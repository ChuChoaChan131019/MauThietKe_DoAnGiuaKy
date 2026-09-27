# Hướng dẫn bắt buộc dành cho AI

File này là điểm bắt đầu cho mọi công cụ AI làm việc trong repository. Phạm vi áp dụng là toàn bộ dự án. Không sửa mã nguồn trước khi hoàn thành phần “Thứ tự đọc bắt buộc”.

## 1. Thứ tự đọc bắt buộc

1. `AGENTS.md` — quy tắc làm việc với AI.
2. `README.md` — mục tiêu, công nghệ và cách chạy dự án.
3. `Docs/SRS.md` — yêu cầu nghiệp vụ và tiêu chí nghiệm thu.
4. `Docs/ARCHITECTURE.md` — kiến trúc, package và hướng phụ thuộc.
5. `Docs/PROJECT_STRUCTURE_GUIDE.md` — chức năng từng thư mục và vị trí đặt code/test.
6. `Docs/MODULE_OWNERSHIP.md` — module, bảng và tài nguyên do từng thành viên sở hữu.
7. `Docs/DEVELOPMENT_PLAYBOOK.md` — quy trình thực hiện một feature.
8. Guide của module liên quan trong `Docs/modules/`.
9. Source code, test và cấu hình hiện tại liên quan trực tiếp đến task.

Sau khi đọc, phải xác định được requirement ID, module sở hữu, dependency, acceptance criteria và phạm vi file dự kiến thay đổi.

## 2. Nguồn sự thật

| Nội dung | Nguồn chuẩn |
| --- | --- |
| Yêu cầu nghiệp vụ | `Docs/SRS.md` |
| Kiến trúc và dependency | `Docs/ARCHITECTURE.md` |
| Vị trí đặt file và trách nhiệm thư mục | `Docs/PROJECT_STRUCTURE_GUIDE.md` |
| Quyền sở hữu module/bảng | `Docs/MODULE_OWNERSHIP.md` |
| Quy trình triển khai | `Docs/DEVELOPMENT_PLAYBOOK.md` |
| Quy tắc Git và pull request | `Docs/GIT_WORKFLOW.md` |
| Tiêu chuẩn hoàn thành | `Docs/CONTRIBUTING.md` và guide module |
| Hành vi đã triển khai | Source code và test hiện tại |

Nếu task, tài liệu và code mâu thuẫn, không tự chọn ngầm. Nêu rõ điểm mâu thuẫn, ảnh hưởng và yêu cầu người dùng hoặc chủ module xác nhận trước khi thay đổi ngoài phạm vi.

## 3. Tổng quan dự án

- Java 21, Spring Boot 4.1.1, Maven Wrapper.
- Spring MVC, Thymeleaf, Spring Security, Spring Data JPA.
- PostgreSQL/Supabase và Cloudinary.
- Kiến trúc modular monolith, package gốc `com.senvia.doangiuaky`.
- State Pattern cho shop, Strategy Pattern cho payment, Spring Event/Observer cho notification.

## 4. Bản đồ module

| Module | Phạm vi | Guide |
| --- | --- | --- |
| `identity` | Tài khoản, xác thực, phân quyền; bảng `users` | `Docs/modules/IDENTITY_GUIDE.md` |
| `merchant` | Shop, category, product, image; State Pattern | `Docs/modules/MERCHANT_GUIDE.md` |
| `shopping` | Cart, cart item, favorite | `Docs/modules/SHOPPING_GUIDE.md` |
| `ordering` | Checkout, order, payment, history; Strategy Pattern | `Docs/modules/ORDERING_GUIDE.md` |
| `engagement` | Notification, review, admin view, report; Observer | `Docs/modules/ENGAGEMENT_GUIDE.md` |
| `common` | Thành phần kỹ thuật thật sự dùng chung | Thành viên 1 quản lý |

## 5. Ranh giới kiến trúc bắt buộc

- Chỉ sửa module nằm trong phạm vi task.
- Module khác chỉ được sử dụng qua contract trong `<module>.api`.
- Không import Entity, Repository hoặc Service nội bộ chéo module.
- Không chuyển nghiệp vụ của một module vào `common`.
- Controller không gọi Repository trực tiếp và không chứa nghiệp vụ phức tạp.
- DTO không để lộ password hash, token hoặc trường nội bộ.
- Tiền tệ dùng `BigDecimal`, không dùng `float` hoặc `double`.
- State đặt trong `merchant.state`; Strategy trong `ordering.strategy`; listener trong `engagement.event`.
- Template và static asset phải nằm trong thư mục module sở hữu.
- Không tạo abstraction, class khung hoặc dependency mới khi chưa có nhu cầu cụ thể từ task.
- Không sửa `pom.xml`, `application.properties`, fragment/common asset nếu task không yêu cầu; thay đổi các file này phải được nêu rõ.

## 6. Bảo mật và dữ liệu

- Không commit secret, password, token, Cloudinary API secret hoặc chuỗi kết nối thật.
- Không ghi thông tin xác thực vào log, exception hoặc response.
- Không dùng dữ liệu cá nhân thật trong seed/demo.
- Không commit `target/`, file IDE hoặc file cấu hình cá nhân.
- Mọi quyền sở hữu shop, cart, order, notification và review phải được kiểm tra ở backend.

## 7. Quy trình thực hiện task

1. Đọc tài liệu bắt buộc và guide module.
2. Tìm implementation hiện tại trước khi đề xuất thay đổi.
3. Xác định requirement/business rule và các trường hợp lỗi.
4. Nêu kế hoạch ngắn cùng phạm vi file tác động.
5. Triển khai theo vertical slice: migration → entity/repository → DTO/service → API/event → controller/view → test.
6. Giữ thay đổi nhỏ và không sửa file không liên quan.
7. Chạy test phù hợp và kiểm tra ranh giới module.
8. Cập nhật tài liệu trong cùng thay đổi nếu hành vi, cấu hình hoặc contract thay đổi.
9. Báo cáo file đã sửa, test đã chạy và blocker còn lại.

## 8. Lệnh kiểm tra

Windows:

```powershell
.\mvnw.cmd test
.\mvnw.cmd clean package
```

Linux/macOS:

```bash
./mvnw test
./mvnw clean package
```

Test tải ApplicationContext cần datasource PostgreSQL hoặc test database đã cấu hình. Không che lỗi cấu hình bằng cách xóa test hoặc vô hiệu hóa auto-configuration nếu task không yêu cầu.

## 9. Definition of Done cho AI

- Đáp ứng acceptance criteria và requirement liên quan.
- Không vi phạm ownership hoặc hướng phụ thuộc.
- Validation, phân quyền, transaction và xử lý lỗi phù hợp.
- Test mới/hiện có chạy ở mức có thể; mọi lỗi còn lại được báo rõ.
- Không có secret hoặc file sinh tự động trong thay đổi.
- Tài liệu và public contract được cập nhật khi cần.

## 10. Prompt khởi đầu khuyến nghị

```text
Đọc AGENTS.md và toàn bộ tài liệu bắt buộc trước.
Sau đó thực hiện issue <id> thuộc module <module>.
Nêu requirement, phạm vi file và kế hoạch trước khi sửa.
Không thay đổi ngoài phạm vi nếu chưa báo rõ.
```
