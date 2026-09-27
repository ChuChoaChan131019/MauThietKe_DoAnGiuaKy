# Hướng dẫn cấu trúc và vị trí đặt mã nguồn

[← Danh mục tài liệu](README.md)

Tài liệu này là bản đồ thư mục chính thức của dự án. Thành viên phải dùng tài liệu này để xác định **code thuộc module nào**, **loại code là gì** và **phải đặt vào package/thư mục nào** trước khi tạo file mới.

Kiến trúc và hướng phụ thuộc được quy định tại [ARCHITECTURE.md](ARCHITECTURE.md); quyền sở hữu module và bảng dữ liệu được quy định tại [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md).

## 1. Cách xác định nơi viết code

Thực hiện lần lượt ba câu hỏi:

1. Chức năng thuộc nghiệp vụ nào: `identity`, `merchant`, `shopping`, `ordering` hay `engagement`?
2. File thực hiện vai trò gì: nhận request, chứa dữ liệu truyền vào/ra, xử lý nghiệp vụ, truy cập database hay cung cấp contract?
3. File là Java, giao diện, tài nguyên tĩnh, migration hay test?

Ví dụ: tính năng “người bán tạo sản phẩm” thuộc `merchant`; request được nhận tại `merchant.controller`, form nằm tại `merchant.dto`, nghiệp vụ nằm tại `merchant.service`, dữ liệu được lưu qua `merchant.repository`, trang HTML nằm tại `templates/merchant` và test nằm dưới package `merchant` trong `src/test`.

## 2. Cây thư mục tổng quát

```text
doangiuaky/
├── .mvn/wrapper/                 Cấu hình Maven Wrapper
├── Docs/                         Tài liệu dự án
│   └── modules/                  Hướng dẫn riêng cho từng module
├── src/
│   ├── main/
│   │   ├── java/com/senvia/doangiuaky/
│   │   │   ├── common/           Thành phần kỹ thuật dùng chung
│   │   │   ├── identity/         Tài khoản, đăng nhập, phân quyền
│   │   │   ├── merchant/         Shop, danh mục và sản phẩm
│   │   │   ├── shopping/         Giỏ hàng và yêu thích
│   │   │   ├── ordering/         Checkout, đơn hàng, thanh toán
│   │   │   └── engagement/       Thông báo, đánh giá, báo cáo
│   │   └── resources/
│   │       ├── db/migration/     Migration cơ sở dữ liệu
│   │       ├── templates/        Giao diện Thymeleaf
│   │       ├── static/           CSS, JavaScript và hình ảnh tĩnh
│   │       └── application.properties
│   └── test/
│       └── java/com/senvia/doangiuaky/
│           ├── identity/
│           ├── merchant/
│           ├── shopping/
│           ├── ordering/
│           └── engagement/
├── .gitignore
├── AGENTS.md                     Điểm bắt đầu bắt buộc cho AI
├── pom.xml                       Khai báo dự án và dependency Maven
├── mvnw                          Maven Wrapper cho Linux/macOS
├── mvnw.cmd                      Maven Wrapper cho Windows
└── README.md                     Giới thiệu và cách bắt đầu dự án
```

`target/` có thể xuất hiện sau khi build nhưng là thư mục sinh tự động, không phải nơi viết code và không được commit.

## 3. Các file và thư mục ở gốc dự án

| Vị trí | Chức năng | Khi nào được sửa |
| --- | --- | --- |
| `README.md` | Giới thiệu, công nghệ, trạng thái và đường dẫn bắt đầu | Khi cách chạy, phạm vi hoặc tài liệu chính thay đổi |
| `AGENTS.md` | Quy tắc bắt buộc cho công cụ AI | Khi quy trình đọc, ranh giới hoặc kiểm tra dành cho AI thay đổi |
| `Docs/` | SRS, kiến trúc, database, quy trình nhóm và guide module | Cập nhật cùng thay đổi liên quan |
| `pom.xml` | Java version, Spring Boot, dependency và plugin Maven | Chỉ sửa khi task thực sự cần dependency/plugin mới; nêu rõ trong PR |
| `.mvn/wrapper/`, `mvnw`, `mvnw.cmd` | Cho phép chạy đúng Maven version mà không cần cài Maven riêng | Không sửa trong feature nghiệp vụ thông thường |
| `.gitignore` | Loại file build, IDE và cấu hình cục bộ khỏi Git | Khi xuất hiện loại file sinh mới cần bỏ qua |
| `target/` | Class đã biên dịch, file JAR và báo cáo test | Không sửa, không commit; Maven tự tạo lại |

Không đặt Java, HTML, SQL migration hoặc file cấu hình nghiệp vụ trực tiếp ở gốc dự án.

## 4. Mã Java trong `src/main/java`

Package gốc là `com.senvia.doangiuaky`. `DoangiuakyApplication.java` là entrypoint khởi động Spring Boot; không đưa nghiệp vụ vào file này.

### 4.1. Chọn module nghiệp vụ

| Module | Viết code gì ở đây | Không viết gì ở đây |
| --- | --- | --- |
| `identity` | User, đăng ký, đăng nhập, principal, role và authorization | Shop, sản phẩm, giỏ hàng hoặc đơn hàng |
| `merchant` | Shop, duyệt shop, category, product, product image và vòng đời shop | Cart, checkout, payment hoặc review |
| `shopping` | Cart, cart item, favorite và thao tác trước checkout | Tạo order hoặc xử lý payment |
| `ordering` | Checkout, order, order item, order history và payment | Quản lý catalog hoặc thông báo |
| `engagement` | Notification, review, màn hình admin và báo cáo/thống kê | Xác thực hoặc cập nhật trực tiếp order/product |
| `common` | Cấu hình và tiện ích kỹ thuật thật sự được nhiều module dùng | Entity, repository hoặc business rule của một module cụ thể |

Nếu một class chỉ phục vụ một module thì class đó phải ở module ấy, không chuyển vào `common` chỉ để tiện import.

### 4.2. Các package chuẩn bên trong module

Mỗi module nghiệp vụ sử dụng các package sau khi có nhu cầu thực tế:

| Package | Đặt gì vào đây | Ví dụ | Không đặt vào đây |
| --- | --- | --- | --- |
| `api` | Contract công khai để module khác sử dụng: interface, DTO đọc tối thiểu, command/query hoặc integration event | `ProductQueryApi`, `ProductSummary`, `OrderCreatedEvent` | Controller, JPA Entity, Repository hoặc chi tiết triển khai nội bộ |
| `controller` | Spring MVC controller nhận request, gọi service và trả view/redirect/response | `ProductController`, `CartController` | Truy vấn database trực tiếp hoặc business rule phức tạp |
| `dto` | Form, request và response dùng nội bộ module; annotation validation đầu vào | `CreateProductRequest`, `CheckoutForm`, `OrderResponse` | JPA mapping, transaction hoặc truy vấn database |
| `entity` | JPA Entity, embeddable và enum lưu trong database do module sở hữu | `Product`, `OrderStatus` | DTO trả ra giao diện hoặc entity của module khác |
| `repository` | Spring Data repository và truy vấn cho entity của module | `ProductRepository` | Nghiệp vụ, kiểm tra quyền ở mức use case hoặc repository của module khác |
| `service` | Use case, business rule, transaction và kiểm tra ownership/quyền theo dữ liệu | `ProductService`, `CheckoutService` | Nhận HTTP request trực tiếp hoặc dựng HTML |

Luồng gọi chuẩn:

```text
Controller → Service → Repository → Database
                ↓
       API của module khác
```

Controller không được gọi Repository trực tiếp. Module A không import `entity`, `repository` hoặc `service` của module B; module A chỉ gọi contract trong `B.api`.

### 4.3. Các package đặc biệt

| Package | Chủ sở hữu | Chức năng | Ví dụ file phù hợp |
| --- | --- | --- | --- |
| `common.config` | `common` | Cấu hình Spring hoặc tích hợp dùng chung | `WebConfig`, `ClockConfig` |
| `common.exception` | `common` | Exception contract chung và global error handler | `GlobalExceptionHandler`, `ResourceNotFoundException` |
| `common.validation` | `common` | Annotation/validator tái sử dụng ở nhiều module | `ValidPassword`, `ValidPasswordValidator` |
| `common.web` | `common` | Hỗ trợ web chung, global model attribute | `GlobalModelAttributeAdvice` |
| `identity.security` | `identity` | Spring Security, authenticated principal, user details | `SecurityConfig`, `CustomUserDetailsService` |
| `merchant.state` | `merchant` | State Pattern cho vòng đời shop | `ShopState`, `PendingShopState` |
| `ordering.strategy` | `ordering` | Strategy Pattern cho phương thức thanh toán | `PaymentStrategy`, `CodPaymentStrategy` |
| `engagement.event` | `engagement` | Listener nhận event để tạo notification/phản ứng tương tác | `OrderCreatedEventListener` |

Không tạo thêm package đặc biệt chỉ để chứa một file chưa rõ trách nhiệm. Khi cấu trúc cần thay đổi, cập nhật kiến trúc và guide này trong cùng pull request.

### 4.4. Ý nghĩa của `package-info.java`

Các file `package-info.java` hiện tại giữ package khung trong Git và mô tả ngắn trách nhiệm package trước khi có implementation thật. Đây không phải class nghiệp vụ và không cần gọi hoặc inject.

Khi thêm class mới:

- Giữ `package-info.java`; nó có thể tiếp tục làm tài liệu package.
- Không viết service, entity hay cấu hình chạy ứng dụng vào `package-info.java`.
- Có thể mở file này để kiểm tra nhanh mục đích package.

## 5. Tài nguyên trong `src/main/resources`

### 5.1. `application.properties`

Chứa cấu hình ứng dụng Spring Boot. Không commit password, token, API key hoặc connection string thật. Ưu tiên biến môi trường cho secret. Thay đổi cấu hình dùng chung phải được nêu trong pull request.

### 5.2. `db/migration`

Chứa migration SQL có phiên bản. Mỗi thay đổi schema phải có migration mới; không sửa migration đã được chia sẻ hoặc chạy ở môi trường khác.

Ví dụ tên file:

```text
V1__create_users_table.sql
V2__create_shops_and_products.sql
V3__create_orders.sql
```

Migration có thể chứa nhiều bảng trong cùng một feature nhưng phải được các chủ module/bảng liên quan review. Quy tắc chi tiết nằm trong [DATABASE.md](DATABASE.md).

### 5.3. `templates`

| Vị trí | Nội dung |
| --- | --- |
| `templates/identity/` | Trang đăng ký, đăng nhập và tài khoản |
| `templates/merchant/` | Trang shop, category và product |
| `templates/shopping/` | Trang cart và favorite |
| `templates/ordering/` | Trang checkout, order và payment |
| `templates/engagement/` | Trang notification, review, admin và report |
| `templates/fragments/` | Fragment Thymeleaf thật sự dùng chung như header/footer |

Tên view trả về từ controller phải khớp đường dẫn module, ví dụ `return "merchant/products/create";` tương ứng với `templates/merchant/products/create.html`.

Không đặt template riêng của một module vào `fragments`. Thay đổi fragment chung cần được review vì có thể ảnh hưởng cả năm module.

### 5.4. `static`

```text
static/
├── css/
│   ├── common/                   CSS dùng chung
│   └── modules/<module>/         CSS riêng của module
├── js/
│   ├── common/                   JavaScript dùng chung
│   └── modules/<module>/         JavaScript riêng của module
└── images/                       Ảnh tĩnh chung của ứng dụng
```

CSS/JavaScript của một feature phải nằm trong thư mục module sở hữu. Chỉ đưa asset vào `common` khi ít nhất nhiều module thực sự dùng và thay đổi đã được review. Ảnh sản phẩm do người dùng tải lên không lưu trong `static/images`; chúng được lưu qua dịch vụ lưu trữ đã cấu hình như Cloudinary.

## 6. Test trong `src/test`

Test phản chiếu package của code được kiểm thử. Không viết code chạy thật trong `src/test`.

```text
src/main/java/com/senvia/doangiuaky/merchant/service/ProductService.java
src/test/java/com/senvia/doangiuaky/merchant/service/ProductServiceTest.java
```

| Loại test | Đặt ở đâu | Quy ước tên | Kiểm tra gì |
| --- | --- | --- | --- |
| Unit test | Package tương ứng với class | `*Test` | Business rule của service, state, strategy; dependency được mock |
| Repository test | `<module>/repository` | `*RepositoryTest` | Mapping, custom query, lọc theo user/shop |
| MVC test | `<module>/controller` | `*ControllerTest` | Route, validation, quyền, status/redirect và model |
| Integration test | Module/luồng liên quan | `*IntegrationTest` | Nhiều tầng, transaction hoặc contract chéo module |
| Context smoke test | Package gốc | `DoangiuakyApplicationTests` | Spring ApplicationContext khởi động được |

Các `package-info.java` trong năm thư mục test chỉ là mô tả và giữ sẵn ranh giới module. Khi viết test, tạo thêm package con giống source thật, chẳng hạn `merchant/service` hoặc `ordering/controller`; không gom mọi test vào package gốc của module.

Chạy test trên Windows:

```powershell
.\mvnw.cmd test
```

Test cần database phải dùng cấu hình test phù hợp; không dùng database production và không xóa test chỉ để build xanh.

## 7. Bảng chọn nhanh: file này đặt ở đâu?

| Nhu cầu | Vị trí |
| --- | --- |
| Tạo endpoint/trang mới | `<module>/controller` |
| Nhận dữ liệu form hoặc trả response | `<module>/dto` |
| Ánh xạ một bảng do module sở hữu | `<module>/entity` |
| Viết query database | `<module>/repository` |
| Xử lý use case/business rule/transaction | `<module>/service` |
| Cho module khác đọc dữ liệu hoặc gọi hành vi | Module cung cấp: `<module>/api` |
| Cấu hình đăng nhập và principal | `identity/security` |
| Xử lý trạng thái shop | `merchant/state` |
| Thêm phương thức thanh toán | `ordering/strategy` |
| Lắng nghe event tạo thông báo | `engagement/event` |
| Tạo trang HTML | `resources/templates/<module>` |
| Thêm CSS/JavaScript riêng | `resources/static/{css|js}/modules/<module>` |
| Thêm fragment hoặc asset chung | `templates/fragments` hoặc `static/{css|js}/common`, cần review |
| Thay đổi database schema | `resources/db/migration` |
| Viết test | `src/test/java`, phản chiếu package source |
| Viết hướng dẫn module | `Docs/modules/<MODULE>_GUIDE.md` |

## 8. Ví dụ một vertical slice hoàn chỉnh

Feature `merchant` tạo sản phẩm có thể tác động các file sau:

```text
src/main/resources/db/migration/Vx__create_products.sql
src/main/java/com/senvia/doangiuaky/merchant/entity/Product.java
src/main/java/com/senvia/doangiuaky/merchant/repository/ProductRepository.java
src/main/java/com/senvia/doangiuaky/merchant/dto/CreateProductRequest.java
src/main/java/com/senvia/doangiuaky/merchant/service/ProductService.java
src/main/java/com/senvia/doangiuaky/merchant/controller/ProductController.java
src/main/resources/templates/merchant/products/create.html
src/main/resources/static/css/modules/merchant/products.css
src/test/java/com/senvia/doangiuaky/merchant/service/ProductServiceTest.java
src/test/java/com/senvia/doangiuaky/merchant/controller/ProductControllerTest.java
```

Nếu `shopping` cần đọc thông tin sản phẩm, `merchant` công bố một contract tối thiểu như `merchant.api.ProductQueryApi`; `shopping` không được import `Product`, `ProductRepository` hoặc `ProductService`.

## 9. Những lỗi tổ chức cần tránh

- Tạo package tổng quát ở gốc như `controller`, `service`, `repository` dùng cho cả hệ thống.
- Đưa business rule của một module vào `common`.
- Cho Controller gọi Repository trực tiếp.
- Dùng Entity làm form hoặc response và vô tình lộ trường nội bộ.
- Import Entity/Repository/Service nội bộ chéo module.
- Đặt mọi CSS/JavaScript vào thư mục `common`.
- Đặt test khác module hoặc không phản chiếu package source.
- Sửa file trong `target/` hoặc commit output build.
- Commit secret vào `application.properties`.
- Tạo file ở vị trí mới nhưng không cập nhật tài liệu khi cấu trúc dự án thay đổi.

## 10. Checklist trước khi tạo file

- [ ] Đã xác định requirement và module sở hữu.
- [ ] Đã đọc guide riêng của module trong `Docs/modules/`.
- [ ] Đã chọn đúng vai trò package bằng bảng ở mục 4 và mục 7.
- [ ] Không tạo phụ thuộc nội bộ chéo module.
- [ ] Không đưa code riêng của module vào `common`.
- [ ] Đã xác định test tương ứng trong `src/test`.
- [ ] Nếu sửa tài nguyên chung, database, cấu hình hoặc contract, đã báo các chủ sở hữu liên quan review.

Nếu vẫn không xác định được vị trí file sau checklist, chưa tạo package mới; trao đổi với người phụ trách kiến trúc hoặc chủ module trước.
