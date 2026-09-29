# Hướng dẫn cài đặt và chạy dự án

## 1. Yêu cầu môi trường

| Thành phần | Yêu cầu |
| --- | --- |
| JDK | Java 21 |
| Build | Maven Wrapper đi kèm repository |
| Database | PostgreSQL hoặc Supabase PostgreSQL |
| Lưu ảnh | Cloudinary khi triển khai upload |
| Công cụ | Git và IDE hỗ trợ Java 21 |

Kiểm tra:

```powershell
java -version
git --version
.\mvnw.cmd -version
```

Maven phải sử dụng JDK 21.

## 2. Lấy mã nguồn

```bash
git clone <repository-url>
cd doangiuaky
```

## 3. Cấu hình PostgreSQL

Không ghi thông tin đăng nhập thật vào source code hoặc Git.

| Biến môi trường | Ý nghĩa | Ví dụ |
| --- | --- | --- |
| `SPRING_DATASOURCE_URL` | JDBC URL | `jdbc:postgresql://localhost:5432/ecommerce` |
| `SPRING_DATASOURCE_USERNAME` | Database user | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | `your_password` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Chính sách schema | `validate` |

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

## 4. Cấu hình Cloudinary

Khi chức năng upload ảnh được triển khai, dùng biến môi trường thay cho giá trị thật trong repository:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Tên biến cuối cùng phải khớp cấu hình ứng dụng tại thời điểm tích hợp. Không đưa API secret vào log, issue, ảnh chụp hoặc dữ liệu demo.

## 5. Chạy và đóng gói

Windows:

```powershell
.\mvnw.cmd spring-boot:run
.\mvnw.cmd test
.\mvnw.cmd clean package
```

Linux/macOS:

```bash
chmod +x mvnw
./mvnw spring-boot:run
./mvnw test
./mvnw clean package
```

Ứng dụng mặc định chạy tại `http://localhost:8080`. File JAR được tạo trong `target/`; không commit thư mục này.

## 6. Database migration

Migration được đặt tại:

```text
src/main/resources/db/migration
```

Quy tắc đặt tên, review và dữ liệu mẫu xem [DATABASE.md](DATABASE.md). Không chỉnh trực tiếp schema dùng chung mà không có migration tương ứng.

## 7. Lỗi thường gặp

### Sai Java

Kiểm tra `JAVA_HOME` và kết quả `.\mvnw.cmd -version`.

### Không kết nối PostgreSQL

- Kiểm tra URL, username, password và database.
- Với Supabase, kiểm tra host, port và SSL.
- Không đăng log chứa chuỗi kết nối hoặc mật khẩu.

### Test ApplicationContext thất bại

Các test tải Spring context cần datasource/test database phù hợp. Không xóa test hoặc vô hiệu auto-configuration chỉ để build xanh.

### Cổng 8080 bị chiếm

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"
```

## 8. Bước tiếp theo

Sau khi chạy được dự án, đọc [CONTRIBUTING.md](CONTRIBUTING.md), [DEVELOPMENT_PLAYBOOK.md](DEVELOPMENT_PLAYBOOK.md) và guide của module được giao.
