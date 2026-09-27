# Hướng dẫn module Identity

[← Playbook chung](../DEVELOPMENT_PLAYBOOK.md)

## Phạm vi

- **Chủ sở hữu:** Thành viên 1.
- **Requirement:** [AUTH 01–07](../SRS.md#sec_1013).
- **Bảng:** `users`.
- **Package:** `com.senvia.doangiuaky.identity` và phần kỹ thuật `common`.
- **Template:** `templates/identity`.

Module quản lý đăng ký, đăng nhập, đăng xuất, hồ sơ, đổi mật khẩu, trạng thái tài khoản và Spring Security.

## Public contract

Identity cung cấp qua `identity.api`:

- Định danh người dùng hiện tại.
- Thông tin công khai tối thiểu: id, họ tên, role và trạng thái.
- Kiểm tra tài khoản tồn tại/đang hoạt động theo id.

Không công bố password hash, repository hoặc security principal nội bộ.

## Thứ tự triển khai

1. Tạo migration `users`, enum role và account status.
2. Tạo Entity/Repository và truy vấn email duy nhất.
3. Triển khai đăng ký với validation và BCrypt.
4. Cấu hình đăng nhập, đăng xuất, access denied và tài khoản bị khóa.
5. Triển khai xem/sửa hồ sơ và đổi mật khẩu.
6. Công bố contract người dùng cho các module khác.
7. Hoàn thiện template đăng ký, đăng nhập và hồ sơ.

## Thành phần dự kiến

- Entity: User; enum Role, AccountStatus.
- DTO/form: đăng ký, đăng nhập, cập nhật hồ sơ, đổi mật khẩu.
- Service: đăng ký, hồ sơ và truy vấn người dùng công khai.
- Security: user details, password encoder, security configuration và access handler.
- Controller/view: đăng ký, đăng nhập, hồ sơ và đổi mật khẩu.

## Kiểm tra bắt buộc

- Email sai định dạng hoặc trùng bị từ chối.
- Password chỉ được lưu dưới dạng BCrypt.
- Sai mật khẩu và tài khoản LOCKED không đăng nhập được.
- Người dùng chỉ sửa hồ sơ và mật khẩu của chính mình.
- Đổi mật khẩu yêu cầu mật khẩu hiện tại đúng.
- DTO/API công khai không chứa password hash.

## Bàn giao

- AUTH 01–07 có test tương ứng.
- Các module khác có thể lấy user id/role/status qua `identity.api`.
- Không có module nào cần truy cập `UserRepository` trực tiếp.
- Thành viên 2 review phần contract; thay đổi `common` cần pull request riêng.
