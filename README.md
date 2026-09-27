ình 

# E-commerce Marketplace

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](<https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F>)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1)
![Status](<https://img.shields.io/badge/status-in%20development-yellow>)

E-commerce Marketplace là website sàn thương mại điện tử được xây dựng trong khuôn khổ đồ án giữa kỳ môn **Mẫu thiết kế**. Hệ thống kết nối người mua, chủ gian hàng và quản trị viên trên một nền tảng thống nhất.

Người dùng có thể tìm kiếm sản phẩm, quản lý giỏ hàng, đặt hàng, theo dõi đơn, đánh giá và lưu sản phẩm yêu thích. Chủ gian hàng quản lý sản phẩm, xử lý đơn hàng và theo dõi doanh thu. Quản trị viên xét duyệt gian hàng, quản lý danh mục và giám sát hoạt động hệ thống.

Dự án sử dụng kiến trúc modular monolith và áp dụng State, Strategy, Observer Pattern nhằm giữ mã nguồn dễ bảo trì, kiểm thử và phát triển song song bởi năm thành viên.

## Chức năng chính

- Đăng ký, đăng nhập và quản lý hồ sơ cá nhân.
- Phân quyền người dùng và quản trị viên bằng Spring Security.
- Đăng ký, xét duyệt, từ chối và khóa gian hàng.
- Quản lý danh mục, sản phẩm và hình ảnh sản phẩm.
- Tìm kiếm, lọc và xem chi tiết sản phẩm.
- Quản lý giỏ hàng và danh sách sản phẩm yêu thích.
- Đặt hàng từ nhiều gian hàng và theo dõi trạng thái đơn.
- Thanh toán COD hoặc chuyển khoản mô phỏng.
- Nhận thông báo về gian hàng và đơn hàng.
- Đánh giá sản phẩm sau khi hoàn tất đơn hàng.
- Thống kê hoạt động và doanh thu của gian hàng.

## Vai trò hệ thống

| Vai trò     | Khả năng chính                                                                  |
| ------------ | ---------------------------------------------------------------------------------- |
| Guest        | Xem, tìm kiếm và lọc sản phẩm; đăng ký hoặc đăng nhập                 |
| User / Buyer | Quản lý hồ sơ, giỏ hàng, yêu thích, đặt hàng và đánh giá            |
| Shop Owner   | Quản lý gian hàng, sản phẩm, đơn hàng và doanh thu                        |
| Admin        | Xét duyệt gian hàng, quản lý danh mục, tài khoản và giám sát hệ thống |

## Công nghệ sử dụng

| Thành phần         | Công nghệ                        |
| -------------------- | ---------------------------------- |
| Ngôn ngữ           | Java 21                            |
| Framework            | Spring Boot 4.1.1                  |
| Web                  | Spring MVC, Thymeleaf              |
| Bảo mật            | Spring Security, BCrypt            |
| Dữ liệu            | Spring Data JPA, Hibernate         |
| Cơ sở dữ liệu    | PostgreSQL, Supabase               |
| Lưu trữ hình ảnh | Cloudinary                         |
| Giao diện           | Bootstrap 5, HTML, CSS, JavaScript |
| Build                | Maven Wrapper                      |
| Kiểm thử           | JUnit, Mockito, MockMvc, Postman   |

## Kiến trúc

Dự án là một ứng dụng Spring Boot duy nhất, được chia thành năm bounded context để mỗi thành viên có thể sở hữu trọn backend, giao diện và kiểm thử của một module.

```text
com.senvia.doangiuaky
├── common       # Cấu hình và thành phần kỹ thuật dùng chung
├── identity     # Tài khoản, xác thực và phân quyền
├── merchant     # Gian hàng, danh mục và sản phẩm
├── shopping     # Giỏ hàng và sản phẩm yêu thích
├── ordering     # Checkout, đơn hàng và thanh toán
└── engagement   # Thông báo, đánh giá, quản trị và báo cáo
```

Module khác chỉ sử dụng contract trong package `<module>.api`, không truy cập trực tiếp Entity hoặc Repository của nhau.

Xem chi tiết tại [Kiến trúc hệ thống](Docs/ARCHITECTURE.md) và [Quyền sở hữu module](Docs/MODULE_OWNERSHIP.md).

## Cấu trúc repository

```text
doangiuaky/
├── Docs/                       # Tài liệu kỹ thuật và quy trình nhóm
├── src/
│   ├── main/
│   │   ├── java/               # Mã nguồn chia theo module
│   │   └── resources/
│   │       ├── db/migration/   # Database migration
│   │       ├── static/         # CSS, JavaScript và hình ảnh
│   │       └── templates/      # Thymeleaf template theo module
│   └── test/                   # Kiểm thử theo module
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

## Yêu cầu cài đặt

- JDK 21.
- Git.
- PostgreSQL hoặc tài khoản Supabase.
- VS Code, IntelliJ IDEA hoặc IDE hỗ trợ Java tương đương.
- Tài khoản Cloudinary khi triển khai chức năng tải ảnh.

Kiểm tra môi trường:

```bash
java -version
git --version
```

`java -version` phải hiển thị Java 21.

## Cài đặt và chạy dự án

### 1. Clone repository

```bash
git clone <repository-url>
cd doangiuaky
```

Thay `<repository-url>` bằng URL repository chính thức sau khi dự án được tạo trên GitHub.

### 2. Cấu hình PostgreSQL

Không ghi thông tin đăng nhập trực tiếp vào source code hoặc commit lên Git.

| Biến môi trường               | Ý nghĩa                     | Ví dụ                                        |
| --------------------------------- | ----------------------------- | ---------------------------------------------- |
| `SPRING_DATASOURCE_URL`         | JDBC URL của PostgreSQL      | `jdbc:postgresql://localhost:5432/ecommerce` |
| `SPRING_DATASOURCE_USERNAME`    | Tài khoản cơ sở dữ liệu | `postgres`                                   |
| `SPRING_DATASOURCE_PASSWORD`    | Mật khẩu cơ sở dữ liệu  | `your_password`                              |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Chính sách schema           | `validate`                                   |

PowerShell:

```powershell
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/ecommerce"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="your_password"
$env:SPRING_JPA_HIBERNATE_DDL_AUTO="validate"
```

Bash:

```bash
export SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/ecommerce"
export SPRING_DATASOURCE_USERNAME="postgres"
export SPRING_DATASOURCE_PASSWORD="your_password"
export SPRING_JPA_HIBERNATE_DDL_AUTO="validate"
```

Biến môi trường Cloudinary sẽ được bổ sung khi module tải ảnh được triển khai. Xem hướng dẫn đầy đủ tại [Docs/SETUP.md](Docs/SETUP.md).

### 3. Chạy ứng dụng

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Linux hoặc macOS:

```bash
chmod +x mvnw
./mvnw spring-boot:run
```

Ứng dụng mặc định chạy tại [http://localhost:8080](http://localhost:8080).

## Kiểm thử

Windows:

```powershell
.\mvnw.cmd test
```

Linux hoặc macOS:

```bash
./mvnw test
```

Các kiểm thử tải Spring ApplicationContext cần datasource PostgreSQL hoặc test database đã được cấu hình.

## Đóng gói

```powershell
.\mvnw.cmd clean package
```

File JAR được tạo trong `target/`. Thư mục này không được commit lên Git.

## Thành viên nhóm

| STT | Thành viên                      | Module sở hữu          | GitHub                                  |
| --: | --------------------------------- | ------------------------ | --------------------------------------- |
|   1 | [Họ tên thành viên 1 – MSSV] | `identity`, `common` | [@username](https://github.com/username) |
|   2 | [Họ tên thành viên 2 – MSSV] | `merchant`             | [@username](https://github.com/username) |
|   3 | [Họ tên thành viên 3 – MSSV] | `shopping`             | [@username](https://github.com/username) |
|   4 | [Họ tên thành viên 4 – MSSV] | `ordering`             | [@username](https://github.com/username) |
|   5 | [Họ tên thành viên 5 – MSSV] | `engagement`           | [@username](https://github.com/username) |

- **Nhóm:** 2
- **Môn học:** Mẫu thiết kế
- **Giảng viên hướng dẫn:** Đoàn Minh Khuê

Thông tin và phân công chi tiết được quản lý tại [Docs/TEAM.md](Docs/TEAM.md).

## Trạng thái dự án

| Hạng mục                                 | Trạng thái     |
| ------------------------------------------ | ---------------- |
| Khởi tạo Spring Boot                     | Hoàn thành     |
| Cấu trúc modular monolith                | Hoàn thành     |
| Tài liệu kỹ thuật và quy trình nhóm | Hoàn thành     |
| Thiết kế và migration cơ sở dữ liệu | Chưa bắt đầu |
| Xác thực và phân quyền                | Chưa bắt đầu |
| Các module nghiệp vụ                    | Chưa bắt đầu |
| Kiểm thử tích hợp                      | Chưa bắt đầu |
| Triển khai                                | Chưa bắt đầu |

## Bắt đầu công việc

Mỗi thành viên đọc [Bản đồ cấu trúc dự án](Docs/PROJECT_STRUCTURE_GUIDE.md) để biết chức năng từng thư mục và nơi đặt code/test, thực hiện task theo [Playbook phát triển](Docs/DEVELOPMENT_PLAYBOOK.md), sau đó đọc guide của module được phân công:

| Thành viên | Module                   | Hướng dẫn                                        |
| ------------ | ------------------------ | --------------------------------------------------- |
| 1            | `identity`, `common` | [Identity Guide](Docs/modules/IDENTITY_GUIDE.md)     |
| 2            | `merchant`             | [Merchant Guide](Docs/modules/MERCHANT_GUIDE.md)     |
| 3            | `shopping`             | [Shopping Guide](Docs/modules/SHOPPING_GUIDE.md)     |
| 4            | `ordering`             | [Ordering Guide](Docs/modules/ORDERING_GUIDE.md)     |
| 5            | `engagement`           | [Engagement Guide](Docs/modules/ENGAGEMENT_GUIDE.md) |

### Sử dụng AI

Mọi công cụ AI phải bắt đầu từ [AGENTS.md](AGENTS.md). File này quy định thứ tự đọc tài liệu, nguồn sự thật, ranh giới module, quy trình triển khai và kiểm tra bắt buộc.

Prompt khởi đầu khuyến nghị:

```text
Đọc AGENTS.md và toàn bộ tài liệu bắt buộc trước.
Sau đó thực hiện issue <id> thuộc module <module>.
Nêu requirement, phạm vi file và kế hoạch trước khi sửa.
Không thay đổi ngoài phạm vi nếu chưa báo rõ.
```

## Tài liệu dự án

| Tài liệu                                           | Nội dung                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------- |
| [Hướng dẫn AI](AGENTS.md)                           | Entrypoint bắt buộc cho AI trước khi phân tích hoặc sửa dự án   |
| [Danh mục tài liệu](Docs/README.md)                | Điểm bắt đầu cho toàn bộ tài liệu kỹ thuật               |
| [Đặc tả yêu cầu](Docs/SRS.md)                      | Nguồn chuẩn về yêu cầu nghiệp vụ và tiêu chí nghiệm thu      |
| [Playbook phát triển](Docs/DEVELOPMENT_PLAYBOOK.md) | Quy trình làm feature, kiểm thử và bàn giao                   |
| [Cài đặt](Docs/SETUP.md)                           | Cấu hình môi trường và xử lý lỗi thường gặp             |
| [Kiến trúc](Docs/ARCHITECTURE.md)                   | Module, package, dependency và design pattern                      |
| [Cấu trúc dự án](Docs/PROJECT_STRUCTURE_GUIDE.md)   | Chức năng thư mục, vị trí đặt code/test và ví dụ vertical slice    |
| [Module Ownership](Docs/MODULE_OWNERSHIP.md)          | Chủ sở hữu, bảng dữ liệu và quy tắc thay đổi chéo module |
| [Cơ sở dữ liệu](Docs/DATABASE.md)                 | Mô hình 14 bảng và quy tắc migration                           |
| [Quy trình Git](Docs/GIT_WORKFLOW.md)                | Branch, commit, pull request và review                             |
| [Đóng góp](Docs/CONTRIBUTING.md)                   | Tiêu chuẩn code, test và Definition of Done                      |
| [Nhóm phát triển](Docs/TEAM.md)                    | Thành viên, vai trò và phạm vi phụ trách                     |

## Đóng góp

Không push trực tiếp lên `main` hoặc `develop`. Mỗi tính năng được phát triển trên branch theo mẫu:

```text
feature/<module>/<issue>-<slug>
```

Ví dụ:

```text
feature/merchant/12-create-product
```

Đọc [Docs/CONTRIBUTING.md](Docs/CONTRIBUTING.md) và [Docs/GIT_WORKFLOW.md](Docs/GIT_WORKFLOW.md) trước khi bắt đầu công việc.

## Bảo mật

- Không commit mật khẩu, token, API key hoặc chuỗi kết nối thật.
- Không ghi mật khẩu hoặc thông tin xác thực vào log.
- Mọi endpoint quản trị và người bán phải kiểm tra quyền ở backend.
- Dữ liệu demo không sử dụng thông tin cá nhân thật.

## Giấy phép

Đây là dự án phục vụ mục đích học tập. Nhóm chưa công bố giấy phép sử dụng mã nguồn; nội dung giấy phép sẽ được bổ sung sau khi các thành viên thống nhất.
