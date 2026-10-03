# Quy trình Git

Tài liệu này là nguồn chuẩn cho branch, commit, pull request, review và merge. Quy trình triển khai feature nằm tại [DEVELOPMENT_PLAYBOOK.md](DEVELOPMENT_PLAYBOOK.md); tiêu chuẩn chất lượng nằm tại [CONTRIBUTING.md](CONTRIBUTING.md).

## 1. Mô hình nhánh

```text
main
  └── develop
       ├── feature/<module>/<issue>-<slug>
       ├── fix/<module>/<issue>-<slug>
       └── docs/<issue>-<slug>
```

| Nhánh | Mục đích |
| --- | --- |
| `main` | Phiên bản ổn định, có thể trình diễn |
| `develop` | Tích hợp thay đổi đã review |
| `feature/<module>/*` | Feature mới |
| `fix/<module>/*` | Sửa lỗi |
| `docs/*` | Chỉ thay đổi tài liệu |
| `hotfix/*` | Sửa khẩn cấp từ `main` khi nhóm thống nhất |

Không push trực tiếp lên `main` hoặc `develop`.

## 2. Tạo và đồng bộ branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/merchant/12-create-product
```

Tên branch dùng chữ thường, có module, issue và slug ngăn bằng dấu gạch ngang.

Trước khi mở PR, đồng bộ `develop` trên chính feature branch:

```bash
git checkout develop
git pull origin develop
git checkout feature/merchant/12-create-product
git merge develop
```

Giải quyết conflict, chạy lại test rồi mới push. Không force-push nhánh dùng chung.

## 3. Commit

Định dạng:

```text
<type>(<scope>): <mô tả ngắn>
```

| Type | Dùng khi |
| --- | --- |
| `feat` | Thêm chức năng |
| `fix` | Sửa lỗi |
| `docs` | Thay đổi tài liệu |
| `test` | Thêm/sửa test |
| `refactor` | Tái cấu trúc không đổi hành vi |
| `chore` | Cấu hình, dependency, bảo trì |
| `style` | Chỉ định dạng |

Ví dụ:

```text
feat(merchant): add product creation flow
fix(ordering): prevent duplicate stock refund
test(shopping): cover cart quantity validation
docs(team): update member assignments
```

Mỗi commit nhỏ, chạy được và tập trung vào một mục đích. Không commit secret, `target/`, file IDE hoặc cấu hình cá nhân.

## 4. Pull request

PR phải có:

- Issue/task và requirement liên quan.
- Tóm tắt phạm vi thay đổi.
- Danh sách file hoặc module bị tác động.
- Cách kiểm thử và kết quả.
- Ảnh UI nếu giao diện thay đổi.
- Migration nếu schema thay đổi.
- Ghi chú contract/config/tài nguyên chung nếu có.
- Tài liệu cập nhật khi hành vi thay đổi.

Trước khi mở PR:

```powershell
.\mvnw.cmd test
git status
git diff develop...HEAD
```

## 5. Review và merge

- Ít nhất một người khác review.
- Thay đổi chéo module cần chủ module liên quan review.
- Public contract cần cả bên cung cấp và bên sử dụng review.
- Tài nguyên common/config cần Doàn Trương Duy Khang review.
- Test phải thành công và mọi comment yêu cầu sửa phải được xử lý.
- Không merge khi diff còn secret, file build hoặc cấu hình cá nhân.
- Ưu tiên squash merge và xóa feature branch sau khi merge.

Người review và ownership hiện hành xem [TEAM.md](TEAM.md) và [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md).
