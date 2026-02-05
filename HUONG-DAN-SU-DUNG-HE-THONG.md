# 📖 HƯỚNG DẪN SỬ DỤNG HỆ THỐNG QUẢN LÝ TICKET

**Tác giả:** Nguyễn Thị Thu Trang  
**Lớp:** ĐH12C2  
**Công ty:** TNHH 28H  
**Phiên bản:** 1.0  
**Ngày cập nhật:** 27/01/2026

---

## 📋 MỤC LỤC

1. [Giới thiệu hệ thống](#1-giới-thiệu-hệ-thống)
2. [Đăng nhập và bắt đầu](#2-đăng-nhập-và-bắt-đầu)
3. [Hướng dẫn cho Nhân viên](#3-hướng-dẫn-cho-nhân-viên)
4. [Hướng dẫn cho IT Staff](#4-hướng-dẫn-cho-it-staff)
5. [Hướng dẫn cho Admin](#5-hướng-dẫn-cho-admin)
6. [Sử dụng Chatbot AI](#6-sử-dụng-chatbot-ai)
7. [Câu hỏi thường gặp](#7-câu-hỏi-thường-gặp)

---

## 1. GIỚI THIỆU HỆ THỐNG

### 1.1 Hệ thống là gì?

Hệ thống Quản lý Ticket là nền tảng giúp nhân viên công ty yêu cầu hỗ trợ kỹ thuật một cách dễ dàng và có tổ chức. Thay vì gọi điện hoặc nhắn tin trực tiếp cho IT, bạn tạo một "ticket" (phiếu yêu cầu) trên hệ thống.

### 1.2 Lợi ích

**Cho Nhân viên:**
- Tạo yêu cầu hỗ trợ mọi lúc, mọi nơi
- Theo dõi tiến độ xử lý real-time
- Không cần nhớ số điện thoại IT
- Có bằng chứng về yêu cầu và giải pháp

**Cho IT Staff:**
- Quản lý tập trung tất cả yêu cầu
- Không bỏ sót yêu cầu nào
- Ưu tiên xử lý theo độ khẩn cấp
- Có lịch sử để tham khảo

**Cho Công ty:**
- Minh bạch quy trình hỗ trợ
- Báo cáo chi tiết về hiệu suất
- Phát hiện vấn đề thường gặp
- Cải thiện chất lượng dịch vụ IT

### 1.3 Ai sử dụng hệ thống?

**Employee (Nhân viên):** Người cần hỗ trợ kỹ thuật  
**IT Staff (Nhân viên IT):** Người xử lý yêu cầu hỗ trợ  
**Admin (Quản trị viên):** Người quản lý hệ thống và đánh giá hiệu suất

---

## 2. ĐĂNG NHẬP VÀ BẮT ĐẦU

### 2.1 Truy cập hệ thống

Mở trình duyệt web (Chrome, Edge, Firefox) và truy cập:
```
https://ticket.28h.com
```

### 2.2 Đăng nhập

**Bước 1:** Nhập email công ty của bạn  
**Bước 2:** Nhập mật khẩu  
**Bước 3:** Click nút "Đăng nhập"

**Lưu ý:** Nếu chưa có tài khoản, liên hệ Admin để được cấp.

### 2.3 Quên mật khẩu

**Bước 1:** Click "Quên mật khẩu?" ở trang đăng nhập  
**Bước 2:** Nhập email của bạn  
**Bước 3:** Kiểm tra email để nhận link đặt lại mật khẩu  
**Bước 4:** Click link và tạo mật khẩu mới

### 2.4 Giao diện chính

Sau khi đăng nhập, bạn sẽ thấy:

**Thanh menu bên trái:**
- Dashboard (Trang chủ)
- Tickets (Danh sách ticket)
- Knowledge Base (Cơ sở tri thức)
- Reports (Báo cáo - chỉ IT/Admin)

**Góc trên phải:**
- Icon chuông: Thông báo
- Avatar: Thông tin tài khoản, đăng xuất

---

## 3. HƯỚNG DẪN CHO NHÂN VIÊN

### 3.1 Tạo Ticket Mới

#### Khi nào cần tạo ticket?

- Máy tính bị lỗi, chạy chậm
- Không kết nối được mạng/WiFi
- Quên mật khẩu các hệ thống
- Cần cài đặt phần mềm mới
- Máy in không hoạt động
- Yêu cầu hỗ trợ kỹ thuật khác

#### Cách tạo ticket

**Bước 1: Vào trang tạo ticket**
- Click "Tickets" trên menu
- Click nút "+ Tạo Ticket"

**Bước 2: Điền thông tin**

**Tiêu đề** (bắt buộc)
- Mô tả ngắn gọn vấn đề
- Ví dụ: "Máy in tầng 2 không in được"

**Danh mục** (bắt buộc)
- Chọn loại vấn đề:
  - Hardware: Máy tính, máy in, thiết bị
  - Software: Phần mềm, ứng dụng
  - Network: Mạng, WiFi, Internet
  - Account & Access: Tài khoản, mật khẩu
  - Other: Vấn đề khác

**Độ ưu tiên** (bắt buộc)
- **Low (Thấp):** Không ảnh hưởng công việc, có thể đợi
  - Ví dụ: Hỏi cách sử dụng tính năng mới
- **Medium (Trung bình):** Ảnh hưởng một phần công việc
  - Ví dụ: Máy tính chạy chậm nhưng vẫn dùng được
- **High (Cao):** Ảnh hưởng nghiêm trọng, cần xử lý gấp
  - Ví dụ: Máy tính không bật được, không làm việc được

**Mô tả chi tiết** (bắt buộc)
- Giải thích rõ vấn đề
- Các bước đã thử
- Thời gian xảy ra lỗi
- Ví dụ:
  ```
  Máy in Canon tầng 2 báo lỗi "Paper Jam" nhưng không có giấy kẹt.
  Tôi đã thử:
  - Tắt mở lại máy in
  - Kiểm tra khay giấy
  Vẫn không in được. Lỗi xảy ra từ sáng nay.
  ```

**File đính kèm** (tùy chọn)
- Ảnh chụp màn hình lỗi
- File log nếu có
- Click "Chọn file" hoặc kéo thả file
- Hỗ trợ: JPG, PNG, PDF, Word, Excel (tối đa 10MB)

**Bước 3: Gửi ticket**
- Kiểm tra lại thông tin
- Click "Tạo Ticket"
- Hệ thống sẽ tạo mã ticket (VD: TKT-2026-0001)
- Bạn nhận thông báo khi có cập nhật

### 3.2 Theo Dõi Ticket

#### Xem danh sách ticket của tôi

**Bước 1:** Click "Tickets" → "My Tickets"  
**Bước 2:** Xem tất cả ticket đã tạo

**Các trạng thái ticket:**

🔵 **New (Mới):** Ticket vừa tạo, chưa có ai xử lý  
🟡 **Assigned (Đã giao):** Đã giao cho IT Staff  
🟠 **In Progress (Đang xử lý):** IT đang xử lý  
🟣 **Pending (Chờ phản hồi):** IT cần thêm thông tin từ bạn  
🟢 **Resolved (Đã giải quyết):** IT đã xử lý xong  
⚫ **Closed (Đã đóng):** Hoàn tất, không còn vấn đề

#### Xem chi tiết ticket

**Bước 1:** Click vào ticket muốn xem  
**Bước 2:** Xem thông tin:
- Trạng thái hiện tại
- Người xử lý
- Thời gian dự kiến hoàn thành (SLA)
- Lịch sử thay đổi
- Bình luận và cập nhật

### 3.3 Tương Tác với Ticket

#### Thêm bình luận

Khi cần cung cấp thêm thông tin hoặc hỏi thêm:

**Bước 1:** Mở ticket  
**Bước 2:** Cuộn xuống phần "Comments"  
**Bước 3:** Nhập nội dung bình luận  
**Bước 4:** Click "Gửi"

IT Staff sẽ nhận thông báo và trả lời bạn.

#### Cung cấp thông tin khi được yêu cầu

Khi ticket ở trạng thái **Pending** (màu tím):
- IT Staff đang chờ thông tin từ bạn
- Xem comment của IT để biết cần cung cấp gì
- Trả lời bằng cách thêm comment
- Đính kèm file nếu cần (ảnh chụp màn hình, log...)

#### Đánh giá sau khi giải quyết

Khi ticket chuyển sang **Resolved**:

**Bước 1:** Kiểm tra vấn đề đã được giải quyết chưa  
**Bước 2:** Nếu OK, đánh giá dịch vụ:
- Chọn số sao (1-5 sao)
  - 5 sao: Rất hài lòng
  - 4 sao: Hài lòng
  - 3 sao: Bình thường
  - 2 sao: Không hài lòng
  - 1 sao: Rất không hài lòng
- Viết nhận xét (tùy chọn)
- Click "Gửi đánh giá"

**Bước 3:** Click "Close" để đóng ticket

#### Mở lại ticket

Nếu vấn đề chưa được giải quyết hoàn toàn:

**Bước 1:** Mở ticket đã Resolved  
**Bước 2:** Click "Reopen Ticket"  
**Bước 3:** Giải thích lý do mở lại  
**Bước 4:** Click "Xác nhận"

Ticket sẽ quay lại trạng thái Assigned để IT xử lý tiếp.

### 3.4 Sử dụng Tìm Kiếm và Lọc

#### Tìm kiếm ticket

**Bước 1:** Vào trang "My Tickets"  
**Bước 2:** Nhập từ khóa vào ô tìm kiếm  
**Bước 3:** Hệ thống tìm trong tiêu đề và mô tả

#### Lọc ticket

**Theo trạng thái:**
- Click tab "Tất cả", "Đang xử lý", "Đã xong"

**Theo thời gian:**
- Sắp xếp theo "Mới nhất" hoặc "Cũ nhất"

---

## 4. HƯỚNG DẪN CHO IT STAFF

### 4.1 Dashboard và Tổng Quan

#### Xem Dashboard

Sau khi đăng nhập, IT Staff thấy Dashboard với:

**Action Required (Cần xử lý):**
- Số ticket mới chưa được giao
- Số ticket được giao cho bạn
- Số ticket sắp quá hạn SLA

**Thống kê:**
- Tổng số ticket
- Ticket theo trạng thái
- SLA compliance (tỷ lệ đúng hạn)
- Hiệu suất cá nhân

### 4.2 Xem và Quản Lý Ticket

#### Xem tất cả ticket

**Bước 1:** Click "Tickets" → "All Tickets"  
**Bước 2:** Xem danh sách tất cả ticket trong hệ thống

#### Lọc ticket

**Theo trạng thái:**
- New, Assigned, In Progress, Pending, Resolved, Closed

**Theo độ ưu tiên:**
- High, Medium, Low

**Theo người tạo:**
- Chọn nhân viên cụ thể

**Theo người xử lý:**
- Assigned to Me: Ticket của bạn
- Unassigned: Ticket chưa có ai nhận
- Chọn IT Staff khác

**Theo SLA:**
- Quá hạn SLA: Ticket đã quá thời gian cam kết
- Sắp quá hạn: Ticket sắp hết hạn (còn < 2 giờ)

#### Xem chi tiết ticket

Click vào ticket để xem:
- Thông tin đầy đủ
- Lịch sử thay đổi
- Comments (public và internal)
- File đính kèm
- SLA status

### 4.3 Nhận và Xử Lý Ticket

#### Nhận ticket mới

**Cách 1: Tự nhận**
- Xem danh sách ticket New
- Chọn ticket phù hợp với kỹ năng
- Click "Assign to Me"

**Cách 2: Được giao**
- Admin giao ticket cho bạn
- Bạn nhận thông báo

#### Bắt đầu xử lý

**Bước 1:** Mở ticket đã được giao  
**Bước 2:** Click "Start Progress"  
**Bước 3:** Trạng thái chuyển sang "In Progress"  
**Bước 4:** User nhận thông báo: "Ticket đang được xử lý"

#### Cập nhật tiến độ

**Internal Note (Ghi chú nội bộ):**
- Chỉ IT Staff thấy
- Ghi lại các bước đã thử
- Kết quả kiểm tra
- Ví dụ: "Đã kiểm tra máy in, phát hiện hết mực"

**Public Comment (Bình luận công khai):**
- User cũng thấy
- Thông báo tiến độ cho user
- Ví dụ: "Đang kiểm tra máy in, sẽ cập nhật trong 15 phút"

#### Yêu cầu thêm thông tin

Khi cần thêm thông tin từ user:

**Bước 1:** Click "Change Status" → "Pending"  
**Bước 2:** Thêm comment giải thích cần thông tin gì  
**Bước 3:** User nhận thông báo và trả lời

Ví dụ comment:
```
Anh cho em hỏi:
1. Anh đang dùng trình duyệt nào?
2. Lỗi này xuất hiện từ khi nào?
3. Anh có thử trình duyệt khác chưa?
```

#### Giải quyết ticket

Khi đã xử lý xong vấn đề:

**Bước 1:** Click "Resolve"  
**Bước 2:** Nhập "Resolution Notes" (Ghi chú giải pháp)

Ví dụ:
```
Đã thay mực máy in và reset máy.
Máy in hoạt động bình thường.
Hướng dẫn user cách kiểm tra mực.
```

**Bước 3:** Click "Confirm"  
**Bước 4:** Trạng thái chuyển sang "Resolved"  
**Bước 5:** User nhận thông báo và đánh giá

#### Đóng ticket

**Tự động:** Ticket tự động đóng sau 24h kể từ khi Resolved  
**Thủ công:** Click "Close" để đóng ngay

### 4.4 Giao Ticket

#### Giao cho IT Staff khác

Khi không thể xử lý hoặc cần chuyên môn khác:

**Bước 1:** Mở ticket  
**Bước 2:** Click "Assign"  
**Bước 3:** Chọn IT Staff phù hợp  
**Bước 4:** Thêm ghi chú (tùy chọn)  
**Bước 5:** Click "Confirm"

IT Staff mới nhận thông báo.

### 4.5 Quản Lý SLA

#### Hiểu về SLA

**SLA (Service Level Agreement):** Thời gian cam kết xử lý ticket

**Thời gian SLA theo độ ưu tiên:**
- High: 4 giờ làm việc
- Medium: 24 giờ làm việc (1 ngày)
- Low: 72 giờ làm việc (3 ngày)

**Lưu ý:**
- Chỉ tính giờ làm việc: 8:00-17:30, Thứ 2-6
- Không tính cuối tuần và ngày lễ

#### Trạng thái SLA

**Met (Đúng hạn):** Còn nhiều thời gian - Màu xanh  
**At Risk (Sắp quá hạn):** Đã dùng 80% thời gian - Màu vàng  
**Breached (Quá hạn):** Đã quá thời gian cam kết - Màu đỏ

#### Xem ticket sắp quá hạn

**Bước 1:** Click "SLA" → "At Risk"  
**Bước 2:** Ưu tiên xử lý các ticket này  
**Bước 3:** Tránh để ticket breach SLA

#### Xử lý ticket quá hạn

Ticket quá hạn sẽ:
- Tự động escalate (leo thang) lên Admin
- Hiển thị màu đỏ
- Ảnh hưởng đến đánh giá hiệu suất

**Cách xử lý:**
- Ưu tiên xử lý ngay
- Giải thích lý do chậm trễ (nếu có)
- Hoàn thành càng sớm càng tốt

### 4.6 Tạo Knowledge Base

#### Khi nào nên tạo bài viết?

- Vấn đề thường gặp, lặp lại nhiều lần
- Hướng dẫn sử dụng hệ thống
- Giải pháp cho lỗi phổ biến
- FAQ (Câu hỏi thường gặp)

#### Cách tạo bài viết

**Bước 1:** Click "Knowledge Base" → "+ New Article"

**Bước 2:** Điền thông tin

**Tiêu đề:**
- Rõ ràng, dễ hiểu
- Ví dụ: "Hướng dẫn kết nối WiFi 28H-Staff"

**Nội dung:**
- Viết chi tiết, từng bước
- Có ảnh minh họa nếu được
- Dễ hiểu cho người không chuyên

**Danh mục:**
- Chọn category phù hợp

**Tags (Từ khóa):**
- Thêm từ khóa để dễ tìm kiếm
- Ví dụ: wifi, mạng, kết nối

**Trạng thái:**
- Draft: Lưu nháp, chưa công khai
- Published: Xuất bản, mọi người thấy

**Bước 3:** Click "Save"

#### Chỉnh sửa bài viết

**Bước 1:** Vào Knowledge Base  
**Bước 2:** Tìm bài viết cần sửa  
**Bước 3:** Click "Edit"  
**Bước 4:** Cập nhật nội dung  
**Bước 5:** Click "Save"

### 4.7 Xem Báo Cáo Cá Nhân

#### Truy cập báo cáo

**Bước 1:** Click "Reports" → "My Performance"  
**Bước 2:** Xem các chỉ số:

**Số ticket đã xử lý:**
- Tổng số ticket assigned
- Số ticket resolved
- Tỷ lệ hoàn thành

**Thời gian xử lý trung bình:**
- Trung bình bao nhiêu giờ/ticket
- So sánh với team

**SLA Compliance:**
- Tỷ lệ % ticket đúng hạn
- Số ticket quá hạn

**Đánh giá từ user:**
- Rating trung bình (1-5 sao)
- Feedback từ user

**Workload hiện tại:**
- Số ticket đang xử lý
- Số ticket chờ xử lý

---

## 5. HƯỚNG DẪN CHO ADMIN

### 5.1 Quản Lý Người Dùng

#### Xem danh sách người dùng

**Bước 1:** Click "Users"  
**Bước 2:** Xem tất cả user trong hệ thống

**Lọc theo:**
- Role: Employee, IT_Staff, Admin
- Department: IT, Kế toán, Marketing...
- Status: Active, Inactive

#### Tạo người dùng mới

**Bước 1:** Click "+ New User"

**Bước 2:** Điền thông tin

**Thông tin cơ bản:**
- Full Name: Họ tên đầy đủ
- Email: Email công ty (dùng để đăng nhập)
- Password: Mật khẩu tạm (user sẽ đổi sau)
- Phone: Số điện thoại

**Phân quyền:**
- Role: Chọn Employee, IT_Staff, hoặc Admin
- Department: Chọn phòng ban

**Bước 3:** Click "Create"  
**Bước 4:** Thông báo cho user về tài khoản

#### Chỉnh sửa người dùng

**Bước 1:** Click vào user cần sửa  
**Bước 2:** Click "Edit"  
**Bước 3:** Cập nhật thông tin  
**Bước 4:** Click "Save"

#### Vô hiệu hóa người dùng

Khi nhân viên nghỉ việc:

**Bước 1:** Mở user  
**Bước 2:** Toggle "Active" → "Inactive"  
**Bước 3:** User không thể đăng nhập

**Lưu ý:** Không xóa user để giữ lịch sử ticket.

### 5.2 Quản Lý Categories

#### Xem danh sách categories

**Bước 1:** Click "Settings" → "Categories"  
**Bước 2:** Xem tất cả danh mục

#### Tạo category mới

**Bước 1:** Click "+ New Category"

**Bước 2:** Điền thông tin
- Name: Tên danh mục
- Description: Mô tả
- Icon: Chọn icon
- Color: Chọn màu

**Bước 3:** Click "Create"

#### Chỉnh sửa category

**Bước 1:** Click vào category  
**Bước 2:** Click "Edit"  
**Bước 3:** Cập nhật thông tin  
**Bước 4:** Click "Save"

### 5.3 Cấu Hình SLA Rules

#### Xem SLA rules hiện tại

**Bước 1:** Click "Settings" → "SLA Rules"  
**Bước 2:** Xem quy tắc cho từng priority

#### Chỉnh sửa SLA rule

**Bước 1:** Click vào rule cần sửa  
**Bước 2:** Click "Edit"

**Bước 3:** Cập nhật thời gian
- Response Time: Thời gian phản hồi (giờ)
- Resolution Time: Thời gian giải quyết (giờ)

**Bước 4:** Click "Save"

**Lưu ý:** Thay đổi SLA chỉ áp dụng cho ticket mới.

### 5.4 Quản Lý Auto-Escalation

#### Xem escalation rules

**Bước 1:** Click "Settings" → "Escalation"  
**Bước 2:** Xem tất cả quy tắc leo thang

#### Tạo escalation rule mới

**Bước 1:** Click "+ New Rule"

**Bước 2:** Cấu hình rule

**Thông tin cơ bản:**
- Name: Tên quy tắc
- Description: Mô tả

**Điều kiện kích hoạt:**
- Trigger Type:
  - SLA Breached: Khi quá hạn SLA
  - SLA At Risk: Khi đạt 80% SLA
  - No Assignment: Khi chưa giao sau X giờ
  - No Response: Khi không có hoạt động sau X giờ
- Trigger Hours: Số giờ (cho time-based triggers)

**Hành động:**
- Escalation Level: Mức độ leo thang (1-5)
- Target Type:
  - Role: Giao cho role (workload balanced)
  - User: Giao cho user cụ thể
  - Manager: Giao cho tất cả Admin
- Target Role/User: Chọn cụ thể

**Bộ lọc (tùy chọn):**
- Priority: Chỉ áp dụng cho priority nào
- Category: Chỉ áp dụng cho category nào

**Thông báo:**
- Notify Manager: Gửi thông báo cho Admin

**Bước 3:** Click "Create"

#### Bật/Tắt escalation rule

**Bước 1:** Vào danh sách rules  
**Bước 2:** Toggle "Active" / "Inactive"

#### Xem escalation history

**Bước 1:** Click "Escalation" → "History"  
**Bước 2:** Xem tất cả escalation đã xảy ra  
**Bước 3:** Lọc theo date range

### 5.5 Xem Báo Cáo Tổng Quan

#### Dashboard Admin

**Bước 1:** Click "Dashboard"  
**Bước 2:** Xem tổng quan:

**Tổng số ticket:**
- Theo trạng thái
- Theo độ ưu tiên
- Theo danh mục

**SLA Compliance:**
- Tỷ lệ % đúng hạn
- Số ticket quá hạn
- Số ticket sắp quá hạn

**Xu hướng:**
- Ticket tạo mới theo ngày/tuần/tháng
- Ticket giải quyết theo ngày/tuần/tháng
- So sánh với kỳ trước

**Hiệu suất IT Staff:**
- Bảng xếp hạng
- Số ticket đã xử lý
- Thời gian xử lý trung bình
- SLA compliance
- Rating trung bình

#### Báo cáo chi tiết

**Bước 1:** Click "Reports"  
**Bước 2:** Chọn loại báo cáo:

**Báo cáo theo thời gian:**
- Chọn date range
- Xem số liệu trong khoảng đó
- Export ra Excel/PDF

**Báo cáo theo danh mục:**
- Phân tích từng category
- Category nào có vấn đề nhiều nhất
- Thời gian xử lý trung bình

**Báo cáo hiệu suất:**
- So sánh giữa các IT Staff
- Phát hiện điểm mạnh/yếu
- Đề xuất cải thiện

---

## 6. SỬ DỤNG CHATBOT AI

### 6.1 Chatbot là gì?

Chatbot là trợ lý ảo thông minh giúp bạn:
- Tìm giải pháp nhanh cho vấn đề thường gặp
- Trả lời câu hỏi 24/7
- Hướng dẫn sử dụng hệ thống
- Tạo ticket nhanh nếu cần

### 6.2 Mở Chatbot

**Cách 1:** Click icon chat ở góc dưới bên phải  
**Cách 2:** Nhấn phím tắt: Ctrl + K

### 6.3 Hỏi Chatbot

#### Các câu hỏi Chatbot có thể trả lời

**Hướng dẫn sử dụng:**
- "Làm sao kết nối WiFi?"
- "Cách đặt phòng họp?"
- "Hướng dẫn sử dụng ERP?"
- "Làm sao reset mật khẩu?"

**Thông tin hệ thống:**
- "Giờ làm việc của IT?"
- "Làm sao liên hệ IT?"
- "Mật khẩu WiFi là gì?"

**Khắc phục sự cố:**
- "Máy tính chạy chậm phải làm sao?"
- "Không kết nối được mạng?"
- "Máy in báo lỗi?"

**Về hệ thống:**
- "Làm sao tạo ticket?"
- "Xem ticket của tôi ở đâu?"
- "Project này của ai?"

#### Cách hỏi hiệu quả

**Nên:**
- Hỏi rõ ràng, cụ thể
- Mô tả vấn đề chi tiết
- Ví dụ: "Làm sao kết nối WiFi 28H-Staff trên Windows 10?"

**Không nên:**
- Hỏi quá chung chung
- Ví dụ: "Máy tính lỗi" (không rõ lỗi gì)

### 6.4 Chatbot Trả Lời

#### Chatbot tìm thấy giải pháp

Chatbot sẽ:
- Trả lời câu hỏi của bạn
- Gợi ý các bài viết liên quan
- Cung cấp link để xem chi tiết

**Ví dụ:**
```
Bạn: Làm sao kết nối WiFi?

Chatbot: Để kết nối WiFi 28H-Staff, bạn làm theo các bước sau:

1. Mở WiFi trên máy tính
2. Chọn mạng "28H-Staff"
3. Nhập mật khẩu: 28h@2024
4. Click "Kết nối"

Nếu không kết nối được, vui lòng kiểm tra:
- WiFi đã bật chưa
- Mật khẩu nhập đúng chưa
- Máy tính có trong danh sách cho phép không

Xem thêm: [Hướng dẫn kết nối WiFi chi tiết]
```

#### Chatbot không tìm thấy giải pháp

Chatbot sẽ:
- Xin lỗi không tìm thấy
- Gợi ý tạo ticket
- Cung cấp link tạo ticket nhanh

**Ví dụ:**
```
Bạn: Máy tính bị lỗi màn hình xanh

Chatbot: Xin lỗi, tôi không tìm thấy thông tin về vấn đề này 
trong cơ sở kiến thức.

Bạn có muốn tạo ticket để được IT Staff hỗ trợ trực tiếp không?

[Tạo Ticket] [Thử tìm kiếm khác]
```

### 6.5 Tạo Ticket qua Chatbot

**Bước 1:** Click "Tạo Ticket" trong chat  
**Bước 2:** Chatbot hỏi thông tin:
- Tiêu đề ticket
- Danh mục
- Độ ưu tiên
- Mô tả chi tiết

**Bước 3:** Trả lời từng câu hỏi  
**Bước 4:** Xác nhận thông tin  
**Bước 5:** Ticket được tạo tự động

### 6.6 Tips Sử Dụng Chatbot

**Thử Chatbot trước:**
- Trước khi tạo ticket, hỏi Chatbot
- Có thể tự giải quyết được vấn đề đơn giản
- Tiết kiệm thời gian cho cả hai bên

**Hỏi rõ ràng:**
- Càng cụ thể càng tốt
- Cung cấp đủ thông tin

**Xem bài viết gợi ý:**
- Chatbot gợi ý bài viết liên quan
- Click vào để xem chi tiết
- Có thể tìm thấy giải pháp

**Đánh giá câu trả lời:**
- Click "Helpful" nếu hữu ích
- Click "Not Helpful" nếu không giúp được
- Giúp Chatbot học và cải thiện

---

## 7. CÂU HỎI THƯỜNG GẶP

### 7.1 Về Tài Khoản

**Q: Tôi quên mật khẩu, làm sao?**

A: Click "Quên mật khẩu?" ở trang đăng nhập, nhập email và làm theo hướng dẫn trong email.

**Q: Tôi muốn đổi mật khẩu?**

A: Vào Settings → Profile → Đổi mật khẩu.

**Q: Tôi chưa có tài khoản?**

A: Liên hệ Admin để được cấp tài khoản.

### 7.2 Về Ticket

**Q: Ticket của tôi bao lâu được xử lý?**

A: Tùy độ ưu tiên:
- High: 4 giờ làm việc
- Medium: 24 giờ làm việc
- Low: 72 giờ làm việc

**Q: Tôi có thể hủy ticket không?**

A: Không thể hủy, nhưng có thể đóng ticket nếu không cần nữa. Liên hệ IT Staff để đóng.

**Q: Tôi có thể tạo bao nhiêu ticket?**

A: Không giới hạn. Tạo ticket riêng cho mỗi vấn đề.

**Q: Tôi có thể sửa ticket đã tạo không?**

A: Không thể sửa trực tiếp. Thêm comment để cung cấp thông tin mới.

**Q: Làm sao biết ticket của tôi đang ở đâu?**

A: Xem trạng thái ticket:
- New: Chưa có ai xử lý
- Assigned: Đã giao cho IT
- In Progress: Đang xử lý
- Pending: Chờ thông tin từ bạn
- Resolved: Đã xong
- Closed: Hoàn tất

### 7.3 Về File Đính Kèm

**Q: File đính kèm có giới hạn gì?**

A: 
- Kích thước: Tối đa 10MB/file
- Loại file: Ảnh (JPG, PNG), PDF, Word, Excel, ZIP
- Số lượng: Không giới hạn

**Q: Tôi không upload được file?**

A: Kiểm tra:
- File có quá 10MB không?
- Loại file có được hỗ trợ không?
- Kết nối mạng có ổn định không?

### 7.4 Về Thông Báo

**Q: Tôi không nhận được thông báo?**

A: Kiểm tra:
- Thông báo trong hệ thống (icon chuông)
- Email spam/junk folder
- Cài đặt thông báo trong Profile

**Q: Tôi nhận quá nhiều thông báo?**

A: Vào Settings → Notifications để tùy chỉnh loại thông báo muốn nhận.

### 7.5 Về SLA

**Q: SLA là gì?**

A: Service Level Agreement - Thời gian cam kết xử lý ticket. Giúp đảm bảo ticket được xử lý kịp thời.

**Q: Tại sao ticket của tôi bị escalate?**

A: Ticket tự động escalate khi:
- Quá hạn SLA
- Sắp quá hạn SLA (80%)
- Chưa được giao sau X giờ
- Không có hoạt động sau X giờ

**Q: Escalate có nghĩa là gì?**

A: Leo thang - Chuyển ticket lên cấp cao hơn hoặc giao cho người khác để xử lý nhanh hơn.

### 7.6 Về Chatbot

**Q: Chatbot có thể làm gì?**

A: 
- Trả lời câu hỏi thường gặp
- Hướng dẫn sử dụng hệ thống
- Tìm kiếm trong Knowledge Base
- Hỗ trợ tạo ticket nhanh

**Q: Chatbot không hiểu câu hỏi của tôi?**

A: Thử:
- Hỏi rõ ràng hơn
- Dùng từ khóa khác
- Hoặc tạo ticket để IT Staff hỗ trợ trực tiếp

**Q: Chatbot có thay thế IT Staff không?**

A: Không. Chatbot chỉ hỗ trợ cho vấn đề đơn giản. Vấn đề phức tạp vẫn cần IT Staff xử lý.

### 7.7 Về Knowledge Base

**Q: Tôi có thể tạo bài viết Knowledge Base không?**

A: Chỉ IT Staff và Admin mới có quyền tạo bài viết.

**Q: Làm sao tìm bài viết trong Knowledge Base?**

A: 
- Dùng ô tìm kiếm
- Lọc theo category
- Xem bài viết phổ biến
- Hỏi Chatbot

**Q: Bài viết không đúng/lỗi thời?**

A: Báo cho IT Staff để cập nhật. Click "Report Issue" ở cuối bài viết.

### 7.8 Về Hiệu Suất

**Q: Trang web load chậm?**

A: Thử:
- Refresh trang (F5)
- Clear cache trình duyệt (Ctrl + Shift + Delete)
- Đổi trình duyệt khác
- Kiểm tra kết nối mạng

**Q: Tôi gặp lỗi khi sử dụng?**

A: 
- Chụp màn hình lỗi
- Tạo ticket với ảnh chụp màn hình
- Mô tả các bước dẫn đến lỗi

### 7.9 Về Bảo Mật

**Q: Mật khẩu của tôi có an toàn không?**

A: Có. Mật khẩu được mã hóa, không ai thấy được kể cả Admin.

**Q: Tôi nên đổi mật khẩu thường xuyên không?**

A: Nên đổi mỗi 3-6 tháng. Dùng mật khẩu mạnh: ít nhất 8 ký tự, có chữ hoa, chữ thường, số, ký tự đặc biệt.

**Q: Ai có thể xem ticket của tôi?**

A: 
- Bạn (người tạo)
- IT Staff được giao
- Admin
- Không ai khác

### 7.10 Về Hỗ Trợ

**Q: Tôi cần hỗ trợ khẩn cấp?**

A: 
- Tạo ticket với priority High
- Hoặc gọi hotline: 1900-xxxx
- Email: support@28h.com

**Q: Giờ làm việc của IT?**

A: 8:00-17:30, Thứ 2-6. Ngoài giờ, tạo ticket và IT sẽ xử lý vào ngày làm việc tiếp theo.

**Q: Tôi có câu hỏi về hệ thống?**

A: 
- Hỏi Chatbot
- Xem Knowledge Base
- Tạo ticket với category "Other"
- Email: support@28h.com

---

## 8. LIÊN HỆ VÀ HỖ TRỢ

### 8.1 Thông Tin Liên Hệ

**Email hỗ trợ:** support@28h.com  
**Hotline:** 1900-xxxx  
**Giờ làm việc:** 8:00-17:30, Thứ 2-6

### 8.2 Hỗ Trợ Khẩn Cấp

**Trong giờ làm việc:**
- Gọi hotline: 1900-xxxx
- Tạo ticket với priority High

**Ngoài giờ làm việc:**
- Tạo ticket (IT sẽ xử lý sáng hôm sau)
- Email: support@28h.com

### 8.3 Phản Hồi và Góp Ý

Chúng tôi luôn lắng nghe ý kiến của bạn để cải thiện hệ thống.

**Cách gửi phản hồi:**
- Tạo ticket với category "Feedback"
- Email: feedback@28h.com
- Đánh giá sau khi ticket được giải quyết

**Chúng tôi muốn nghe:**
- Tính năng bạn muốn có
- Vấn đề bạn gặp phải
- Cải thiện bạn đề xuất
- Trải nghiệm sử dụng của bạn

---

## 9. TIPS SỬ DỤNG HIỆU QUẢ

### 9.1 Cho Nhân Viên

**Tạo ticket hiệu quả:**
- Tiêu đề rõ ràng, ngắn gọn
- Mô tả chi tiết vấn đề
- Đính kèm ảnh chụp màn hình
- Chọn đúng priority

**Theo dõi ticket:**
- Check thông báo thường xuyên
- Trả lời nhanh khi IT hỏi thêm
- Đánh giá sau khi xong

**Tự giải quyết:**
- Thử Chatbot trước
- Xem Knowledge Base
- Tìm kiếm bài viết liên quan

### 9.2 Cho IT Staff

**Quản lý thời gian:**
- Ưu tiên ticket High và At Risk
- Xử lý ticket theo thứ tự SLA
- Cập nhật tiến độ thường xuyên

**Giao tiếp:**
- Trả lời user nhanh chóng
- Giải thích rõ ràng, dễ hiểu
- Cập nhật tiến độ cho user biết

**Tạo Knowledge Base:**
- Viết bài cho vấn đề thường gặp
- Hướng dẫn chi tiết, có ảnh
- Cập nhật khi có thay đổi

### 9.3 Cho Admin

**Giám sát:**
- Check dashboard hàng ngày
- Xem SLA compliance
- Theo dõi hiệu suất team

**Cải thiện:**
- Phân tích vấn đề thường gặp
- Đầu tư vào giải pháp lâu dài
- Training cho user và IT

**Báo cáo:**
- Xuất báo cáo định kỳ
- Trình bày cho Ban Giám Đốc
- Đề xuất cải thiện

---

## PHỤ LỤC

### A. Bảng Thuật Ngữ

**Ticket:** Phiếu yêu cầu hỗ trợ kỹ thuật  
**SLA:** Service Level Agreement - Thời gian cam kết xử lý  
**Escalation:** Leo thang - Chuyển ticket lên cấp cao hơn  
**Priority:** Độ ưu tiên (High, Medium, Low)  
**Status:** Trạng thái ticket (New, Assigned, In Progress...)  
**Knowledge Base:** Cơ sở tri thức - Thư viện bài viết hướng dẫn  
**Chatbot:** Trợ lý ảo thông minh  
**Dashboard:** Trang tổng quan  
**Comment:** Bình luận, trao đổi trong ticket  
**Attachment:** File đính kèm  

### B. Phím Tắt

**Ctrl + K:** Mở Chatbot  
**Ctrl + N:** Tạo ticket mới (trong trang Tickets)  
**Ctrl + F:** Tìm kiếm  
**Ctrl + /:** Xem danh sách phím tắt  
**Esc:** Đóng modal/popup  

### C. Trạng Thái Ticket

🔵 **New:** Mới tạo, chưa xử lý  
🟡 **Assigned:** Đã giao cho IT  
🟠 **In Progress:** Đang xử lý  
🟣 **Pending:** Chờ phản hồi  
🟢 **Resolved:** Đã giải quyết  
⚫ **Closed:** Đã đóng  

### D. Độ Ưu Tiên

🔴 **High:** Khẩn cấp - SLA 4 giờ  
🟡 **Medium:** Trung bình - SLA 24 giờ  
🟢 **Low:** Thấp - SLA 72 giờ  

---

**© 2026 Công ty TNHH 28H**

**Tài liệu này được tạo để hướng dẫn sử dụng Hệ thống Quản lý Ticket.**

**Nếu có thắc mắc, vui lòng liên hệ: support@28h.com**

---

**Phiên bản:** 1.0  
**Ngày cập nhật:** 27/01/2026  
**Tác giả:** Nguyễn Thị Thu Trang - Lớp ĐH12C2

**HẾT**
