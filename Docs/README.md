# Tài liệu dự án E-commerce Marketplace

[← README chính](../README.md)

Thư mục này là mục lục cho tài liệu nghiệp vụ, kỹ thuật và cộng tác. Mỗi loại thông tin có một nguồn chuẩn; tài liệu khác chỉ tóm tắt và liên kết đến nguồn đó.

## Bắt đầu nhanh

| Nhu cầu | Đọc tài liệu |
| --- | --- |
| Hiểu dự án và chạy nhanh | [README chính](../README.md) |
| Cài môi trường, database, Cloudinary | [SETUP.md](SETUP.md) |
| Xem yêu cầu và tiêu chí nghiệm thu | [SRS.md](SRS.md) |
| Xem kiến trúc và dependency | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Xác định chủ module/bảng | [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md) |
| Xác định vị trí đặt code/test | [PROJECT_STRUCTURE_GUIDE.md](PROJECT_STRUCTURE_GUIDE.md) |
| Thực hiện một feature | [DEVELOPMENT_PLAYBOOK.md](DEVELOPMENT_PLAYBOOK.md) |
| Tạo branch, commit và pull request | [GIT_WORKFLOW.md](GIT_WORKFLOW.md) |
| Kiểm tra tiêu chuẩn hoàn thành | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Xem thành viên và người review | [TEAM.md](TEAM.md) |
| Xem phân công chi tiết | [PHAN_CONG_CONG_VIEC.md](PHAN_CONG_CONG_VIEC.md) |
| Làm việc bằng AI | [AGENTS.md](../AGENTS.md) |

## Nguồn sự thật

| Nội dung | File chuẩn |
| --- | --- |
| Yêu cầu nghiệp vụ, business rule, acceptance criteria | [SRS.md](SRS.md) |
| Kiến trúc, dependency, design pattern | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Chủ module và bảng dữ liệu | [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md) |
| Thành viên, MSSV, nhóm trưởng, người review | [TEAM.md](TEAM.md) |
| Công việc cụ thể từng thành viên | [PHAN_CONG_CONG_VIEC.md](PHAN_CONG_CONG_VIEC.md) |
| Thiết kế database và migration | [DATABASE.md](DATABASE.md) |
| Quy trình triển khai feature | [DEVELOPMENT_PLAYBOOK.md](DEVELOPMENT_PLAYBOOK.md) |
| Quy tắc Git và pull request | [GIT_WORKFLOW.md](GIT_WORKFLOW.md) |
| Tiêu chuẩn code/test/Definition of Done | [CONTRIBUTING.md](CONTRIBUTING.md) |

## Hướng dẫn module

| Module | Guide | Requirement |
| --- | --- | --- |
| `merchant` | [MERCHANT_GUIDE.md](modules/MERCHANT_GUIDE.md) | SHOP 01–10, PROD 01–11 |
| `ordering` | [ORDERING_GUIDE.md](modules/ORDERING_GUIDE.md) | PAY 01–08, ORDER 01–09 |
| `shopping` | [SHOPPING_GUIDE.md](modules/SHOPPING_GUIDE.md) | CART 01–07, FAV 01–03 và Buyer Order History |
| `identity` | [IDENTITY_GUIDE.md](modules/IDENTITY_GUIDE.md) | AUTH 01–08 |
| `engagement` | [ENGAGEMENT_GUIDE.md](modules/ENGAGEMENT_GUIDE.md) | NOTI 01–07, REV 01–04, STAT 01–05 |

## Thứ tự đọc đề xuất

Thành viên mới:

```text
README → TEAM → SRS → ARCHITECTURE → MODULE_OWNERSHIP
       → CONTRIBUTING → DEVELOPMENT_PLAYBOOK → module guide → GIT_WORKFLOW
```

AI phải bắt đầu từ [AGENTS.md](../AGENTS.md) và tuân thủ thứ tự đọc ghi trong file đó.

## Quy tắc cập nhật

- Không ghi secret hoặc dữ liệu cá nhân thật vào tài liệu.
- Dùng đường dẫn tương đối giữa các file trong repository.
- Khi hành vi, contract, schema hoặc quy trình thay đổi, cập nhật đúng file nguồn chuẩn.
- Không chép lại một nội dung dài ở nhiều file; ưu tiên tóm tắt và dẫn liên kết.
