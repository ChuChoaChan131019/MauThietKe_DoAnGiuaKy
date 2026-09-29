# Hướng dẫn cấu trúc và vị trí đặt mã nguồn

Tài liệu này là nguồn chuẩn để xác định file phải đặt ở đâu. Kiến trúc/dependency xem [ARCHITECTURE.md](ARCHITECTURE.md); ownership xem [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md).

## 1. Cây thư mục

```text
doangiuaky/
├── Docs/
│   └── modules/
├── src/
│   ├── main/
│   │   ├── java/com/senvia/doangiuaky/
│   │   │   ├── common/
│   │   │   ├── identity/
│   │   │   ├── merchant/
│   │   │   ├── shopping/
│   │   │   ├── ordering/
│   │   │   └── engagement/
│   │   └── resources/
│   │       ├── db/migration/
│   │       ├── templates/
│   │       ├── static/
│   │       └── application.properties
│   └── test/java/com/senvia/doangiuaky/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

`target/` là output build, không phải nơi viết code và không được commit.

## 2. Chọn module

| Module | Đặt nghiệp vụ | Không đặt |
| --- | --- | --- |
| `identity` | Account, login, principal, role | Shop, cart, order |
| `merchant` | Shop, category, product, image, stock | Cart, payment, review |
| `shopping` | Cart, cart item, favorite, Buyer Order UI qua API | Tạo order/payment |
| `ordering` | Checkout, order, history, payment | Catalog, notification |
| `engagement` | Notification, review, dashboard/Admin view | Cập nhật trực tiếp order/product |
| `common` | Thành phần kỹ thuật thật sự dùng chung | Business rule riêng module |

## 3. Package chuẩn

| Package | Nội dung | Không chứa |
| --- | --- | --- |
| `api` | Interface, public DTO, command/query, integration event | Entity, Repository, Controller |
| `controller` | Nhận request, gọi service, trả view/response | Query hoặc nghiệp vụ phức tạp |
| `dto` | Form/request/response và validation | JPA mapping, transaction |
| `entity` | JPA Entity, embeddable, enum persistence | DTO giao diện |
| `repository` | Spring Data và custom query của module | Business rule |
| `service` | Use case, transaction, ownership | HTTP/view rendering |

Luồng chuẩn:

```text
Controller → Service → Repository → Database
                ↓
       Public API module khác
```

## 4. Package đặc biệt

| Package | Trách nhiệm |
| --- | --- |
| `common.config` | Cấu hình Spring/tích hợp dùng chung |
| `common.exception` | Exception chung và global handler |
| `common.validation` | Validator thật sự tái sử dụng |
| `common.web` | Hỗ trợ web chung |
| `identity.security` | Spring Security và principal |
| `merchant.state` | State Pattern của shop |
| `ordering.strategy` | Payment Strategy |
| `engagement.event` | Event listener tạo notification |

Không tạo package mới chỉ để chứa một file chưa rõ trách nhiệm.

## 5. Resources

### Migration

```text
src/main/resources/db/migration/VyyyyMMddHHmm__module_description.sql
```

Quy tắc chi tiết xem [DATABASE.md](DATABASE.md).

### Template

| Vị trí | Nội dung |
| --- | --- |
| `templates/identity/` | Account/authentication |
| `templates/merchant/` | Shop/category/product |
| `templates/shopping/` | Cart/favorite/Buyer Order History |
| `templates/ordering/` | Checkout/order seller/payment |
| `templates/engagement/` | Notification/review/dashboard/Admin |
| `templates/fragments/` | Fragment dùng chung |

Tên view phải khớp đường dẫn template.

### Static asset

```text
static/css/common/
static/css/modules/<module>/
static/js/common/
static/js/modules/<module>/
static/images/
```

Asset riêng đặt trong module; fragment/common asset cần review. Ảnh upload lưu trên Cloudinary, không lưu trong `static/images`.

### Cấu hình

`application.properties` không chứa secret thật. Thay đổi cấu hình dùng chung phải được nêu rõ trong PR.

## 6. Test

Test phản chiếu package source:

```text
src/main/java/com/senvia/doangiuaky/merchant/service/ProductService.java
src/test/java/com/senvia/doangiuaky/merchant/service/ProductServiceTest.java
```

| Loại | Quy ước | Kiểm tra |
| --- | --- | --- |
| Unit | `*Test` | Service, State, Strategy |
| Repository | `*RepositoryTest` | Mapping, constraint, query |
| MVC | `*ControllerTest` | Route, validation, quyền |
| Integration | `*IntegrationTest` | Contract, transaction, rollback |
| Context | `DoangiuakyApplicationTests` | ApplicationContext |

## 7. Bảng chọn nhanh

| Nhu cầu | Vị trí |
| --- | --- |
| Endpoint/trang | `<module>/controller` |
| Form/request/response | `<module>/dto` |
| Ánh xạ bảng | `<module>/entity` |
| Query database | `<module>/repository` |
| Use case/transaction | `<module>/service` |
| Contract chéo module | Module cung cấp: `<module>/api` |
| Security | `identity/security` |
| Shop State | `merchant/state` |
| Payment Strategy | `ordering/strategy` |
| Notification listener | `engagement/event` |
| HTML | `resources/templates/<module>` |
| CSS/JS | `resources/static/{css|js}/modules/<module>` |
| Migration | `resources/db/migration` |
| Test | `src/test/java`, phản chiếu source |

## 8. Ví dụ vertical slice

Feature tạo product có thể gồm:

```text
db/migration/V...__merchant_create_products.sql
merchant/entity/Product.java
merchant/repository/ProductRepository.java
merchant/dto/CreateProductRequest.java
merchant/service/ProductService.java
merchant/api/ProductQueryApi.java
merchant/controller/ProductController.java
templates/merchant/products/create.html
static/css/modules/merchant/products.css
test/.../merchant/service/ProductServiceTest.java
test/.../merchant/controller/ProductControllerTest.java
```

Nếu `shopping` cần product, nó dùng `merchant.api`; không import `Product`, `ProductRepository` hoặc `ProductService`.

## 9. Kiểm tra trước khi tạo file

- Đã xác định requirement và module.
- Đã đọc guide module.
- File đúng vai trò package.
- Không tạo dependency nội bộ chéo module.
- Không đưa business rule riêng vào `common`.
- Có vị trí test tương ứng.
- Thay đổi migration, contract, config hoặc common có người review.
