import { KnowledgeArticle } from '../entities/knowledge-article.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';

export async function seedKnowledgeArticles() {
  console.log('🌱 Seeding knowledge articles for 28H Company...');

  // Get categories and admin user
  const hardwareCategory = await Category.findOne({ where: { name: 'Hardware' } });
  const softwareCategory = await Category.findOne({ where: { name: 'Software' } });
  const networkCategory = await Category.findOne({ where: { name: 'Network' } });
  const otherCategory = await Category.findOne({ where: { name: 'Other' } });
  
  const admin = await User.findOne({ where: { role: 'Admin' } });

  if (!admin) {
    console.error('❌ Admin user not found. Please seed users first.');
    return;
  }

  const articles = [
    // COMPANY-SPECIFIC ARTICLES
    {
      title: 'Hướng dẫn truy cập hệ thống ERP nội bộ 28H',
      content: `## Giới thiệu
Hệ thống ERP (Enterprise Resource Planning) của 28H được triển khai để quản lý toàn bộ hoạt động kinh doanh từ kế toán, nhân sự, đến quản lý dự án.

## Thông tin hệ thống

### URL truy cập
- **Nội bộ**: http://erp.28h.local (chỉ trong mạng công ty)
- **Từ xa**: https://erp.28h.com.vn (qua VPN)
- **Port**: 8080

### Tài khoản
- Username: Mã nhân viên (VD: 28H001, 28H002)
- Password: Được cấp bởi phòng Nhân sự
- Đổi password lần đầu đăng nhập

## Các module chính

### 1. Module Nhân sự (HR)
**Chức năng:**
- Xem bảng lương hàng tháng
- Đăng ký nghỉ phép online
- Xem lịch làm việc
- Chấm công điện tử
- Đăng ký tăng ca

**Truy cập:** Menu → Nhân sự → Chọn chức năng

### 2. Module Dự án (Project Management)
**Chức năng:**
- Xem danh sách dự án được giao
- Cập nhật tiến độ công việc
- Báo cáo hàng tuần
- Quản lý tài liệu dự án

**Truy cập:** Menu → Dự án → My Projects

### 3. Module Tài chính (Finance)
**Chức năng:**
- Tạo phiếu đề nghị thanh toán
- Xem lịch sử thanh toán
- Báo cáo chi phí
- Quản lý hóa đơn

**Truy cập:** Menu → Tài chính → Đề nghị thanh toán

### 4. Module Kho (Inventory)
**Chức năng:**
- Đăng ký mượn thiết bị
- Xem tình trạng kho
- Yêu cầu văn phòng phẩm
- Theo dõi tài sản cá nhân

**Truy cập:** Menu → Kho → Yêu cầu mượn

## Quy trình đăng ký nghỉ phép

### Bước 1: Đăng nhập ERP
- Truy cập erp.28h.local
- Đăng nhập bằng mã nhân viên

### Bước 2: Tạo đơn nghỉ phép
1. Menu → Nhân sự → Đăng ký nghỉ phép
2. Chọn loại nghỉ:
   - Nghỉ phép năm
   - Nghỉ ốm (có giấy bác sĩ)
   - Nghỉ việc riêng
   - Nghỉ không lương
3. Chọn ngày bắt đầu và kết thúc
4. Nhập lý do nghỉ
5. Đính kèm giấy tờ (nếu có)
6. Click "Gửi duyệt"

### Bước 3: Chờ phê duyệt
- Trưởng phòng duyệt: 2-4 giờ
- Giám đốc duyệt (nghỉ >3 ngày): 1 ngày
- Nhận thông báo qua email

### Lưu ý:
⚠️ Đăng ký trước ít nhất 2 ngày làm việc
⚠️ Nghỉ đột xuất: Gọi điện + đăng ký sau
⚠️ Số ngày phép còn lại: Xem trong Dashboard

## Chấm công điện tử

### Thiết bị chấm công
**Vị trí:**
- Tầng 1: Cổng chính (máy vân tay)
- Tầng 2: Thang máy (máy thẻ từ)
- Tầng 3: Phòng IT (máy vân tay)

### Quy định:
- Giờ vào: 8:00 - 8:30
- Giờ ra: 17:00 - 17:30
- Nghỉ trưa: 12:00 - 13:00
- Quên chấm công: Báo HR trong ngày

### Xem lịch sử chấm công
1. ERP → Nhân sự → Chấm công
2. Chọn tháng cần xem
3. Xuất file Excel (nếu cần)

## Đăng ký tăng ca

### Điều kiện:
- Có yêu cầu từ trưởng phòng
- Đăng ký trước ít nhất 1 ngày
- Tối đa 40 giờ/tháng

### Quy trình:
1. ERP → Nhân sự → Đăng ký tăng ca
2. Chọn ngày và giờ tăng ca
3. Nhập lý do công việc
4. Gửi duyệt
5. Chấm công khi tăng ca (bắt buộc)

### Mức lương tăng ca:
- Ngày thường: 150% lương giờ
- Cuối tuần: 200% lương giờ
- Ngày lễ: 300% lương giờ

## Xử lý sự cố

### Quên mật khẩu ERP
1. Click "Quên mật khẩu" tại trang đăng nhập
2. Nhập mã nhân viên và email công ty
3. Nhận link reset qua email
4. Hoặc liên hệ HR: hr@28h.com.vn

### Lỗi không đăng nhập được
- Kiểm tra mã nhân viên (phân biệt hoa thường)
- Kiểm tra Caps Lock
- Thử trình duyệt khác (Chrome khuyến nghị)
- Xóa cache và cookie
- Liên hệ IT nếu vẫn lỗi

### Dữ liệu không hiển thị
- Refresh trang (F5)
- Kiểm tra kết nối mạng
- Thử đăng xuất và đăng nhập lại
- Báo IT nếu lỗi kéo dài >30 phút

## Hỗ trợ

### Vấn đề kỹ thuật (IT)
- Tạo ticket qua hệ thống này
- Email: it@28h.com.vn
- Ext: 101

### Vấn đề nghiệp vụ (HR)
- Email: hr@28h.com.vn
- Ext: 102
- Trực tiếp: Phòng HR (Tầng 2, phòng 201)

**Giờ hỗ trợ**: 8:00 - 17:30 (Thứ 2 - Thứ 6)`,
      categoryId: softwareCategory?.id,
      authorId: admin.id,
      tags: 'erp, 28h, hệ thống nội bộ, nhân sự, hướng dẫn',
      isPublished: true,
      publishedAt: new Date('2026-01-10'),
      viewCount: 523,
      helpfulCount: 198,
      notHelpfulCount: 7,
    },

    {
      title: 'Hướng dẫn kết nối WiFi văn phòng 28H',
      content: `## Mạng WiFi tại văn phòng 28H

Công ty có 3 mạng WiFi phục vụ các mục đích khác nhau:

### 1. 28H-Staff (Dành cho nhân viên)
**Thông tin kết nối:**
- SSID: **28H-Staff**
- Password: **28H@Staff2026**
- Bảo mật: WPA2-Enterprise
- Băng tần: 2.4GHz + 5GHz

**Phạm vi:**
- Tầng 1: Khu vực lễ tân, phòng họp A, B
- Tầng 2: Phòng Kinh doanh, Marketing, Kế toán
- Tầng 3: Phòng IT, Phòng Giám đốc
- Tầng 4: Khu vực pantry, phòng nghỉ

**Tốc độ:** 100Mbps (download), 50Mbps (upload)

### 2. 28H-Guest (Dành cho khách)
**Thông tin kết nối:**
- SSID: **28H-Guest**
- Password: **Guest28H** (đổi hàng tuần)
- Bảo mật: WPA2-PSK
- Băng tần: 2.4GHz

**Phạm vi:**
- Tầng 1: Khu vực lễ tân, phòng chờ
- Giới hạn: 10Mbps, không truy cập mạng nội bộ

**Lưu ý:** Mật khẩu mới được gửi qua email mỗi thứ 2 hàng tuần

### 3. 28H-IoT (Dành cho thiết bị)
**Thông tin:**
- SSID: **28H-IoT**
- Chỉ dành cho: Máy in, camera, điều hòa thông minh
- Nhân viên không sử dụng mạng này

## Hướng dẫn kết nối (Windows)

### Bước 1: Bật WiFi
- Click biểu tượng WiFi trên taskbar
- Hoặc Settings → Network & Internet → WiFi

### Bước 2: Chọn mạng
- Tìm và click vào **28H-Staff**
- Check "Connect automatically"
- Click "Connect"

### Bước 3: Nhập mật khẩu
- Nhập: **28H@Staff2026**
- Click "Next"

### Bước 4: Xác nhận kết nối
- Chọn "Yes" cho "Do you want to allow..."
- Đợi 5-10 giây
- Khi thấy "Connected" → Thành công

## Hướng dẫn kết nối (macOS)

1. Click biểu tượng WiFi trên menu bar
2. Chọn **28H-Staff**
3. Nhập password: **28H@Staff2026**
4. Click "Join"

## Hướng dẫn kết nối (Mobile)

### iOS:
1. Settings → WiFi
2. Chọn **28H-Staff**
3. Nhập password
4. Tap "Join"

### Android:
1. Settings → WiFi
2. Chọn **28H-Staff**
3. Nhập password
4. Tap "Connect"

## Vị trí Access Point (AP)

### Tầng 1:
- AP-01: Lễ tân (trần giữa)
- AP-02: Phòng họp A (góc trái)
- AP-03: Phòng họp B (góc phải)

### Tầng 2:
- AP-04: Khu vực Kinh doanh (cột giữa)
- AP-05: Khu vực Marketing (cửa sổ)
- AP-06: Phòng Kế toán (góc phải)

### Tầng 3:
- AP-07: Phòng IT (trần giữa)
- AP-08: Hành lang (gần thang máy)
- AP-09: Phòng Giám đốc (riêng biệt)

### Tầng 4:
- AP-10: Khu pantry (trần giữa)
- AP-11: Phòng nghỉ (góc trái)

## Xử lý sự cố

### Không tìm thấy mạng 28H-Staff
**Nguyên nhân:**
- AP gần bạn bị lỗi
- WiFi adapter bị tắt
- Driver WiFi lỗi

**Giải pháp:**
1. Bật lại WiFi adapter
2. Di chuyển đến vị trí khác
3. Restart máy tính
4. Báo IT nếu nhiều người cùng bị

### Kết nối được nhưng không có Internet
**Nguyên nhân:**
- Đường truyền Internet chính bị sự cố
- Router bị lỗi
- Tài khoản bị khóa

**Giải pháp:**
1. Ngắt và kết nối lại WiFi
2. Kiểm tra với đồng nghiệp xem họ có bị không
3. Thử kết nối dây mạng (nếu có)
4. Báo IT ngay nếu cả văn phòng bị

### WiFi yếu hoặc chập chờn
**Nguyên nhân:**
- Xa AP
- Nhiều người dùng cùng lúc
- Vật cản (tường, cột)

**Giải pháp:**
1. Di chuyển gần AP hơn
2. Chuyển sang băng tần 5GHz (nếu hỗ trợ)
3. Sử dụng dây mạng (khuyến nghị cho desktop)
4. Báo IT để xem xét lắp thêm AP

### Mật khẩu không đúng
**Nguyên nhân:**
- Gõ sai (phân biệt hoa thường)
- Mật khẩu đã đổi
- Caps Lock đang bật

**Giải pháp:**
1. Kiểm tra Caps Lock
2. Copy-paste mật khẩu từ email
3. Xóa mạng đã lưu và kết nối lại
4. Liên hệ IT để xác nhận mật khẩu

## Quy định sử dụng WiFi

### ✅ Được phép:
- Làm việc, email, cloud storage
- Họp online (Zoom, Teams, Google Meet)
- Tìm kiếm thông tin công việc
- Học tập, nghiên cứu

### ❌ Không được phép:
- Streaming video HD liên tục (YouTube, Netflix)
- Download file lớn không liên quan công việc
- Chơi game online
- Torrent, P2P
- Truy cập nội dung không phù hợp

### ⚠️ Lưu ý:
- Hệ thống có giám sát băng thông
- Tài khoản lạm dụng sẽ bị khóa
- Vi phạm nghiêm trọng sẽ bị xử lý kỷ luật

## Bảo mật WiFi

### Không chia sẻ mật khẩu:
- Mật khẩu 28H-Staff chỉ dành cho nhân viên
- Khách sử dụng mạng 28H-Guest
- Vi phạm sẽ bị xử lý

### Cẩn thận với thiết bị cá nhân:
- Cài đặt antivirus
- Cập nhật hệ điều hành
- Không jailbreak/root
- Không cài app lạ

### Khi rời công ty:
- Xóa mạng 28H-Staff khỏi thiết bị
- Không chia sẻ mật khẩu cho người khác

## Hỗ trợ

### Vấn đề kết nối:
- Tạo ticket: Category "Network"
- Email: it@28h.com.vn
- Ext: 101
- Trực tiếp: Phòng IT (Tầng 3)

### Thời gian xử lý:
- Vấn đề cá nhân: 1-2 giờ
- Vấn đề toàn văn phòng: Ưu tiên xử lý ngay

**Cập nhật lần cuối**: 15/01/2026  
**Người phụ trách**: Phòng IT - Công ty TNHH 28H`,
      categoryId: networkCategory?.id,
      authorId: admin.id,
      tags: 'wifi, 28h, network, văn phòng, kết nối',
      isPublished: true,
      publishedAt: new Date('2026-01-12'),
      viewCount: 678,
      helpfulCount: 245,
      notHelpfulCount: 12,
    },

    {
      title: 'Quy trình đặt và sử dụng phòng họp tại 28H',
      content: `## Danh sách phòng họp

### Tầng 1 - Phòng họp lớn
**Phòng A - "Innovation"**
- Sức chứa: 20 người
- Thiết bị:
  - TV 65 inch (kết nối HDMI/Wireless)
  - Hệ thống loa micro
  - Bảng Flipchart
  - Điều hòa 2 chiều
  - Camera họp online (Logitech Rally)
- Phù hợp: Họp toàn công ty, đào tạo, họp khách hàng

**Phòng B - "Collaboration"**
- Sức chứa: 15 người
- Thiết bị:
  - TV 55 inch
  - Bảng Whiteboard
  - Điều hòa
  - Camera họp online
- Phù hợp: Họp phòng ban, workshop

### Tầng 2 - Phòng họp trung
**Phòng C - "Focus"**
- Sức chứa: 8 người
- Thiết bị:
  - Monitor 32 inch
  - Bảng Whiteboard
  - Điều hòa
- Phù hợp: Họp team, brainstorming

**Phòng D - "Creative"**
- Sức chứa: 8 người
- Thiết bị:
  - TV 43 inch
  - Bảng Whiteboard
  - Sofa thoải mái
- Phù hợp: Họp sáng tạo, thảo luận

### Tầng 3 - Phòng họp nhỏ
**Phòng E - "Quick Sync"**
- Sức chứa: 4 người
- Thiết bị:
  - Monitor 24 inch
  - Bảng Whiteboard nhỏ
- Phù hợp: Họp nhanh, 1-1 meeting

**Phòng F - "Private"**
- Sức chứa: 4 người
- Thiết bị:
  - Monitor 24 inch
  - Cách âm tốt
- Phù hợp: Họp riêng tư, phỏng vấn

## Quy trình đặt phòng

### Cách 1: Qua hệ thống ERP (Khuyến nghị)

#### Bước 1: Đăng nhập ERP
- Truy cập: http://erp.28h.local
- Đăng nhập bằng mã nhân viên

#### Bước 2: Đặt phòng
1. Menu → Tiện ích → Đặt phòng họp
2. Chọn ngày và giờ họp
3. Chọn phòng họp (xem phòng trống)
4. Nhập thông tin:
   - Tiêu đề cuộc họp
   - Số người tham gia
   - Mục đích họp
   - Yêu cầu đặc biệt (nếu có)
5. Thêm người tham gia (tùy chọn)
6. Click "Đặt phòng"

#### Bước 3: Xác nhận
- Nhận email xác nhận ngay lập tức
- Email chứa:
  - Mã đặt phòng (VD: MTG-2026-001)
  - Thông tin phòng họp
  - Thời gian
  - Mã mở cửa (nếu phòng có khóa điện tử)

### Cách 2: Qua Outlook Calendar

#### Bước 1: Tạo cuộc họp
1. Mở Outlook Calendar
2. Click "New Meeting"
3. Nhập tiêu đề và thời gian

#### Bước 2: Thêm phòng họp
1. Click "Add Room"
2. Tìm phòng: Gõ tên phòng (VD: "Phòng A")
3. Chọn phòng từ danh sách
4. Outlook sẽ hiển thị phòng trống

#### Bước 3: Mời người tham gia
1. Thêm email người tham gia
2. Click "Send"
3. Mọi người nhận lời mời qua email

### Cách 3: Liên hệ trực tiếp (Khẩn cấp)
- Gọi Admin: Ext 103
- Email: admin@28h.com.vn
- Trực tiếp: Lễ tân (Tầng 1)

## Quy định đặt phòng

### Thời gian đặt trước:
- Họp thường: Tối thiểu 2 giờ trước
- Họp quan trọng: Tối thiểu 1 ngày trước
- Họp khách hàng: Tối thiểu 2 ngày trước

### Thời gian họp:
- Tối thiểu: 30 phút
- Tối đa: 4 giờ (có thể gia hạn nếu phòng trống)
- Khung giờ: 8:00 - 18:00 (T2-T6)

### Hủy đặt phòng:
- Hủy trước ít nhất 1 giờ
- Qua ERP hoặc email admin@28h.com.vn
- Không hủy quá 3 lần/tháng (sẽ bị cảnh cáo)

### Ưu tiên:
1. Họp khách hàng, đối tác
2. Họp toàn công ty
3. Họp phòng ban
4. Họp team
5. Họp cá nhân

## Sử dụng phòng họp

### Trước khi họp (5 phút):

#### Mở cửa phòng:
- **Phòng A, B**: Dùng thẻ nhân viên quẹt
- **Phòng C, D, E, F**: Nhập mã (trong email xác nhận)

#### Kiểm tra thiết bị:
- Bật TV/Monitor
- Test micro, loa (nếu họp online)
- Kết nối laptop với màn hình
- Kiểm tra điều hòa

#### Chuẩn bị:
- Sắp xếp bàn ghế (nếu cần)
- Chuẩn bị tài liệu
- Test camera (nếu họp online)

### Trong khi họp:

#### Sử dụng thiết bị:
**Kết nối màn hình:**
- Cách 1: Cáp HDMI (có sẵn trên bàn)
- Cách 2: Wireless Display (Miracast)
  - Windows: Win + K → Chọn màn hình
  - Mac: AirPlay → Chọn màn hình

**Họp online:**
- Mở Zoom/Teams/Google Meet
- Chọn camera và micro của phòng
- Test âm thanh trước khi bắt đầu

**Ghi chú:**
- Dùng Whiteboard/Flipchart
- Chụp ảnh ghi chú sau khi họp
- Xóa sạch sau khi dùng

#### Quy tắc:
✅ Giữ im lặng, không làm ồn
✅ Tắt điện thoại hoặc để chế độ im lặng
✅ Không ăn uống trong phòng (trừ nước)
✅ Giữ gìn vệ sinh

### Sau khi họp:

#### Dọn dẹp:
- Tắt TV/Monitor, điều hòa
- Xóa Whiteboard/Flipchart
- Sắp xếp lại bàn ghế
- Vứt rác vào thùng
- Mang theo tài liệu cá nhân

#### Đóng cửa:
- Kiểm tra không để quên đồ
- Đóng cửa và khóa
- Tắt đèn

#### Feedback (tùy chọn):
- Đánh giá chất lượng phòng họp qua ERP
- Báo lỗi thiết bị (nếu có)

## Thiết bị và cách sử dụng

### TV/Monitor:
**Bật/Tắt:**
- Remote control trên bàn
- Hoặc nút nguồn trên TV

**Chuyển nguồn:**
- Nút "Source" trên remote
- Chọn HDMI 1, HDMI 2, hoặc Screen Mirroring

### Camera họp online:
**Logitech Rally (Phòng A, B):**
- Tự động bật khi có tín hiệu
- Điều khiển: Remote trên bàn
- Zoom in/out: Nút +/-
- Pan/Tilt: Nút mũi tên

**Webcam thường (Phòng C, D, E, F):**
- Cắm USB vào laptop
- Chọn trong Zoom/Teams

### Micro và loa:
**Hệ thống loa micro (Phòng A, B):**
- Bật: Nút nguồn trên bàn điều khiển
- Điều chỉnh âm lượng: Núm xoay
- Test: Nói thử và nghe qua loa

**Micro USB (Phòng C, D, E, F):**
- Cắm USB vào laptop
- Chọn trong Zoom/Teams

### Bảng Whiteboard:
- Dùng bút lông chuyên dụng (trên bàn)
- Xóa bằng khăn lau (trong ngăn kéo)
- Không dùng bút dạ thường

### Flipchart (Phòng A):
- Giấy A1 có sẵn
- Bút marker trong hộp
- Lật trang khi hết chỗ

## Xử lý sự cố

### Không mở được cửa:
- Kiểm tra mã đặt phòng
- Thử quẹt lại thẻ
- Gọi Admin: Ext 103

### TV/Monitor không bật:
- Kiểm tra nguồn điện
- Kiểm tra remote (pin)
- Thử nút nguồn trên TV
- Báo IT nếu vẫn lỗi

### Không kết nối được màn hình:
- Kiểm tra cáp HDMI
- Chuyển đúng nguồn (HDMI 1/2)
- Thử cáp khác (trong ngăn kéo)
- Restart laptop

### Camera/Micro không hoạt động:
- Kiểm tra kết nối USB
- Chọn đúng thiết bị trong Zoom/Teams
- Restart ứng dụng họp
- Báo IT nếu vẫn lỗi

### Điều hòa không hoạt động:
- Kiểm tra remote (pin)
- Kiểm tra nhiệt độ đặt
- Đợi 2-3 phút cho máy khởi động
- Báo Admin nếu vẫn lỗi

## Hỗ trợ

### Đặt phòng:
- Admin: Ext 103
- Email: admin@28h.com.vn

### Sự cố thiết bị:
- IT: Ext 101
- Email: it@28h.com.vn
- Tạo ticket: Category "Hardware"

### Khẩn cấp:
- Lễ tân: Ext 100
- Bảo vệ: Ext 199

**Cập nhật**: 15/01/2026  
**Phụ trách**: Phòng Hành chính - Công ty TNHH 28H`,
      categoryId: otherCategory?.id,
      authorId: admin.id,
      tags: 'phòng họp, 28h, văn phòng, meeting, hướng dẫn',
      isPublished: true,
      publishedAt: new Date('2026-01-13'),
      viewCount: 445,
      helpfulCount: 187,
      notHelpfulCount: 9,
    },

    {
      title: 'Hướng dẫn sử dụng máy in và máy photocopy tại 28H',
      content: `## Vị trí máy in/photocopy

### Tầng 1:
**Máy Photocopy Ricoh MP C3004**
- Vị trí: Gần lễ tân
- Chức năng: In, Copy, Scan màu
- Tốc độ: 30 trang/phút
- Khổ giấy: A4, A3
- Dùng cho: Tài liệu khách hàng, hợp đồng

### Tầng 2:
**Máy In HP LaserJet Pro M404dn**
- Vị trí: Khu vực Kinh doanh (gần cửa sổ)
- Chức năng: In đen trắng
- Tốc độ: 40 trang/phút
- Khổ giấy: A4
- Dùng cho: Tài liệu nội bộ

**Máy In Canon Pixma G7070**
- Vị trí: Khu vực Marketing (góc phải)
- Chức năng: In màu, Scan
- Tốc độ: 15 trang/phút
- Khổ giấy: A4, A5
- Dùng cho: Tài liệu màu, brochure

### Tầng 3:
**Máy In HP LaserJet Pro M402n**
- Vị trí: Phòng IT
- Chức năng: In đen trắng
- Tốc độ: 40 trang/phút
- Khổ giấy: A4
- Dùng cho: IT, tài liệu kỹ thuật

### Tầng 4:
**Máy In Brother HL-L2321D**
- Vị trí: Khu pantry
- Chức năng: In đen trắng
- Tốc độ: 30 trang/phút
- Khổ giấy: A4
- Dùng cho: In nhanh, tài liệu cá nhân

## Kết nối máy in

### Cách 1: Qua mạng (Khuyến nghị)

#### Windows:
1. Settings → Devices → Printers & scanners
2. Click "Add a printer or scanner"
3. Chọn máy in từ danh sách:
   - **Ricoh-T1** (Tầng 1)
   - **HP-T2-Sales** (Tầng 2 - Kinh doanh)
   - **Canon-T2-Marketing** (Tầng 2 - Marketing)
   - **HP-T3-IT** (Tầng 3)
   - **Brother-T4** (Tầng 4)
4. Click "Add device"
5. Đợi cài đặt driver (tự động)

#### macOS:
1. System Preferences → Printers & Scanners
2. Click "+" để thêm máy in
3. Chọn máy in từ danh sách
4. Click "Add"

### Cách 2: Qua IP Address

Nếu không tìm thấy máy in, thêm bằng IP:

**Danh sách IP máy in:**
- Ricoh-T1: 192.168.1.101
- HP-T2-Sales: 192.168.1.102
- Canon-T2-Marketing: 192.168.1.103
- HP-T3-IT: 192.168.1.104
- Brother-T4: 192.168.1.105

**Thêm máy in bằng IP (Windows):**
1. Settings → Printers → Add printer
2. Chọn "Add a printer using TCP/IP address"
3. Nhập IP address
4. Click "Next" và làm theo hướng dẫn

## In tài liệu

### In từ máy tính:

#### Bước 1: Mở file cần in
- Word, Excel, PDF, v.v.

#### Bước 2: Chọn Print
- Ctrl + P (Windows)
- Cmd + P (Mac)

#### Bước 3: Cấu hình in
**Chọn máy in:**
- Chọn máy in gần bạn nhất
- Hoặc máy in phù hợp (màu/đen trắng)

**Số lượng:**
- Nhập số bản cần in
- Tối đa 50 bản/lần (nếu nhiều hơn, liên hệ Admin)

**Khổ giấy:**
- A4: Tài liệu thường
- A3: Bản vẽ, poster (chỉ Ricoh-T1)

**In 2 mặt:**
- Chọn "Print on both sides"
- Tiết kiệm giấy, thân thiện môi trường

**Màu sắc:**
- Color: In màu (chỉ Canon, Ricoh)
- Grayscale: Đen trắng

**Chất lượng:**
- Draft: Nháp (nhanh, tiết kiệm mực)
- Normal: Thường (khuyến nghị)
- Best: Tốt nhất (cho tài liệu quan trọng)

#### Bước 4: Click Print
- Đợi 5-10 giây
- Đến máy in lấy tài liệu

### In từ điện thoại:

#### iOS (AirPrint):
1. Mở file cần in
2. Tap biểu tượng Share
3. Chọn "Print"
4. Chọn máy in (hỗ trợ AirPrint)
5. Cấu hình và tap "Print"

**Lưu ý:** Chỉ Ricoh-T1 và Canon-T2-Marketing hỗ trợ AirPrint

#### Android:
1. Cài app "Mopria Print Service" (Google Play)
2. Mở file cần in
3. Menu → Print
4. Chọn máy in
5. Cấu hình và tap "Print"

## Photocopy (Ricoh-T1)

### Bước 1: Đặt tài liệu
- Mở nắp máy
- Đặt tài liệu úp xuống
- Căn góc trên bên trái
- Đóng nắp

### Bước 2: Cấu hình
**Màn hình cảm ứng:**
- Tap "Copy"
- Chọn số lượng (bàn phím số)
- Chọn màu: Color/Black & White
- Chọn khổ giấy: A4/A3
- Chọn 1 mặt/2 mặt

**Các tùy chọn nâng cao:**
- Zoom: Phóng to/thu nhỏ (50%-200%)
- Density: Độ đậm nhạt
- Collate: Sắp xếp trang

### Bước 3: Bắt đầu copy
- Nhấn nút "Start" (màu xanh)
- Đợi máy copy xong
- Lấy tài liệu gốc và bản copy

### Copy nhiều trang:
1. Mở khay nạp tự động (ADF) ở trên
2. Đặt tài liệu úp lên (trang 1 ở trên cùng)
3. Cấu hình như trên
4. Nhấn "Start"
5. Máy sẽ tự động copy từng trang

## Scan tài liệu

### Scan to Email (Ricoh-T1):

#### Bước 1: Đặt tài liệu
- Đặt vào khay ADF hoặc kính scan

#### Bước 2: Chọn Scan
- Tap "Scan" trên màn hình
- Chọn "Scan to Email"

#### Bước 3: Nhập email
- Tap vào ô "To:"
- Nhập email của bạn
- Hoặc chọn từ Address Book

#### Bước 4: Cấu hình
- File format: PDF (khuyến nghị) hoặc JPEG
- Resolution: 300 dpi (thường) hoặc 600 dpi (chất lượng cao)
- Color: Color/Grayscale/Black & White

#### Bước 5: Scan
- Nhấn "Start"
- Đợi scan xong
- Kiểm tra email (trong vòng 1-2 phút)

### Scan to USB:
1. Cắm USB vào cổng USB của máy
2. Đặt tài liệu
3. Tap "Scan" → "Scan to USB"
4. Cấu hình và nhấn "Start"
5. Đợi xong, rút USB

### Scan to Computer:
1. Mở phần mềm scan trên máy tính
   - Windows: "HP Smart" hoặc "Canon IJ Scan Utility"
   - Mac: "Image Capture"
2. Chọn máy scan
3. Đặt tài liệu vào máy
4. Click "Scan" trên phần mềm
5. File sẽ lưu vào máy tính

## Quy định sử dụng

### Giới hạn in:
- **Nhân viên thường**: 200 trang/tháng
- **Trưởng phòng**: 500 trang/tháng
- **Giám đốc**: Không giới hạn

**Vượt hạn mức:**
- Liên hệ Admin để xin phép
- Giải thích lý do
- Có thể bị khấu trừ chi phí nếu lạm dụng

### In màu:
- Chỉ in khi thực sự cần thiết
- Ưu tiên: Tài liệu khách hàng, marketing
- Không in ảnh cá nhân, tài liệu không liên quan

### In 2 mặt:
- Bắt buộc cho tài liệu >5 trang
- Tiết kiệm giấy, bảo vệ môi trường
- Trừ tài liệu đặc biệt (hợp đồng, v.v.)

### Giấy in:
- Giấy A4 80gsm: Có sẵn trong máy
- Giấy A3, giấy ảnh: Liên hệ Admin
- Không tự ý thay giấy

### Bảo mật:
- Không in tài liệu mật
- Lấy tài liệu ngay sau khi in
- Không để tài liệu trên máy in
- Hủy tài liệu lỗi đúng cách

## Xử lý sự cố

### Máy in không phản hồi:
1. Kiểm tra kết nối mạng
2. Kiểm tra máy in có bật không
3. Restart máy in (tắt/bật nguồn)
4. Xóa job in và in lại
5. Báo IT nếu vẫn lỗi

### Kẹt giấy:
1. Tắt máy in
2. Mở các nắp máy in
3. Nhẹ nhàng kéo giấy ra theo chiều máy kéo
4. Đóng nắp
5. Bật máy và in lại

**Lưu ý:** Không kéo giấy ngược chiều, có thể làm hỏng máy

### In bị mờ/nhạt:
- Kiểm tra mực (có thể hết)
- Lắc hộp mực nhẹ nhàng
- Thay hộp mực mới (liên hệ IT)

### In bị lỗi font/layout:
- Kiểm tra driver máy in (có thể cũ)
- Thử in từ PDF thay vì Word
- Liên hệ IT để update driver

### Máy báo lỗi:
- Ghi lại mã lỗi trên màn hình
- Chụp ảnh màn hình lỗi
- Tạo ticket với thông tin lỗi
- Không tự ý sửa chữa

## Thay mực và bảo trì

### Khi nào cần thay mực:
- Máy báo "Toner Low"
- In bị mờ, nhạt
- Có vệt trắng trên giấy

### Quy trình thay mực:
1. **KHÔNG** tự ý thay mực
2. Tạo ticket: Category "Hardware"
3. Tiêu đề: "Yêu cầu thay mực máy in [Tên máy]"
4. IT sẽ thay trong vòng 2-4 giờ

### Bảo trì định kỳ:
- IT kiểm tra máy in mỗi tháng
- Vệ sinh, kiểm tra linh kiện
- Thay thế linh kiện hao mòn
- Không ảnh hưởng đến công việc

## Hỗ trợ

### Vấn đề kỹ thuật:
- Tạo ticket: Category "Hardware"
- Email: it@28h.com.vn
- Ext: 101

### Yêu cầu giấy in, mực:
- Email: admin@28h.com.vn
- Ext: 103

### Khẩn cấp:
- Gọi IT trực tiếp: Ext 101
- Hoặc đến phòng IT (Tầng 3)

**Thời gian xử lý:**
- Kẹt giấy, lỗi nhỏ: 15-30 phút
- Thay mực: 2-4 giờ
- Sửa chữa lớn: 1-2 ngày

**Cập nhật**: 15/01/2026  
**Phụ trách**: Phòng IT - Công ty TNHH 28H`,
      categoryId: hardwareCategory?.id,
      authorId: admin.id,
      tags: 'máy in, photocopy, 28h, hardware, hướng dẫn',
      isPublished: true,
      publishedAt: new Date('2026-01-14'),
      viewCount: 534,
      helpfulCount: 212,
      notHelpfulCount: 11,
    },

    {
      title: 'Chính sách bảo mật thông tin tại Công ty 28H',
      content: `## Mục đích
Bảo vệ thông tin, dữ liệu của công ty, khách hàng và nhân viên khỏi rò rỉ, mất mát hoặc sử dụng trái phép.

## Phạm vi áp dụng
- Tất cả nhân viên Công ty TNHH 28H
- Nhà thầu, đối tác có quyền truy cập hệ thống
- Thực tập sinh, cộng tác viên

## Phân loại thông tin

### 1. Thông tin MẬT (Confidential)
**Định nghĩa:**
- Thông tin tối mật, ảnh hưởng nghiêm trọng nếu rò rỉ
- Chỉ một số người được phép truy cập

**Ví dụ:**
- Chiến lược kinh doanh
- Hợp đồng khách hàng lớn
- Mã nguồn phần mềm độc quyền
- Thông tin tài chính nhạy cảm
- Dữ liệu cá nhân khách hàng (CCCD, CMND)

**Quy định:**
- Lưu trữ: Server mã hóa, két sắt
- Truy cập: Cần phê duyệt Giám đốc
- Chia sẻ: Chỉ qua email mã hóa
- In ấn: Đóng dấu "MẬT", đếm số lượng
- Hủy: Máy hủy tài liệu cấp P-4

### 2. Thông tin NỘI BỘ (Internal)
**Định nghĩa:**
- Thông tin chỉ dành cho nhân viên công ty
- Không công khai ra bên ngoài

**Ví dụ:**
- Quy trình làm việc nội bộ
- Danh sách nhân viên, phòng ban
- Biên bản họp nội bộ
- Báo cáo dự án
- Thông tin lương thưởng

**Quy định:**
- Lưu trữ: Server nội bộ, ERP
- Truy cập: Nhân viên công ty
- Chia sẻ: Qua email công ty, ERP
- In ấn: Đóng dấu "NỘI BỘ"
- Hủy: Máy hủy tài liệu thường

### 3. Thông tin CÔNG KHAI (Public)
**Định nghĩa:**
- Thông tin có thể công khai
- Không ảnh hưởng nếu lan truyền

**Ví dụ:**
- Thông tin trên website công ty
- Tài liệu marketing
- Thông cáo báo chí
- Tuyển dụng

**Quy định:**
- Lưu trữ: Không hạn chế
- Truy cập: Công khai
- Chia sẻ: Tự do

## Quy định sử dụng máy tính

### Mật khẩu:
✅ **Bắt buộc:**
- Đổi mật khẩu mỗi 3 tháng
- Tối thiểu 8 ký tự (chữ hoa, thường, số, ký tự đặc biệt)
- Khác mật khẩu cũ
- Không dùng chung với tài khoản khác

❌ **Cấm:**
- Chia sẻ mật khẩu
- Lưu mật khẩu trong file text
- Dùng mật khẩu đơn giản (123456, password)
- Viết mật khẩu ra giấy dán màn hình

### Khóa màn hình:
- **Bắt buộc** khóa khi rời khỏi bàn (Win + L)
- Tự động khóa sau 5 phút không hoạt động
- Không để người khác sử dụng máy tính của bạn

### Phần mềm:
- Chỉ cài phần mềm được IT phê duyệt
- Không cài phần mềm crack, không bản quyền
- Cập nhật Windows, antivirus định kỳ
- Không tắt antivirus

### Dữ liệu:
- Lưu dữ liệu công việc trên server (\\\\fileserver.28h.local)
- Backup dữ liệu quan trọng hàng tuần
- Không lưu dữ liệu công ty vào USB cá nhân
- Mã hóa file nhạy cảm (BitLocker, 7-Zip AES)

## Quy định sử dụng Email

### Email công ty:
- Chỉ dùng email @28h.com.vn cho công việc
- Không gửi thông tin mật qua email cá nhân
- Không forward email công ty ra ngoài

### Gửi email:
✅ **Nên:**
- Kiểm tra người nhận trước khi gửi
- Dùng BCC khi gửi nhiều người (bảo mật email)
- Mã hóa file đính kèm nhạy cảm
- Đánh dấu "Confidential" nếu cần

❌ **Không:**
- Gửi thông tin mật cho người không liên quan
- Reply All không cần thiết
- Gửi file quá lớn (>25MB) - dùng link OneDrive

### Nhận email:
⚠️ **Cảnh giác với:**
- Email từ người lạ
- Email yêu cầu mật khẩu, thông tin cá nhân
- Link đáng ngờ
- File đính kèm .exe, .zip từ người lạ

**Nếu nghi ngờ:**
1. KHÔNG click link, KHÔNG mở file
2. Forward email đến: security@28h.com.vn
3. Xóa email

## Quy định sử dụng USB và thiết bị lưu trữ

### USB cá nhân:
❌ **CẤM** sử dụng USB cá nhân trong công ty
- Nguy cơ virus, malware
- Nguy cơ rò rỉ dữ liệu

### USB công ty:
✅ **Được phép** nếu:
- Đăng ký với IT (ghi nhận serial number)
- Mã hóa bằng BitLocker
- Chỉ dùng cho công việc
- Trả lại khi nghỉ việc

### Ổ cứng di động:
- Tương tự quy định USB
- Cần phê duyệt trưởng phòng

### Cloud storage cá nhân:
❌ **CẤM** lưu dữ liệu công ty lên:
- Google Drive cá nhân
- Dropbox cá nhân
- iCloud cá nhân

✅ **Dùng** OneDrive công ty (1TB/người)

## Quy định sử dụng mạng xã hội

### Tài khoản cá nhân:
✅ **Được phép:**
- Sử dụng mạng xã hội cá nhân
- Chia sẻ thông tin công khai của công ty

❌ **Cấm:**
- Chia sẻ thông tin nội bộ, mật
- Chụp ảnh màn hình công việc đăng lên
- Phàn nàn, chê bai công ty
- Tiết lộ thông tin khách hàng, dự án

### Tài khoản công ty:
- Chỉ người được ủy quyền quản lý
- Tuân thủ hướng dẫn truyền thông
- Không đăng nội dung nhạy cảm

## Làm việc từ xa (Remote)

### Kết nối:
- **Bắt buộc** dùng VPN công ty
- Không truy cập hệ thống qua WiFi công cộng
- Dùng WiFi nhà riêng có mật khẩu

### Thiết bị:
- Ưu tiên dùng laptop công ty
- Nếu dùng máy cá nhân:
  - Cài antivirus
  - Cập nhật hệ điều hành
  - Không để người khác sử dụng

### Môi trường:
- Làm việc ở nơi riêng tư
- Không để người khác nhìn thấy màn hình
- Không thảo luận công việc nơi công cộng

## Xử lý sự cố bảo mật

### Nếu phát hiện:
- Email lừa đảo (phishing)
- Virus, malware
- Truy cập trái phép
- Mất laptop, USB
- Rò rỉ thông tin

**Hành động ngay:**
1. **NGỪNG** sử dụng thiết bị
2. **NGẮT** kết nối mạng (rút dây/tắt WiFi)
3. **BÁO** ngay cho IT: Ext 101 hoặc security@28h.com.vn
4. **GHI** lại thời gian, triệu chứng

**KHÔNG:**
- Tự ý xử lý
- Che giấu sự cố
- Trì hoãn báo cáo

## Vi phạm và xử lý

### Mức độ vi phạm:

**Nhẹ (Nhắc nhở):**
- Quên khóa màn hình
- Không đổi mật khẩu đúng hạn
- Để tài liệu trên máy in

**Trung bình (Cảnh cáo):**
- Chia sẻ mật khẩu
- Sử dụng USB cá nhân
- Gửi thông tin nội bộ qua email cá nhân

**Nặng (Sa thải + Pháp lý):**
- Cố ý rò rỉ thông tin mật
- Đánh cắp dữ liệu
- Phá hoại hệ thống
- Gây thiệt hại cho công ty

## Cam kết bảo mật

Tất cả nhân viên phải ký cam kết bảo mật khi:
- Nhận việc (ngày đầu tiên)
- Truy cập dữ liệu mật
- Tham gia dự án đặc biệt

**Cam kết có hiệu lực:**
- Trong thời gian làm việc
- Sau khi nghỉ việc: 2 năm

## Đào tạo bảo mật

### Bắt buộc:
- Nhân viên mới: Trong tuần đầu tiên
- Tất cả nhân viên: Mỗi năm 1 lần
- Khi có chính sách mới

### Nội dung:
- Chính sách bảo mật
- Nhận diện email lừa đảo
- Xử lý sự cố
- Case study thực tế

## Liên hệ

### Vấn đề bảo mật:
- **Email**: security@28h.com.vn
- **Hotline**: 1900-xxxx (24/7)
- **Ext**: 101 (IT)

### Báo cáo vi phạm:
- **Email**: hr@28h.com.vn
- **Trực tiếp**: Phòng Nhân sự (Tầng 2, phòng 201)

**Phiên bản**: 2.0  
**Ngày ban hành**: 01/01/2026  
**Người phê duyệt**: Ban Giám đốc Công ty TNHH 28H  
**Hiệu lực**: Toàn bộ nhân viên, đối tác`,
      categoryId: otherCategory?.id,
      authorId: admin.id,
      tags: 'bảo mật, chính sách, 28h, security, quy định',
      isPublished: true,
      publishedAt: new Date('2026-01-15'),
      viewCount: 612,
      helpfulCount: 234,
      notHelpfulCount: 15,
    },
  ];

  // Insert articles
  for (const article of articles) {
    await KnowledgeArticle.create(article);
  }

  console.log(`✅ Seeded ${articles.length} knowledge articles for 28H Company`);
}
