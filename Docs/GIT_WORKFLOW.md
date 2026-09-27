# Quy trình Git

## 1. Mô hình nhánh

```text
main
  └── develop
       ├── feature/identity/<issue>-<slug>
       ├── feature/merchant/<issue>-<slug>
       ├── feature/shopping/<issue>-<slug>
       ├── feature/ordering/<issue>-<slug>
       ├── feature/engagement/<issue>-<slug>
       └── fix/<module>/<issue>-<slug>
```

| Nhánh | Mục đích |
| --- | --- |
| `main` | Phiên bản ổn định, có thể trình diễn |
| `develop` | Tích hợp các tính năng đã được review |
| `feature/<module>/*` | Phát triển một tính năng trong module sở hữu |
| `fix/<module>/*` | Sửa lỗi trên nhánh phát triển |
| `docs/*` | Thay đổi tài liệu không kèm tính năng |
| `hotfix/*` | Sửa khẩn cấp từ `main` nếu cần |

Không push trực tiếp lên `main` hoặc `develop`.

## 2. Tạo nhánh làm việc

```bash
git checkout develop
git pull origin develop
git checkout -b feature/merchant/12-create-product
```

Tên nhánh dùng chữ thường, chứa module và mã issue; các từ trong slug ngăn cách bằng dấu gạch ngang.

## 3. Quy ước commit

Định dạng:

```text
<type>(<scope>): <mô tả ngắn>
```

Các loại thường dùng:

| Type | Ý nghĩa |
| --- | --- |
| `feat` | Thêm chức năng |
| `fix` | Sửa lỗi |
| `docs` | Thay đổi tài liệu |
| `test` | Thêm hoặc sửa kiểm thử |
| `refactor` | Tái cấu trúc không đổi hành vi |
| `chore` | Cấu hình, dependency hoặc tác vụ bảo trì |
| `style` | Định dạng không ảnh hưởng hành vi |

Ví dụ:

```text
feat(identity): add user login flow
fix(ordering): prevent invalid status transition
docs(setup): add Supabase configuration guide
test(ordering): cover COD payment strategy
```

Mỗi commit nên nhỏ, hoàn chỉnh và chỉ tập trung vào một mục đích.

## 4. Pull request

Mỗi pull request phải có:

- Issue hoặc task liên quan.
- Tóm tắt thay đổi.
- Cách kiểm thử.
- Ảnh giao diện nếu có thay đổi UI.
- Migration nếu thay đổi schema.
- Cập nhật tài liệu nếu thay đổi hành vi hoặc cấu hình.
- Chủ module review nếu thay đổi public contract, entity, repository, migration hoặc tài nguyên của module đó.
- Thành viên 1 review nếu sửa `common`, `pom.xml`, `application.properties`, fragment hoặc static common.

Trước khi tạo pull request:

```bash
./mvnw test
git status
git diff develop...HEAD
```

Trên Windows dùng `.\mvnw.cmd test`.

## 5. Review và merge

1. Ít nhất một thành viên khác review; bắt buộc có chủ module khi thay đổi chéo module.
2. Tất cả kiểm thử tự động phải thành công.
3. Không còn comment yêu cầu sửa chưa xử lý.
4. Không có secret, file build hoặc cấu hình cá nhân trong diff.
5. Ưu tiên squash merge để lịch sử `develop` gọn.
6. Xóa feature branch sau khi merge thành công.

## 6. Đồng bộ khi có xung đột

```bash
git checkout develop
git pull origin develop
git checkout feature/merchant/12-create-product
git merge develop
```

Giải quyết xung đột trên feature branch, chạy lại kiểm thử rồi mới push. Không dùng `git push --force` lên nhánh dùng chung.
