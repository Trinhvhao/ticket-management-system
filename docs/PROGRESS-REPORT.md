# BÁO CÁO TIẾN ĐỘ DỰ ÁN
## Hệ thống Quản lý Ticket - Công ty TNHH 28H

**Ngày cập nhật:** 16/01/2026  
**Trạng thái hiện tại:** Đang hoàn thiện phân quyền và quản trị thông tin

---

## BẢNG TIẾN ĐỘ THỰC HIỆN

| Thời gian | Công việc thực hiện | Dự kiến kết quả | Kết quả thực nghiệm | Trạng thái |
|-----------|---------------------|-----------------|---------------------|------------|
| 21/11 – 01/12/2025 | Thu thập và nghiên cứu tài liệu về hệ thống quản lý ticket, Helpdesk, chatbot hỗ trợ; khảo sát thực tế nhu cầu tại Công ty TNHH 28H | Hiểu rõ quy trình hỗ trợ kỹ thuật nội bộ, tổng hợp tài liệu lý thuyết; xác định yêu cầu hệ thống cần xây dựng | Hoàn thành nghiên cứu ITIL/ITSM, khảo sát quy trình hỗ trợ hiện tại (nhắn tin, gọi điện), xác định 3 roles chính (Employee, IT_Staff, Admin), định nghĩa 12 modules cần phát triển | Hoàn thành |
| 02/12 – 10/12/2025 | Phân tích yêu cầu hệ thống và nghiệp vụ; xây dựng sơ đồ Use Case, biểu đồ hoạt động; hoàn thiện tài liệu phân tích | Bộ tài liệu phân tích nghiệp vụ hoàn chỉnh; Use Case, Activity Diagram và mô hình xử lý rõ ràng | Hoàn thành Use Case cho 12 modules, thiết kế workflow ticket (New - Assigned - In Progress - Resolved - Closed), định nghĩa 80+ API endpoints | Hoàn thành |
| 11/12 – 20/12/2025 | Thiết kế tổng thể hệ thống web: kiến trúc ứng dụng, cơ sở dữ liệu, giao diện Dashboard quản lý ticket | Hoàn thiện thiết kế CSDL; bản mẫu giao diện và kiến trúc hệ thống web | Thiết kế 14 tables PostgreSQL, kiến trúc 3-tier (Next.js + NestJS + PostgreSQL), mockup Dashboard với charts, Kanban, Calendar views | Hoàn thành |
| 21/12 – 01/01/2026 | Xây dựng chức năng quản lý ticket (gửi yêu cầu, theo dõi trạng thái, cập nhật thông tin) | Hoàn thành chức năng khởi tạo và quản lý ticket cơ bản | CRUD tickets hoàn chỉnh, auto-generate ticket number (TKT-YYYY-NNNN), 6 status workflow, 3 priority levels, search/filter/pagination, bulk operations, Kanban và Calendar views | Hoàn thành |
| 02/01 – 10/01/2026 | Xây dựng chức năng xử lý ticket cho nhân viên IT (cập nhật trạng thái, thêm bình luận) | Nhân viên IT xử lý ticket theo đúng quy trình nghiệp vụ | Assign ticket, status transitions, comments (public/internal), attachments upload/download, ticket history (audit trail), SLA tracking với at-risk/breached alerts | Hoàn thành |
| 11/01 – 20/01/2026 | Phát triển chức năng quản trị hệ thống (quản lý người dùng, phân quyền, quản lý danh mục yêu cầu) | Hoàn thiện phân quyền hệ thống và quản trị thông tin | CRUD Users (Admin only), RBAC với 3 roles, JWT authentication, Categories management, SLA rules management, Knowledge Base, Reports và Analytics Dashboard | Đang thực hiện |
| 21/01 – 28/01/2026 | Tích hợp chatbot hỗ trợ hỏi đáp và tạo ticket tự động khi chatbot không đưa ra giải pháp | Chatbot hoạt động cơ bản, hỗ trợ người dùng hiệu quả | Backend chatbot module đã có (rule-based NLP, KB integration), cần hoàn thiện frontend chat widget và auto-create ticket flow | Chưa bắt đầu |
| 23/01 – 30/01/2026 | Hoàn thiện giao diện Web Dashboard, tối ưu hệ thống và kiểm tra chức năng | Hệ thống hoàn chỉnh và giao diện trực quan | Dashboard cơ bản đã có, cần tối ưu UI/UX, responsive design | Chưa bắt đầu |
| 01/02 – 10/02/2026 | Kiểm thử tổng thể hệ thống, đánh giá kết quả, sửa lỗi; viết báo cáo khóa luận và hoàn thiện sản phẩm | Hệ thống ổn định, báo cáo khóa luận hoàn thiện, sẵn sàng bảo vệ | Chưa thực hiện | Chưa bắt đầu |

---

## THỐNG KÊ

| Metric | Số lượng |
|--------|----------|
| Backend Modules | 12 |
| API Endpoints | 80+ |
| Database Tables | 14 |
| Frontend Pages | 20+ |
| Tiến độ tổng thể | 75% |
