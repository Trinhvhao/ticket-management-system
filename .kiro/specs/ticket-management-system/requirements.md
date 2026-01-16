# Requirements Document

## Introduction

Hệ thống quản lý Ticket là một giải pháp số hóa quy trình hỗ trợ kỹ thuật tại Công ty TNHH 28H, thay thế quy trình thủ công hiện tại (nhắn tin, gọi điện) bằng một hệ thống tập trung, minh bạch và có thể theo dõi được. Hệ thống tích hợp Chatbot hỗ trợ FAQ và tự động tạo ticket để giảm tải cho bộ phận IT.

## Glossary

- **Ticket_System**: Hệ thống quản lý yêu cầu hỗ trợ kỹ thuật
- **Employee**: Nhân viên công ty gửi yêu cầu hỗ trợ
- **IT_Staff**: Nhân viên IT xử lý các yêu cầu hỗ trợ
- **Admin**: Quản trị viên hệ thống
- **Chatbot**: Module trí tuệ nhân tạo hỗ trợ tự động
- **SLA**: Cam kết mức độ dịch vụ về thời gian xử lý
- **Knowledge_Base**: Cơ sở tri thức chứa các giải pháp đã biết
- **Dashboard**: Giao diện tổng quan hiển thị thống kê và báo cáo

## Requirements

### Requirement 1

**User Story:** As an Employee, I want to submit support requests through a web portal, so that I can get technical assistance without having to make phone calls or send personal messages.

#### Acceptance Criteria

1. THE Ticket_System SHALL provide a web interface for creating support requests
2. WHEN an Employee submits a request, THE Ticket_System SHALL generate a unique ticket ID
3. THE Ticket_System SHALL allow file attachments with support requests
4. THE Ticket_System SHALL automatically timestamp all ticket submissions
5. WHEN a ticket is created, THE Ticket_System SHALL send confirmation notification to the Employee

### Requirement 2

**User Story:** As an Employee, I want to track the progress of my support requests in real-time, so that I know the current status and expected resolution time.

#### Acceptance Criteria

1. THE Ticket_System SHALL display current status of each ticket to the Employee
2. WHEN ticket status changes, THE Ticket_System SHALL notify the Employee
3. THE Ticket_System SHALL show estimated resolution time based on SLA
4. THE Ticket_System SHALL provide a history log of all ticket activities
5. THE Ticket_System SHALL allow Employees to add comments to their tickets

### Requirement 3

**User Story:** As an IT_Staff member, I want to receive, categorize and manage support tickets, so that I can efficiently resolve technical issues.

#### Acceptance Criteria

1. THE Ticket_System SHALL present incoming tickets to IT_Staff in a queue interface
2. THE Ticket_System SHALL allow IT_Staff to categorize tickets by type (Hardware, Software, Network)
3. THE Ticket_System SHALL enable IT_Staff to set priority levels (Low, Medium, High)
4. WHEN IT_Staff updates ticket status, THE Ticket_System SHALL log the change with timestamp
5. THE Ticket_System SHALL support escalation to higher-level IT_Staff when needed

### Requirement 4

**User Story:** As an IT_Staff member, I want to access historical solutions and knowledge base, so that I can resolve similar issues faster.

#### Acceptance Criteria

1. THE Ticket_System SHALL maintain a Knowledge_Base of resolved tickets and solutions
2. THE Ticket_System SHALL provide search functionality within the Knowledge_Base
3. WHEN resolving tickets, THE Ticket_System SHALL suggest similar past solutions
4. THE Ticket_System SHALL allow IT_Staff to add solutions to the Knowledge_Base
5. THE Ticket_System SHALL track resolution time for performance metrics

### Requirement 5

**User Story:** As an Admin, I want to manage user permissions and system configuration, so that I can control access and maintain system integrity.

#### Acceptance Criteria

1. THE Ticket_System SHALL provide role-based access control (Employee, IT_Staff, Admin)
2. THE Ticket_System SHALL allow Admin to manage ticket categories and priorities
3. THE Ticket_System SHALL enable Admin to configure SLA rules and timeframes
4. THE Ticket_System SHALL provide user management functionality
5. THE Ticket_System SHALL maintain audit logs of all administrative actions

### Requirement 6

**User Story:** As an Admin, I want to view comprehensive reports and analytics, so that I can evaluate IT department performance and identify improvement areas.

#### Acceptance Criteria

1. THE Ticket_System SHALL generate reports on ticket volume by category and time period
2. THE Ticket_System SHALL calculate and display SLA compliance metrics
3. THE Ticket_System SHALL show IT_Staff performance statistics
4. THE Ticket_System SHALL provide customer satisfaction ratings and trends
5. THE Ticket_System SHALL export reports in common formats (PDF, Excel)

### Requirement 7

**User Story:** As an Employee, I want to interact with a chatbot for common issues, so that I can get immediate help without creating tickets for simple problems.

#### Acceptance Criteria

1. THE Ticket_System SHALL provide a Chatbot interface for FAQ queries
2. THE Chatbot SHALL search the Knowledge_Base for relevant solutions
3. WHEN Chatbot cannot resolve an issue, THE Ticket_System SHALL automatically create a ticket
4. THE Chatbot SHALL collect necessary information during conversation for ticket creation
5. THE Ticket_System SHALL maintain conversation history for reference

### Requirement 8

**User Story:** As a system user, I want the system to enforce SLA commitments, so that support requests are handled within promised timeframes.

#### Acceptance Criteria

1. THE Ticket_System SHALL calculate response and resolution times based on priority levels
2. WHEN tickets approach SLA deadlines, THE Ticket_System SHALL send warning notifications
3. THE Ticket_System SHALL automatically escalate overdue tickets
4. THE Ticket_System SHALL track and report SLA compliance rates
5. THE Ticket_System SHALL adjust SLA timers during non-business hours

### Requirement 9

**User Story:** As an Employee, I want to rate the quality of support received, so that the organization can improve service quality.

#### Acceptance Criteria

1. WHEN a ticket is resolved, THE Ticket_System SHALL request satisfaction rating from the Employee
2. THE Ticket_System SHALL use a 5-point rating scale for service evaluation
3. THE Ticket_System SHALL allow optional feedback comments with ratings
4. THE Ticket_System SHALL compile satisfaction statistics for reporting
5. THE Ticket_System SHALL prevent multiple ratings for the same ticket

### Requirement 10

**User Story:** As an IT_Staff member, I want to collaborate with colleagues on complex issues, so that we can leverage team expertise for better solutions.

#### Acceptance Criteria

1. THE Ticket_System SHALL allow multiple IT_Staff to be assigned to a single ticket
2. THE Ticket_System SHALL provide internal notes functionality for IT_Staff collaboration
3. THE Ticket_System SHALL notify relevant IT_Staff when tickets are escalated
4. THE Ticket_System SHALL maintain visibility of ticket ownership and assignments
5. THE Ticket_System SHALL support handoff procedures between IT_Staff members