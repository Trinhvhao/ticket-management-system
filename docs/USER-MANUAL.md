# Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Ticket

**Phiên bản:** 1.0  
**Ngày cập nhật:** 18/01/2026  
**Công ty:** TNHH 28H

---

## 📋 Mục Lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Đăng nhập & Đăng ký](#2-đăng-nhập--đăng-ký)
3. [Hướng dẫn cho Employee](#3-hướng-dẫn-cho-employee)
4. [Hướng dẫn cho IT Staff](#4-hướng-dẫn-cho-it-staff)
5. [Hướng dẫn cho Admin](#5-hướng-dẫn-cho-admin)
6. [Câu hỏi thường gặp](#6-câu-hỏi-thường-gặp)

---

## 1. Giới Thiệu

### 1.1 Hệ thống là gì?

Hệ thống Quản lý Ticket là nền tảng số hóa quy trình hỗ trợ kỹ thuật của Công ty TNHH 28H. Thay vì gọi điện hoặc nhắn tin, nhân viên có thể tạo ticket để yêu cầu hỗ trợ và theo dõi tiến độ xử lý.

### 1.2 Các vai trò trong hệ thống

| Vai trò | Mô tả | Quyền hạn |
|---------|-------|-----------|
| **Employee** | Nhân viên công ty | Tạo và theo dõi ticket của mình |
| **IT Staff** | Nhân viên IT | Xử lý tất cả ticket, quản lý SLA |
| **Admin** | Quản trị viên | Toàn quyền quản lý hệ thống |

### 1.3 Truy cập hệ thống

- **URL:** https://your-domain.com
- **Hỗ trợ:** support@28h.com
- **Hotline:** 1900-xxxx

---

## 2. Đăng Nhập & Đăng Ký

### 2.1 Đăng ký tài khoản mới

1. Truy cập trang chủ hệ thống
2. Click nút **"Đăng ký"**
3. Điền thông tin:
   - Họ và tên
   - Email công ty
   - Mật khẩu (tối thiểu 8 ký tự)
   - Xác nhận mật khẩu
4. Click **"Đăng ký"**
5. Kiểm tra email để xác nhận tài khoản (nếu có)

### 2.2 Đăng nhập

1. Nhập email và mật khẩu
2. Click **"Đăng nhập"**
3. Hệ thống sẽ chuyển đến Dashboard

### 2.3 Quên mật khẩu

1. Click **"Quên mật khẩu?"**
2. Nhập email đã đăng ký
3. Kiểm tra email để nhận link đặt lại mật khẩu
4. Click link và tạo mật khẩu mới

### 2.4 Đổi mật khẩu

1. Vào **Settings** → **Profile**
2. Click **"Đổi mật khẩu"**
3. Nhập mật khẩu hiện tại
4. Nhập mật khẩu mới
5. Xác nhận mật khẩu mới
6. Click **"Cập nhật"**

---

## 3. Hướng Dẫn cho Employee

### 3.1 Tạo Ticket Mới

#### Bước 1: Vào trang tạo ticket
- Click **"Tickets"** trên menu
- Click nút **"+ Tạo Ticket"**

#### Bước 2: Điền thông tin ticket
- **Tiêu đề:** Mô tả ngắn gọn vấn đề (bắt buộc)
- **Danh mục:** Chọn loại vấn đề (Hardware, Software, Network, v.v.)
- **Độ ưu tiên:** 
  - **Low:** Không ảnh hưởng công việc
  - **Medium:** Ảnh hưởng một phần
  - **High:** Ảnh hưởng nghiêm trọng, cần xử lý gấp
- **Mô tả chi tiết:** Mô tả đầy đủ vấn đề, các bước đã thử

#### Bước 3: Đính kèm file (nếu cần)
- Click **"Chọn file"** hoặc kéo thả file
- Hỗ trợ: Ảnh, PDF, Word, Excel (tối đa 10MB)
- Có thể đính kèm nhiều file

#### Bước 4: Gửi ticket
- Click **"Tạo Ticket"**
- Hệ thống sẽ tự động tạo mã ticket (VD: TKT-2026-0001)
- Bạn sẽ nhận thông báo khi có cập nhật

### 3.2 Theo Dõi Ticket

#### Xem danh sách ticket của tôi
1. Vào **"Tickets"** → **"My Tickets"**
2. Xem tất cả ticket đã tạo
3. Lọc theo trạng thái:
   - **New:** Mới tạo, chưa được xử lý
   - **Assigned:** Đã giao cho IT Staff
   - **In Progress:** Đang được xử lý
   - **Pending:** Chờ thông tin từ bạn
   - **Resolved:** Đã giải quyết xong
   - **Closed:** Đã đóng

#### Xem chi tiết ticket
1. Click vào ticket muốn xem
2. Xem thông tin:
   - Trạng thái hiện tại
   - Người xử lý
   - Thời gian dự kiến hoàn thành (SLA)
   - Lịch sử thay đổi
   - Bình luận và cập nhật

### 3.3 Tương Tác với Ticket

#### Thêm bình luận
1. Mở ticket
2. Cuộn xuống phần **"Comments"**
3. Nhập nội dung bình luận
4. Click **"Gửi"**

#### Cung cấp thêm thông tin
- Khi ticket ở trạng thái **Pending**, IT Staff đang chờ thông tin từ bạn
- Thêm bình luận với thông tin cần thiết
- Đính kèm file nếu cần (ảnh chụp màn hình, log file)

#### Đánh giá sau khi giải quyết
1. Khi ticket chuyển sang **Resolved**
2. Bạn sẽ thấy form đánh giá
3. Chọn số sao (1-5 sao)
4. Viết nhận xét (tùy chọn)
5. Click **"Gửi đánh giá"**

#### Mở lại ticket
- Nếu vấn đề chưa được giải quyết hoàn toàn
- Click **"Reopen Ticket"**
- Giải thích lý do mở lại

### 3.4 Sử Dụng Chatbot

#### Mở chatbot
- Click icon chat ở góc dưới bên phải
- Chatbot sẽ chào và hỏi bạn cần gì

#### Tìm kiếm giải pháp
1. Gõ câu hỏi hoặc mô tả vấn đề
2. Chatbot sẽ tìm kiếm trong Knowledge Base
3. Xem các bài viết liên quan
4. Click vào bài viết để xem chi tiết

#### Tạo ticket qua chatbot
1. Nếu không tìm thấy giải pháp
2. Click **"Tạo Ticket"**
3. Điền thông tin và gửi

### 3.5 Thông Báo

#### Xem thông báo
- Click icon chuông ở góc trên bên phải
- Số badge hiển thị số thông báo chưa đọc

#### Các loại thông báo
- Ticket được giao cho IT Staff
- Ticket có cập nhật mới
- Ticket được giải quyết
- Yêu cầu thêm thông tin

#### Quản lý thông báo
- Click vào thông báo để xem chi tiết ticket
- Click **"Mark as Read"** để đánh dấu đã đọc
- Click **"Mark All as Read"** để đánh dấu tất cả

---

## 4. Hướng Dẫn cho IT Staff

### 4.1 Xem và Quản Lý Ticket

#### Dashboard
- Xem tổng quan ticket cần xử lý
- **Action Required:** Ticket mới và chưa giao
- **Assigned to Me:** Ticket được giao cho bạn
- **SLA At Risk:** Ticket sắp quá hạn

#### Danh sách ticket
1. Vào **"Tickets"** → **"All Tickets"**
2. Xem tất cả ticket trong hệ thống
3. Lọc theo:
   - Trạng thái
   - Độ ưu tiên
   - Danh mục
   - Người tạo
   - Người xử lý

#### Kanban Board
1. Vào **"Tickets"** → **"Kanban"**
2. Xem ticket theo cột trạng thái
3. Kéo thả ticket để thay đổi trạng thái

### 4.2 Xử Lý Ticket

#### Nhận ticket
1. Mở ticket mới (status: NEW)
2. Click **"Assign to Me"**
3. Hoặc giao cho IT Staff khác

#### Bắt đầu xử lý
1. Mở ticket đã được giao
2. Click **"Start Progress"**
3. Trạng thái chuyển sang **In Progress**

#### Thêm internal note
1. Viết ghi chú chỉ IT Staff thấy
2. Chọn **"Internal Note"**
3. Ghi lại các bước đã thử, kết quả

#### Yêu cầu thêm thông tin
1. Click **"Change Status"** → **"Pending"**
2. Thêm comment giải thích cần thông tin gì
3. User sẽ nhận thông báo

#### Giải quyết ticket
1. Khi đã xử lý xong
2. Click **"Resolve"**
3. Nhập **Resolution Notes** (mô tả cách giải quyết)
4. Click **"Confirm"**

#### Đóng ticket
- Ticket tự động đóng sau 24h kể từ khi Resolved
- Hoặc click **"Close"** để đóng ngay

### 4.3 Quản Lý SLA

#### Xem SLA của ticket
- Mỗi ticket có due date dựa trên priority
- **High:** 4 giờ
- **Medium:** 24 giờ
- **Low:** 72 giờ

#### SLA Status
- **Met:** Còn nhiều thời gian
- **At Risk:** Đã dùng 80% thời gian
- **Breached:** Quá hạn

#### Xem ticket at risk
1. Vào **"SLA"** → **"At Risk"**
2. Ưu tiên xử lý các ticket này
3. Tránh breach SLA

### 4.4 Knowledge Base

#### Tạo bài viết mới
1. Vào **"Knowledge Base"**
2. Click **"+ New Article"**
3. Điền:
   - Tiêu đề
   - Nội dung (rich text editor)
   - Danh mục
   - Tags
4. Chọn **"Published"** hoặc **"Draft"**
5. Click **"Save"**

#### Chỉnh sửa bài viết
1. Mở bài viết
2. Click **"Edit"**
3. Cập nhật nội dung
4. Click **"Save"**

### 4.5 Báo Cáo

#### Xem báo cáo
1. Vào **"Reports"**
2. Xem các metrics:
   - Total tickets
   - SLA compliance rate
   - Average resolution time
   - Tickets by status/priority

#### Staff Performance (Admin only)
- Xem hiệu suất của từng IT Staff
- Số ticket đã xử lý
- Thời gian xử lý trung bình
- Tỷ lệ SLA compliance

---

## 5. Hướng Dẫn cho Admin

### 5.1 Quản Lý User

#### Tạo user mới
1. Vào **"Users"**
2. Click **"+ New User"**
3. Điền thông tin:
   - Full Name
   - Email
   - Password
   - Role (Employee/IT_Staff/Admin)
   - Department
4. Click **"Create"**

#### Chỉnh sửa user
1. Click vào user
2. Click **"Edit"**
3. Cập nhật thông tin
4. Click **"Save"**

#### Vô hiệu hóa user
1. Mở user
2. Toggle **"Active"** → **"Inactive"**
3. User không thể đăng nhập

### 5.2 Quản Lý Categories

#### Tạo category mới
1. Vào **"Categories"**
2. Click **"+ New Category"**
3. Điền:
   - Name
   - Description
   - Icon
   - Color
4. Click **"Create"**

#### Chỉnh sửa category
1. Click vào category
2. Click **"Edit"**
3. Cập nhật thông tin
4. Click **"Save"**

### 5.3 Quản Lý SLA Rules

#### Tạo SLA rule
1. Vào **"SLA Rules"**
2. Click **"+ New Rule"**
3. Điền:
   - Priority (High/Medium/Low)
   - Response Time (giờ)
   - Resolution Time (giờ)
4. Click **"Create"**

#### Chỉnh sửa SLA rule
1. Click vào rule
2. Click **"Edit"**
3. Cập nhật thời gian
4. Click **"Save"**

**Lưu ý:** SLA tính theo giờ làm việc (8:00-17:30, Thứ 2-6)

### 5.4 Quản Lý Auto-Escalation

#### Tạo escalation rule
1. Vào **"Escalation"**
2. Click **"+ New Rule"**
3. Cấu hình:
   - **Name:** Tên rule
   - **Trigger Type:**
     - SLA Breached: Khi quá hạn SLA
     - SLA At Risk: Khi đạt 80% SLA
     - No Assignment: Khi chưa giao sau X giờ
     - No Response: Khi không có hoạt động sau X giờ
   - **Trigger Hours:** Số giờ (cho time-based triggers)
   - **Escalation Level:** 1-5
   - **Target Type:**
     - Role: Giao cho role (workload balanced)
     - User: Giao cho user cụ thể
     - Manager: Giao cho tất cả Admin
   - **Filters:** Priority, Category (optional)
   - **Notify Manager:** Gửi thông báo cho Admin
4. Click **"Create"**

#### Xem escalation history
1. Vào **"Escalation"** → **"History"**
2. Xem tất cả escalation đã xảy ra
3. Lọc theo date range

#### Trigger manual check
- Click **"Run Check Now"** để chạy escalation ngay
- Hữu ích khi test rules mới

### 5.5 Quản Lý Holidays

**Lưu ý:** Hiện tại quản lý qua SQL

```sql
-- Thêm ngày lễ mới
INSERT INTO holidays (name, date, "isRecurring", "createdAt", "updatedAt")
VALUES ('Tết Nguyên Đán 2027', '2027-01-29', false, NOW(), NOW());

-- Xem tất cả holidays
SELECT * FROM holidays ORDER BY date;

-- Xóa holiday
DELETE FROM holidays WHERE id = X;
```

### 5.6 Cấu Hình Email (Optional)

#### SMTP Settings
1. Vào **"Settings"** → **"Email"**
2. Cấu hình:
   - SMTP Host
   - SMTP Port
   - SMTP User
   - SMTP Password
   - From Email
3. Click **"Test Connection"**
4. Click **"Save"**

#### Email Templates
- Ticket Created
- Ticket Assigned
- Ticket Resolved
- SLA Warning
- SLA Breached

---

## 6. Câu Hỏi Thường Gặp

### Q1: Tôi quên mật khẩu, làm sao?
**A:** Click "Quên mật khẩu?" ở trang đăng nhập, nhập email và làm theo hướng dẫn trong email.

### Q2: Ticket của tôi bao lâu được xử lý?
**A:** Tùy độ ưu tiên:
- High: 4 giờ
- Medium: 24 giờ
- Low: 72 giờ

### Q3: Tôi có thể hủy ticket không?
**A:** Không thể hủy, nhưng có thể đóng ticket nếu không cần nữa. Liên hệ IT Staff để đóng.

### Q4: Tôi có thể tạo bao nhiêu ticket?
**A:** Không giới hạn. Tạo ticket riêng cho mỗi vấn đề.

### Q5: File đính kèm có giới hạn gì?
**A:** 
- Kích thước: Tối đa 10MB/file
- Loại file: Ảnh, PDF, Word, Excel, ZIP
- Số lượng: Không giới hạn

### Q6: Tôi không nhận được thông báo email?
**A:** Kiểm tra:
1. Folder Spam/Junk
2. Email đăng ký có đúng không
3. Liên hệ Admin để kiểm tra cấu hình SMTP

### Q7: Chatbot có thể làm gì?
**A:** 
- Tìm kiếm giải pháp trong Knowledge Base
- Trả lời câu hỏi thường gặp
- Hướng dẫn tạo ticket
- Không thể xử lý ticket thay IT Staff

### Q8: SLA là gì?
**A:** Service Level Agreement - Thời gian cam kết xử lý ticket. Giúp đảm bảo ticket được xử lý kịp thời.

### Q9: Tại sao ticket của tôi bị escalate?
**A:** Ticket tự động escalate khi:
- Quá hạn SLA
- Sắp quá hạn SLA (80%)
- Chưa được giao sau X giờ
- Không có hoạt động sau X giờ

### Q10: Tôi có thể xem ticket của người khác không?
**A:** 
- Employee: Chỉ xem ticket của mình
- IT Staff: Xem tất cả ticket
- Admin: Xem tất cả ticket

---

## 📞 Hỗ Trợ

**Email:** support@28h.com  
**Hotline:** 1900-xxxx  
**Giờ làm việc:** 8:00-17:30, Thứ 2-6

**Hỗ trợ khẩn cấp:** 
- Gọi hotline
- Tạo ticket với priority **High**

---

*Hướng dẫn sử dụng phiên bản 1.0*  
*Cập nhật: 18/01/2026*  
*© 2026 Công ty TNHH 28H*
