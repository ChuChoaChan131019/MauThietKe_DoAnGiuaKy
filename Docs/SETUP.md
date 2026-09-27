# Hướng dẫn cài đặt và chạy dự án

## 1. Yêu cầu môi trường

| Thành phần | Yêu cầu |
| --- | --- |
| JDK | Java 21 |
| Build tool | Maven Wrapper đi kèm dự án |
| Cơ sở dữ liệu | PostgreSQL hoặc Supabase PostgreSQL |
| Quản lý mã nguồn | Git |
| IDE | VS Code, IntelliJ IDEA hoặc IDE hỗ trợ Java tương đương |

Kiểm tra môi trường:

```bash
java -version
git --version
```

Kết quả `java -version` phải hiển thị Java 21.

## 2. Lấy mã nguồn

```bash
git clone <repository-url>
cd doangiuaky
```

Thay `<repository-url>` bằng đường dẫn repository chính thức của nhóm.

## 3. Cấu hình cơ sở dữ liệu

Dự án dùng PostgreSQL. Không ghi trực tiếp thông tin đăng nhập vào Git.

Các biến môi trường cần thiết:

| Biến | Ý nghĩa | Ví dụ |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | JDBC URL của PostgreSQL | `jdbc:postgresql://localhost:5432/ecommerce` |
| `SPRING_DATASOURCE_USERNAME` | Tài khoản cơ sở dữ liệu | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Mật khẩu cơ sở dữ liệu | `your_password` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Chính sách cập nhật schema | `validate` |

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

Thông tin Cloudinary sẽ được bổ sung khi module tải ảnh được triển khai. Không commit `api_secret` hoặc thông tin Supabase vào repository.

## 4. Chạy ứng dụng

Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

Linux hoặc macOS:

```bash
chmod +x mvnw
./mvnw spring-boot:run
```

Mặc định ứng dụng chạy tại:

```text
http://localhost:8080
```

## 5. Chạy kiểm thử

Windows:

```powershell
.\mvnw.cmd test
```

Linux hoặc macOS:

```bash
./mvnw test
```

## 6. Đóng gói ứng dụng

```powershell
.\mvnw.cmd clean package
```

File JAR được tạo trong thư mục `target/`. Không commit thư mục này lên Git.

## 7. Cấu trúc làm việc theo module

Mỗi thành viên phát triển trọn backend, template, static asset và test trong module được phân công. Xem [MODULE_OWNERSHIP.md](MODULE_OWNERSHIP.md) trước khi sửa mã thuộc module khác.

Database migration được đặt trong:

```text
src/main/resources/db/migration
```

## 8. Lỗi thường gặp

### Sai phiên bản Java

Kiểm tra `JAVA_HOME` và bảo đảm Maven đang sử dụng JDK 21:

```powershell
.\mvnw.cmd -version
```

### Không kết nối được PostgreSQL

- Kiểm tra JDBC URL, username và password.
- Kiểm tra database đã tồn tại và cho phép kết nối.
- Với Supabase, kiểm tra đúng host, port và chế độ SSL.
- Không đăng ảnh chứa chuỗi kết nối hoặc mật khẩu lên issue công khai.

### Cổng 8080 đang được sử dụng

Có thể chạy tạm bằng cổng khác:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"
```
