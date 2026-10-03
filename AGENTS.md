# Hướng dẫn bắt buộc dành cho AI

Đây là entrypoint cho mọi công cụ AI làm việc trong repository. Không sửa source trước khi hoàn thành thứ tự đọc và xác định rõ phạm vi task.

## 1. Thứ tự đọc bắt buộc

1. `AGENTS.md`.
2. `README.md`.
3. `Docs/SRS.md`.
4. `Docs/ARCHITECTURE.md`.
5. `Docs/PROJECT_STRUCTURE_GUIDE.md`.
6. `Docs/MODULE_OWNERSHIP.md`.
7. `Docs/DEVELOPMENT_PLAYBOOK.md`.
8. Guide của module liên quan trong `Docs/modules/`.
9. Source, test và cấu hình hiện tại liên quan trực tiếp.
10. `Docs/PHAN_CONG_CONG_VIEC.md` khi task liên quan phân công hoặc tích hợp thành viên.

Trước khi sửa phải xác định requirement ID, module/bảng sở hữu, dependency, acceptance criteria, public contract và phạm vi file.

## 2. Nguồn sự thật

| Nội dung | File chuẩn |
| --- | --- |
| Yêu cầu và acceptance criteria | `Docs/SRS.md` |
| Kiến trúc và dependency | `Docs/ARCHITECTURE.md` |
| Vị trí đặt code/test | `Docs/PROJECT_STRUCTURE_GUIDE.md` |
| Module và bảng sở hữu | `Docs/MODULE_OWNERSHIP.md` |
| Quy trình feature | `Docs/DEVELOPMENT_PLAYBOOK.md` |
| Git, commit và PR | `Docs/GIT_WORKFLOW.md` |
| Tiêu chuẩn code/test/DoD | `Docs/CONTRIBUTING.md` |
| Thành viên và review | `Docs/TEAM.md` |
| Công việc chi tiết | `Docs/PHAN_CONG_CONG_VIEC.md` |
| Hành vi đã triển khai | Source và test hiện tại |

Nếu task, tài liệu và code mâu thuẫn, nêu rõ điểm mâu thuẫn và ảnh hưởng; không tự thay đổi ngoài phạm vi đã được xác nhận.

## 3. Ranh giới bắt buộc

- Chỉ sửa module nằm trong phạm vi task.
- Module khác chỉ được dùng contract trong `<module>.api`.
- Không import Entity, Repository hoặc Service nội bộ chéo module.
- Không chuyển business rule riêng module vào `common`.
- Controller không gọi Repository trực tiếp hoặc chứa nghiệp vụ phức tạp.
- DTO không để lộ password hash, token hoặc trường nội bộ.
- Tiền tệ dùng `BigDecimal`.
- Nghiệp vụ nhiều bảng phải có transaction/rollback phù hợp.
- Ownership shop, cart, order, notification và review phải kiểm tra ở backend.
- State đặt trong `merchant.state`; Strategy trong `ordering.strategy`; listener trong `engagement.event`.
- Template và static asset đặt trong thư mục module sở hữu.
- Không tạo abstraction, package hoặc dependency mới khi chưa có nhu cầu cụ thể.
- Không sửa `pom.xml`, `application.properties`, common fragment/asset nếu task không yêu cầu; mọi thay đổi phải được nêu rõ và review.

## 4. Bảo mật và dữ liệu

- Không commit secret, password, token, Cloudinary API secret hoặc connection string thật.
- Không ghi thông tin xác thực vào log, exception hoặc response.
- Không dùng dữ liệu cá nhân thật trong seed/demo.
- Không commit `target/`, file IDE hoặc cấu hình cá nhân.
- Không xóa/vô hiệu test hoặc auto-configuration chỉ để che lỗi môi trường.

## 5. Quy trình thực hiện task

1. Đọc tài liệu và implementation hiện tại.
2. Xác định requirement, business rule, actor, luồng chính và ngoại lệ.
3. Nêu kế hoạch ngắn và phạm vi file.
4. Nếu có dependency, thống nhất public contract/event trước.
5. Triển khai vertical slice: migration → entity/repository → DTO/service → API/event → controller/view → test.
6. Giữ diff nhỏ, không sửa file không liên quan.
7. Chạy test phù hợp và kiểm tra ranh giới module.
8. Cập nhật đúng tài liệu nguồn khi hành vi/contract/config thay đổi.
9. Báo cáo file sửa, test đã chạy và blocker.

Quy trình chi tiết xem `Docs/DEVELOPMENT_PLAYBOOK.md`.

## 6. Lệnh kiểm tra

Windows:

```powershell
.\mvnw.cmd test
.\mvnw.cmd clean package
git status
git diff --check
```

Linux/macOS:

```bash
./mvnw test
./mvnw clean package
git status
git diff --check
```

Test ApplicationContext cần datasource/test database phù hợp.

## 7. Definition of Done cho AI

- Đáp ứng acceptance criteria và requirement liên quan.
- Không vi phạm ownership hoặc dependency.
- Validation, authorization, transaction và xử lý lỗi phù hợp.
- Test liên quan chạy ở mức có thể; lỗi còn lại được báo rõ.
- Không có secret hoặc file sinh tự động.
- Public contract và tài liệu được cập nhật khi cần.
- Chỉ báo hoàn thành khi không còn công việc bắt buộc trong phạm vi task.

## 8. Prompt khởi đầu

```text
Đọc AGENTS.md và toàn bộ tài liệu bắt buộc trước.
Thực hiện issue <id> thuộc module <module>.
Nêu requirement, phạm vi file và kế hoạch trước khi sửa.
Không thay đổi ngoài phạm vi nếu chưa báo rõ.
```
