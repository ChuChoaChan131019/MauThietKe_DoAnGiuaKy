# Tài liệu dự án E-commerce Marketplace

Thư mục này tập hợp tài liệu kỹ thuật và quy ước cộng tác của dự án. Nội dung được cập nhật cùng với mã nguồn; mọi thay đổi ảnh hưởng đến kiến trúc, cơ sở dữ liệu hoặc quy trình phát triển phải cập nhật tài liệu liên quan trong cùng pull request.

[← Quay lại README chính](../README.md)

AI và thành viên sử dụng AI phải đọc [AGENTS.md](../AGENTS.md) trước khi bắt đầu công việc.

## Danh mục tài liệu

| Tài liệu | Nội dung |
| --- | --- |
| [AGENTS.md](../AGENTS.md) | Thứ tự đọc, nguồn sự thật và quy tắc bắt buộc dành cho AI |
| [SRS.md](SRS.md) | Đặc tả yêu cầu phần mềm phiên bản 1.3 |
| [DEVELOPMENT_PLAYBOOK.md](DEVELOPMENT_PLAYBOOK.md) | Quy trình thực hiện một feature từ issue đến pull request |
| [TEAM.md](TEAM.md) | Thành viên, vai trò và phạm vi phụ trách |
| [SETUP.md](SETUP.md) | Yêu cầu môi trường, cấu hình và cách chạy dự án |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Kiến trúc phân lớp, package và mẫu thiết kế |
| [PROJECT_STRUCTURE_GUIDE.md](PROJECT_STRUCTURE_GUIDE.md) | Bản đồ thư mục, trách nhiệm package và vị trí đặt từng loại code/test |
| [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md) | Ranh giới, quyền sở hữu và phụ thuộc giữa năm module |
| [DATABASE.md](DATABASE.md) | Mô hình dữ liệu, quan hệ và quy tắc toàn vẹn |
| [GIT_WORKFLOW.md](GIT_WORKFLOW.md) | Chiến lược nhánh, commit và pull request |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Quy trình đóng góp và tiêu chuẩn hoàn thành công việc |

## Hướng dẫn theo module

| Module | Hướng dẫn | Requirement chính |
| --- | --- | --- |
| `identity` | [IDENTITY_GUIDE.md](modules/IDENTITY_GUIDE.md) | AUTH 01–08 |
| `merchant` | [MERCHANT_GUIDE.md](modules/MERCHANT_GUIDE.md) | SHOP 01–10, PROD 01–11 |
| `shopping` | [SHOPPING_GUIDE.md](modules/SHOPPING_GUIDE.md) | CART 01–07, FAV 01–03 |
| `ordering` | [ORDERING_GUIDE.md](modules/ORDERING_GUIDE.md) | PAY 01–08, ORDER 01–09 |
| `engagement` | [ENGAGEMENT_GUIDE.md](modules/ENGAGEMENT_GUIDE.md) | NOTI 01–07, REV 01–04, STAT 01–05 |

## Thông tin tổng quan

- **Tên dự án:** E-commerce Marketplace
- **Môn học:** Mẫu thiết kế
- **Nhóm:** 2
- **Giảng viên hướng dẫn:** Đoàn Minh Khuê
- **Trạng thái:** Đang phát triển
- **Ngôn ngữ chính:** Java 21
- **Framework:** Spring Boot 4.1.1

## Nguyên tắc cập nhật

1. Không đưa mật khẩu, API key, token hoặc dữ liệu cá nhân thật vào tài liệu.
2. Dùng đường dẫn tương đối khi liên kết giữa các tài liệu trong repository.
3. Khi thay đổi package, bảng dữ liệu hoặc quy trình Git, phải cập nhật tài liệu tương ứng.
4. Nội dung chưa được nhóm thống nhất phải đánh dấu `TODO` và ghi người chịu trách nhiệm.
