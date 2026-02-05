# 📚 HỆ THỐNG QUẢN LÝ TICKET - HƯỚNG DẪN TOÀN DIỆN

**Tác giả:** Nguyễn Thị Thu Trang  
**Lớp:** ĐH12C2  
**Công ty:** TNHH 28H  
**Ngày cập nhật:** 27/01/2026

---

## 📋 MỤC LỤC

1. [Giới thiệu tổng quan](#1-giới-thiệu-tổng-quan)
2. [Bối cảnh và mục tiêu](#2-bối-cảnh-và-mục-tiêu)
3. [Người dùng hệ thống](#3-người-dùng-hệ-thống)
4. [Kiến trúc hệ thống](#4-kiến-trúc-hệ-thống)
5. [Công nghệ sử dụng](#5-công-nghệ-sử-dụng)
6. [Cơ sở dữ liệu](#6-cơ-sở-dữ-liệu)
7. [Chức năng chính](#7-chức-năng-chính)
8. [Quy trình vận hành](#8-quy-trình-vận-hành)
9. [Tính năng nổi bật](#9-tính-năng-nổi-bật)
10. [Bảo mật và phân quyền](#10-bảo-mật-và-phân-quyền)
11. [Triển khai và vận hành](#11-triển-khai-và-vận-hành)
12. [Kết luận](#12-kết-luận)

---

## 1. GIỚI THIỆU TỔNG QUAN

### 1.1 Hệ thống là gì?

**Hệ thống Quản lý Ticket** (Ticket Management System) là một ứng dụng web hiện đại được phát triển để số hóa toàn bộ quy trình hỗ trợ kỹ thuật của Công ty TNHH 28H. 

Thay vì nhân viên phải gọi điện thoại, gửi email hoặc nhắn tin trực tiếp cho bộ phận IT khi gặp sự cố, họ có thể tạo một "ticket" (phiếu yêu cầu) trên hệ thống. Ticket này sẽ được theo dõi, xử lý và giải quyết một cách có hệ thống, minh bạch và hiệu quả.

### 1.2 Vấn đề cần giải quyết

**Trước khi có hệ thống:**
- Nhân viên gọi điện hoặc nhắn tin trực tiếp cho IT khi có vấn đề
- Không có cách theo dõi tiến độ xử lý
- Dễ bị quên hoặc bỏ sót yêu cầu
- Không có báo cáo, thống kê về hiệu suất
- Khó quản lý độ ưu tiên các yêu cầu
- Không có cơ sở tri thức để tự giải quyết vấn đề thường gặp

**Sau khi có hệ thống:**
- Tất cả yêu cầu được ghi nhận và theo dõi
- Có thời gian cam kết xử lý (SLA)
- Tự động phân công và nhắc nhở
- Báo cáo chi tiết về hiệu suất
- Có chatbot AI hỗ trợ tự động
- Có cơ sở tri thức để tự tra cứu

### 1.3 Lợi ích mang lại

**Cho nhân viên:**
- Dễ dàng tạo yêu cầu hỗ trợ mọi lúc mọi nơi
- Theo dõi tiến độ xử lý real-time
- Nhận thông báo khi có cập nhật
- Tìm kiếm giải pháp nhanh qua chatbot

**Cho bộ phận IT:**
- Quản lý tập trung tất cả yêu cầu
- Ưu tiên xử lý theo độ khẩn cấp
- Tránh bỏ sót hoặc quên yêu cầu
- Có lịch sử xử lý để tham khảo

**Cho quản lý:**
- Báo cáo chi tiết về hiệu suất
- Đánh giá năng suất nhân viên IT
- Phát hiện vấn đề thường gặp
- Ra quyết định dựa trên dữ liệu

---

## 2. BỐI CẢNH VÀ MỤC TIÊU

### 2.1 Bối cảnh dự án

Công ty TNHH 28H là một doanh nghiệp có khoảng 100-200 nhân viên. Trước đây, khi nhân viên gặp vấn đề về máy tính, mạng, phần mềm, họ thường:
- Gọi điện trực tiếp cho IT
- Gửi email cho IT
- Nhắn tin qua Zalo/Telegram
- Đến tận bàn làm việc của IT

Cách làm này gây ra nhiều vấn đề:
- IT bị gián đoạn công việc liên tục
- Khó theo dõi yêu cầu nào đã xử lý, chưa xử lý
- Không có bằng chứng về thời gian xử lý
- Khó đánh giá hiệu suất làm việc

### 2.2 Mục tiêu dự án

**Mục tiêu chính:**
1. **Số hóa quy trình** - Chuyển từ thủ công sang hệ thống tự động
2. **Tăng hiệu quả** - Giảm thời gian xử lý, tăng năng suất
3. **Minh bạch hóa** - Mọi người đều thấy được tiến độ
4. **Tuân thủ chuẩn** - Áp dụng tiêu chuẩn ITIL/ITSM quốc tế

**Mục tiêu cụ thể:**
- Giảm 50% thời gian xử lý yêu cầu thường gặp
- Tăng 80% độ hài lòng của nhân viên
- Có báo cáo chi tiết về hiệu suất hàng tháng
- Tự động hóa 30% yêu cầu qua chatbot AI

### 2.3 Phạm vi dự án

**Trong phạm vi:**
- Quản lý yêu cầu hỗ trợ kỹ thuật (IT Support)
- Quản lý SLA (Service Level Agreement)
- Chatbot AI hỗ trợ tự động
- Cơ sở tri thức (Knowledge Base)
- Báo cáo và thống kê

**Ngoài phạm vi:**
- Quản lý tài sản IT (Asset Management)
- Quản lý thay đổi (Change Management)
- Quản lý sự cố (Incident Management)
- Tích hợp với hệ thống ERP

---

## 3. NGƯỜI DÙNG HỆ THỐNG

### 3.1 Phân loại người dùng

Hệ thống có 3 loại người dùng chính, mỗi loại có vai trò và quyền hạn khác nhau:

#### **A. Employee (Nhân viên)**

**Ai là Employee?**
- Tất cả nhân viên trong công ty
- Người cần hỗ trợ kỹ thuật
- Không thuộc bộ phận IT

**Họ làm gì?**
- Tạo ticket khi gặp vấn đề
- Theo dõi tiến độ xử lý ticket
- Cung cấp thêm thông tin khi IT yêu cầu
- Đánh giá chất lượng dịch vụ sau khi xong
- Sử dụng chatbot để tìm giải pháp nhanh

**Ví dụ thực tế:**
- Anh Nam ở phòng Kế toán máy tính bị lỗi → Tạo ticket
- Chị Lan ở phòng Marketing quên mật khẩu WiFi → Hỏi chatbot
- Anh Tuấn ở phòng Kinh doanh cần cài phần mềm mới → Tạo ticket

#### **B. IT Staff (Nhân viên IT)**

**Ai là IT Staff?**
- Nhân viên thuộc bộ phận IT
- Người trực tiếp xử lý các yêu cầu
- Có kiến thức kỹ thuật

**Họ làm gì?**
- Nhận và xử lý ticket được giao
- Cập nhật tiến độ xử lý
- Yêu cầu thêm thông tin nếu cần
- Giải quyết vấn đề và đóng ticket
- Tạo bài viết trong Knowledge Base
- Xem báo cáo hiệu suất cá nhân

**Ví dụ thực tế:**
- Anh Hùng nhận ticket về máy in bị lỗi → Đến kiểm tra → Sửa xong → Đóng ticket
- Chị Mai nhận ticket về cài phần mềm → Hướng dẫn qua điện thoại → Cập nhật tiến độ
- Anh Đức viết bài hướng dẫn kết nối WiFi vào Knowledge Base

#### **C. Admin (Quản trị viên)**

**Ai là Admin?**
- Trưởng phòng IT
- Quản lý hệ thống
- Người có toàn quyền

**Họ làm gì?**
- Quản lý tài khoản người dùng
- Cấu hình quy tắc SLA
- Xem báo cáo tổng quan
- Đánh giá hiệu suất nhân viên IT
- Cấu hình tự động leo thang (escalation)
- Quản lý danh mục và phân loại

**Ví dụ thực tế:**
- Anh Minh (Trưởng phòng IT) xem báo cáo tháng để đánh giá nhân viên
- Chị Hoa cấu hình SLA: Ticket khẩn cấp phải xử lý trong 4 giờ
- Anh Bình tạo tài khoản cho nhân viên mới

### 3.2 So sánh quyền hạn

| Chức năng | Employee | IT Staff | Admin |
|-----------|----------|----------|-------|
| Tạo ticket | ✅ | ✅ | ✅ |
| Xem ticket của mình | ✅ | ✅ | ✅ |
| Xem tất cả ticket | ❌ | ✅ | ✅ |
| Nhận và xử lý ticket | ❌ | ✅ | ✅ |
| Phân công ticket | ❌ | ✅ | ✅ |
| Xóa ticket | ❌ | ❌ | ✅ |
| Quản lý người dùng | ❌ | ❌ | ✅ |
| Cấu hình SLA | ❌ | ❌ | ✅ |
| Xem báo cáo | ❌ | Cá nhân | Toàn bộ |
| Tạo Knowledge Base | ❌ | ✅ | ✅ |
| Sử dụng Chatbot | ✅ | ✅ | ✅ |

---

## 4. KIẾN TRÚC HỆ THỐNG

### 4.1 Mô hình tổng quan

Hệ thống được xây dựng theo mô hình **3 tầng** (3-Tier Architecture), một kiến trúc phổ biến và hiệu quả:

```
┌─────────────────────────────────────────────┐
│         TẦNG 1: GIAO DIỆN (Frontend)        │
│                                             │
│  - Giao diện web người dùng nhìn thấy      │
│  - Chạy trên trình duyệt (Chrome, Edge)    │
│  - Hiển thị dữ liệu, nhận input từ user    │
│  - Công nghệ: Next.js + React              │
└─────────────────┬───────────────────────────┘
                  │
                  │ Giao tiếp qua Internet
                  │ (REST API - JSON)
                  │
┌─────────────────▼───────────────────────────┐
│      TẦNG 2: XỬ LÝ LOGIC (Backend)         │
│                                             │
│  - Xử lý nghiệp vụ, logic hệ thống         │
│  - Kiểm tra quyền truy cập                 │
│  - Tính toán SLA, gửi thông báo            │
│  - Công nghệ: NestJS (Node.js)             │
└─────────────────┬───────────────────────────┘
                  │
                  │ Truy vấn dữ liệu
                  │ (SQL)
                  │
┌─────────────────▼───────────────────────────┐
│       TẦNG 3: DỮ LIỆU (Database)           │
│                                             │
│  - Lưu trữ tất cả dữ liệu                  │
│  - Tickets, Users, Comments, v.v.          │
│  - Công nghệ: PostgreSQL (Supabase)        │
└─────────────────────────────────────────────┘
```

### 4.2 Giải thích chi tiết từng tầng

#### **Tầng 1: Frontend (Giao diện người dùng)**

**Là gì?**
- Phần mà người dùng nhìn thấy và tương tác
- Chạy trên trình duyệt web (Chrome, Edge, Firefox)
- Giống như "mặt tiền" của một cửa hàng

**Làm gì?**
- Hiển thị danh sách ticket
- Hiển thị form tạo ticket mới
- Hiển thị dashboard với biểu đồ
- Nhận input từ người dùng (click, gõ text)
- Gửi request lên Backend để lấy/gửi dữ liệu

**Ví dụ:**
- Khi bạn click nút "Tạo Ticket", Frontend hiển thị form
- Khi bạn điền form và click "Gửi", Frontend gửi dữ liệu lên Backend
- Khi Backend trả về kết quả, Frontend hiển thị thông báo "Tạo thành công"

#### **Tầng 2: Backend (Xử lý logic)**

**Là gì?**
- Phần "não bộ" của hệ thống
- Chạy trên server (máy chủ)
- Người dùng không nhìn thấy trực tiếp

**Làm gì?**
- Nhận request từ Frontend
- Kiểm tra quyền: User này có được phép làm việc này không?
- Xử lý logic nghiệp vụ: Tính SLA, gửi email, tạo thông báo
- Truy vấn Database để lấy/lưu dữ liệu
- Trả kết quả về cho Frontend

**Ví dụ:**
- Frontend gửi request "Tạo ticket mới"
- Backend kiểm tra: User đã đăng nhập chưa?
- Backend tính toán: Ticket này ưu tiên High → SLA là 4 giờ
- Backend lưu ticket vào Database
- Backend gửi thông báo cho IT Staff
- Backend trả về: "Tạo thành công, mã ticket TKT-2026-0001"

#### **Tầng 3: Database (Cơ sở dữ liệu)**

**Là gì?**
- Nơi lưu trữ tất cả dữ liệu
- Giống như "kho chứa" của hệ thống
- Dữ liệu được tổ chức thành các bảng (tables)

**Làm gì?**
- Lưu trữ thông tin người dùng
- Lưu trữ tất cả ticket
- Lưu trữ comments, attachments
- Lưu trữ lịch sử thay đổi
- Đảm bảo dữ liệu không bị mất

**Ví dụ:**
- Bảng "users": Lưu thông tin tất cả người dùng
- Bảng "tickets": Lưu tất cả ticket đã tạo
- Bảng "comments": Lưu tất cả bình luận trong ticket

### 4.3 Luồng hoạt động

**Ví dụ: Nhân viên tạo ticket mới**

```
Bước 1: Nhân viên mở trình duyệt
        → Truy cập https://ticket.28h.com
        → Frontend hiển thị trang đăng nhập

Bước 2: Nhân viên đăng nhập
        → Frontend gửi email + password lên Backend
        → Backend kiểm tra trong Database
        → Backend tạo JWT token (mã xác thực)
        → Frontend lưu token, chuyển đến Dashboard

Bước 3: Nhân viên click "Tạo Ticket"
        → Frontend hiển thị form tạo ticket

Bước 4: Nhân viên điền form và click "Gửi"
        → Frontend gửi dữ liệu + token lên Backend
        → Backend kiểm tra token (xác thực)
        → Backend validate dữ liệu (có đầy đủ không?)
        → Backend tính SLA dựa trên priority
        → Backend lưu ticket vào Database
        → Backend tạo thông báo cho IT Staff
        → Backend trả về: "Thành công, mã TKT-2026-0001"
        → Frontend hiển thị thông báo thành công
        → Frontend chuyển đến trang chi tiết ticket
```

### 4.4 Ưu điểm của kiến trúc này

**1. Tách biệt rõ ràng**
- Frontend chỉ lo hiển thị
- Backend chỉ lo xử lý logic
- Database chỉ lo lưu trữ
- Dễ bảo trì, nâng cấp

**2. Bảo mật tốt**
- Database không tiếp xúc trực tiếp với người dùng
- Backend kiểm tra quyền trước khi cho phép thao tác
- Dữ liệu nhạy cảm (password) được mã hóa

**3. Dễ mở rộng**
- Có thể thêm nhiều Frontend (web, mobile app)
- Có thể thêm nhiều Backend server khi người dùng tăng
- Có thể nâng cấp Database khi dữ liệu lớn

**4. Hiệu suất cao**
- Frontend cache dữ liệu, giảm request
- Backend xử lý song song nhiều request
- Database tối ưu truy vấn

---

## 5. CÔNG NGHỆ SỬ DỤNG

### 5.1 Tổng quan công nghệ

Hệ thống sử dụng các công nghệ hiện đại, phổ biến và được cộng đồng lập trình viên tin dùng:

```
Frontend:  Next.js + React + TypeScript + TailwindCSS
Backend:   NestJS + Node.js + TypeScript
Database:  PostgreSQL (Supabase)
AI:        Transformers.js + OpenRouter API
```

### 5.2 Frontend - Giao diện người dùng

#### **Next.js 14**
**Là gì?**
- Framework (khung làm việc) để xây dựng ứng dụng web
- Được phát triển bởi Vercel (công ty Mỹ)
- Dựa trên React (thư viện của Facebook)

**Tại sao chọn?**
- Hiệu suất cao, tải trang nhanh
- SEO tốt (Google dễ tìm thấy)
- Hỗ trợ Server-Side Rendering
- Cộng đồng lớn, nhiều tài liệu

**Ví dụ thực tế:**
- Netflix, TikTok, Nike đều dùng Next.js
- Trang web tải nhanh, mượt mà
- Không bị giật lag khi chuyển trang

#### **React 18**
**Là gì?**
- Thư viện JavaScript để xây dựng giao diện
- Được phát triển bởi Facebook (Meta)
- Cho phép tạo các component tái sử dụng

**Tại sao chọn?**
- Phổ biến nhất thế giới (hàng triệu dev dùng)
- Component-based: Dễ tái sử dụng
- Virtual DOM: Cập nhật nhanh
- Ecosystem lớn: Nhiều thư viện hỗ trợ

**Ví dụ:**
- Button component có thể dùng ở nhiều nơi
- Form component tự validate dữ liệu
- Chart component hiển thị biểu đồ đẹp

#### **TypeScript**
**Là gì?**
- Ngôn ngữ lập trình mở rộng từ JavaScript
- Thêm kiểu dữ liệu (type) để code an toàn hơn
- Được phát triển bởi Microsoft

**Tại sao chọn?**
- Phát hiện lỗi sớm (khi viết code, không phải khi chạy)
- Code dễ đọc, dễ bảo trì
- IDE hỗ trợ tốt (gợi ý code thông minh)
- Giảm bug trong production

**Ví dụ:**
- JavaScript: Có thể gán số vào biến string → Lỗi runtime
- TypeScript: Báo lỗi ngay khi viết → Sửa trước khi chạy

#### **TailwindCSS**
**Là gì?**
- Framework CSS để styling (trang trí giao diện)
- Utility-first: Dùng class nhỏ để tạo style
- Responsive: Tự động responsive trên mobile

**Tại sao chọn?**
- Viết CSS nhanh hơn
- Không phải đặt tên class
- Responsive dễ dàng
- File CSS nhỏ gọn

**Ví dụ:**
- Thay vì viết CSS riêng, dùng class có sẵn
- `bg-blue-500 text-white px-4 py-2 rounded` → Button xanh đẹp

### 5.3 Backend - Xử lý logic

#### **NestJS**
**Là gì?**
- Framework để xây dựng server-side application
- Dựa trên Node.js và Express
- Kiến trúc giống Angular (của Google)

**Tại sao chọn?**
- Cấu trúc rõ ràng, dễ maintain
- TypeScript native
- Dependency Injection: Code sạch, dễ test
- Hỗ trợ nhiều pattern: MVC, Microservices

**Ví dụ:**
- Module-based: Mỗi tính năng là 1 module riêng
- Tickets Module, Users Module, Auth Module
- Dễ thêm/xóa tính năng

#### **Node.js**
**Là gì?**
- Runtime để chạy JavaScript trên server
- Không phải trình duyệt
- Event-driven, non-blocking I/O

**Tại sao chọn?**
- JavaScript cả Frontend lẫn Backend
- Hiệu suất cao với I/O operations
- NPM: Hàng triệu package có sẵn
- Cộng đồng lớn nhất

**Ví dụ:**
- Xử lý 10,000 request đồng thời
- Upload file không block server
- Real-time với WebSocket

#### **Sequelize ORM**
**Là gì?**
- ORM (Object-Relational Mapping)
- Chuyển đổi giữa code và database
- Không cần viết SQL thuần

**Tại sao chọn?**
- Viết code thay vì SQL
- Tự động tạo query an toàn (chống SQL Injection)
- Hỗ trợ nhiều database: PostgreSQL, MySQL, SQLite
- Migration: Quản lý thay đổi database

**Ví dụ:**
- Thay vì: `SELECT * FROM users WHERE id = 1`
- Viết: `User.findByPk(1)`
- Dễ đọc, dễ maintain

### 5.4 Database - Lưu trữ dữ liệu

#### **PostgreSQL**
**Là gì?**
- Hệ quản trị cơ sở dữ liệu quan hệ (RDBMS)
- Open-source, miễn phí
- Mạnh mẽ, ổn định

**Tại sao chọn?**
- ACID compliant: Đảm bảo dữ liệu chính xác
- Hỗ trợ JSON: Linh hoạt
- Full-text search: Tìm kiếm nhanh
- Scalable: Mở rộng dễ dàng

**Ví dụ:**
- Lưu hàng triệu ticket không chậm
- Tìm kiếm ticket theo keyword nhanh
- Backup/restore dễ dàng

#### **Supabase**
**Là gì?**
- Platform cung cấp PostgreSQL as a Service
- Giống Firebase nhưng dùng PostgreSQL
- Có sẵn Authentication, Storage, Real-time

**Tại sao chọn?**
- Không cần setup server database
- Tự động backup
- Dashboard quản lý trực quan
- Free tier: Miễn phí cho dự án nhỏ

**Ví dụ:**
- Không cần cài PostgreSQL trên máy
- Truy cập database qua internet
- Xem dữ liệu qua web dashboard

### 5.5 AI & Chatbot

#### **Transformers.js**
**Là gì?**
- Thư viện Machine Learning chạy trên JavaScript
- Chuyển text thành vector (embedding)
- Chạy trên browser hoặc Node.js

**Tại sao chọn?**
- Không cần Python
- Chạy local, không cần API key
- Nhanh, nhẹ
- Hỗ trợ nhiều model

**Ví dụ:**
- Chuyển câu hỏi thành vector 384 chiều
- So sánh độ tương đồng giữa câu hỏi và bài viết
- Tìm bài viết liên quan nhất

#### **OpenRouter API**
**Là gì?**
- API gateway cho nhiều LLM (Large Language Model)
- Truy cập GPT, Claude, Gemini qua 1 API
- Pay-as-you-go hoặc free tier

**Tại sao chọn?**
- Không cần API key riêng cho từng model
- Dễ chuyển đổi giữa các model
- Có free tier: Google Gemini 2.0 Flash
- Giá rẻ hơn gọi trực tiếp

**Ví dụ:**
- User hỏi: "Làm sao kết nối WiFi?"
- Tìm 3 bài viết liên quan
- Gửi lên Gemini để tổng hợp câu trả lời
- Trả về câu trả lời tự nhiên

### 5.6 Các công nghệ hỗ trợ khác

#### **JWT (JSON Web Token)**
- Xác thực người dùng
- Token có thời hạn 7 ngày
- Không cần lưu session trên server

#### **Multer**
- Upload file lên server
- Validate file type, size
- Lưu vào thư mục uploads/

#### **Nodemailer**
- Gửi email thông báo
- SMTP configuration
- Email templates

#### **Cron Jobs**
- Chạy tác vụ định kỳ
- Check SLA breach mỗi 15 phút
- Auto-escalate ticket

---

## 6. CƠ SỞ DỮ LIỆU

### 6.1 Tổng quan Database

Hệ thống sử dụng **PostgreSQL** - một hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ. Dữ liệu được tổ chức thành các **bảng** (tables), mỗi bảng lưu một loại thông tin cụ thể.

**Ví dụ dễ hiểu:**
- Giống như Excel có nhiều sheet
- Mỗi sheet (bảng) có các cột và hàng
- Các bảng có thể liên kết với nhau

### 6.2 Các bảng chính trong hệ thống

#### **Bảng 1: users (Người dùng)**

**Lưu trữ gì?**
- Thông tin tất cả người dùng trong hệ thống
- Tài khoản đăng nhập
- Vai trò và quyền hạn

**Các cột quan trọng:**
- `id`: Mã số duy nhất của người dùng (1, 2, 3...)
- `email`: Email đăng nhập (admin@28h.com)
- `password`: Mật khẩu đã mã hóa (không lưu dạng text)
- `fullName`: Họ tên đầy đủ (Nguyễn Văn A)
- `role`: Vai trò (Employee, IT_Staff, Admin)
- `department`: Phòng ban (IT, Kế toán, Marketing)
- `isActive`: Còn hoạt động không? (true/false)

**Ví dụ dữ liệu:**
```
id | email              | fullName         | role      | department
1  | admin@28h.com      | Nguyễn Văn Admin | Admin     | IT
2  | nam@28h.com        | Trần Văn Nam     | Employee  | Kế toán
3  | hung@28h.com       | Lê Văn Hùng      | IT_Staff  | IT
```

#### **Bảng 2: tickets (Phiếu yêu cầu)**

**Lưu trữ gì?**
- Tất cả ticket đã tạo
- Trạng thái xử lý
- Thông tin chi tiết vấn đề

**Các cột quan trọng:**
- `id`: Mã số ticket (1, 2, 3...)
- `ticketNumber`: Mã hiển thị (TKT-2026-0001)
- `title`: Tiêu đề ngắn gọn
- `description`: Mô tả chi tiết vấn đề
- `status`: Trạng thái (New, Assigned, In Progress, Resolved, Closed)
- `priority`: Độ ưu tiên (Low, Medium, High)
- `categoryId`: Thuộc danh mục nào (1=Hardware, 2=Software...)
- `submitterId`: Người tạo ticket (id trong bảng users)
- `assigneeId`: Người xử lý (id trong bảng users)
- `dueDate`: Hạn xử lý (tính theo SLA)
- `createdAt`: Thời gian tạo
- `resolvedAt`: Thời gian giải quyết xong
- `closedAt`: Thời gian đóng

**Ví dụ dữ liệu:**
```
id | ticketNumber   | title              | status      | priority | submitterId | assigneeId
1  | TKT-2026-0001  | Máy in bị lỗi      | Resolved    | High     | 2           | 3
2  | TKT-2026-0002  | Quên mật khẩu WiFi | In Progress | Medium   | 2           | 3
```

#### **Bảng 3: categories (Danh mục)**

**Lưu trữ gì?**
- Các loại vấn đề có thể gặp
- Phân loại ticket

**Các cột quan trọng:**
- `id`: Mã danh mục
- `name`: Tên danh mục
- `description`: Mô tả
- `icon`: Icon hiển thị
- `parentId`: Danh mục cha (nếu có)

**Ví dụ dữ liệu:**
```
id | name              | description
1  | Hardware          | Vấn đề về phần cứng
2  | Software          | Vấn đề về phần mềm
3  | Network           | Vấn đề về mạng
4  | Account & Access  | Tài khoản và quyền truy cập
```

#### **Bảng 4: comments (Bình luận)**

**Lưu trữ gì?**
- Tất cả bình luận trong ticket
- Trao đổi giữa user và IT

**Các cột quan trọng:**
- `id`: Mã bình luận
- `ticketId`: Thuộc ticket nào
- `userId`: Ai viết bình luận
- `content`: Nội dung bình luận
- `type`: Loại (Public, Internal, System)
- `createdAt`: Thời gian viết

**Ví dụ dữ liệu:**
```
id | ticketId | userId | content                        | type
1  | 1        | 3      | Đang kiểm tra máy in           | Internal
2  | 1        | 3      | Đã sửa xong, vui lòng thử lại  | Public
3  | 1        | 2      | Cảm ơn anh, máy in đã ok       | Public
```

#### **Bảng 5: knowledge_articles (Cơ sở tri thức)**

**Lưu trữ gì?**
- Các bài viết hướng dẫn
- Giải pháp cho vấn đề thường gặp
- FAQ (Câu hỏi thường gặp)

**Các cột quan trọng:**
- `id`: Mã bài viết
- `title`: Tiêu đề
- `content`: Nội dung chi tiết
- `categoryId`: Thuộc danh mục nào
- `authorId`: Ai viết
- `isPublished`: Đã xuất bản chưa
- `tags`: Từ khóa (JSON array)
- `viewCount`: Số lượt xem
- `helpfulCount`: Số người thấy hữu ích
- `embedding`: Vector cho AI search (JSON array 384 số)

**Ví dụ dữ liệu:**
```
id | title                      | categoryId | viewCount | helpfulCount
1  | Hướng dẫn kết nối WiFi     | 3          | 150       | 45
2  | Cách reset mật khẩu ERP    | 4          | 89        | 32
```

#### **Bảng 6: sla_rules (Quy tắc SLA)**

**Lưu trữ gì?**
- Thời gian cam kết xử lý theo độ ưu tiên
- SLA = Service Level Agreement

**Các cột quan trọng:**
- `id`: Mã quy tắc
- `priority`: Độ ưu tiên (Low, Medium, High)
- `responseTime`: Thời gian phản hồi (giờ)
- `resolutionTime`: Thời gian giải quyết (giờ)
- `isActive`: Đang áp dụng không

**Ví dụ dữ liệu:**
```
id | priority | responseTime | resolutionTime | isActive
1  | High     | 1            | 4              | true
2  | Medium   | 2            | 24             | true
3  | Low      | 4            | 72             | true
```

**Giải thích:**
- Ticket High: Phải phản hồi trong 1 giờ, giải quyết trong 4 giờ
- Ticket Medium: Phản hồi trong 2 giờ, giải quyết trong 24 giờ
- Ticket Low: Phản hồi trong 4 giờ, giải quyết trong 72 giờ

#### **Bảng 7: business_hours (Giờ làm việc)**

**Lưu trữ gì?**
- Giờ làm việc của công ty
- Dùng để tính SLA chính xác

**Các cột quan trọng:**
- `id`: Mã
- `dayOfWeek`: Thứ mấy (0=CN, 1=T2, 2=T3...)
- `startTime`: Giờ bắt đầu (08:00:00)
- `endTime`: Giờ kết thúc (17:30:00)
- `isWorkingDay`: Có làm việc không

**Ví dụ dữ liệu:**
```
id | dayOfWeek | startTime | endTime  | isWorkingDay
1  | 1         | 08:00:00  | 17:30:00 | true
2  | 2         | 08:00:00  | 17:30:00 | true
...
6  | 6         | 00:00:00  | 00:00:00 | false  (Thứ 7 không làm)
7  | 0         | 00:00:00  | 00:00:00 | false  (CN không làm)
```

#### **Bảng 8: holidays (Ngày lễ)**

**Lưu trữ gì?**
- Các ngày nghỉ lễ trong năm
- Không tính vào SLA

**Ví dụ dữ liệu:**
```
id | name              | date       | isRecurring
1  | Tết Nguyên Đán    | 2026-01-29 | false
2  | Giỗ Tổ Hùng Vương | 2026-04-10 | true
3  | 30/4 - 1/5        | 2026-04-30 | true
```

#### **Bảng 9: escalation_rules (Quy tắc leo thang)**

**Lưu trữ gì?**
- Quy tắc tự động leo thang ticket
- Khi nào thì escalate, escalate cho ai

**Các cột quan trọng:**
- `triggerType`: Điều kiện kích hoạt (SLA_BREACHED, NO_ASSIGNMENT...)
- `triggerHours`: Sau bao nhiêu giờ
- `escalationLevel`: Mức độ leo thang (1-5)
- `targetType`: Leo thang cho ai (ROLE, USER, MANAGER)
- `targetRole`: Role nào (nếu targetType=ROLE)
- `targetUserId`: User nào (nếu targetType=USER)

**Ví dụ:**
```
Quy tắc 1: Nếu ticket High không được giao sau 1 giờ
           → Escalate lên Admin

Quy tắc 2: Nếu ticket quá hạn SLA
           → Escalate lên Manager
```

#### **Bảng 10: notifications (Thông báo)**

**Lưu trữ gì?**
- Tất cả thông báo gửi cho user
- Đã đọc hay chưa

**Các cột quan trọng:**
- `userId`: Gửi cho ai
- `type`: Loại thông báo
- `title`: Tiêu đề ngắn
- `message`: Nội dung
- `ticketId`: Liên quan ticket nào
- `isRead`: Đã đọc chưa
- `readAt`: Thời gian đọc

### 6.3 Mối quan hệ giữa các bảng

**Quan hệ 1-nhiều (One-to-Many):**

1. **User → Tickets**
   - 1 user có thể tạo nhiều ticket
   - 1 ticket chỉ do 1 user tạo
   - Liên kết: `tickets.submitterId` → `users.id`

2. **User → Comments**
   - 1 user có thể viết nhiều comment
   - 1 comment chỉ do 1 user viết
   - Liên kết: `comments.userId` → `users.id`

3. **Ticket → Comments**
   - 1 ticket có thể có nhiều comment
   - 1 comment chỉ thuộc 1 ticket
   - Liên kết: `comments.ticketId` → `tickets.id`

4. **Category → Tickets**
   - 1 category có nhiều ticket
   - 1 ticket thuộc 1 category
   - Liên kết: `tickets.categoryId` → `categories.id`

**Ví dụ truy vấn:**
```
Lấy tất cả ticket của user có id=2:
SELECT * FROM tickets WHERE submitterId = 2

Lấy tất cả comment của ticket có id=1:
SELECT * FROM comments WHERE ticketId = 1

Lấy thông tin người tạo ticket:
SELECT users.* FROM users 
JOIN tickets ON tickets.submitterId = users.id
WHERE tickets.id = 1
```

---

## 7. CHỨC NĂNG CHÍNH

### 7.1 Quản lý Ticket

#### **A. Tạo Ticket Mới**

**Ai có thể làm?** Tất cả người dùng (Employee, IT Staff, Admin)

**Quy trình:**
1. User click nút "Tạo Ticket"
2. Điền form với các thông tin:
   - **Tiêu đề**: Mô tả ngắn gọn (VD: "Máy in tầng 2 bị lỗi")
   - **Danh mục**: Chọn loại vấn đề (Hardware, Software, Network...)
   - **Độ ưu tiên**: 
     - Low: Không ảnh hưởng công việc
     - Medium: Ảnh hưởng một phần
     - High: Ảnh hưởng nghiêm trọng, cần xử lý gấp
   - **Mô tả chi tiết**: Giải thích rõ vấn đề, các bước đã thử
   - **File đính kèm**: Ảnh chụp màn hình, log file (tùy chọn)
3. Click "Gửi"
4. Hệ thống tự động:
   - Tạo mã ticket (TKT-2026-0001)
   - Tính toán SLA dựa trên priority
   - Gửi thông báo cho IT Staff
   - Lưu vào database

**Ví dụ thực tế:**
```
Tiêu đề: Máy in tầng 2 không in được
Danh mục: Hardware → Printer
Độ ưu tiên: High (vì ảnh hưởng công việc nhiều người)
Mô tả: Máy in Canon tầng 2 báo lỗi "Paper Jam" nhưng không có 
       giấy kẹt. Đã thử tắt mở lại nhưng vẫn lỗi.
File: anh-chup-man-hinh-loi.jpg

→ Hệ thống tạo: TKT-2026-0001
→ SLA: 4 giờ (vì High priority)
→ Due date: Hôm nay 14:00 (nếu tạo lúc 10:00)
```

#### **B. Xem và Theo Dõi Ticket**

**Với Employee:**
- Xem danh sách ticket của mình
- Lọc theo trạng thái (Đang xử lý, Đã xong, Tất cả)
- Xem chi tiết từng ticket
- Theo dõi tiến độ real-time

**Với IT Staff:**
- Xem tất cả ticket trong hệ thống
- Lọc theo nhiều tiêu chí:
  - Trạng thái
  - Độ ưu tiên
  - Người tạo
  - Người xử lý
  - SLA (Quá hạn, Sắp quá hạn)
- Xem ticket được giao cho mình
- Xem ticket chưa được giao

**Với Admin:**
- Xem tất cả ticket
- Xem báo cáo tổng quan
- Xem hiệu suất từng IT Staff

#### **C. Xử Lý Ticket (IT Staff)**

**Quy trình xử lý:**

**Bước 1: Nhận ticket**
- IT Staff xem danh sách ticket mới
- Chọn ticket phù hợp với kỹ năng
- Click "Assign to Me" (Giao cho tôi)
- Hoặc Admin giao cho IT Staff cụ thể

**Bước 2: Bắt đầu xử lý**
- Click "Start Progress" (Bắt đầu xử lý)
- Trạng thái chuyển từ "Assigned" → "In Progress"
- User nhận thông báo: "Ticket của bạn đang được xử lý"

**Bước 3: Xử lý vấn đề**
- IT Staff đến kiểm tra/sửa chữa
- Cập nhật tiến độ bằng Internal Note (chỉ IT thấy)
- Nếu cần thêm thông tin từ user:
  - Chuyển trạng thái sang "Pending"
  - Viết comment hỏi user
  - User nhận thông báo và trả lời

**Bước 4: Giải quyết xong**
- Click "Resolve" (Giải quyết)
- Nhập "Resolution Notes" (Ghi chú cách giải quyết)
- VD: "Đã thay mực máy in và reset máy. Máy in hoạt động bình thường."
- Trạng thái chuyển sang "Resolved"
- User nhận thông báo

**Bước 5: Đóng ticket**
- User kiểm tra và xác nhận OK
- User đánh giá (1-5 sao) và viết feedback
- Click "Close" hoặc tự động đóng sau 24h
- Trạng thái chuyển sang "Closed"

**Ví dụ timeline:**
```
10:00 - User tạo ticket "Máy in lỗi"
10:05 - IT Staff Hùng nhận ticket
10:10 - Hùng bắt đầu xử lý
10:15 - Hùng viết note: "Đang kiểm tra máy in"
10:30 - Hùng giải quyết xong: "Đã thay mực"
10:35 - User xác nhận OK, đánh giá 5 sao
10:36 - Ticket đóng
```

#### **D. Các Trạng Thái Ticket**

**1. New (Mới)**
- Ticket vừa được tạo
- Chưa có ai nhận xử lý
- Màu: Xanh dương

**2. Assigned (Đã giao)**
- Đã giao cho IT Staff cụ thể
- IT Staff chưa bắt đầu xử lý
- Màu: Vàng

**3. In Progress (Đang xử lý)**
- IT Staff đang xử lý
- Có thể mất vài phút đến vài giờ
- Màu: Cam

**4. Pending (Chờ phản hồi)**
- Chờ thông tin từ user
- Hoặc chờ bên thứ 3 (nhà cung cấp)
- Màu: Tím

**5. Resolved (Đã giải quyết)**
- IT Staff đã xử lý xong
- Chờ user xác nhận
- Màu: Xanh lá

**6. Closed (Đã đóng)**
- Hoàn tất, không còn vấn đề
- Không thể chỉnh sửa
- Màu: Xám

**Luồng chuyển trạng thái:**
```
New → Assigned → In Progress → Resolved → Closed
              ↓                    ↑
              → Pending ←──────────┘
                    ↓
              Reopen (Mở lại)
```

### 7.2 Quản lý SLA (Service Level Agreement)

#### **A. SLA là gì?**

**Định nghĩa đơn giản:**
- SLA = Thời gian cam kết xử lý ticket
- Giống như "hạn chót" để hoàn thành công việc
- Đảm bảo ticket được xử lý kịp thời

**Tại sao cần SLA?**
- Tránh ticket bị quên, bỏ sót
- Ưu tiên xử lý ticket khẩn cấp trước
- Đánh giá hiệu suất IT Staff
- Tăng sự hài lòng của user

#### **B. Cách tính SLA**

**Dựa trên độ ưu tiên:**
- **High Priority**: 4 giờ làm việc
- **Medium Priority**: 24 giờ làm việc (1 ngày)
- **Low Priority**: 72 giờ làm việc (3 ngày)

**Lưu ý quan trọng:**
- Chỉ tính giờ làm việc (8:00-17:30, Thứ 2-6)
- Không tính cuối tuần (Thứ 7, Chủ nhật)
- Không tính ngày lễ

**Ví dụ tính SLA:**

**Trường hợp 1: Ticket tạo trong giờ làm việc**
```
Tạo ticket: Thứ 2, 10:00
Priority: High (4 giờ)
Due date: Thứ 2, 14:00 (cùng ngày)
```

**Trường hợp 2: Ticket tạo cuối ngày**
```
Tạo ticket: Thứ 2, 16:00
Priority: High (4 giờ)
Còn lại hôm nay: 1.5 giờ (16:00-17:30)
Cần thêm: 2.5 giờ
Due date: Thứ 3, 10:30 (8:00 + 2.5 giờ)
```

**Trường hợp 3: Ticket tạo cuối tuần**
```
Tạo ticket: Thứ 6, 17:00
Priority: High (4 giờ)
Cuối tuần không tính
Due date: Thứ 2, 12:00 (8:00 + 4 giờ)
```

**Trường hợp 4: Có ngày lễ**
```
Tạo ticket: Thứ 5, 16:00 (29/01 - Tết)
Priority: Medium (24 giờ)
30/01, 31/01, 01/02 là ngày lễ
Due date: Thứ 3, 16:00 (sau Tết)
```

#### **C. Trạng thái SLA**

**1. Met (Đúng hạn)**
- Còn nhiều thời gian
- Màu xanh lá
- VD: Còn 3 giờ, SLA là 4 giờ

**2. At Risk (Sắp quá hạn)**
- Đã dùng 80% thời gian
- Màu vàng, cảnh báo
- VD: Còn 0.5 giờ, SLA là 4 giờ

**3. Breached (Quá hạn)**
- Đã quá thời gian cam kết
- Màu đỏ, cần xử lý gấp
- VD: Quá 1 giờ so với due date

#### **D. Cảnh báo SLA**

**Tự động cảnh báo khi:**
- Ticket sắp quá hạn (còn 2 giờ)
- Ticket đã quá hạn
- Ticket chưa được giao sau 1 giờ

**Ai nhận cảnh báo:**
- IT Staff được giao ticket
- Admin (quản lý)
- Người tạo ticket (nếu quá hạn)

**Hình thức cảnh báo:**
- Thông báo trong hệ thống
- Email (nếu cấu hình)
- Badge màu đỏ trên dashboard

### 7.3 Chatbot AI

#### **A. Chatbot là gì?**

**Định nghĩa:**
- Trợ lý ảo thông minh
- Trả lời câu hỏi tự động
- Giúp user tự giải quyết vấn đề thường gặp

**Mục đích:**
- Giảm tải cho IT Staff
- Trả lời nhanh 24/7
- Hướng dẫn user tự xử lý

#### **B. Chatbot hoạt động như thế nào?**

**Công nghệ sử dụng:**
1. **Transformers.js**: Chuyển câu hỏi thành vector (embedding)
2. **Vector Search**: Tìm bài viết liên quan trong Knowledge Base
3. **OpenRouter API**: Gọi AI (Google Gemini) để tạo câu trả lời
4. **RAG**: Retrieval Augmented Generation - Trả lời dựa trên dữ liệu có sẵn

**Quy trình xử lý:**
```
Bước 1: User hỏi "Làm sao kết nối WiFi?"

Bước 2: Chuyển câu hỏi thành vector (384 số)
        [0.123, -0.456, 0.789, ...]

Bước 3: So sánh với tất cả bài viết trong Knowledge Base
        Tìm 3 bài viết có vector giống nhất (cosine similarity)

Bước 4: Lấy nội dung 3 bài viết:
        - "Hướng dẫn kết nối WiFi 28H-Staff"
        - "Khắc phục lỗi WiFi không kết nối được"
        - "Đổi mật khẩu WiFi"

Bước 5: Gửi lên AI (Gemini) với prompt:
        "Dựa trên 3 bài viết này, trả lời câu hỏi của user"

Bước 6: AI tổng hợp và trả về câu trả lời tự nhiên:
        "Để kết nối WiFi 28H-Staff, bạn làm theo các bước sau:
         1. Mở WiFi trên máy tính
         2. Chọn mạng '28H-Staff'
         3. Nhập mật khẩu: 28h@2024
         4. Click 'Kết nối'
         
         Nếu không kết nối được, vui lòng kiểm tra..."

Bước 7: Hiển thị câu trả lời cho user
        Kèm theo link 3 bài viết để xem chi tiết
```

#### **C. Chatbot có thể làm gì?**

**1. Trả lời câu hỏi thường gặp**
- "Làm sao kết nối WiFi?"
- "Quên mật khẩu ERP phải làm sao?"
- "Cách đặt phòng họp?"
- "Máy in ở đâu?"

**2. Hướng dẫn sử dụng hệ thống**
- "Làm sao tạo ticket?"
- "Xem ticket của tôi ở đâu?"
- "Cách đánh giá ticket?"

**3. Thông tin về dự án**
- "Project này của ai?"
- "Hệ thống có những tính năng gì?"

**4. Tạo ticket nhanh**
- Nếu không tìm thấy giải pháp
- Chatbot gợi ý: "Bạn có muốn tạo ticket không?"
- Click "Tạo ticket" → Chuyển đến form

#### **D. Ưu điểm của Chatbot**

**Cho User:**
- Trả lời nhanh, không cần chờ
- Có thể hỏi bất cứ lúc nào (24/7)
- Tìm giải pháp ngay lập tức
- Không cần tạo ticket cho vấn đề đơn giản

**Cho IT Staff:**
- Giảm số lượng ticket đơn giản
- Tập trung xử lý vấn đề phức tạp
- Không bị gián đoạn bởi câu hỏi lặp lại

**Cho Công ty:**
- Tiết kiệm thời gian và chi phí
- Tăng hiệu quả hỗ trợ
- Có dữ liệu về câu hỏi thường gặp

---

### 7.4 Knowledge Base (Cơ sở tri thức)

#### **A. Knowledge Base là gì?**

**Định nghĩa:**
- Thư viện các bài viết hướng dẫn
- Giải pháp cho vấn đề thường gặp
- Tài liệu tham khảo cho user

**Mục đích:**
- User tự tìm giải pháp
- Giảm ticket lặp lại
- Lưu trữ kiến thức của công ty

#### **B. Nội dung Knowledge Base**

**Các loại bài viết:**

**1. Hướng dẫn sử dụng**
- Hướng dẫn kết nối WiFi
- Hướng dẫn sử dụng ERP
- Hướng dẫn đặt phòng họp
- Hướng dẫn sử dụng máy in

**2. Khắc phục sự cố**
- Máy tính chạy chậm - Cách xử lý
- Không kết nối được mạng
- Quên mật khẩu - Cách reset
- Lỗi phần mềm thường gặp

**3. Chính sách và quy định**
- Chính sách bảo mật thông tin
- Quy định sử dụng thiết bị công ty
- Quy trình yêu cầu cài đặt phần mềm

**4. FAQ (Câu hỏi thường gặp)**
- WiFi password là gì?
- Làm sao liên hệ IT?
- Giờ làm việc của IT?

#### **C. Tính năng Knowledge Base**

**1. Tìm kiếm**
- Tìm theo từ khóa
- Tìm theo danh mục
- Tìm theo tag

**2. Đánh giá**
- User đánh giá bài viết có hữu ích không
- Nút "Helpful" / "Not Helpful"
- Thống kê số lượt xem, số người thấy hữu ích

**3. Liên kết với Chatbot**
- Chatbot tự động tìm bài viết liên quan
- Gợi ý bài viết khi user hỏi
- Tạo câu trả lời dựa trên bài viết

#### **D. Ai tạo bài viết?**

**IT Staff và Admin:**
- Viết bài viết mới
- Chỉnh sửa bài viết cũ
- Xuất bản hoặc lưu nháp
- Thêm tags, chọn category

**Quy trình tạo bài viết:**
```
1. IT Staff click "New Article"
2. Điền thông tin:
   - Tiêu đề
   - Nội dung (rich text editor)
   - Danh mục
   - Tags (từ khóa)
3. Preview để xem trước
4. Chọn "Published" hoặc "Draft"
5. Click "Save"
6. Hệ thống tự động tạo embedding cho AI
```

### 7.5 Báo cáo và Thống kê

#### **A. Dashboard (Trang tổng quan)**

**Hiển thị gì?**

**1. Tổng quan Ticket**
- Tổng số ticket
- Ticket đang mở (Open)
- Ticket đã đóng hôm nay
- Ticket đã đóng tuần này
- Ticket đã đóng tháng này

**2. SLA Compliance (Tuân thủ SLA)**
- Tỷ lệ % ticket đúng hạn
- Số ticket quá hạn
- Số ticket sắp quá hạn
- Biểu đồ gauge (đồng hồ)

**3. Thời gian xử lý trung bình**
- Trung bình bao nhiêu giờ để giải quyết ticket
- So sánh theo priority
- Xu hướng tăng/giảm

**4. Ticket theo trạng thái**
- Biểu đồ tròn (pie chart)
- Số lượng ticket ở mỗi trạng thái
- New, Assigned, In Progress, Pending, Resolved, Closed

**5. Ticket theo độ ưu tiên**
- Biểu đồ cột (bar chart)
- High, Medium, Low
- Thời gian xử lý trung bình của mỗi loại

**6. Ticket theo danh mục**
- Danh mục nào có nhiều ticket nhất
- Phát hiện vấn đề thường gặp
- Quyết định đầu tư cải thiện

**7. Xu hướng Ticket (Ticket Trends)**
- Biểu đồ đường (line chart)
- Số ticket tạo mới theo ngày/tuần/tháng
- Số ticket giải quyết theo ngày/tuần/tháng
- So sánh xu hướng

**8. Hiệu suất IT Staff**
- Bảng xếp hạng (leaderboard)
- Số ticket đã xử lý
- Thời gian xử lý trung bình
- Tỷ lệ SLA compliance
- Số ticket đang xử lý

#### **B. Báo cáo chi tiết**

**1. Báo cáo theo thời gian**
- Chọn khoảng thời gian (date range)
- Xem số liệu trong khoảng đó
- Export ra Excel/PDF

**2. Báo cáo theo danh mục**
- Phân tích từng danh mục
- Danh mục nào có vấn đề nhiều nhất
- Thời gian xử lý trung bình

**3. Báo cáo hiệu suất cá nhân**
- IT Staff xem hiệu suất của mình
- So sánh với trung bình team
- Xác định điểm cần cải thiện

**4. Báo cáo SLA**
- Tỷ lệ tuân thủ SLA theo priority
- Ticket nào quá hạn, lý do
- Xu hướng cải thiện/xấu đi

#### **C. Ứng dụng của báo cáo**

**Cho IT Staff:**
- Xem hiệu suất cá nhân
- Cải thiện thời gian xử lý
- Học hỏi từ đồng nghiệp

**Cho Admin:**
- Đánh giá hiệu suất team
- Phát hiện vấn đề hệ thống
- Ra quyết định đầu tư
- Đánh giá KPI nhân viên

**Cho Ban Giám Đốc:**
- Xem tổng quan hoạt động IT
- Đánh giá ROI (Return on Investment)
- Quyết định ngân sách IT

### 7.6 Thông báo (Notifications)

#### **A. Các loại thông báo**

**1. Ticket được tạo**
- Gửi cho: IT Staff, Admin
- Nội dung: "Ticket mới TKT-2026-0001: Máy in lỗi"

**2. Ticket được giao**
- Gửi cho: IT Staff được giao
- Nội dung: "Bạn được giao ticket TKT-2026-0001"

**3. Ticket có cập nhật**
- Gửi cho: Người tạo ticket, IT Staff xử lý
- Nội dung: "Ticket TKT-2026-0001 có cập nhật mới"

**4. Ticket được giải quyết**
- Gửi cho: Người tạo ticket
- Nội dung: "Ticket TKT-2026-0001 đã được giải quyết"

**5. SLA cảnh báo**
- Gửi cho: IT Staff, Admin
- Nội dung: "Ticket TKT-2026-0001 sắp quá hạn SLA"

**6. Ticket quá hạn**
- Gửi cho: IT Staff, Admin
- Nội dung: "Ticket TKT-2026-0001 đã quá hạn SLA"

**7. Yêu cầu thêm thông tin**
- Gửi cho: Người tạo ticket
- Nội dung: "IT cần thêm thông tin cho ticket TKT-2026-0001"

**8. Ticket được escalate**
- Gửi cho: Admin, IT Staff mới
- Nội dung: "Ticket TKT-2026-0001 đã được leo thang"

#### **B. Cách xem thông báo**

**Trên giao diện:**
- Icon chuông ở góc trên bên phải
- Badge màu đỏ hiển thị số thông báo chưa đọc
- Click vào để xem danh sách
- Click vào thông báo để xem chi tiết ticket

**Qua Email (nếu cấu hình):**
- Gửi email tự động
- Có link trực tiếp đến ticket
- Có thể reply email để comment

#### **C. Quản lý thông báo**

**Đánh dấu đã đọc:**
- Click vào thông báo → Tự động đánh dấu đã đọc
- Hoặc click "Mark as Read"
- Hoặc "Mark All as Read" để đánh dấu tất cả

**Xóa thông báo:**
- Thông báo cũ tự động xóa sau 30 ngày
- Hoặc user có thể xóa thủ công

### 7.7 Tự động Leo thang (Auto-Escalation)

#### **A. Escalation là gì?**

**Định nghĩa:**
- Leo thang = Chuyển ticket lên cấp cao hơn
- Khi ticket không được xử lý kịp thời
- Đảm bảo không có ticket bị bỏ quên

**Ví dụ thực tế:**
```
Ticket High priority không được giao sau 1 giờ
→ Tự động escalate lên Admin
→ Admin nhận thông báo và giao cho IT Staff

Ticket quá hạn SLA
→ Tự động escalate lên Manager
→ Manager can thiệp, ưu tiên xử lý
```

#### **B. Các điều kiện kích hoạt Escalation**

**1. SLA Breached (Quá hạn SLA)**
- Ticket đã quá thời gian cam kết
- Cần xử lý gấp

**2. SLA At Risk (Sắp quá hạn)**
- Ticket đã dùng 80% thời gian
- Cảnh báo sớm

**3. No Assignment (Chưa được giao)**
- Ticket mới chưa có ai nhận
- Sau X giờ tự động escalate

**4. No Response (Không có phản hồi)**
- Ticket không có hoạt động
- Sau X giờ tự động escalate

#### **C. Quy tắc Escalation**

**Admin có thể cấu hình:**

**Quy tắc 1:**
```
Tên: High Priority - No Assignment
Điều kiện: Ticket High chưa được giao sau 1 giờ
Hành động: Escalate lên Admin
Thông báo: Gửi email cho tất cả Admin
```

**Quy tắc 2:**
```
Tên: SLA Breached - All Priority
Điều kiện: Ticket quá hạn SLA
Hành động: Escalate lên Manager
Thông báo: Gửi email cho Manager
```

**Quy tắc 3:**
```
Tên: No Response - 24 hours
Điều kiện: Ticket không có hoạt động sau 24 giờ
Hành động: Gán lại cho IT Staff khác (workload balanced)
Thông báo: Gửi thông báo cho IT Staff mới
```

#### **D. Cách hoạt động**

**Cron Job (Tác vụ định kỳ):**
- Chạy tự động mỗi 15 phút
- Kiểm tra tất cả ticket
- So sánh với quy tắc escalation
- Thực hiện hành động nếu match

**Quy trình:**
```
1. Cron job chạy (mỗi 15 phút)
2. Lấy tất cả quy tắc escalation đang active
3. Với mỗi quy tắc:
   - Tìm ticket thỏa mãn điều kiện
   - Kiểm tra ticket chưa bị escalate trước đó
   - Thực hiện escalate:
     + Tăng escalation level
     + Gán cho target (role/user/manager)
     + Tạo escalation history
     + Gửi thông báo
4. Log kết quả
```

#### **E. Lợi ích của Escalation**

**Đảm bảo SLA:**
- Không có ticket bị quên
- Xử lý kịp thời

**Cân bằng công việc:**
- Phân phối đều ticket
- Tránh quá tải cho 1 người

**Minh bạch:**
- Có lịch sử escalation
- Biết ticket đã leo thang bao nhiêu lần

**Cải thiện hiệu suất:**
- Phát hiện bottleneck
- Cải thiện quy trình

---

## 8. QUY TRÌNH VẬN HÀNH

### 8.1 Quy trình tạo và xử lý Ticket (Chi tiết)

#### **Kịch bản 1: Vấn đề đơn giản - Giải quyết nhanh**

**Tình huống:** Nhân viên quên mật khẩu WiFi

```
09:00 - Anh Nam (Employee) gặp vấn đề
        "Mình quên mật khẩu WiFi rồi"

09:01 - Anh Nam mở Chatbot
        Hỏi: "Mật khẩu WiFi là gì?"

09:01 - Chatbot trả lời ngay
        "Mật khẩu WiFi 28H-Staff là: 28h@2024
         Nếu không kết nối được, vui lòng xem hướng dẫn..."
        
        Kèm link: "Hướng dẫn kết nối WiFi"

09:02 - Anh Nam kết nối thành công
        Không cần tạo ticket
        Tiết kiệm thời gian cho cả 2 bên
```

**Kết quả:**
- Thời gian giải quyết: 2 phút
- Không tốn thời gian IT Staff
- User hài lòng vì giải quyết nhanh

#### **Kịch bản 2: Vấn đề trung bình - Cần IT hỗ trợ**

**Tình huống:** Máy tính chạy chậm

```
10:00 - Chị Lan (Employee) tạo ticket
        Tiêu đề: "Máy tính chạy rất chậm"
        Danh mục: Hardware → Computer
        Priority: Medium
        Mô tả: "Máy tính mở phần mềm rất lâu, đôi khi bị đơ"
        
        → Hệ thống tạo: TKT-2026-0015
        → SLA: 24 giờ (Medium)
        → Due date: Ngày mai 10:00

10:05 - Anh Hùng (IT Staff) nhận thông báo
        Xem ticket mới trên dashboard
        Click "Assign to Me"

10:10 - Anh Hùng bắt đầu xử lý
        Click "Start Progress"
        Viết Internal Note: "Sẽ đến kiểm tra lúc 11:00"

11:00 - Anh Hùng đến bàn Chị Lan
        Kiểm tra máy tính
        Phát hiện: RAM đầy, nhiều phần mềm chạy nền

11:15 - Anh Hùng xử lý
        - Dọn dẹp phần mềm không cần thiết
        - Tăng RAM từ 4GB lên 8GB
        - Cài đặt lại Windows

12:00 - Anh Hùng hoàn thành
        Click "Resolve"
        Resolution Notes: "Đã nâng cấp RAM lên 8GB và cài lại Windows.
                          Máy tính đã chạy mượt mà."

12:05 - Chị Lan nhận thông báo
        Kiểm tra máy tính
        Thấy máy chạy nhanh hơn nhiều
        
12:10 - Chị Lan đánh giá
        Rating: 5 sao
        Feedback: "Anh Hùng hỗ trợ rất nhiệt tình, máy giờ chạy rất nhanh"
        Click "Close"

12:11 - Ticket đóng
        Lưu vào lịch sử
        Cập nhật thống kê
```

**Kết quả:**
- Thời gian xử lý: 2 giờ (trong SLA 24 giờ)
- SLA: Met (Đúng hạn)
- User hài lòng: 5 sao
- IT Staff hoàn thành tốt công việc

#### **Kịch bản 3: Vấn đề phức tạp - Cần thêm thông tin**

**Tình huống:** Lỗi phần mềm ERP

```
14:00 - Anh Tuấn (Employee) tạo ticket
        Tiêu đề: "Không đăng nhập được ERP"
        Priority: High (ảnh hưởng công việc)
        Mô tả: "Nhập đúng user/pass nhưng báo lỗi"
        File: screenshot-loi.png
        
        → TKT-2026-0016
        → SLA: 4 giờ
        → Due date: 18:00 hôm nay

14:05 - Chị Mai (IT Staff) nhận ticket
        Assign to Me
        Start Progress

14:10 - Chị Mai xem screenshot
        Cần thêm thông tin để xử lý
        
14:15 - Chị Mai chuyển sang Pending
        Comment: "Anh cho em hỏi:
                 1. Anh đang dùng trình duyệt nào?
                 2. Lỗi này xuất hiện từ khi nào?
                 3. Anh có thử trình duyệt khác chưa?"

14:20 - Anh Tuấn nhận thông báo
        Trả lời: "Em dùng Chrome, lỗi từ sáng nay.
                 Chưa thử trình duyệt khác."

14:25 - Chị Mai nhận thông tin
        Chuyển lại In Progress
        Hướng dẫn: "Anh thử xóa cache Chrome:
                    1. Ctrl + Shift + Delete
                    2. Chọn 'All time'
                    3. Xóa Cookies và Cache
                    4. Thử đăng nhập lại"

14:30 - Anh Tuấn thử
        Vẫn không được
        Comment: "Em làm rồi nhưng vẫn lỗi"

14:35 - Chị Mai quyết định
        "Em sẽ remote vào máy anh để kiểm tra"
        Dùng TeamViewer remote

14:45 - Chị Mai phát hiện
        Tài khoản bị khóa do nhập sai pass 5 lần
        Unlock tài khoản trên server

14:50 - Chị Mai test
        Đăng nhập thành công
        
14:55 - Chị Mai Resolve
        Resolution: "Tài khoản bị khóa do nhập sai mật khẩu nhiều lần.
                    Đã unlock. Anh có thể đăng nhập bình thường."

15:00 - Anh Tuấn xác nhận
        Đăng nhập OK
        Rating: 5 sao
        Close ticket
```

**Kết quả:**
- Thời gian xử lý: 1 giờ (trong SLA 4 giờ)
- Có tương tác qua lại
- Cần remote để xử lý
- Giải quyết thành công

#### **Kịch bản 4: Vấn đề khẩn cấp - Escalation**

**Tình huống:** Server ERP down, ảnh hưởng toàn công ty

```
08:00 - Nhiều nhân viên tạo ticket
        TKT-2026-0020: "Không vào được ERP"
        TKT-2026-0021: "ERP báo lỗi 500"
        TKT-2026-0022: "Không kết nối được server"
        Priority: High

08:05 - Hệ thống phát hiện
        Nhiều ticket cùng vấn đề
        Gửi cảnh báo cho Admin

08:10 - Admin (Anh Minh) nhận cảnh báo
        Xem dashboard: 15 ticket High mới
        Nhận ra: Server ERP có vấn đề

08:15 - Anh Minh gọi họp khẩn
        Gọi tất cả IT Staff
        Phân công: Anh Đức check server, Anh Hùng thông báo user

08:20 - Anh Đức kiểm tra server
        Phát hiện: Disk đầy, database không ghi được
        
08:30 - Anh Đức xử lý
        Dọn dẹp log files cũ
        Mở rộng disk
        Restart database

08:45 - Anh Hùng thông báo
        Gửi email toàn công ty:
        "ERP đang bảo trì khẩn cấp, dự kiến xong lúc 9:00"

09:00 - Anh Đức hoàn thành
        Test ERP: Hoạt động bình thường
        Thông báo Admin

09:05 - Anh Minh xác nhận
        Test từ nhiều máy: OK
        Thông báo toàn công ty: "ERP đã hoạt động trở lại"

09:10 - IT Staff resolve tất cả ticket
        Resolution: "Server ERP bị đầy disk, đã xử lý xong.
                    Hệ thống hoạt động bình thường."

09:30 - User xác nhận
        Tất cả đều vào được ERP
        Close tickets
```

**Kết quả:**
- Vấn đề nghiêm trọng
- Xử lý nhanh trong 1 giờ
- Phối hợp team tốt
- Thông báo kịp thời cho user

### 8.2 Quy trình hàng ngày của IT Staff

#### **Buổi sáng (8:00 - 12:00)**

```
08:00 - Đăng nhập hệ thống
        Xem Dashboard
        Check Action Required:
        - 5 ticket mới (New)
        - 3 ticket assigned to me
        - 1 ticket sắp quá hạn SLA

08:10 - Ưu tiên xử lý
        1. Ticket sắp quá hạn (At Risk)
        2. Ticket High priority
        3. Ticket Medium priority

08:15 - Xử lý ticket sắp quá hạn
        TKT-2026-0010: Cài phần mềm AutoCAD
        Đến bàn user, cài đặt
        Resolve lúc 09:00

09:00 - Xử lý ticket High
        TKT-2026-0018: Máy in không in được
        Kiểm tra, thay mực
        Resolve lúc 09:30

09:30 - Coffee break
        Nghỉ 15 phút

09:45 - Xử lý ticket Medium
        TKT-2026-0019: Hướng dẫn sử dụng Excel
        Remote hướng dẫn qua TeamViewer
        Resolve lúc 10:30

10:30 - Nhận ticket mới
        TKT-2026-0023: Quên mật khẩu email
        Reset password
        Resolve lúc 10:45

10:45 - Viết Knowledge Base
        Viết bài: "Hướng dẫn sử dụng Excel cơ bản"
        Dựa trên ticket vừa xử lý

11:30 - Check dashboard
        Tất cả ticket assigned đã xử lý xong
        Không có ticket At Risk

11:45 - Nghỉ trưa
```

#### **Buổi chiều (13:00 - 17:30)**

```
13:00 - Quay lại làm việc
        Check dashboard
        2 ticket mới trong lúc nghỉ trưa

13:10 - Xử lý ticket mới
        TKT-2026-0024: Laptop không bật được
        Đến kiểm tra: Pin hết, sạc bị hỏng
        Thay sạc mới
        Resolve lúc 14:00

14:00 - Họp team
        Review ticket tuần này
        Thảo luận vấn đề thường gặp
        Lên kế hoạch cải thiện

15:00 - Xử lý ticket
        TKT-2026-0025: Cài phần mềm Photoshop
        Cài đặt và active
        Resolve lúc 15:45

15:45 - Proactive maintenance
        Check các máy tính trong công ty
        Cập nhật Windows, antivirus
        Phòng ngừa vấn đề

17:00 - Tổng kết ngày
        Xem báo cáo cá nhân:
        - Đã xử lý: 7 tickets
        - Thời gian trung bình: 45 phút/ticket
        - SLA compliance: 100%
        - Rating trung bình: 4.8/5

17:15 - Handover
        Ghi chú ticket đang xử lý dở
        Thông báo cho IT Staff ca tối (nếu có)

17:30 - Kết thúc ngày làm việc
```

### 8.3 Quy trình hàng tuần của Admin

#### **Thứ 2: Lên kế hoạch tuần**

```
- Xem báo cáo tuần trước
- Phân tích xu hướng ticket
- Lên kế hoạch cải thiện
- Họp team kick-off tuần mới
```

#### **Thứ 3-5: Theo dõi và hỗ trợ**

```
- Check dashboard mỗi ngày
- Xem SLA compliance
- Hỗ trợ IT Staff khi cần
- Xử lý escalation
- Review Knowledge Base
```

#### **Thứ 6: Tổng kết tuần**

```
09:00 - Xuất báo cáo tuần
        - Tổng số ticket: 45
        - Đã giải quyết: 42
        - Đang xử lý: 3
        - SLA compliance: 95%
        - Thời gian xử lý TB: 2.5 giờ

10:00 - Phân tích dữ liệu
        - Danh mục nào nhiều ticket nhất?
          → Hardware: 20 tickets (44%)
        - Vấn đề nào thường gặp?
          → Máy in lỗi: 8 tickets
        - IT Staff nào hiệu suất cao?
          → Anh Hùng: 15 tickets, 4.9 sao

11:00 - Họp team review
        - Khen ngợi thành tích tốt
        - Thảo luận vấn đề khó
        - Đề xuất cải thiện

14:00 - Lên kế hoạch cải thiện
        - Mua máy in mới (vì hay hỏng)
        - Viết thêm bài Knowledge Base
        - Training cho user về vấn đề thường gặp

15:00 - Cập nhật quy tắc
        - Điều chỉnh SLA nếu cần
        - Cập nhật escalation rules
        - Thêm/sửa categories

16:00 - Gửi báo cáo cho Ban Giám Đốc
        - Tóm tắt hoạt động tuần
        - Highlight thành tích
        - Đề xuất đầu tư
```

### 8.4 Quy trình hàng tháng

#### **Cuối tháng: Báo cáo và đánh giá**

```
Ngày 25-28: Chuẩn bị báo cáo
- Xuất dữ liệu tháng
- Tạo biểu đồ, chart
- Viết phân tích

Ngày 29-30: Họp tổng kết
- Review KPI tháng
- Đánh giá hiệu suất cá nhân
- Thưởng/phạt dựa trên KPI
- Lên mục tiêu tháng sau

Ngày 1-5 tháng sau: Cải thiện
- Implement các đề xuất
- Training nếu cần
- Cập nhật quy trình
```

---

## 9. TÍNH NĂNG NỔI BẬT

### 9.1 Tính toán SLA thông minh

#### **A. Tính theo giờ làm việc**

**Vấn đề:**
- Nếu tính SLA 24/7, không công bằng
- IT không làm việc cuối tuần, ban đêm
- User tạo ticket tối thứ 6 → Thứ 2 mới xử lý

**Giải pháp:**
- Chỉ tính giờ làm việc: 8:00-17:30, T2-T6
- Tự động bỏ qua cuối tuần
- Tự động bỏ qua ngày lễ

**Ví dụ:**
```
Ticket tạo: Thứ 6, 16:00
SLA: 4 giờ
Còn lại hôm nay: 1.5 giờ (16:00-17:30)
Cần thêm: 2.5 giờ
Thứ 7, CN: Không tính
Due date: Thứ 2, 10:30 (8:00 + 2.5 giờ)
```

**Lợi ích:**
- Công bằng cho IT Staff
- Realistic expectations cho User
- Tuân thủ chuẩn ITIL

#### **B. Cảnh báo sớm**

**At Risk Warning:**
- Khi ticket dùng 80% thời gian SLA
- Gửi cảnh báo cho IT Staff
- Ưu tiên xử lý trước khi quá hạn

**Ví dụ:**
```
SLA: 4 giờ
At Risk: 3.2 giờ (80%)
Còn lại: 0.8 giờ (48 phút)
→ Cảnh báo: "Ticket sắp quá hạn, cần xử lý gấp"
```

### 9.2 Chatbot AI với RAG

#### **A. RAG là gì?**

**RAG = Retrieval Augmented Generation**

**Giải thích đơn giản:**
- Không phải AI tự nghĩ ra câu trả lời
- AI tìm kiếm trong Knowledge Base
- Lấy thông tin có sẵn
- Tổng hợp thành câu trả lời tự nhiên

**Tại sao tốt hơn?**
- Câu trả lời chính xác (dựa trên dữ liệu có sẵn)
- Không bịa đặt (hallucination)
- Có thể truy xuất nguồn
- Cập nhật dễ dàng (thêm bài viết mới)

#### **B. Vector Search**

**Cách hoạt động:**

**Bước 1: Tạo Embedding**
```
Câu hỏi: "Làm sao kết nối WiFi?"
→ Chuyển thành vector 384 số
→ [0.123, -0.456, 0.789, ..., 0.234]

Bài viết: "Hướng dẫn kết nối WiFi 28H-Staff"
→ Chuyển thành vector 384 số
→ [0.145, -0.432, 0.801, ..., 0.256]
```

**Bước 2: Tính độ tương đồng**
```
Cosine Similarity giữa 2 vector
Kết quả: 0.92 (rất giống)

So sánh với tất cả bài viết:
- Bài 1: 0.92 (Hướng dẫn WiFi) ← Chọn
- Bài 2: 0.85 (Khắc phục lỗi WiFi) ← Chọn
- Bài 3: 0.78 (Đổi mật khẩu WiFi) ← Chọn
- Bài 4: 0.45 (Hướng dẫn ERP) ← Bỏ
```

**Bước 3: Tạo câu trả lời**
```
Gửi 3 bài viết + câu hỏi lên AI
AI đọc và tổng hợp
Trả về câu trả lời tự nhiên
```

**Lợi ích:**
- Tìm kiếm thông minh (không cần từ khóa chính xác)
- Hiểu ngữ cảnh
- Tìm được bài viết liên quan

### 9.3 Auto-Escalation thông minh

#### **A. Workload Balancing**

**Vấn đề:**
- Nếu escalate random → Có người quá tải
- Nếu escalate theo thứ tự → Không công bằng

**Giải pháp:**
- Tính toán workload của mỗi IT Staff
- Escalate cho người ít việc nhất
- Cân bằng công việc

**Cách tính workload:**
```
Workload = Số ticket đang xử lý + (Số ticket High * 2)

Ví dụ:
Anh Hùng: 3 ticket (2 Medium, 1 High)
→ Workload = 3 + (1 * 2) = 5

Chị Mai: 4 ticket (4 Medium, 0 High)
→ Workload = 4 + (0 * 2) = 4

→ Escalate cho Chị Mai (workload thấp hơn)
```

#### **B. Escalation Level**

**Cấp độ leo thang:**
```
Level 0: Ticket mới tạo
Level 1: Escalate lần 1 (sau 1 giờ không giao)
Level 2: Escalate lần 2 (sau 2 giờ vẫn không xử lý)
Level 3: Escalate lần 3 (quá hạn SLA)
Level 4: Escalate lên Manager
Level 5: Escalate lên Giám Đốc (critical)
```

**Ví dụ:**
```
10:00 - Ticket High tạo
11:00 - Chưa giao → Level 1, escalate cho IT Staff
12:00 - Chưa xử lý → Level 2, escalate cho IT Staff khác
14:00 - Quá hạn SLA → Level 3, escalate lên Admin
15:00 - Vẫn chưa xong → Level 4, escalate lên Manager
```

### 9.4 Lịch sử thay đổi đầy đủ

#### **A. Audit Trail**

**Ghi lại mọi thay đổi:**
- Ai tạo ticket
- Ai sửa ticket
- Ai comment
- Ai thay đổi trạng thái
- Ai giao ticket
- Ai escalate

**Ví dụ:**
```
10:00 - Anh Nam tạo ticket
10:05 - Anh Hùng nhận ticket
10:10 - Anh Hùng bắt đầu xử lý
10:15 - Anh Hùng thêm comment
10:30 - Anh Hùng thay đổi priority: Medium → High
11:00 - Anh Hùng giải quyết
11:05 - Anh Nam đánh giá 5 sao
11:06 - Anh Nam đóng ticket
```

**Lợi ích:**
- Truy xuất được lịch sử
- Phát hiện vấn đề
- Đánh giá hiệu suất
- Compliance (tuân thủ quy định)

#### **B. Soft Delete**

**Không xóa hẳn:**
- Comment bị xóa → Chỉ đánh dấu deleted
- Vẫn lưu trong database
- Admin có thể xem lại

**Tại sao?**
- Tránh mất dữ liệu quan trọng
- Có thể khôi phục nếu cần
- Audit trail đầy đủ

### 9.5 Dashboard trực quan

#### **A. Real-time Updates**

**Cập nhật tự động:**
- Không cần refresh trang
- Dữ liệu cập nhật mỗi 30 giây
- Thông báo real-time

**Công nghệ:**
- React Query với auto-refetch
- WebSocket cho thông báo
- Optimistic updates

#### **B. Interactive Charts**

**Biểu đồ tương tác:**
- Click vào biểu đồ → Xem chi tiết
- Hover → Hiển thị tooltip
- Zoom in/out
- Fullscreen mode

**Các loại biểu đồ:**
- Line Chart: Xu hướng theo thời gian
- Bar Chart: So sánh giữa các nhóm
- Pie Chart: Tỷ lệ phần trăm
- Gauge Chart: SLA compliance

### 9.6 Responsive Design

#### **A. Hoạt động trên mọi thiết bị**

**Desktop (Máy tính):**
- Giao diện đầy đủ
- Nhiều cột, nhiều thông tin
- Biểu đồ lớn, dễ nhìn

**Tablet (iPad):**
- Giao diện vừa phải
- 2 cột
- Touch-friendly

**Mobile (Điện thoại):**
- Giao diện đơn giản
- 1 cột
- Nút to, dễ bấm
- Menu hamburger

**Ví dụ:**
```
Desktop: Sidebar + Content + Right Panel
Tablet:  Sidebar (collapse) + Content
Mobile:  Menu (hamburger) + Content (full width)
```

#### **B. Progressive Web App (PWA)**

**Có thể cài đặt như app:**
- Thêm vào Home Screen
- Mở như app native
- Hoạt động offline (một phần)
- Push notifications

### 9.7 Bảo mật nhiều lớp

#### **A. Authentication (Xác thực)**

**JWT Token:**
- Mã hóa thông tin user
- Có thời hạn (7 ngày)
- Không lưu trên server (stateless)

**Password Security:**
- Hash bằng bcrypt (12 rounds)
- Không lưu plain text
- Không thể decrypt

#### **B. Authorization (Phân quyền)**

**Role-Based Access Control:**
- Mỗi role có quyền khác nhau
- Kiểm tra quyền ở mọi API call
- Frontend cũng kiểm tra (UI)

**Ví dụ:**
```
Employee muốn xóa ticket
→ Frontend: Không hiển thị nút "Delete"
→ Backend: Nếu vẫn gọi API → Trả về 403 Forbidden
```

#### **C. Input Validation**

**Kiểm tra dữ liệu:**
- Frontend: Validate form trước khi gửi
- Backend: Validate lại (không tin Frontend)
- Database: Constraint (NOT NULL, UNIQUE)

**Chống tấn công:**
- SQL Injection: Dùng ORM (Sequelize)
- XSS: Sanitize input
- CSRF: CSRF token
- Rate Limiting: Giới hạn request/phút

### 9.8 Performance Optimization

#### **A. Database Optimization**

**Indexing:**
- Index trên các cột hay query
- `tickets.status`, `tickets.assigneeId`
- Tăng tốc độ truy vấn

**Connection Pooling:**
- Tái sử dụng kết nối database
- Không tạo kết nối mới mỗi request
- Giảm overhead

#### **B. Frontend Optimization**

**Code Splitting:**
- Không load toàn bộ code một lúc
- Load theo route (lazy loading)
- Giảm thời gian load trang đầu

**Caching:**
- React Query cache dữ liệu
- Không fetch lại nếu còn fresh
- Giảm số lượng API call

**Image Optimization:**
- Compress ảnh trước khi upload
- Lazy load ảnh
- Responsive images

---

## 10. BẢO MẬT VÀ PHÂN QUYỀN

### 10.1 Hệ thống phân quyền (RBAC)

#### **A. Role-Based Access Control**

**3 Roles chính:**

**1. Employee**
```
Quyền:
✅ Tạo ticket
✅ Xem ticket của mình
✅ Comment trên ticket của mình
✅ Đánh giá ticket
✅ Xem Knowledge Base
✅ Sử dụng Chatbot
✅ Xem thông báo của mình

Không được:
❌ Xem ticket của người khác
❌ Xóa ticket
❌ Giao ticket
❌ Xem báo cáo
❌ Quản lý user
```

**2. IT_Staff**
```
Quyền:
✅ Tất cả quyền của Employee
✅ Xem tất cả ticket
✅ Nhận và xử lý ticket
✅ Giao ticket cho đồng nghiệp
✅ Thay đổi trạng thái ticket
✅ Viết Internal Note
✅ Tạo Knowledge Base
✅ Xem báo cáo cá nhân

Không được:
❌ Xóa ticket
❌ Quản lý user
❌ Cấu hình SLA
❌ Xem báo cáo toàn bộ
```

**3. Admin**
```
Quyền:
✅ Tất cả quyền của IT_Staff
✅ Xóa ticket
✅ Quản lý user (CRUD)
✅ Cấu hình SLA rules
✅ Cấu hình Escalation rules
✅ Xem báo cáo toàn bộ
✅ Quản lý categories
✅ Quản lý holidays
✅ Xem audit logs
```

#### **B. Cách kiểm tra quyền**

**Backend:**
```typescript
// Decorator kiểm tra role
@Roles(UserRole.ADMIN, UserRole.IT_STAFF)
@UseGuards(JwtAuthGuard, RolesGuard)
async deleteTicket(@Param('id') id: number) {
  // Chỉ Admin và IT_Staff mới vào được
}
```

**Frontend:**
```typescript
// Kiểm tra role trước khi hiển thị
{user.role === 'Admin' && (
  <button onClick={deleteTicket}>Delete</button>
)}
```

### 10.2 Bảo mật dữ liệu

#### **A. Mã hóa Password**

**Bcrypt Hashing:**
```
Input: "password123"
Salt: Random string
Hash: $2b$12$KIXxKj8N9yGmP7QZ...
→ Lưu vào database

Khi đăng nhập:
Input: "password123"
→ Hash lại với cùng salt
→ So sánh với hash trong DB
→ Match → Đăng nhập thành công
```

**Không thể decrypt:**
- Chỉ có thể so sánh
- Nếu quên password → Phải reset, không thể lấy lại

#### **B. JWT Token**

**Cấu trúc:**
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId: 1, role: "Admin", exp: 1234567890 }
Signature: HMACSHA256(header + payload, secret)

→ Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Bảo mật:**
- Có chữ ký (signature) → Không thể giả mạo
- Có expiration → Hết hạn sau 7 ngày
- Lưu trong localStorage (Frontend)
- Gửi trong header mỗi request

#### **C. HTTPS**

**Mã hóa kết nối:**
- Tất cả dữ liệu truyền qua internet được mã hóa
- Không thể nghe lén (man-in-the-middle)
- SSL Certificate từ Let's Encrypt

### 10.3 Audit và Compliance

#### **A. Audit Logs**

**Ghi lại mọi hành động:**
- Ai đăng nhập khi nào
- Ai tạo/sửa/xóa gì
- Ai truy cập dữ liệu nhạy cảm
- Lỗi xảy ra khi nào

**Ví dụ:**
```
2026-01-27 10:00:00 | User: admin@28h.com | Action: LOGIN | IP: 192.168.1.100
2026-01-27 10:05:00 | User: admin@28h.com | Action: CREATE_TICKET | Ticket: TKT-2026-0001
2026-01-27 10:10:00 | User: admin@28h.com | Action: DELETE_USER | User: old@28h.com
```

#### **B. GDPR Compliance**

**Quyền của user:**
- Quyền xem dữ liệu cá nhân
- Quyền xóa dữ liệu (Right to be forgotten)
- Quyền export dữ liệu

**Hệ thống hỗ trợ:**
- Export ticket của user ra JSON
- Xóa user và tất cả dữ liệu liên quan
- Anonymize dữ liệu khi cần

---

## 11. TRIỂN KHAI VÀ VẬN HÀNH

### 11.1 Môi trường triển khai

#### **A. Development (Phát triển)**

**Mục đích:**
- Lập trình viên phát triển tính năng mới
- Test tính năng
- Debug lỗi

**Cấu hình:**
- Chạy trên localhost
- Database local hoặc dev server
- Hot reload (tự động reload khi sửa code)
- Debug mode bật
- Log chi tiết

**Địa chỉ:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

#### **B. Staging (Kiểm thử)**

**Mục đích:**
- Test trước khi lên production
- QA team test
- User Acceptance Testing (UAT)

**Cấu hình:**
- Giống production
- Database riêng (staging)
- Dữ liệu giả lập
- Có thể reset dữ liệu

**Địa chỉ:**
- Frontend: https://staging.ticket.28h.com
- Backend: https://staging-api.ticket.28h.com

#### **C. Production (Thực tế)**

**Mục đích:**
- User thực tế sử dụng
- Dữ liệu thật
- Phải ổn định, bảo mật

**Cấu hình:**
- Server mạnh
- Database production (Supabase)
- HTTPS bắt buộc
- Backup tự động
- Monitoring 24/7

**Địa chỉ:**
- Frontend: https://ticket.28h.com
- Backend: https://api.ticket.28h.com

### 11.2 Cơ sở hạ tầng

#### **A. Server**

**Backend Server:**
```
CPU: 2 cores
RAM: 4GB
Storage: 20GB SSD
OS: Ubuntu 20.04 LTS
Location: Singapore (gần Việt Nam)
```

**Frontend Server:**
```
Có thể dùng:
- Vercel (miễn phí, tự động deploy)
- Netlify (miễn phí, tự động deploy)
- Hoặc cùng server với Backend
```

#### **B. Database**

**Supabase PostgreSQL:**
```
Plan: Free tier
Storage: 500MB
Bandwidth: 2GB/tháng
Connections: 60 concurrent
Backup: Tự động hàng ngày
Location: Singapore
```

**Nâng cấp khi cần:**
```
Pro Plan: $25/tháng
Storage: 8GB
Bandwidth: 50GB/tháng
Connections: 200 concurrent
```

#### **C. CDN và Caching**

**Cloudflare:**
- Cache static files
- DDoS protection
- SSL certificate miễn phí
- Tăng tốc độ load trang

### 11.3 Quy trình Deploy

#### **A. Deploy Backend**

**Bước 1: Chuẩn bị**
```bash
# Pull code mới nhất
git pull origin main

# Cài dependencies
cd apps/backend
npm install

# Build production
npm run build
```

**Bước 2: Database Migration**
```bash
# Chạy migrations
npm run db:migrate

# Seed dữ liệu (nếu cần)
npm run db:seed
```

**Bước 3: Start với PM2**
```bash
# Start hoặc restart
pm2 restart ticket-backend

# Hoặc start lần đầu
pm2 start ecosystem.config.js

# Check status
pm2 status

# Xem logs
pm2 logs ticket-backend
```

**Bước 4: Verify**
```bash
# Test API
curl https://api.ticket.28h.com/health

# Check logs
pm2 logs --lines 50
```

#### **B. Deploy Frontend**

**Option 1: Vercel (Khuyến nghị)**
```bash
# Cài Vercel CLI
npm install -g vercel

# Deploy
cd apps/frontend
vercel --prod

# Tự động deploy khi push lên GitHub
```

**Option 2: Manual Deploy**
```bash
# Build
cd apps/frontend
npm run build

# Copy build files lên server
scp -r .next/* user@server:/var/www/ticket-frontend/

# Restart
pm2 restart ticket-frontend
```

#### **C. Rollback (Quay lại phiên bản cũ)**

**Nếu có lỗi sau khi deploy:**
```bash
# Xem lịch sử deploy
pm2 list

# Rollback code
git reset --hard HEAD~1

# Rebuild
npm run build

# Restart
pm2 restart all

# Hoặc restore database backup
psql < backup-2026-01-26.sql
```

### 11.4 Monitoring và Logging

#### **A. Application Monitoring**

**PM2 Monitoring:**
```bash
# Real-time monitoring
pm2 monit

# Xem CPU, Memory usage
pm2 status

# Xem logs
pm2 logs

# Xem logs của 1 app
pm2 logs ticket-backend --lines 100
```

**Metrics quan trọng:**
- CPU usage: < 70%
- Memory usage: < 80%
- Response time: < 500ms
- Error rate: < 1%

#### **B. Database Monitoring**

**Supabase Dashboard:**
- Database size
- Number of connections
- Query performance
- Slow queries

**Cảnh báo khi:**
- Database > 80% capacity
- Connections > 50
- Slow query > 1 second

#### **C. Error Tracking**

**Sentry (Optional):**
- Tự động catch errors
- Gửi thông báo khi có lỗi
- Stack trace chi tiết
- User context

**Log Levels:**
```
ERROR: Lỗi nghiêm trọng, cần xử lý ngay
WARN: Cảnh báo, cần chú ý
INFO: Thông tin bình thường
DEBUG: Chi tiết cho developer
```

### 11.5 Backup và Recovery

#### **A. Database Backup**

**Tự động backup hàng ngày:**
```bash
#!/bin/bash
# Script: backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/ticket-system"
FILENAME="ticket_db_$DATE.sql"

# Backup database
pg_dump -h supabase-host -U postgres -d postgres > $BACKUP_DIR/$FILENAME

# Compress
gzip $BACKUP_DIR/$FILENAME

# Xóa backup cũ hơn 7 ngày
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $FILENAME.gz"
```

**Cron job:**
```bash
# Chạy mỗi ngày lúc 2:00 AM
0 2 * * * /var/www/ticket-system/backup-db.sh
```

#### **B. Restore Database**

**Khi cần restore:**
```bash
# Giải nén backup
gunzip backup-2026-01-26.sql.gz

# Restore
psql -h supabase-host -U postgres -d postgres < backup-2026-01-26.sql

# Verify
psql -h supabase-host -U postgres -d postgres -c "SELECT COUNT(*) FROM tickets;"
```

#### **C. Code Backup**

**Git Repository:**
- Push code lên GitHub
- Private repository
- Tự động backup

**Server Backup:**
- Backup toàn bộ server mỗi tuần
- Snapshot trên cloud provider

### 11.6 Bảo trì định kỳ

#### **A. Hàng ngày**

```
- Check PM2 status
- Check error logs
- Check database connections
- Check disk space
- Verify backup completed
```

#### **B. Hàng tuần**

```
- Review error logs chi tiết
- Check slow queries
- Update dependencies (nếu có security patch)
- Clean up old logs
- Review performance metrics
```

#### **C. Hàng tháng**

```
- Update Node.js, npm
- Update dependencies
- Review và optimize database
- Clean up old data (tickets > 1 năm)
- Review security
- Test backup restore
```

### 11.7 Xử lý sự cố

#### **A. Backend không hoạt động**

**Triệu chứng:**
- API không response
- Frontend báo lỗi "Cannot connect to server"

**Cách xử lý:**
```bash
# 1. Check PM2 status
pm2 status

# 2. Xem logs
pm2 logs ticket-backend --lines 50

# 3. Restart
pm2 restart ticket-backend

# 4. Nếu vẫn lỗi, check database
psql -h supabase-host -U postgres -d postgres

# 5. Check disk space
df -h

# 6. Check memory
free -h
```

#### **B. Database connection error**

**Triệu chứng:**
- Backend báo lỗi "Cannot connect to database"
- Timeout errors

**Cách xử lý:**
```bash
# 1. Check database status (Supabase Dashboard)

# 2. Check connection string trong .env
cat apps/backend/.env | grep DB_

# 3. Test connection
psql -h supabase-host -U postgres -d postgres

# 4. Check số lượng connections
# Nếu quá nhiều, tăng pool size hoặc restart

# 5. Restart backend
pm2 restart ticket-backend
```

#### **C. Frontend không load**

**Triệu chứng:**
- Trang trắng
- Lỗi 404
- Lỗi JavaScript

**Cách xử lý:**
```bash
# 1. Check PM2 status (nếu host trên server)
pm2 status ticket-frontend

# 2. Check Vercel status (nếu host trên Vercel)
# Vào Vercel Dashboard

# 3. Check browser console
# F12 → Console → Xem lỗi

# 4. Check API connection
# F12 → Network → Xem API calls

# 5. Clear cache và reload
# Ctrl + Shift + R
```

#### **D. Slow performance**

**Triệu chứng:**
- Trang load chậm
- API response chậm

**Cách xử lý:**
```bash
# 1. Check server resources
htop
df -h

# 2. Check database slow queries
# Vào Supabase Dashboard → Query Performance

# 3. Check PM2 metrics
pm2 monit

# 4. Optimize database
# Add indexes, clean up old data

# 5. Scale up server (nếu cần)
# Tăng RAM, CPU
```

### 11.8 Scaling (Mở rộng)

#### **A. Vertical Scaling (Tăng cấu hình)**

**Khi nào cần:**
- CPU usage > 80%
- Memory usage > 90%
- Response time > 1 second

**Cách làm:**
- Nâng cấp server: 2 cores → 4 cores
- Tăng RAM: 4GB → 8GB
- Nâng cấp database plan

#### **B. Horizontal Scaling (Thêm server)**

**Khi nào cần:**
- Số user > 1000
- Request/second > 100
- Vertical scaling không đủ

**Cách làm:**
- Thêm backend server
- Load balancer (Nginx)
- Database replication

**Kiến trúc:**
```
                Load Balancer
                      |
        +-------------+-------------+
        |             |             |
   Backend 1     Backend 2     Backend 3
        |             |             |
        +-------------+-------------+
                      |
                  Database
```

---

## 12. KẾT LUẬN

### 12.1 Tổng kết dự án

**Hệ thống Quản lý Ticket** là một giải pháp toàn diện để số hóa quy trình hỗ trợ kỹ thuật của Công ty TNHH 28H. Dự án đã đạt được các mục tiêu đề ra:

✅ **Số hóa quy trình:** Chuyển từ thủ công sang hệ thống tự động  
✅ **Tăng hiệu quả:** Giảm thời gian xử lý, tăng năng suất IT  
✅ **Minh bạch hóa:** Mọi người đều thấy được tiến độ xử lý  
✅ **Tuân thủ chuẩn:** Áp dụng ITIL/ITSM, tính SLA theo business hours  
✅ **AI Chatbot:** Giảm tải cho IT, trả lời tự động 24/7  
✅ **Báo cáo chi tiết:** Dashboard trực quan, metrics đầy đủ  

### 12.2 Thành tựu đạt được

**Về kỹ thuật:**
- Kiến trúc 3-tier hiện đại, dễ mở rộng
- Công nghệ tiên tiến: Next.js, NestJS, PostgreSQL
- AI Chatbot với RAG, vector search
- Auto-escalation thông minh
- Bảo mật nhiều lớp
- Performance tối ưu

**Về nghiệp vụ:**
- Quản lý ticket đầy đủ vòng đời
- SLA tính theo business hours
- Knowledge Base phong phú
- Báo cáo và thống kê chi tiết
- Phân quyền rõ ràng
- Audit trail đầy đủ

**Về trải nghiệm:**
- Giao diện đẹp, dễ sử dụng
- Responsive trên mọi thiết bị
- Thông báo real-time
- Chatbot thông minh
- Dashboard trực quan

### 12.3 Lợi ích mang lại

**Cho Nhân viên:**
- Tạo ticket dễ dàng, mọi lúc mọi nơi
- Theo dõi tiến độ real-time
- Tự giải quyết vấn đề qua Chatbot
- Không cần gọi điện, gửi email

**Cho IT Staff:**
- Quản lý tập trung tất cả yêu cầu
- Ưu tiên xử lý theo SLA
- Không bỏ sót ticket
- Có lịch sử để tham khảo
- Đánh giá hiệu suất rõ ràng

**Cho Quản lý:**
- Báo cáo chi tiết, trực quan
- Đánh giá hiệu suất team
- Phát hiện vấn đề thường gặp
- Ra quyết định dựa trên dữ liệu
- Tối ưu nguồn lực

**Cho Công ty:**
- Tiết kiệm thời gian và chi phí
- Tăng năng suất làm việc
- Cải thiện chất lượng dịch vụ IT
- Tăng sự hài lòng nhân viên
- Tuân thủ chuẩn quốc tế

### 12.4 Bài học kinh nghiệm

**Về kỹ thuật:**
- Chọn công nghệ phù hợp quan trọng hơn công nghệ mới nhất
- Kiến trúc tốt giúp dễ bảo trì và mở rộng
- Testing và monitoring rất quan trọng
- Security phải được ưu tiên từ đầu

**Về quản lý:**
- Hiểu rõ yêu cầu nghiệp vụ trước khi code
- Giao tiếp với user thường xuyên
- Chia nhỏ tính năng, deploy từng phần
- Document đầy đủ giúp handover dễ dàng

**Về vận hành:**
- Backup quan trọng hơn bạn nghĩ
- Monitoring giúp phát hiện vấn đề sớm
- Có kế hoạch xử lý sự cố
- Training user giúp adoption tốt hơn

### 12.5 Hướng phát triển tương lai

**Ngắn hạn (3-6 tháng):**
- Thêm mobile app (React Native)
- Tích hợp email (gửi/nhận ticket qua email)
- Thêm ticket templates
- Cải thiện Chatbot (thêm model, fine-tuning)
- Thêm dashboard cho từng department

**Trung hạn (6-12 tháng):**
- Tích hợp với hệ thống ERP
- Asset Management (quản lý tài sản IT)
- Change Management (quản lý thay đổi)
- Problem Management (quản lý vấn đề)
- Advanced analytics (AI predict issues)

**Dài hạn (1-2 năm):**
- Microservices architecture
- Multi-tenant (nhiều công ty dùng chung)
- Advanced AI (tự động phân loại, gợi ý giải pháp)
- Integration marketplace (plugin ecosystem)
- White-label solution (bán cho công ty khác)

### 12.6 Lời cảm ơn

Dự án này được hoàn thành nhờ sự hỗ trợ của:

- **Công ty TNHH 28H:** Cung cấp yêu cầu và feedback
- **Giảng viên hướng dẫn:** Chỉ dẫn và góp ý
- **Cộng đồng Open Source:** Cung cấp công cụ và thư viện
- **Gia đình và bạn bè:** Động viên và hỗ trợ

### 12.7 Thông tin liên hệ

**Tác giả:** Nguyễn Thị Thu Trang  
**Lớp:** ĐH12C2  
**Email:** thutrang@example.com  
**GitHub:** https://github.com/thutrang  

**Hệ thống:**
- **Production:** https://ticket.28h.com
- **API Docs:** https://api.ticket.28h.com/docs
- **Repository:** https://github.com/28h/ticket-system

**Hỗ trợ:**
- **Email:** support@28h.com
- **Hotline:** 1900-xxxx
- **Giờ làm việc:** 8:00-17:30, Thứ 2-6

---

## PHỤ LỤC

### A. Thuật ngữ chuyên ngành

**API (Application Programming Interface):** Giao diện lập trình ứng dụng, cách các phần mềm giao tiếp với nhau

**Backend:** Phần xử lý logic phía server, người dùng không nhìn thấy

**Frontend:** Phần giao diện người dùng nhìn thấy và tương tác

**Database:** Cơ sở dữ liệu, nơi lưu trữ thông tin

**SLA (Service Level Agreement):** Thỏa thuận mức độ dịch vụ, thời gian cam kết xử lý

**Escalation:** Leo thang, chuyển ticket lên cấp cao hơn

**RAG (Retrieval Augmented Generation):** Kỹ thuật AI tạo câu trả lời dựa trên dữ liệu có sẵn

**JWT (JSON Web Token):** Mã xác thực người dùng

**ORM (Object-Relational Mapping):** Chuyển đổi giữa code và database

**CRUD:** Create, Read, Update, Delete - 4 thao tác cơ bản với dữ liệu

### B. Tài liệu tham khảo

**Công nghệ:**
- Next.js: https://nextjs.org/docs
- NestJS: https://docs.nestjs.com
- PostgreSQL: https://www.postgresql.org/docs
- React: https://react.dev

**Chuẩn ITIL:**
- ITIL Foundation: https://www.axelos.com/certifications/itil
- ITSM Best Practices: https://www.bmc.com/blogs/itil-itsm

**AI & Machine Learning:**
- Transformers.js: https://huggingface.co/docs/transformers.js
- OpenRouter: https://openrouter.ai/docs

### C. Changelog (Lịch sử thay đổi)

**Version 1.0.0 (27/01/2026)**
- ✅ Release phiên bản đầu tiên
- ✅ Đầy đủ tính năng core
- ✅ Đã test và sẵn sàng production

**Version 0.9.0 (20/01/2026)**
- ✅ Hoàn thành Chatbot AI với RAG
- ✅ Hoàn thành Auto-Escalation
- ✅ Hoàn thành Dashboard và Reports

**Version 0.8.0 (15/01/2026)**
- ✅ Hoàn thành SLA Management
- ✅ Hoàn thành Business Hours
- ✅ Hoàn thành Knowledge Base

**Version 0.7.0 (10/01/2026)**
- ✅ Hoàn thành Ticket Management
- ✅ Hoàn thành User Management
- ✅ Hoàn thành Authentication

---

**© 2026 Nguyễn Thị Thu Trang - Lớp ĐH12C2**

**Tài liệu này được tạo để giúp mọi người hiểu rõ về Hệ thống Quản lý Ticket mà không cần kiến thức lập trình.**

**Nếu có thắc mắc, vui lòng liên hệ: thutrang@example.com**

---

**HẾT**
