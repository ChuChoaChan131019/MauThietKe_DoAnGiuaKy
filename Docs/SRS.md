# ĐẶC TẢ YÊU CẦU PHẦN MỀM

**WEBSITE SÀN THƯƠNG MẠI ĐIỆN TỬ**

*Dự án giữa kỳ môn Mẫu thiết kế*

| **Giảng viên hướng dẫn** | Đoàn Minh Khuê |
| --- | --- |
| **Lớp học phần** | [Điền lớp học phần] |
| **Nhóm thực hiện** | 2 |

tháng 9 năm 2026

## Thông tin tài liệu

| **Thuộc tính** | **Nội dung** |
| --- | --- |
| Tên tài liệu | Đặc tả yêu cầu phần mềm Website Sàn thương mại điện tử |
| Mã tài liệu | SRS ECOM 01 |
| Phiên bản | 1.3 |
| Trạng thái | Bản cơ sở để nhóm thống nhất phân tích và triển khai |
| Đối tượng sử dụng | Nhóm phát triển, giảng viên hướng dẫn và người kiểm thử |
| Công nghệ chính | Java 21, Spring Boot, Thymeleaf, Spring Data JPA, Spring Security, Supabase PostgreSQL và Cloudinary |

### Lịch sử phiên bản

| Phiên bản | Ngày | Người thực hiện | Nội dung |
| --- | --- | --- | --- |
| **1.0** | [Điền ngày] | Nhóm phát triển | Khởi tạo đặc tả yêu cầu phần mềm |
| 1.1 | 25/09/2026 | Nhóm phát triển | Chốt VS Code, Cloudinary, kiểm thử và hai mẫu thiết kế bắt buộc |
| 1.2 | 25/09/2026 | Nhóm phát triển | Bổ sung cấu trúc chi tiết và giải thích trường dữ liệu của 14 bảng |
| 1.3 | 27/09/2026 | Nhóm phát triển | Chuyển cấu trúc package sang modular monolith theo năm bounded context |

### Phê duyệt tài liệu

| **Vai trò** | **Họ tên** | **Ngày** | **Xác nhận** |
| --- | --- | --- | --- |
| Trưởng nhóm | [Điền] | [Điền] | [Ký hoặc xác nhận] |
| Giảng viên | [Điền] | [Điền] | [Ký hoặc xác nhận] |

# MỤC LỤC

- [1 Giới thiệu](#sec_1000)
  - [1.1 Mục đích tài liệu](#sec_1001)
  - [1.2 Phạm vi sản phẩm](#sec_1002)
  - [1.3 Đối tượng đọc](#sec_1003)
  - [1.4 Thuật ngữ và viết tắt](#sec_1004)
- [2 Mô tả tổng quan](#sec_1005)
  - [2.1 Bối cảnh](#sec_1006)
  - [2.2 Mục tiêu](#sec_1007)
  - [2.3 Giả định và phụ thuộc](#sec_1008)
  - [2.4 Ràng buộc](#sec_1009)
- [3 Tác nhân và quyền truy cập](#sec_1010)
  - [3.1 Ma trận quyền](#sec_1011)
- [4 Yêu cầu chức năng](#sec_1012)
  - [4.1 Tài khoản và hồ sơ](#sec_1013)
  - [4.2 Gian hàng và xét duyệt](#sec_1014)
  - [4.3 Danh mục và sản phẩm](#sec_1015)
  - [4.4 Giỏ hàng](#sec_1016)
  - [4.5 Đặt hàng và thanh toán](#sec_1017)
  - [4.6 Quản lý đơn hàng](#sec_1018)
  - [4.7 Thông báo](#sec_1019)
  - [4.8 Đánh giá và yêu thích](#sec_1020)
  - [4.9 Thống kê](#sec_1021)
- [5 Đặc tả ca sử dụng](#sec_1022)
  - [UC 01 Đăng ký tài khoản](#sec_1023)
  - [UC 02 Gửi yêu cầu mở gian hàng](#sec_1024)
  - [UC 03 Xét duyệt gian hàng](#sec_1025)
  - [UC 04 Quản lý sản phẩm](#sec_1026)
  - [UC 05 Thêm sản phẩm vào giỏ](#sec_1027)
  - [UC 06 Đặt hàng](#sec_1028)
  - [UC 07 Xử lý đơn hàng](#sec_1029)
  - [UC 08 Đánh giá sản phẩm](#sec_1030)
- [6 Quy tắc nghiệp vụ](#sec_1031)
  - [6.1 Quy tắc chuyển trạng thái gian hàng](#sec_1032)
  - [6.2 Quy tắc chuyển trạng thái đơn hàng](#sec_1033)
- [7 Yêu cầu dữ liệu](#sec_1034)
  - [7.1 Chi tiết cấu trúc các bảng](#sec_1035)
  - [7.2 Ràng buộc dữ liệu](#sec_1036)
  - [7.3 Chính sách tạo dữ liệu mẫu](#sec_1037)
- [8 Yêu cầu phi chức năng](#sec_1038)
- [9 Kiến trúc và công nghệ](#sec_1039)
  - [9.1 Kiến trúc phân lớp](#sec_1040)
  - [9.2 Công nghệ sử dụng](#sec_1041)
  - [9.3 Cấu trúc package dự kiến](#sec_1042)
- [10 Áp dụng mẫu thiết kế](#sec_1043)
  - [10.1 State Pattern cho gian hàng](#sec_1044)
  - [10.2 Strategy Pattern cho thanh toán](#sec_1045)
  - [10.3 Observer Pattern cho thông báo](#sec_1046)
- [11 Giao diện dự kiến](#sec_1047)
  - [11.1 Nguyên tắc giao diện](#sec_1048)
- [12 Tiêu chí nghiệm thu](#sec_1049)
  - [12.1 Kịch bản trình diễn](#sec_1050)
- [13 Phạm vi ngoài hệ thống](#sec_1051)
- [14 Kế hoạch thực hiện và phân công](#sec_1052)
  - [14.1 Quy tắc Git](#sec_1053)
- [15 Phụ lục](#sec_1054)
  - [15.1 Danh sách trạng thái](#sec_1055)
  - [15.2 Điều kiện đóng băng yêu cầu](#sec_1056)
  - [15.3 Danh sách nội dung cần nhóm điền](#sec_1057)

<a id="sec_1000"></a>
## 1 Giới thiệu

<a id="sec_1001"></a>
### 1.1 Mục đích tài liệu

Tài liệu này xác định các yêu cầu chức năng, yêu cầu phi chức năng, quy tắc nghiệp vụ, dữ liệu và giới hạn của Website Sàn thương mại điện tử. Tài liệu là cơ sở chung để năm thành viên thống nhất phạm vi, phân chia công việc, thiết kế hệ thống, lập trình, kiểm thử và trình bày sản phẩm giữa kỳ.

Kết quả cần đạt là một website cho phép mọi tài khoản mua hàng; người dùng có nhu cầu bán hàng có thể gửi yêu cầu mở gian hàng và chỉ được kinh doanh sau khi quản trị viên phê duyệt. Hệ thống phải minh họa rõ State Pattern trong vòng đời gian hàng và Strategy Pattern trong xử lý phương thức thanh toán.

<a id="sec_1002"></a>
### 1.2 Phạm vi sản phẩm

Sản phẩm là ứng dụng web nguyên khối được xây dựng bằng Java và Spring Boot. Hệ thống phục vụ ba nhóm hành vi chính: mua hàng, vận hành gian hàng và quản trị sàn. Dữ liệu được lưu trên Supabase PostgreSQL để các thành viên cùng sử dụng; hình ảnh được lưu trên Cloudinary.

Bộ công nghệ chính thức gồm VS Code, Java 21, Spring Boot, Spring MVC, Thymeleaf, Bootstrap, Spring Data JPA, Spring Security, Supabase PostgreSQL và Cloudinary. State Pattern và Strategy Pattern là hai mẫu bắt buộc; Observer chỉ là phần mở rộng nếu còn thời gian.

- Người dùng đăng ký, đăng nhập, quản lý hồ sơ, mua hàng, theo dõi đơn, đánh giá và lưu sản phẩm yêu thích.
- Người dùng gửi yêu cầu mở gian hàng; quản trị viên phê duyệt, từ chối hoặc khóa gian hàng.
- Chủ gian hàng được duyệt quản lý sản phẩm, tồn kho, đơn bán và thống kê doanh thu cơ bản.
- Hệ thống hỗ trợ thanh toán mô phỏng bằng COD và chuyển khoản.
- Hệ thống tạo thông báo nội bộ khi có sự kiện quan trọng.

<a id="sec_1003"></a>
### 1.3 Đối tượng đọc

- Giảng viên dùng để đánh giá phạm vi và cách áp dụng mẫu thiết kế.
- Nhóm phát triển dùng để triển khai đúng chức năng và tránh thay đổi phạm vi tùy ý.
- Người kiểm thử dùng để xây dựng kịch bản kiểm thử và tiêu chí nghiệm thu.

<a id="sec_1004"></a>
### 1.4 Thuật ngữ và viết tắt

| **Thuật ngữ** | **Giải thích** |
| --- | --- |
| User | Tài khoản người dùng chung; có thể mua hàng và có thể xin mở gian hàng. |
| Admin | Tài khoản quản trị hệ thống. |
| Shop | Gian hàng do một người dùng sở hữu sau khi được phê duyệt. |
| COD | Thanh toán khi nhận hàng. |
| SRS | Tài liệu đặc tả yêu cầu phần mềm. |
| JPA | Chuẩn ánh xạ đối tượng Java với cơ sở dữ liệu quan hệ. |
| MVP | Phiên bản tối thiểu có thể vận hành và trình diễn đầy đủ luồng chính. |

<a id="sec_1005"></a>
## 2 Mô tả tổng quan

<a id="sec_1006"></a>
### 2.1 Bối cảnh

Nhiều website bán hàng chỉ cho quản trị viên đăng sản phẩm và vận hành như một cửa hàng đơn lẻ. Dự án này mô phỏng sàn thương mại điện tử nhiều gian hàng: một người dùng có thể vừa mua hàng vừa sở hữu gian hàng mà không cần tạo hai tài khoản. Quyền bán hàng phát sinh từ trạng thái gian hàng đã được phê duyệt, không phải từ một loại tài khoản người bán tách biệt.

<a id="sec_1007"></a>
### 2.2 Mục tiêu

1. Xây dựng luồng mua hàng hoàn chỉnh từ xem sản phẩm đến theo dõi đơn.

2. Xây dựng quy trình yêu cầu và xét duyệt gian hàng có trạng thái rõ ràng.

3. Bảo đảm người dùng chỉ thao tác trên dữ liệu thuộc quyền sở hữu của mình.

4. Áp dụng tối thiểu State Pattern và Strategy Pattern vào nghiệp vụ thực tế.

5. Sử dụng cơ sở dữ liệu cloud để cả nhóm cùng phát triển và kiểm thử.

<a id="sec_1008"></a>
### 2.3 Giả định và phụ thuộc

- Người dùng có trình duyệt hiện đại và kết nối Internet.
- Dịch vụ Supabase hoạt động và thông tin kết nối được cấu hình bằng biến môi trường.
- Thanh toán và giao hàng chỉ được mô phỏng; không kết nối ngân hàng hoặc đơn vị vận chuyển.
- Mỗi người dùng chỉ sở hữu tối đa một gian hàng trong phạm vi dự án.
- Dự án được thực hiện bởi năm thành viên trong khoảng ba đến bốn tuần.

<a id="sec_1009"></a>
### 2.4 Ràng buộc

- Ngôn ngữ backend bắt buộc là Java.
- Hệ thống phải sử dụng ít nhất hai mẫu thiết kế phần mềm.
- Ứng dụng triển khai theo kiến trúc Spring MVC và phân lớp Controller, Service, Repository.
- Không lưu mật khẩu dạng văn bản thuần.
- Không đưa khóa bí mật hoặc mật khẩu cơ sở dữ liệu lên GitHub.

<a id="sec_1010"></a>
## 3 Tác nhân và quyền truy cập

Hệ thống có hai loại tài khoản là USER và ADMIN. Khái niệm người bán là khả năng bổ sung của USER khi người đó sở hữu gian hàng có trạng thái APPROVED.

| **Tác nhân** | **Mô tả** | **Quyền chính** |
| --- | --- | --- |
| Khách | Người chưa đăng nhập. | Xem danh sách, tìm kiếm, lọc và xem chi tiết sản phẩm; đăng ký và đăng nhập. |
| Người dùng | Tài khoản có vai trò USER. | Quản lý hồ sơ, giỏ hàng, đặt hàng, đánh giá, yêu thích và gửi yêu cầu mở gian hàng. |
| Chủ gian hàng | USER có shop APPROVED. | Có toàn bộ quyền của người dùng và thêm quyền quản lý sản phẩm, đơn bán, tồn kho và thống kê. |
| Quản trị viên | Tài khoản có vai trò ADMIN. | Duyệt gian hàng, quản lý danh mục, khóa gian hàng, xem dữ liệu quản trị và xử lý vi phạm. |

<a id="sec_1011"></a>
### 3.1 Ma trận quyền

| **Chức năng** | **Khách** | **User** | **Shop được duyệt** | **Admin** |
| --- | --- | --- | --- | --- |
| Xem sản phẩm | Có | Có | Có | Có |
| Mua hàng | Không | Có | Có | Tùy cấu hình |
| Gửi yêu cầu mở shop | Không | Có | Không | Không |
| Đăng sản phẩm | Không | Không | Có | Không |
| Xử lý đơn bán | Không | Không | Có | Theo dõi |
| Duyệt gian hàng | Không | Không | Không | Có |
| Quản lý danh mục | Không | Không | Không | Có |

<a id="sec_1012"></a>
## 4 Yêu cầu chức năng

Mức ưu tiên được quy ước: Bắt buộc là yêu cầu phải hoàn thành để nghiệm thu; Nên có là yêu cầu thực hiện khi luồng chính đã ổn định.

<a id="sec_1013"></a>
### 4.1 Tài khoản và hồ sơ

| **Mã** | **Yêu cầu** | **Ưu tiên** |
| --- | --- | --- |
| **AUTH 01** | Hệ thống cho phép khách đăng ký bằng họ tên, email và mật khẩu. | Bắt buộc |
| **AUTH 02** | Email phải duy nhất và có định dạng hợp lệ. | Bắt buộc |
| **AUTH 03** | Mật khẩu được mã hóa bằng BCrypt trước khi lưu. | Bắt buộc |
| **AUTH 04** | Người dùng đăng nhập và đăng xuất khỏi hệ thống. | Bắt buộc |
| **AUTH 05** | Người dùng xem và cập nhật họ tên, số điện thoại, địa chỉ và ảnh đại diện. | Bắt buộc |
| **AUTH 06** | Người dùng đổi mật khẩu sau khi xác nhận mật khẩu hiện tại. | Bắt buộc |
| **AUTH 07** | Hệ thống từ chối tài khoản bị khóa và các yêu cầu không đúng quyền. | Bắt buộc |

<a id="sec_1014"></a>
### 4.2 Gian hàng và xét duyệt

| **Mã** | **Yêu cầu** | **Ưu tiên** |
| --- | --- | --- |
| **SHOP 01** | Người dùng chưa có gian hàng được gửi yêu cầu mở gian hàng. | Bắt buộc |
| **SHOP 02** | Yêu cầu gồm tên, mô tả, logo, điện thoại và địa chỉ gian hàng. | Bắt buộc |
| **SHOP 03** | Yêu cầu mới có trạng thái PENDING và chưa được đăng sản phẩm. | Bắt buộc |
| **SHOP 04** | Admin xem danh sách và chi tiết yêu cầu đang chờ. | Bắt buộc |
| **SHOP 05** | Admin phê duyệt yêu cầu và chuyển trạng thái thành APPROVED. | Bắt buộc |
| **SHOP 06** | Admin từ chối yêu cầu, bắt buộc nhập lý do. | Bắt buộc |
| **SHOP 07** | Người dùng xem lý do, chỉnh sửa và gửi lại yêu cầu bị từ chối. | Bắt buộc |
| **SHOP 08** | Admin khóa gian hàng vi phạm bằng trạng thái LOCKED. | Bắt buộc |
| **SHOP 09** | Chủ shop APPROVED được cập nhật thông tin gian hàng. | Bắt buộc |

<a id="sec_1015"></a>
### 4.3 Danh mục và sản phẩm

| **Mã** | **Yêu cầu** | **Ưu tiên** |
| --- | --- | --- |
| **PROD 01** | Admin thêm, sửa và ẩn danh mục sản phẩm. | Bắt buộc |
| **PROD 02** | Chủ shop APPROVED thêm sản phẩm thuộc gian hàng mình. | Bắt buộc |
| **PROD 03** | Sản phẩm có tên, mô tả, giá, tồn kho, danh mục và ít nhất một ảnh. | Bắt buộc |
| **PROD 04** | Chủ shop sửa hoặc ẩn sản phẩm thuộc sở hữu của mình. | Bắt buộc |
| **PROD 05** | Hệ thống không cho phép giá âm hoặc tồn kho âm. | Bắt buộc |
| **PROD 06** | Khách và người dùng xem danh sách, chi tiết và thông tin gian hàng. | Bắt buộc |
| **PROD 07** | Hệ thống tìm kiếm sản phẩm theo tên. | Bắt buộc |
| **PROD 08** | Hệ thống lọc theo danh mục và khoảng giá. | Bắt buộc |
| **PROD 09** | Danh sách hỗ trợ phân trang. | Nên có |
| **PROD 10** | Ảnh được lưu trên Cloudinary; cơ sở dữ liệu lưu URL và public\_id để hiển thị, thay thế hoặc xóa ảnh. | Bắt buộc |

<a id="sec_1016"></a>
### 4.4 Giỏ hàng

| **Mã** | **Yêu cầu** | **Ưu tiên** |
| --- | --- | --- |
| **CART 01** | Người dùng thêm sản phẩm đang bán vào giỏ hàng. | Bắt buộc |
| **CART 02** | Sản phẩm đã có trong giỏ được tăng số lượng thay vì tạo dòng trùng. | Bắt buộc |
| **CART 03** | Người dùng thay đổi số lượng hoặc xóa sản phẩm khỏi giỏ. | Bắt buộc |
| **CART 04** | Số lượng trong giỏ không vượt quá tồn kho hiện tại. | Bắt buộc |
| **CART 05** | Giỏ hiển thị sản phẩm theo từng gian hàng và tính tạm tính. | Bắt buộc |
| **CART 06** | Sản phẩm ẩn hoặc hết hàng được cảnh báo trước khi thanh toán. | Bắt buộc |

<a id="sec_1017"></a>
### 4.5 Đặt hàng và thanh toán

| **Mã** | **Yêu cầu** | **Ưu tiên** |
| --- | --- | --- |
| **PAY 01** | Người dùng nhập hoặc chọn địa chỉ nhận hàng khi checkout. | Bắt buộc |
| **PAY 02** | Hệ thống nhóm sản phẩm theo gian hàng và tạo một đơn cho mỗi shop. | Bắt buộc |
| **PAY 03** | Người dùng chọn COD hoặc chuyển khoản mô phỏng. | Bắt buộc |
| **PAY 04** | Hệ thống áp dụng Payment Strategy tương ứng. | Bắt buộc |
| **PAY 05** | Chuyển khoản chỉ hiển thị hướng dẫn và mã đơn, không gọi ngân hàng thật. | Bắt buộc |
| **PAY 06** | Sau khi đặt thành công, hệ thống trừ tồn kho và xóa các mục đã mua khỏi giỏ. | Bắt buộc |

<a id="sec_1018"></a>
### 4.6 Quản lý đơn hàng

| **Mã** | **Yêu cầu** | **Ưu tiên** |
| --- | --- | --- |
| **ORDER 01** | Người mua xem danh sách và chi tiết đơn của mình. | Bắt buộc |
| **ORDER 02** | Chủ shop chỉ xem đơn thuộc gian hàng của mình. | Bắt buộc |
| **ORDER 03** | Đơn mới có trạng thái PENDING. | Bắt buộc |
| **ORDER 04** | Chủ shop xác nhận đơn theo luồng trạng thái hợp lệ. | Bắt buộc |
| **ORDER 05** | Luồng chuẩn gồm PENDING, CONFIRMED, PREPARING, SHIPPING và COMPLETED. | Bắt buộc |
| **ORDER 06** | Đơn có thể chuyển sang CANCELLED theo quy tắc hủy. | Bắt buộc |
| **ORDER 07** | Hệ thống ghi lịch sử mỗi lần thay đổi trạng thái. | Bắt buộc |
| **ORDER 08** | Hủy đơn hợp lệ phải hoàn lại tồn kho. | Bắt buộc |
| **ORDER 09** | Người không sở hữu đơn không được xem hoặc sửa đơn. | Bắt buộc |

<a id="sec_1019"></a>
### 4.7 Thông báo

| **Mã** | **Yêu cầu** | **Ưu tiên** |
| --- | --- | --- |
| **NOTI 01** | Admin nhận thông báo khi có yêu cầu mở gian hàng mới. | Bắt buộc |
| **NOTI 02** | Người dùng nhận thông báo khi yêu cầu được duyệt hoặc từ chối. | Bắt buộc |
| **NOTI 03** | Chủ shop nhận thông báo khi có đơn hàng mới. | Bắt buộc |
| **NOTI 04** | Người mua nhận thông báo khi trạng thái đơn thay đổi. | Bắt buộc |
| **NOTI 05** | Người dùng xem danh sách, số lượng chưa đọc và đánh dấu đã đọc. | Bắt buộc |
| **NOTI 06** | Thông báo hoạt động trong website và không yêu cầu realtime. | Bắt buộc |

<a id="sec_1020"></a>
### 4.8 Đánh giá và yêu thích

| **Mã** | **Yêu cầu** | **Ưu tiên** |
| --- | --- | --- |
| **REV 01** | Người mua chỉ đánh giá sản phẩm thuộc đơn COMPLETED của mình. | Bắt buộc |
| **REV 02** | Đánh giá gồm điểm từ 1 đến 5 và nội dung nhận xét. | Bắt buộc |
| **REV 03** | Mỗi sản phẩm trong một đơn chỉ được người mua đánh giá một lần. | Bắt buộc |
| **REV 04** | Hệ thống hiển thị điểm trung bình và danh sách đánh giá. | Bắt buộc |
| **FAV 01** | Người dùng thêm hoặc xóa sản phẩm yêu thích. | Bắt buộc |
| **FAV 02** | Một người dùng không thể lưu trùng cùng một sản phẩm. | Bắt buộc |
| **FAV 03** | Người dùng xem danh sách sản phẩm yêu thích của mình. | Bắt buộc |

<a id="sec_1021"></a>
### 4.9 Thống kê

| **Mã** | **Yêu cầu** | **Ưu tiên** |
| --- | --- | --- |
| **STAT 01** | Chủ shop xem tổng số sản phẩm đang quản lý. | Bắt buộc |
| **STAT 02** | Chủ shop xem tổng số đơn và số đơn theo trạng thái. | Bắt buộc |
| **STAT 03** | Doanh thu chỉ tính từ đơn COMPLETED. | Bắt buộc |
| **STAT 04** | Số liệu chỉ bao gồm dữ liệu của chính gian hàng đang đăng nhập. | Bắt buộc |
| **STAT 05** | Biểu đồ là tùy chọn; các thẻ số và bảng tổng hợp là đủ để nghiệm thu. | Nên có |

<a id="sec_1022"></a>
## 5 Đặc tả ca sử dụng

<a id="sec_1023"></a>
### UC 01 Đăng ký tài khoản

| **Thuộc tính** | **Nội dung** |
| --- | --- |
| Tác nhân | Khách |
| Tiền điều kiện | Email chưa tồn tại trong hệ thống. |
| Kích hoạt | Khách chọn Đăng ký. |
| Luồng chính | 1. Khách nhập họ tên, email, mật khẩu và xác nhận mật khẩu.  <br>2. Hệ thống kiểm tra định dạng và tính duy nhất của email.  <br>3. Hệ thống mã hóa mật khẩu và tạo tài khoản USER ở trạng thái ACTIVE.  <br>4. Hệ thống chuyển đến trang đăng nhập hoặc tự động đăng nhập theo cấu hình. |
| Ngoại lệ | 1. Email đã tồn tại: hiển thị lỗi và không tạo tài khoản.  <br>2. Mật khẩu xác nhận không khớp: yêu cầu nhập lại.  <br>3. Dữ liệu thiếu hoặc sai định dạng: hiển thị lỗi tại trường tương ứng. |
| Hậu điều kiện | Tài khoản được lưu an toàn và có thể đăng nhập. |

<a id="sec_1024"></a>
### UC 02 Gửi yêu cầu mở gian hàng

| **Thuộc tính** | **Nội dung** |
| --- | --- |
| Tác nhân | Người dùng |
| Tiền điều kiện | Đã đăng nhập; chưa có shop APPROVED hoặc PENDING. |
| Kích hoạt | Người dùng chọn Mở gian hàng. |
| Luồng chính | 1. Người dùng nhập thông tin gian hàng và tải logo.  <br>2. Hệ thống kiểm tra dữ liệu bắt buộc.  <br>3. Hệ thống tạo hoặc cập nhật shop với trạng thái PENDING.  <br>4. Hệ thống tạo thông báo cho Admin.  <br>5. Người dùng xem trạng thái chờ xét duyệt. |
| Ngoại lệ | 1. Đã có yêu cầu PENDING: hệ thống không tạo yêu cầu trùng.  <br>2. Đã có shop APPROVED: chuyển người dùng đến Kênh người bán.  <br>3. Ảnh không hợp lệ hoặc upload thất bại: không hoàn tất yêu cầu. |
| Hậu điều kiện | Yêu cầu được lưu ở trạng thái PENDING và người dùng chưa được bán hàng. |

<a id="sec_1025"></a>
### UC 03 Xét duyệt gian hàng

| **Thuộc tính** | **Nội dung** |
| --- | --- |
| Tác nhân | Admin |
| Tiền điều kiện | Admin đã đăng nhập; yêu cầu đang PENDING. |
| Kích hoạt | Admin mở chi tiết yêu cầu. |
| Luồng chính | 1. Admin xem thông tin người yêu cầu và gian hàng.  <br>2. Admin chọn Phê duyệt hoặc Từ chối.  <br>3. Nếu phê duyệt, hệ thống chuyển shop sang APPROVED.  <br>4. Nếu từ chối, Admin nhập lý do và hệ thống chuyển sang REJECTED.  <br>5. Hệ thống gửi thông báo kết quả cho người dùng. |
| Ngoại lệ | 1. Yêu cầu không còn PENDING: hệ thống từ chối cập nhật lặp.  <br>2. Admin từ chối nhưng không nhập lý do: hệ thống yêu cầu bổ sung. |
| Hậu điều kiện | Trạng thái gian hàng và thông báo được cập nhật nhất quán. |

<a id="sec_1026"></a>
### UC 04 Quản lý sản phẩm

| **Thuộc tính** | **Nội dung** |
| --- | --- |
| Tác nhân | Chủ gian hàng |
| Tiền điều kiện | Đã đăng nhập; shop APPROVED. |
| Kích hoạt | Chủ shop mở mục Sản phẩm. |
| Luồng chính | 1. Chủ shop chọn thêm mới hoặc chỉnh sửa sản phẩm.  <br>2. Nhập tên, mô tả, giá, tồn kho, danh mục và ảnh.  <br>3. Hệ thống kiểm tra quyền sở hữu và dữ liệu.  <br>4. Ảnh được tải lên Cloudinary.  <br>5. Hệ thống lưu sản phẩm và hiển thị trong danh sách. |
| Ngoại lệ | 1. Shop không APPROVED: từ chối thao tác.  <br>2. Người dùng sửa sản phẩm shop khác: trả về lỗi không có quyền.  <br>3. Giá hoặc tồn kho không hợp lệ: không lưu. |
| Hậu điều kiện | Sản phẩm được tạo hoặc cập nhật đúng gian hàng. |

<a id="sec_1027"></a>
### UC 05 Thêm sản phẩm vào giỏ

| **Thuộc tính** | **Nội dung** |
| --- | --- |
| Tác nhân | Người dùng |
| Tiền điều kiện | Đã đăng nhập; sản phẩm đang bán và còn hàng. |
| Kích hoạt | Người dùng chọn Thêm vào giỏ. |
| Luồng chính | 1. Hệ thống đọc giỏ hiện tại của người dùng.  <br>2. Nếu sản phẩm chưa có, tạo mục giỏ hàng.  <br>3. Nếu đã có, tăng số lượng.  <br>4. Kiểm tra tổng số lượng không vượt tồn kho.  <br>5. Hiển thị giỏ hàng và tổng tạm tính. |
| Ngoại lệ | 1. Sản phẩm hết hàng hoặc bị ẩn: không cho thêm.  <br>2. Số lượng vượt tồn kho: giữ mức tối đa hợp lệ và cảnh báo. |
| Hậu điều kiện | Giỏ hàng được cập nhật, chưa thay đổi tồn kho thật. |

<a id="sec_1028"></a>
### UC 06 Đặt hàng

| **Thuộc tính** | **Nội dung** |
| --- | --- |
| Tác nhân | Người dùng |
| Tiền điều kiện | Đã đăng nhập; giỏ có sản phẩm hợp lệ. |
| Kích hoạt | Người dùng chọn Đặt hàng. |
| Luồng chính | 1. Người dùng xác nhận địa chỉ và phương thức thanh toán.  <br>2. Hệ thống kiểm tra lại tồn kho và trạng thái sản phẩm.  <br>3. Hệ thống nhóm các mục giỏ theo gian hàng.  <br>4. Hệ thống tạo một đơn PENDING cho mỗi gian hàng.  <br>5. Payment Strategy xử lý COD hoặc chuyển khoản mô phỏng.  <br>6. Hệ thống trừ tồn kho, xóa mục đã mua và tạo thông báo cho shop.  <br>7. Hệ thống hiển thị kết quả và mã đơn. |
| Ngoại lệ | 1. Tồn kho thay đổi: yêu cầu người dùng điều chỉnh số lượng.  <br>2. Một nhóm sản phẩm không hợp lệ: không tạo đơn cho nhóm đó và thông báo rõ.  <br>3. Có lỗi lưu dữ liệu: giao dịch được hoàn tác để tránh trừ kho nhưng không có đơn. |
| Hậu điều kiện | Các đơn được tạo nhất quán và có thể theo dõi. |

<a id="sec_1029"></a>
### UC 07 Xử lý đơn hàng

| **Thuộc tính** | **Nội dung** |
| --- | --- |
| Tác nhân | Chủ gian hàng |
| Tiền điều kiện | Shop APPROVED; đơn thuộc shop. |
| Kích hoạt | Chủ shop mở chi tiết đơn bán. |
| Luồng chính | 1. Chủ shop xem thông tin đơn và sản phẩm.  <br>2. Chọn trạng thái kế tiếp hợp lệ.  <br>3. Hệ thống xác nhận quyền và quy tắc chuyển trạng thái.  <br>4. Hệ thống cập nhật đơn và ghi lịch sử.  <br>5. Hệ thống tạo thông báo cho người mua. |
| Ngoại lệ | 1. Đơn không thuộc shop: từ chối truy cập.  <br>2. Trạng thái chuyển không hợp lệ: giữ nguyên và hiển thị lỗi.  <br>3. Đơn đã COMPLETED hoặc CANCELLED: không cho xử lý tiếp. |
| Hậu điều kiện | Trạng thái, lịch sử và thông báo được cập nhật. |

<a id="sec_1030"></a>
### UC 08 Đánh giá sản phẩm

| **Thuộc tính** | **Nội dung** |
| --- | --- |
| Tác nhân | Người dùng |
| Tiền điều kiện | Có đơn COMPLETED chứa sản phẩm; chưa đánh giá mục đó. |
| Kích hoạt | Người dùng chọn Viết đánh giá. |
| Luồng chính | 1. Người dùng chọn từ 1 đến 5 sao và nhập nhận xét.  <br>2. Hệ thống xác minh quyền đánh giá từ order item.  <br>3. Hệ thống lưu đánh giá.  <br>4. Hệ thống tính lại điểm trung bình sản phẩm.  <br>5. Hệ thống thông báo cho chủ shop. |
| Ngoại lệ | 1. Đơn chưa COMPLETED hoặc không thuộc người dùng: từ chối.  <br>2. Đã đánh giá: chuyển sang xem đánh giá hiện có.  <br>3. Điểm ngoài khoảng 1 đến 5: yêu cầu nhập lại. |
| Hậu điều kiện | Đánh giá hợp lệ được hiển thị và không bị trùng. |

<a id="sec_1031"></a>
## 6 Quy tắc nghiệp vụ

| **Mã** | **Nội dung** |
| --- | --- |
| **BR 01** | Mỗi email chỉ thuộc một tài khoản. |
| **BR 02** | Mỗi người dùng chỉ sở hữu tối đa một gian hàng. |
| **BR 03** | Shop PENDING, REJECTED hoặc LOCKED không được đăng sản phẩm hay nhận đơn mới. |
| **BR 04** | Chỉ Admin được phê duyệt, từ chối hoặc khóa gian hàng. |
| **BR 05** | Từ chối gian hàng bắt buộc có lý do. |
| **BR 06** | Mỗi sản phẩm thuộc đúng một gian hàng và một danh mục. |
| **BR 07** | Giá sản phẩm lớn hơn 0; tồn kho không âm. |
| **BR 08** | Giá tại thời điểm mua được lưu trong order item để không bị thay đổi khi giá sản phẩm cập nhật. |
| **BR 09** | Mỗi đơn hàng thuộc đúng một người mua và một gian hàng. |
| **BR 10** | Giỏ có nhiều gian hàng được tách thành nhiều đơn. |
| **BR 11** | Chỉ đơn PENDING hoặc CONFIRMED mới có thể bị hủy theo cấu hình dự án. |
| **BR 12** | Hủy đơn thành công phải hoàn lại tồn kho đúng một lần. |
| **BR 13** | Đơn COMPLETED và CANCELLED là trạng thái kết thúc. |
| **BR 14** | Doanh thu chỉ bao gồm đơn COMPLETED. |
| **BR 15** | Chỉ người mua sở hữu đơn COMPLETED mới được đánh giá sản phẩm trong đơn. |
| **BR 16** | Một người dùng không được lưu trùng một sản phẩm yêu thích. |
| **BR 17** | Thông báo thuộc riêng người nhận và người khác không được đọc hoặc sửa. |
| **BR 18** | Mọi thao tác quản trị quan trọng phải kiểm tra quyền ở backend, không chỉ ẩn nút trên giao diện. |

<a id="sec_1032"></a>
### 6.1 Quy tắc chuyển trạng thái gian hàng

| **Từ trạng thái** | **Hành động** | **Sang trạng thái** | **Tác nhân** |
| --- | --- | --- | --- |
| Không có | Gửi yêu cầu | PENDING | User |
| REJECTED | Chỉnh sửa và gửi lại | PENDING | User |
| PENDING | Phê duyệt | APPROVED | Admin |
| PENDING | Từ chối | REJECTED | Admin |
| APPROVED | Khóa vi phạm | LOCKED | Admin |
| LOCKED | Mở khóa | APPROVED | Admin |

<a id="sec_1033"></a>
### 6.2 Quy tắc chuyển trạng thái đơn hàng

| **Trạng thái hiện tại** | **Trạng thái hợp lệ tiếp theo** |
| --- | --- |
| PENDING | CONFIRMED hoặc CANCELLED |
| CONFIRMED | PREPARING hoặc CANCELLED |
| PREPARING | SHIPPING |
| SHIPPING | COMPLETED |
| COMPLETED | Không có |
| CANCELLED | Không có |

<a id="sec_1034"></a>
## 7 Yêu cầu dữ liệu

Cơ sở dữ liệu sử dụng Supabase PostgreSQL. Tên bảng dùng số nhiều, khóa chính dùng kiểu số hoặc UUID theo quyết định kỹ thuật thống nhất của nhóm. Các trường thời gian nên gồm created\_at và updated\_at khi phù hợp.

| **Bảng** | **Mục đích** | **Trường chính dự kiến** |
| --- | --- | --- |
| users | Tài khoản | id, full\_name, email, password\_hash, phone, address, avatar\_url, avatar\_public\_id, role, account\_status |
| shops | Gian hàng và yêu cầu mở shop | id, owner\_id, shop\_name, description, logo\_url, logo\_public\_id, phone, address, status, rejection\_reason, approved\_by |
| categories | Danh mục | id, name, description, active |
| products | Sản phẩm | id, shop\_id, category\_id, name, description, price, stock\_quantity, status |
| product\_images | Ảnh sản phẩm | id, product\_id, image\_url, public\_id, display\_order |
| carts | Giỏ hàng | id, user\_id |
| cart\_items | Mục giỏ | id, cart\_id, product\_id, quantity |
| orders | Đơn hàng | id, buyer\_id, shop\_id, status, payment\_method, payment\_status, shipping\_address, total\_amount |
| order\_items | Mục đơn hàng | id, order\_id, product\_id, product\_name\_snapshot, unit\_price, quantity, subtotal |
| payments | Kết quả thanh toán mô phỏng | id, order\_id, method, amount, status, transaction\_reference |
| order\_status\_histories | Lịch sử trạng thái | id, order\_id, old\_status, new\_status, changed\_by, changed\_at |
| notifications | Thông báo nội bộ | id, receiver\_id, type, title, content, reference\_id, is\_read, created\_at |
| reviews | Đánh giá | id, user\_id, product\_id, order\_item\_id, rating, comment, created\_at |
| favorites | Sản phẩm yêu thích | id, user\_id, product\_id, created\_at |

<a id="sec_1035"></a>
### 7.1 Chi tiết cấu trúc các bảng

Hệ thống sử dụng 14 bảng. Kiểu dữ liệu dưới đây được thiết kế cho PostgreSQL; PK là khóa chính, FK là khóa ngoại, UNIQUE là không trùng lặp, NOT NULL là bắt buộc và NULL là có thể để trống.

#### 7.1.1 Bảng users Tài khoản người dùng

Lưu tài khoản dùng chung của người mua, chủ gian hàng và quản trị viên. Người bán không có tài khoản riêng; khả năng bán hàng được xác định qua gian hàng đã được duyệt.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh duy nhất của tài khoản. |
| full\_name | VARCHAR(100) | NOT NULL | Họ tên hiển thị của người dùng. |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Email dùng để đăng nhập và nhận thông báo. |
| password\_hash | VARCHAR(255) | NOT NULL | Mật khẩu đã được mã hóa bằng BCrypt. |
| phone | VARCHAR(20) | NULL | Số điện thoại liên hệ. |
| address | TEXT | NULL | Địa chỉ mặc định trong hồ sơ. |
| avatar\_url | TEXT | NULL | Đường dẫn ảnh đại diện trên Cloudinary. |
| avatar\_public\_id | VARCHAR(255) | NULL | Mã ảnh Cloudinary để thay thế hoặc xóa ảnh. |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'USER' | Vai trò hệ thống gồm USER hoặc ADMIN. |
| account\_status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái tài khoản gồm ACTIVE hoặc LOCKED. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm tạo tài khoản. |
| updated\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm cập nhật gần nhất. |

#### 7.1.2 Bảng shops Gian hàng và yêu cầu mở gian hàng

Lưu thông tin gian hàng đồng thời quản lý quy trình gửi yêu cầu, phê duyệt, từ chối và khóa gian hàng.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh duy nhất của gian hàng. |
| owner\_id | BIGINT | FK users(id), NOT NULL, UNIQUE | Chủ sở hữu; mỗi người dùng có tối đa một gian hàng. |
| shop\_name | VARCHAR(150) | NOT NULL | Tên gian hàng hiển thị trên website. |
| description | TEXT | NULL | Nội dung giới thiệu gian hàng. |
| logo\_url | TEXT | NULL | Đường dẫn logo trên Cloudinary. |
| logo\_public\_id | VARCHAR(255) | NULL | Mã logo Cloudinary để quản lý tệp. |
| phone | VARCHAR(20) | NOT NULL | Số điện thoại liên hệ của gian hàng. |
| address | TEXT | NOT NULL | Địa chỉ hoạt động của gian hàng. |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | Trạng thái PENDING, APPROVED, REJECTED hoặc LOCKED; được xử lý bằng State Pattern. |
| rejection\_reason | TEXT | NULL | Lý do Admin từ chối yêu cầu mở gian hàng. |
| approved\_by | BIGINT | FK users(id), NULL | Admin đã duyệt hoặc xử lý yêu cầu. |
| submitted\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm người dùng gửi yêu cầu. |
| approved\_at | TIMESTAMPTZ | NULL | Thời điểm yêu cầu được phê duyệt. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm tạo bản ghi gian hàng. |
| updated\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm cập nhật gần nhất. |

#### 7.1.3 Bảng categories Danh mục sản phẩm

Lưu các nhóm sản phẩm để quản trị viên quản lý và người mua sử dụng khi lọc dữ liệu.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của danh mục. |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Tên danh mục sản phẩm. |
| description | TEXT | NULL | Mô tả ngắn về danh mục. |
| active | BOOLEAN | NOT NULL, DEFAULT TRUE | Cho biết danh mục còn được sử dụng hay đã ẩn. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm tạo danh mục. |
| updated\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm cập nhật gần nhất. |

#### 7.1.4 Bảng products Sản phẩm

Lưu thông tin sản phẩm thuộc từng gian hàng và danh mục. Chủ gian hàng chỉ được thao tác trên sản phẩm của mình.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của sản phẩm. |
| shop\_id | BIGINT | FK shops(id), NOT NULL | Gian hàng sở hữu sản phẩm. |
| category\_id | BIGINT | FK categories(id), NOT NULL | Danh mục của sản phẩm. |
| name | VARCHAR(200) | NOT NULL | Tên sản phẩm. |
| description | TEXT | NULL | Thông tin mô tả chi tiết sản phẩm. |
| price | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Giá bán hiện tại; dùng kiểu số thập phân chính xác. |
| stock\_quantity | INTEGER | NOT NULL, CHECK >= 0 | Số lượng tồn kho hiện tại. |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'ACTIVE' | Trạng thái ACTIVE, HIDDEN hoặc OUT\_OF\_STOCK. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm tạo sản phẩm. |
| updated\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm cập nhật gần nhất. |

#### 7.1.5 Bảng product\_images Hình ảnh sản phẩm

Lưu nhiều hình ảnh cho một sản phẩm. Tệp thật được lưu trên Cloudinary, cơ sở dữ liệu chỉ giữ thông tin tham chiếu.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của hình ảnh. |
| product\_id | BIGINT | FK products(id), NOT NULL | Sản phẩm sở hữu hình ảnh. |
| image\_url | TEXT | NOT NULL | Đường dẫn hiển thị ảnh trên Cloudinary. |
| public\_id | VARCHAR(255) | NOT NULL | Mã Cloudinary dùng để thay thế hoặc xóa tệp. |
| display\_order | INTEGER | NOT NULL, DEFAULT 0 | Thứ tự hiển thị; giá trị nhỏ được ưu tiên trước. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm thêm hình ảnh. |

#### 7.1.6 Bảng carts Giỏ hàng

Đại diện cho giỏ hàng đang hoạt động của một người dùng. Mỗi tài khoản chỉ có một giỏ hàng.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của giỏ hàng. |
| user\_id | BIGINT | FK users(id), NOT NULL, UNIQUE | Người dùng sở hữu giỏ hàng. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm tạo giỏ hàng. |
| updated\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm giỏ hàng thay đổi gần nhất. |

#### 7.1.7 Bảng cart\_items Sản phẩm trong giỏ hàng

Lưu từng sản phẩm và số lượng mà người dùng đã thêm vào giỏ.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của mục giỏ hàng. |
| cart\_id | BIGINT | FK carts(id), NOT NULL | Giỏ hàng chứa mục này. |
| product\_id | BIGINT | FK products(id), NOT NULL | Sản phẩm được thêm vào giỏ. |
| quantity | INTEGER | NOT NULL, CHECK > 0 | Số lượng sản phẩm người dùng muốn mua. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm thêm sản phẩm vào giỏ. |
| updated\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm thay đổi số lượng gần nhất. |
| cart\_id, product\_id | - | UNIQUE | Không cho phép một sản phẩm xuất hiện thành nhiều dòng trong cùng giỏ. |

#### 7.1.8 Bảng orders Đơn hàng theo gian hàng

Lưu đơn hàng của người mua. Khi giỏ có sản phẩm từ nhiều gian hàng, hệ thống tách thành một đơn cho mỗi gian hàng để từng người bán xử lý độc lập.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh nội bộ của đơn hàng. |
| order\_code | VARCHAR(30) | NOT NULL, UNIQUE | Mã đơn dễ đọc để hiển thị và tra cứu. |
| buyer\_id | BIGINT | FK users(id), NOT NULL | Người dùng đặt mua sản phẩm. |
| shop\_id | BIGINT | FK shops(id), NOT NULL | Gian hàng chịu trách nhiệm xử lý đơn. |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | Trạng thái PENDING, CONFIRMED, PREPARING, SHIPPING, COMPLETED hoặc CANCELLED. |
| payment\_method | VARCHAR(20) | NOT NULL | Phương thức COD hoặc BANK\_TRANSFER; được xử lý bằng Strategy Pattern. |
| payment\_status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | Trạng thái PENDING, COD\_PENDING, PAID hoặc FAILED. |
| receiver\_name | VARCHAR(100) | NOT NULL | Tên người nhận tại thời điểm đặt hàng. |
| receiver\_phone | VARCHAR(20) | NOT NULL | Số điện thoại người nhận. |
| shipping\_address | TEXT | NOT NULL | Địa chỉ giao hàng được chụp tại thời điểm đặt. |
| note | TEXT | NULL | Ghi chú giao hàng của người mua. |
| total\_amount | NUMERIC(14,2) | NOT NULL, CHECK >= 0 | Tổng tiền của đơn thuộc một gian hàng. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm đặt hàng. |
| updated\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm cập nhật gần nhất. |

#### 7.1.9 Bảng order\_items Chi tiết đơn hàng

Lưu các sản phẩm thuộc một đơn hàng. Tên và giá được chụp lại để đơn cũ không thay đổi khi người bán sửa sản phẩm.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của dòng sản phẩm trong đơn. |
| order\_id | BIGINT | FK orders(id), NOT NULL | Đơn hàng chứa dòng sản phẩm. |
| product\_id | BIGINT | FK products(id), NOT NULL | Sản phẩm gốc được mua. |
| product\_name\_snapshot | VARCHAR(200) | NOT NULL | Tên sản phẩm tại thời điểm đặt hàng. |
| unit\_price | NUMERIC(12,2) | NOT NULL, CHECK >= 0 | Đơn giá tại thời điểm đặt hàng. |
| quantity | INTEGER | NOT NULL, CHECK > 0 | Số lượng sản phẩm đã đặt. |
| subtotal | NUMERIC(14,2) | NOT NULL, CHECK >= 0 | Thành tiền bằng đơn giá nhân số lượng. |

#### 7.1.10 Bảng payments Thanh toán mô phỏng

Lưu kết quả xử lý thanh toán COD hoặc chuyển khoản mô phỏng. Hệ thống không kết nối ngân hàng thật.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của giao dịch mô phỏng. |
| order\_id | BIGINT | FK orders(id), NOT NULL, UNIQUE | Đơn hàng được thanh toán; mỗi đơn có một kết quả thanh toán. |
| method | VARCHAR(20) | NOT NULL | Phương thức COD hoặc BANK\_TRANSFER. |
| amount | NUMERIC(14,2) | NOT NULL, CHECK >= 0 | Số tiền cần thanh toán. |
| status | VARCHAR(20) | NOT NULL | Trạng thái PENDING, COD\_PENDING, PAID hoặc FAILED. |
| transaction\_reference | VARCHAR(100) | NULL | Mã tham chiếu giả lập cho giao dịch chuyển khoản. |
| paid\_at | TIMESTAMPTZ | NULL | Thời điểm được ghi nhận đã thanh toán. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm tạo kết quả thanh toán. |

#### 7.1.11 Bảng order\_status\_histories Lịch sử trạng thái đơn

Ghi lại mọi lần chuyển trạng thái để người mua theo dõi và nhóm kiểm tra đúng luồng nghiệp vụ.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của bản ghi lịch sử. |
| order\_id | BIGINT | FK orders(id), NOT NULL | Đơn hàng được thay đổi trạng thái. |
| old\_status | VARCHAR(20) | NULL | Trạng thái trước khi thay đổi; có thể rỗng ở lần tạo đầu tiên. |
| new\_status | VARCHAR(20) | NOT NULL | Trạng thái mới của đơn hàng. |
| changed\_by | BIGINT | FK users(id), NOT NULL | Tài khoản thực hiện thay đổi. |
| note | TEXT | NULL | Ghi chú hoặc lý do thay đổi trạng thái. |
| changed\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm thay đổi trạng thái. |

#### 7.1.12 Bảng notifications Thông báo trong website

Lưu thông báo nội bộ về duyệt gian hàng, đơn hàng, tồn kho và đánh giá để người nhận xem lại trong website.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của thông báo. |
| receiver\_id | BIGINT | FK users(id), NOT NULL | Tài khoản nhận thông báo. |
| type | VARCHAR(50) | NOT NULL | Loại sự kiện tạo thông báo. |
| title | VARCHAR(150) | NOT NULL | Tiêu đề ngắn của thông báo. |
| content | TEXT | NOT NULL | Nội dung chi tiết hiển thị cho người nhận. |
| reference\_id | BIGINT | NULL | Mã đối tượng liên quan như đơn hàng hoặc gian hàng. |
| is\_read | BOOLEAN | NOT NULL, DEFAULT FALSE | Đánh dấu người dùng đã đọc hay chưa. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm tạo thông báo. |

#### 7.1.13 Bảng reviews Đánh giá sản phẩm

Lưu điểm số và nhận xét của người đã mua. Mỗi mục hàng trong đơn chỉ được đánh giá một lần bởi đúng người mua.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của đánh giá. |
| user\_id | BIGINT | FK users(id), NOT NULL | Người dùng viết đánh giá. |
| product\_id | BIGINT | FK products(id), NOT NULL | Sản phẩm được đánh giá. |
| order\_item\_id | BIGINT | FK order\_items(id), NOT NULL | Dòng hàng chứng minh người dùng đã mua sản phẩm. |
| rating | SMALLINT | NOT NULL, CHECK 1..5 | Số sao đánh giá từ 1 đến 5. |
| comment | TEXT | NULL | Nội dung nhận xét của người mua. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm tạo đánh giá. |
| updated\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm chỉnh sửa đánh giá gần nhất. |
| user\_id, order\_item\_id | - | UNIQUE | Ngăn một người đánh giá trùng cùng một mục hàng. |

#### 7.1.14 Bảng favorites Sản phẩm yêu thích

Lưu danh sách sản phẩm mà người dùng đánh dấu để xem lại sau.

| **Tên trường** | **Kiểu dữ liệu** | **Ràng buộc** | **Giải thích** |
| --- | --- | --- | --- |
| id | BIGSERIAL | PK | Mã định danh của mục yêu thích. |
| user\_id | BIGINT | FK users(id), NOT NULL | Người dùng lưu sản phẩm. |
| product\_id | BIGINT | FK products(id), NOT NULL | Sản phẩm được yêu thích. |
| created\_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Thời điểm thêm vào danh sách yêu thích. |
| user\_id, product\_id | - | UNIQUE | Không tạo bản ghi yêu thích trùng lặp. |

<a id="sec_1036"></a>
### 7.2 Ràng buộc dữ liệu

- users.email là duy nhất.
- shops.owner\_id là duy nhất để bảo đảm một người dùng chỉ có một gian hàng.
- favorites có ràng buộc duy nhất trên cặp user\_id và product\_id.
- reviews có ràng buộc duy nhất trên order\_item\_id và user\_id.
- order\_items lưu tên và giá chụp tại thời điểm đặt hàng.
- Các khóa ngoại quan trọng không được xóa tùy tiện; ưu tiên trạng thái ẩn hoặc khóa.
- Số tiền dùng kiểu số thập phân chính xác, không dùng float hoặc double cho dữ liệu tiền tệ.

<a id="sec_1037"></a>
### 7.3 Chính sách tạo dữ liệu mẫu

- Tối thiểu một tài khoản Admin và ba tài khoản User.
- Tối thiểu hai gian hàng APPROVED, một yêu cầu PENDING và một yêu cầu REJECTED.
- Tối thiểu ba danh mục và mười hai sản phẩm.
- Tạo đơn ở nhiều trạng thái để trình diễn quản lý đơn và thống kê.
- Không sử dụng thông tin nhạy cảm thật trong dữ liệu demo.

<a id="sec_1038"></a>
## 8 Yêu cầu phi chức năng

| **Mã** | **Nhóm** | **Yêu cầu** |
| --- | --- | --- |
| **NFR 01** | Hiệu năng | Trang danh sách thông thường nên phản hồi trong khoảng 3 giây với dữ liệu demo và mạng ổn định. |
| **NFR 02** | Hiệu năng | Danh sách sản phẩm và đơn hàng phải phân trang khi dữ liệu tăng. |
| **NFR 03** | Bảo mật | Mật khẩu mã hóa bằng BCrypt và không xuất hiện trong log hoặc response. |
| **NFR 04** | Bảo mật | Mọi endpoint quản trị và người bán phải kiểm tra xác thực và quyền ở backend. |
| **NFR 05** | Bảo mật | Thông tin kết nối Supabase, Cloudinary API Secret và các khóa bí mật được lưu bằng biến môi trường. |
| **NFR 06** | Toàn vẹn | Tạo đơn, trừ tồn kho và xóa giỏ phải nằm trong giao dịch cơ sở dữ liệu. |
| **NFR 07** | Dễ dùng | Giao diện responsive, thông báo lỗi gần trường nhập và có xác nhận trước thao tác quan trọng. |
| **NFR 08** | Tương thích | Hỗ trợ phiên bản hiện hành của Chrome, Edge và Firefox trên máy tính. |
| **NFR 09** | Khả trì | Mã nguồn phân lớp rõ; nghiệp vụ không đặt trực tiếp trong Controller. |
| **NFR 10** | Khả kiểm thử | Service quan trọng và các Strategy, State phải có unit test cơ bản. |
| **NFR 11** | Theo dõi lỗi | Lỗi phải được ghi log đủ để chẩn đoán nhưng không lộ mật khẩu hoặc token. |
| **NFR 12** | Sao lưu | Nhóm xuất bản sao schema và dữ liệu demo trước buổi bảo vệ. |

<a id="sec_1039"></a>
## 9 Kiến trúc và công nghệ

<a id="sec_1040"></a>
### 9.1 Kiến trúc phân lớp

| **Lớp** | **Trách nhiệm** |
| --- | --- |
| View | Thymeleaf, HTML, Bootstrap và JavaScript hiển thị giao diện. |
| Controller | Nhận request, kiểm tra dữ liệu đầu vào cơ bản và điều hướng. |
| Service | Thực hiện nghiệp vụ, giao dịch, phân quyền theo dữ liệu và gọi mẫu thiết kế. |
| Repository | Truy cập PostgreSQL thông qua Spring Data JPA. |
| Entity và DTO | Entity ánh xạ dữ liệu; DTO trao đổi dữ liệu với giao diện và tránh lộ trường nhạy cảm. |
| Pattern | Các lớp State, Strategy và Observer tách hành vi có khả năng thay đổi. |

<a id="sec_1041"></a>
### 9.2 Công nghệ sử dụng

| **Thành phần** | **Công nghệ** | **Vai trò** |
| --- | --- | --- |
| Ngôn ngữ | Java 21 | Nghiệp vụ và backend |
| Framework | Spring Boot | Khởi tạo và vận hành ứng dụng |
| Web | Spring MVC và Thymeleaf | Điều khiển và hiển thị giao diện |
| Bảo mật | Spring Security và BCrypt | Xác thực, phân quyền và mã hóa mật khẩu |
| Dữ liệu | Spring Data JPA và Hibernate | ORM và Repository |
| CSDL cloud | Supabase PostgreSQL | Lưu dữ liệu dùng chung |
| Tệp ảnh | Cloudinary | Logo, ảnh đại diện và ảnh sản phẩm |
| Giao diện | Bootstrap 5 và JavaScript | Responsive và tương tác cơ bản |
| Build | Maven | Quản lý dependency |
| Kiểm thử | JUnit 5, Mockito, MockMvc, Postman và trình duyệt | Unit test và kiểm thử request |
| Quản lý mã | Git và GitHub | Làm việc nhóm theo nhánh |
| IDE | VS Code | Viết, chạy và gỡ lỗi mã nguồn |

<a id="sec_1042"></a>
### 9.3 Cấu trúc package dự kiến

Dự án sử dụng modular monolith và chia package theo bounded context để năm thành viên có thể phát triển song song. Mỗi module sở hữu Controller, DTO, Entity, Repository, Service, template, static asset và kiểm thử của mình.

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

Module khác chỉ được sử dụng contract trong package api; không truy cập trực tiếp Entity hoặc Repository của nhau. State Pattern đặt trong merchant.state, Strategy Pattern đặt trong ordering.strategy và Observer sử dụng Spring Event với listener trong engagement.event.

<a id="sec_1043"></a>
## 10 Áp dụng mẫu thiết kế

<a id="sec_1044"></a>
### 10.1 State Pattern cho gian hàng

Vấn đề cần giải quyết là hành vi của gian hàng thay đổi theo trạng thái xét duyệt. Nếu toàn bộ điều kiện được viết bằng nhiều khối if else trong service, mã sẽ khó mở rộng và dễ bỏ sót quy tắc. State Pattern đóng gói hành vi của từng trạng thái thành lớp riêng.

| **Thành phần** | **Trách nhiệm** |
| --- | --- |
| ShopState | Giao diện chung, khai báo các hành vi như canAddProduct, canReceiveOrder và mô tả trạng thái. |
| PendingShopState | Không cho bán; cho phép chờ Admin xử lý. |
| ApprovedShopState | Cho đăng sản phẩm, nhận đơn và quản lý gian hàng. |
| RejectedShopState | Không cho bán; cho phép sửa và gửi lại yêu cầu. |
| LockedShopState | Chặn hoạt động bán cho đến khi Admin mở khóa. |
| ShopContext hoặc ShopService | Chọn State hiện tại và ủy quyền kiểm tra hành vi. |

Tiêu chí chứng minh: cùng một lời gọi kiểm tra quyền bán phải trả kết quả khác nhau theo trạng thái; việc thêm trạng thái mới không buộc sửa nhiều nhánh điều kiện ở các Controller.

<a id="sec_1045"></a>
### 10.2 Strategy Pattern cho thanh toán

COD và chuyển khoản có cách xử lý và thông điệp kết quả khác nhau. Strategy Pattern cung cấp giao diện PaymentStrategy và các triển khai cụ thể, giúp CheckoutService sử dụng một hợp đồng thống nhất.

| **Thành phần** | **Trách nhiệm** |
| --- | --- |
| PaymentStrategy | Giao diện khai báo phương thức xử lý thanh toán mô phỏng. |
| CodPaymentStrategy | Tạo trạng thái chờ thanh toán khi nhận hàng. |
| BankTransferStrategy | Tạo hướng dẫn chuyển khoản và mã tham chiếu đơn. |
| PaymentStrategyFactory | Chọn Strategy dựa trên phương thức người dùng nhập. |
| CheckoutService | Tạo đơn và gọi Strategy mà không phụ thuộc chi tiết từng phương thức. |

Tiêu chí chứng minh: có thể bổ sung một phương thức thanh toán mô phỏng mới bằng một lớp Strategy mới và cập nhật nơi lựa chọn, không sửa thuật toán tạo đơn cốt lõi.

<a id="sec_1046"></a>
### 10.3 Observer Pattern cho thông báo

Observer là mẫu mở rộng không bắt buộc. Phiên bản đầu có thể dùng NotificationService trực tiếp; nếu còn thời gian, nhóm áp dụng Observer để tách nghiệp vụ chính khỏi việc tạo thông báo. Khi trạng thái đơn hoặc gian hàng thay đổi, publisher phát sự kiện và các listener tạo notification tương ứng. Trong Spring Boot, nhóm có thể triển khai bằng application event hoặc giao diện observer tự xây dựng, nhưng phải giải thích nhất quán trong báo cáo.

| **Sự kiện** | **Đối tượng nhận thông báo** |
| --- | --- |
| ShopRequested | Admin |
| ShopApproved hoặc ShopRejected | Chủ gian hàng |
| OrderCreated | Chủ gian hàng |
| OrderStatusChanged | Người mua |
| ReviewCreated | Chủ gian hàng |

<a id="sec_1047"></a>
## 11 Giao diện dự kiến

| **Nhóm màn hình** | **Màn hình** |
| --- | --- |
| Công khai | Trang chủ; danh sách sản phẩm; chi tiết sản phẩm; trang gian hàng; đăng ký; đăng nhập. |
| Người dùng | Hồ sơ; giỏ hàng; checkout; đơn mua; chi tiết đơn; thông báo; yêu thích; viết đánh giá. |
| Kênh người bán | Tổng quan; thông tin gian hàng; sản phẩm; thêm sửa sản phẩm; đơn bán; chi tiết đơn; thống kê. |
| Quản trị | Dashboard; yêu cầu mở shop; chi tiết xét duyệt; danh mục; danh sách gian hàng; khóa mở khóa. |

<a id="sec_1048"></a>
### 11.1 Nguyên tắc giao diện

- Thanh điều hướng thay đổi theo trạng thái đăng nhập và quyền.
- Nút Kênh người bán chỉ xuất hiện khi shop APPROVED; trạng thái khác hiển thị tiến trình phù hợp.
- Form hiển thị lỗi tại trường nhập và giữ lại dữ liệu hợp lệ đã nhập.
- Các thao tác hủy đơn, khóa shop và ẩn sản phẩm phải có xác nhận.
- Trạng thái đơn và gian hàng dùng nhãn chữ rõ ràng, không chỉ dựa vào màu sắc.
- Thiết kế ưu tiên desktop nhưng vẫn sử dụng được trên màn hình nhỏ.

<a id="sec_1049"></a>
## 12 Tiêu chí nghiệm thu

| **Mã** | **Phạm vi** | **Điều kiện đạt** |
| --- | --- | --- |
| **AT 01** | Tài khoản | Đăng ký, đăng nhập, đăng xuất và cập nhật hồ sơ hoạt động; mật khẩu trong CSDL không ở dạng văn bản. |
| **AT 02** | Gian hàng | User gửi yêu cầu; Admin duyệt hoặc từ chối; quyền bán thay đổi đúng theo State. |
| **AT 03** | Sản phẩm | Shop APPROVED tạo và sửa sản phẩm của mình; không thể sửa sản phẩm shop khác. |
| **AT 04** | Tìm kiếm | Tìm theo tên và lọc theo danh mục, giá trả về kết quả phù hợp. |
| **AT 05** | Giỏ hàng | Thêm, sửa, xóa và kiểm tra tồn kho chính xác. |
| **AT 06** | Checkout | Giỏ nhiều shop tạo nhiều đơn; COD và chuyển khoản dùng Strategy tương ứng. |
| **AT 07** | Đơn hàng | Người bán xử lý đúng luồng; người mua theo dõi được; lịch sử trạng thái được ghi. |
| **AT 08** | Thông báo | Các sự kiện bắt buộc tạo thông báo đúng người nhận và có thể đánh dấu đã đọc. |
| **AT 09** | Doanh thu | Doanh thu chỉ cộng đơn COMPLETED của đúng shop. |
| **AT 10** | Đánh giá | Chỉ người đã mua và hoàn tất đơn mới đánh giá; không tạo đánh giá trùng. |
| **AT 11** | Yêu thích | Thêm, xóa và xem danh sách; không tạo bản ghi trùng. |
| **AT 12** | Bảo mật | URL và request trái quyền đều bị chặn ở backend. |

<a id="sec_1050"></a>
### 12.1 Kịch bản trình diễn

1. Đăng nhập User A và gửi yêu cầu mở gian hàng.

2. Đăng nhập Admin, từ chối một lần có lý do; User A sửa và gửi lại; Admin phê duyệt.

3. User A vào Kênh người bán và đăng sản phẩm.

4. Đăng nhập User B, tìm sản phẩm, thêm sản phẩm từ hai shop vào giỏ và checkout bằng COD.

5. Đăng nhập chủ shop, xác nhận và cập nhật trạng thái đơn; User B nhận thông báo.

6. Hoàn tất đơn; User B đánh giá sản phẩm và thêm một sản phẩm khác vào yêu thích.

7. Chủ shop xem doanh thu đã cập nhật từ đơn COMPLETED.

<a id="sec_1051"></a>
## 13 Phạm vi ngoài hệ thống

Các chức năng dưới đây không thuộc phiên bản giữa kỳ. Việc loại bỏ giúp nhóm hoàn thành chắc chắn luồng chính trong thời gian ba đến bốn tuần.

- Thanh toán ngân hàng hoặc ví điện tử thật.
- Tích hợp đơn vị vận chuyển và theo dõi GPS.
- Chat realtime giữa người mua và người bán.
- Voucher, flash sale, đấu giá hoặc livestream.
- Đăng nhập mạng xã hội, OTP qua SMS hoặc xác minh danh tính.
- Gợi ý sản phẩm bằng trí tuệ nhân tạo.
- Kiến trúc microservices, Kafka hoặc hệ thống phân tán.
- Ứng dụng di động riêng.

<a id="sec_1052"></a>
<a id="sec_1053"></a>
## 14 Quy tắc Git

- Sử dụng main cho phiên bản ổn định và develop để tích hợp.
- Mỗi module có nhánh feature riêng; không đẩy trực tiếp vào main.
- Pull request phải được ít nhất một thành viên khác kiểm tra.
- Merge sớm và đều đặn; không chờ cuối dự án mới tích hợp.
- Mọi thay đổi schema phải được thông báo và quản lý bằng migration hoặc script SQL có phiên bản.

<a id="sec_1054"></a>
## 15 Phụ lục

<a id="sec_1055"></a>
### 15.1 Danh sách trạng thái

| **Đối tượng** | **Giá trị** |
| --- | --- |
| Tài khoản | ACTIVE, LOCKED |
| Gian hàng | PENDING, APPROVED, REJECTED, LOCKED |
| Sản phẩm | ACTIVE, HIDDEN, OUT\_OF\_STOCK |
| Đơn hàng | PENDING, CONFIRMED, PREPARING, SHIPPING, COMPLETED, CANCELLED |
| Thanh toán | PENDING, PAID, FAILED hoặc COD\_PENDING tùy thiết kế chi tiết |

<a id="sec_1056"></a>
### 15.2 Điều kiện đóng băng yêu cầu

Nhóm ưu tiên hoàn thiện yêu cầu bắt buộc trước khi bổ sung yêu cầu mới. Các thay đổi được ghi vào lịch sử phiên bản của tài liệu.

<a id="sec_1057"></a>
### 15.3 Danh sách nội dung cần nhóm điền

- Tên trường, khoa, lớp học phần và giảng viên.
- Tên nhóm, họ tên và mã sinh viên của năm thành viên.
- Tên chính thức của website và logo nếu có.
- Ngày hoàn thành, đường dẫn GitHub và đường dẫn bản triển khai.
- Quyết định cuối về kiểu khóa chính, quy tắc hủy đơn và dữ liệu mẫu.
