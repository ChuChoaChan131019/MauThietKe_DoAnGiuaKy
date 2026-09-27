# Playbook phát triển dự án

[← Danh mục tài liệu](README.md)

Tài liệu này hướng dẫn một thành viên thực hiện công việc từ lúc nhận task đến khi pull request được merge. Quy định kiến trúc chi tiết nằm trong [ARCHITECTURE.md](ARCHITECTURE.md), vị trí đặt từng loại code nằm trong [PROJECT_STRUCTURE_GUIDE.md](PROJECT_STRUCTURE_GUIDE.md), còn quyền sở hữu nằm trong [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md).

## 1. Trước khi nhận công việc

- Hoàn tất cài đặt theo [SETUP.md](SETUP.md).
- Đọc [SRS](SRS.md) và guide của module được phân công.
- Đọc [bản đồ cấu trúc dự án](PROJECT_STRUCTURE_GUIDE.md) để xác định đúng nơi đặt code và test.
- Xác nhận issue có requirement, acceptance criteria và người review.
- Kiểm tra task có thay đổi public API, bảng hoặc tài nguyên dùng chung không.
- Nếu phụ thuộc module khác, thống nhất contract trong package `api` trước khi triển khai.

## 2. Quy trình thực hiện một feature

### Bước 1 — Phân tích

1. Ghi requirement ID và business rule liên quan vào issue.
2. Xác định actor, tiền điều kiện, luồng chính, ngoại lệ và hậu điều kiện.
3. Xác định bảng thuộc module nào; không tự sửa bảng của module khác.
4. Liệt kê endpoint/view, validation, quyền truy cập và test cần có.

### Bước 2 — Tạo branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<module>/<issue>-<slug>
```

Ví dụ:

```bash
git checkout -b feature/merchant/12-create-product
```

### Bước 3 — Triển khai vertical slice

Thực hiện theo thứ tự, bỏ qua bước không áp dụng:

1. Migration có phiên bản.
2. Entity và enum thuộc module.
3. Repository và truy vấn dữ liệu.
4. DTO/form và validation.
5. Service, transaction và business rule.
6. Contract hoặc event trong `<module>.api`.
7. Controller và kiểm tra quyền.
8. Thymeleaf template, CSS và JavaScript của module.
9. Unit test, repository test và MVC test.
10. Cập nhật tài liệu liên quan.

Không triển khai toàn bộ tầng dữ liệu rồi mới làm giao diện. Mỗi pull request nên hoàn thành một luồng nhỏ có thể kiểm thử từ đầu đến cuối.

## 3. Quy tắc code bắt buộc

- Controller không gọi Repository trực tiếp và không chứa nghiệp vụ phức tạp.
- Module khác chỉ dùng kiểu hoặc interface trong `<module>.api`.
- Không import Entity, Repository hoặc Service nội bộ của module khác.
- DTO chịu trách nhiệm dữ liệu request/response; không expose trường nhạy cảm.
- Tiền tệ dùng `BigDecimal`, không dùng `float` hoặc `double`.
- Nghiệp vụ thay đổi nhiều bảng phải nằm trong transaction.
- Quyền sở hữu dữ liệu được kiểm tra ở backend, không chỉ ẩn nút trên giao diện.
- Không ghi password, token, API key hoặc chuỗi kết nối vào code/log.
- Template và static asset nằm trong thư mục module sở hữu.

## 4. Thay đổi chéo module

1. Tạo issue mô tả dữ liệu hoặc hành vi cần lấy từ module cung cấp.
2. Hai chủ module thống nhất contract tối thiểu trong package `api`.
3. Module cung cấp triển khai contract và test độc lập.
4. Module sử dụng mock contract để tiếp tục phát triển trong lúc chờ tích hợp.
5. Khi contract được merge, chạy test của cả hai module.

Spring Event được dùng cho thông báo bất đồng bộ trong cùng ứng dụng. Không dùng event để né một lời gọi đồng bộ cần kết quả ngay.

## 5. Chiến lược kiểm thử

| Loại test | Khi cần | Nội dung tối thiểu |
| --- | --- | --- |
| Unit test | Service, State, Strategy | Luồng thành công, business rule và ngoại lệ |
| Repository test | Truy vấn tùy chỉnh | Kết quả đúng và giới hạn theo owner/shop/user |
| MVC test | Endpoint quan trọng | Validation, quyền, status/redirect và model |
| Integration test | Luồng chéo module | Contract, transaction và rollback |
| Manual test | Thymeleaf/UI | Hiển thị, lỗi form, responsive và xác nhận thao tác |

Kiểm tra trước pull request:

```powershell
.\mvnw.cmd test
git status
git diff develop...HEAD
```

Test tải ApplicationContext cần datasource hoặc test database đã được cấu hình.

## 6. Checklist pull request

- [ ] Issue và requirement ID được liên kết.
- [ ] Chỉ thay đổi module thuộc phạm vi task.
- [ ] Không có secret, file build hoặc cấu hình IDE.
- [ ] Validation và kiểm tra quyền ở backend đầy đủ.
- [ ] Test cho luồng chính và ngoại lệ quan trọng đã chạy.
- [ ] Migration có tên đúng và được chủ bảng review.
- [ ] Public contract được chủ module cung cấp và sử dụng review.
- [ ] Giao diện có ảnh minh chứng nếu thay đổi UI.
- [ ] Tài liệu được cập nhật nếu thay đổi hành vi hoặc cấu hình.

## 7. Definition of Done

Một task hoàn thành khi đáp ứng acceptance criteria, build/test thành công, không vi phạm ranh giới module, có xử lý lỗi, có tài liệu cần thiết và được merge vào `develop` sau review.

## 8. Trình tự tích hợp toàn dự án

1. **Nền tảng:** `identity` và `merchant` công bố contract người dùng, shop và sản phẩm.
2. **Nghiệp vụ độc lập:** các module triển khai nội bộ và test bằng mock contract.
3. **Mua hàng:** tích hợp `shopping` → `ordering` → `merchant`.
4. **Tương tác:** tích hợp event từ `merchant`/`ordering` → `engagement`.
5. **Nghiệm thu:** chạy [kịch bản demo trong SRS](SRS.md#sec_1050), hoàn thiện dữ liệu mẫu và kiểm thử phân quyền.

## 9. Hướng dẫn theo module

- [Identity](modules/IDENTITY_GUIDE.md)
- [Merchant](modules/MERCHANT_GUIDE.md)
- [Shopping](modules/SHOPPING_GUIDE.md)
- [Ordering](modules/ORDERING_GUIDE.md)
- [Engagement](modules/ENGAGEMENT_GUIDE.md)
