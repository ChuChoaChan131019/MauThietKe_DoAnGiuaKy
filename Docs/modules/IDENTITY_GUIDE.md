# Hướng dẫn module Identity

[← Playbook](../DEVELOPMENT_PLAYBOOK.md) · [Phân công](../PHAN_CONG_CONG_VIEC.md)

## Phạm vi

- **Chủ sở hữu:** Doàn Trương Duy Khang (2111844).
- **Requirement:** AUTH 01–08.
- **Bảng:** `users`.
- **Code/view:** `com.senvia.doangiuaky.identity`, `com.senvia.doangiuaky.common`, `templates/identity`.

Identity sở hữu account, authentication, profile, role/status và Spring Security; Khang review tài nguyên common/config.

## Public contract

`identity.api` cung cấp user ID, tên công khai, role, account status, kiểm tra user ACTIVE và danh sách Admin ACTIVE. Không công bố password hash, User Entity/Repository hoặc principal nội bộ.

## Thứ tự feature

1. Migration User, Role và AccountStatus.
2. Chuẩn hóa email và unique index `LOWER(email)`.
3. Registration và BCrypt.
4. Login/logout, LOCKED account và session invalidation.
5. Profile/avatar và đổi password.
6. Admin list/search/filter/detail/lock/unlock account.
7. Identity API.
8. Security/common error pages và shared navigation.

## Quy tắc đặc thù

- Email trim/lowercase trước kiểm tra và lưu.
- Password chỉ lưu BCrypt và không xuất hiện trong DTO/log.
- User chỉ sửa profile/password của mình.
- Đổi password yêu cầu password hiện tại đúng.
- Admin không mua hàng, không tự khóa và không khóa tài khoản ADMIN.
- Khóa user bắt buộc lý do, người khóa và thời điểm.
- Owner LOCKED làm catalog ẩn và shop ngừng nhận order mới.

## Kiểm thử/bàn giao

Test email, BCrypt, authentication, LOCKED/session, profile/password ownership, USER/ADMIN authorization và lock/unlock. Trần Thị Phương Trang review contract phục vụ Merchant; Huỳnh Thiên Phúc review Admin ACTIVE/notification; thay đổi common/config cần PR riêng.

Checklist chất lượng chung xem [CONTRIBUTING.md](../CONTRIBUTING.md).
