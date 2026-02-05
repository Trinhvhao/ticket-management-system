// Translation keys and values for the application
export type Language = 'en' | 'vi';

export const translations = {
  en: {
    // Common
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update',
      search: 'Search',
      filter: 'Filter',
      back: 'Back',
      loading: 'Loading...',
      noData: 'No data available',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      all: 'All',
      active: 'Active',
      inactive: 'Inactive',
      required: 'Required',
    },

    // Navigation
    nav: {
      dashboard: 'Dashboard',
      tickets: 'Tickets',
      knowledge: 'Knowledge Base',
      users: 'Users',
      categories: 'Categories',
      reports: 'Reports',
      settings: 'Settings',
      notifications: 'Notifications',
      escalation: 'Escalation',
      sla: 'SLA',
    },

    // User roles
    roles: {
      Employee: 'Employee',
      IT_Staff: 'IT Staff',
      Admin: 'Administrator',
    },

    // User management
    users: {
      title: 'User Management',
      editUser: 'Edit User',
      createUser: 'Create User',
      userDetails: 'User Details',
      fullName: 'Full Name',
      email: 'Email',
      role: 'Role',
      department: 'Department',
      phone: 'Phone',
      status: 'Status',
      updateInfo: 'Update user information',
      emailCannotChange: 'Email cannot be changed',
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      accessDenied: 'Access Denied',
      noPermission: 'You don\'t have permission to edit users.',
      notes: 'Notes',
      notesList: {
        roleAffects: 'Changing role will affect user access permissions',
        emailFixed: 'Email cannot be changed after account creation',
        immediateUpdate: 'Information will be updated immediately',
      },
    },

    // Categories
    categories: {
      title: 'Category Management',
      createCategory: 'Create Category',
      editCategory: 'Edit Category',
      name: 'Category Name',
      description: 'Description',
      color: 'Color',
      icon: 'Icon',
      sortOrder: 'Sort Order',
      totalCategories: 'Total Categories',
      activeCategories: 'Active Categories',
      deleteConfirm: 'Are you sure you want to delete this category?',
    },

    // Escalation
    escalation: {
      title: 'Escalation Management',
      history: 'Escalation History',
      createRule: 'Create Rule',
      editRule: 'Edit Rule',
      ruleName: 'Rule Name',
      triggerType: 'Trigger Type',
      escalationLevel: 'Escalation Level',
      targetType: 'Escalate To',
      notifyManager: 'Notify all Admins when escalated',
      runCheck: 'Run Check Now',
      checking: 'Checking...',
      viewHistory: 'View History',
      totalRules: 'Total Rules',
      activeRules: 'Active Rules',
      slaRules: 'SLA Rules',
      timeBased: 'Time-based',
      allRules: 'All Rules',
      activeOnly: 'Active Only',
      inactiveOnly: 'Inactive Only',
      noRulesFound: 'No escalation rules found',
      createFirstRule: 'Create First Rule',
    },

    // Knowledge Base
    knowledge: {
      title: 'Knowledge Base',
      createArticle: 'Create Article',
      editArticle: 'Edit Article',
      articleTitle: 'Title',
      content: 'Content',
      category: 'Category',
      tags: 'Tags',
      status: 'Status',
      draft: 'Draft',
      published: 'Published',
      addTag: 'Add a tag',
      htmlSupported: 'You can use HTML tags for formatting',
      addToKnowledge: 'Add a new article to the knowledge base',
      updateContent: 'Update article content',
    },

    // Tickets
    tickets: {
      title: 'Tickets',
      createTicket: 'Create Ticket',
      ticketNumber: 'Ticket Number',
      subject: 'Subject',
      priority: 'Priority',
      status: 'Status',
      assignee: 'Assignee',
      category: 'Category',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      overview: 'Overview',
      statistics: 'Statistics',
      recentTickets: 'Recent Tickets',
      quickActions: 'Quick Actions',
    },

    // Messages
    messages: {
      success: {
        saved: 'Saved successfully',
        updated: 'Updated successfully',
        deleted: 'Deleted successfully',
        created: 'Created successfully',
      },
      error: {
        saveFailed: 'Failed to save',
        updateFailed: 'Failed to update',
        deleteFailed: 'Failed to delete',
        createFailed: 'Failed to create',
        required: 'This field is required',
      },
    },
  },

  vi: {
    // Common
    common: {
      save: 'Lưu',
      cancel: 'Hủy',
      delete: 'Xóa',
      edit: 'Sửa',
      create: 'Tạo',
      update: 'Cập nhật',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      back: 'Quay lại',
      loading: 'Đang tải...',
      noData: 'Không có dữ liệu',
      confirm: 'Xác nhận',
      yes: 'Có',
      no: 'Không',
      all: 'Tất cả',
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      required: 'Bắt buộc',
    },

    // Navigation
    nav: {
      dashboard: 'Tổng quan',
      tickets: 'Ticket',
      knowledge: 'Kho kiến thức',
      users: 'Người dùng',
      categories: 'Danh mục',
      reports: 'Báo cáo',
      settings: 'Cài đặt',
      notifications: 'Thông báo',
      escalation: 'Escalation',
      sla: 'SLA',
    },

    // User roles
    roles: {
      Employee: 'Nhân viên',
      IT_Staff: 'Nhân viên IT',
      Admin: 'Quản trị viên',
    },

    // User management
    users: {
      title: 'Quản lý Người dùng',
      editUser: 'Chỉnh sửa Người dùng',
      createUser: 'Tạo Người dùng',
      userDetails: 'Chi tiết Người dùng',
      fullName: 'Họ và Tên',
      email: 'Email',
      role: 'Vai trò',
      department: 'Phòng ban',
      phone: 'Số điện thoại',
      status: 'Trạng thái',
      updateInfo: 'Cập nhật thông tin người dùng trong hệ thống',
      emailCannotChange: 'Email không thể thay đổi',
      saveChanges: 'Lưu Thay đổi',
      saving: 'Đang lưu...',
      accessDenied: 'Truy cập Bị từ chối',
      noPermission: 'Bạn không có quyền chỉnh sửa người dùng.',
      notes: 'Lưu ý',
      notesList: {
        roleAffects: 'Thay đổi vai trò sẽ ảnh hưởng đến quyền truy cập của người dùng',
        emailFixed: 'Email không thể thay đổi sau khi tạo tài khoản',
        immediateUpdate: 'Thông tin sẽ được cập nhật ngay lập tức',
      },
    },

    // Categories
    categories: {
      title: 'Quản lý Danh mục',
      createCategory: 'Tạo Danh mục',
      editCategory: 'Sửa Danh mục',
      name: 'Tên Danh mục',
      description: 'Mô tả',
      color: 'Màu sắc',
      icon: 'Biểu tượng',
      sortOrder: 'Thứ tự',
      totalCategories: 'Tổng Danh mục',
      activeCategories: 'Danh mục Hoạt động',
      deleteConfirm: 'Bạn có chắc muốn xóa danh mục này?',
    },

    // Escalation
    escalation: {
      title: 'Quản lý Escalation',
      history: 'Lịch sử Escalation',
      createRule: 'Tạo Quy tắc',
      editRule: 'Sửa Quy tắc',
      ruleName: 'Tên Quy tắc',
      triggerType: 'Loại Kích hoạt',
      escalationLevel: 'Cấp Escalation',
      targetType: 'Leo thang Đến',
      notifyManager: 'Thông báo tất cả Admin khi leo thang',
      runCheck: 'Chạy Kiểm tra',
      checking: 'Đang kiểm tra...',
      viewHistory: 'Xem Lịch sử',
      totalRules: 'Tổng Quy tắc',
      activeRules: 'Đang Hoạt động',
      slaRules: 'Quy tắc SLA',
      timeBased: 'Theo Thời gian',
      allRules: 'Tất cả',
      activeOnly: 'Đang hoạt động',
      inactiveOnly: 'Không hoạt động',
      noRulesFound: 'Không tìm thấy quy tắc escalation',
      createFirstRule: 'Tạo Quy tắc Đầu tiên',
    },

    // Knowledge Base
    knowledge: {
      title: 'Kho Kiến thức',
      createArticle: 'Tạo Bài viết',
      editArticle: 'Sửa Bài viết',
      articleTitle: 'Tiêu đề',
      content: 'Nội dung',
      category: 'Danh mục',
      tags: 'Thẻ',
      status: 'Trạng thái',
      draft: 'Nháp',
      published: 'Đã xuất bản',
      addTag: 'Thêm thẻ',
      htmlSupported: 'Bạn có thể sử dụng thẻ HTML để định dạng',
      addToKnowledge: 'Thêm bài viết mới vào kho kiến thức',
      updateContent: 'Cập nhật nội dung bài viết',
    },

    // Tickets
    tickets: {
      title: 'Ticket',
      createTicket: 'Tạo Ticket',
      ticketNumber: 'Mã Ticket',
      subject: 'Tiêu đề',
      priority: 'Độ ưu tiên',
      status: 'Trạng thái',
      assignee: 'Người xử lý',
      category: 'Danh mục',
      createdAt: 'Ngày tạo',
      updatedAt: 'Cập nhật',
    },

    // Dashboard
    dashboard: {
      title: 'Tổng quan',
      overview: 'Tổng quan',
      statistics: 'Thống kê',
      recentTickets: 'Ticket Gần đây',
      quickActions: 'Thao tác Nhanh',
    },

    // Messages
    messages: {
      success: {
        saved: 'Lưu thành công',
        updated: 'Cập nhật thành công',
        deleted: 'Xóa thành công',
        created: 'Tạo thành công',
      },
      error: {
        saveFailed: 'Lưu thất bại',
        updateFailed: 'Cập nhật thất bại',
        deleteFailed: 'Xóa thất bại',
        createFailed: 'Tạo thất bại',
        required: 'Trường này là bắt buộc',
      },
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;
