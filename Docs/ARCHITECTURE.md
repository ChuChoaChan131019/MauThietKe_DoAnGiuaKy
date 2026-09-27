# Kiến trúc hệ thống

## 1. Tổng quan

Ứng dụng là một modular monolith Spring Boot. Mã nguồn được chia theo bounded context thay vì gom toàn bộ Controller, Service, Entity và Repository của hệ thống vào các package kỹ thuật dùng chung.

Mỗi module sở hữu trọn luồng của mình:

```text
Browser
   ↓
Template của module
   ↓
Controller của module
   ↓
Service / Design Pattern của module
   ↓
Repository của module
   ↓
Các bảng do module sở hữu
```

Cách tổ chức này cho phép năm thành viên phát triển song song trên các vùng mã nguồn và tài nguyên khác nhau.

Để biết từng loại class, template, migration và test phải đặt ở đâu, xem [PROJECT_STRUCTURE_GUIDE.md](PROJECT_STRUCTURE_GUIDE.md).

## 2. Cấu trúc package

Package gốc là `com.senvia.doangiuaky`.

```text
com.senvia.doangiuaky
├── common
│   ├── config
│   ├── exception
│   ├── validation
│   └── web
├── identity
│   ├── api
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   ├── service
│   └── security
├── merchant
│   ├── api
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   ├── service
│   └── state
├── shopping
│   ├── api
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   └── service
├── ordering
│   ├── api
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── repository
│   ├── service
│   └── strategy
└── engagement
    ├── api
    ├── controller
    ├── dto
    ├── entity
    ├── repository
    ├── service
    └── event
```

## 3. Trách nhiệm module

| Module | Trách nhiệm chính |
| --- | --- |
| `common` | Cấu hình và thành phần kỹ thuật dùng chung; không chứa nghiệp vụ |
| `identity` | Tài khoản, đăng nhập, principal và phân quyền |
| `merchant` | Gian hàng, xét duyệt, danh mục, sản phẩm và hình ảnh |
| `shopping` | Giỏ hàng và sản phẩm yêu thích |
| `ordering` | Checkout, đơn hàng, lịch sử trạng thái và thanh toán |
| `engagement` | Thông báo, đánh giá, màn hình quản trị và báo cáo |

Trong mỗi module:

| Package | Trách nhiệm |
| --- | --- |
| `api` | Interface, DTO hoặc event công khai cho module khác |
| `controller` | Tiếp nhận request và điều hướng response/view |
| `dto` | Request, response và form nội bộ của module |
| `entity` | Entity và enum của các bảng module sở hữu |
| `repository` | Truy cập dữ liệu do module sở hữu |
| `service` | Nghiệp vụ, transaction và phân quyền theo dữ liệu |

## 4. Ranh giới phụ thuộc

```text
common       → không phụ thuộc module nghiệp vụ
identity     → common
merchant     → common, identity.api
shopping     → common, identity.api, merchant.api
ordering     → common, identity.api, merchant.api, shopping.api
engagement   → common, identity.api, merchant.api, ordering.api
```

Quy tắc bắt buộc:

1. Module khác chỉ sử dụng contract trong `<module>.api`.
2. Không import Entity hoặc Repository của module khác.
3. Controller chỉ gọi Service của module mình hoặc public API của module khác.
4. Service quản lý transaction cho nghiệp vụ thay đổi nhiều bảng.
5. Entity không chứa logic trình bày giao diện.
6. Không trả mật khẩu, token hoặc trường nội bộ qua DTO.
7. Kiểm tra quyền sở hữu shop và đơn hàng tại backend.

Chi tiết ownership xem [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md).

## 5. Mẫu thiết kế

### State Pattern

Đặt trong `merchant.state` và quản lý vòng đời gian hàng:

```text
PENDING → APPROVED
PENDING → REJECTED → PENDING
APPROVED → LOCKED → APPROVED
```

### Strategy Pattern

Đặt trong `ordering.strategy` và cung cấp các cách xử lý thanh toán:

- `CodPaymentStrategy`
- `BankTransferStrategy`
- `PaymentStrategyFactory`

`CheckoutService` phụ thuộc vào hợp đồng Strategy thay vì chứa thuật toán của mọi phương thức thanh toán.

### Observer Pattern

Listener đặt trong `engagement.event`. `merchant` và `ordering` phát Spring Event khi gian hàng hoặc đơn hàng thay đổi; `engagement` tiếp nhận để tạo notification mà không truy cập Repository nội bộ của module phát sự kiện.

## 6. Cấu trúc giao diện

```text
templates/{identity,merchant,shopping,ordering,engagement}/
templates/fragments/
static/css/modules/{identity,merchant,shopping,ordering,engagement}/
static/js/modules/{identity,merchant,shopping,ordering,engagement}/
static/{css,js}/common/
```

Mỗi chủ module quản lý template và static asset của module mình. Fragment và asset common phải được review như tài nguyên dùng chung.
