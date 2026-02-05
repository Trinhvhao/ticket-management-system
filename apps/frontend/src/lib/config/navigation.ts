import {
  LayoutDashboard,
  Ticket,
  Users,
  FolderOpen,
  BookOpen,
  Bell,
  Settings,
  BarChart3,
  Clock,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: string[]; // If empty, accessible by all authenticated users
  badge?: string;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  {
    title: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Ticket',
    href: '/tickets',
    icon: Ticket,
  },
  {
    title: 'Kho kiến thức',
    href: '/knowledge',
    icon: BookOpen,
  },
];

export const managementNavigation: NavItem[] = [
  {
    title: 'Người dùng',
    href: '/users',
    icon: Users,
    roles: ['Admin'],
  },
  {
    title: 'Danh mục',
    href: '/categories',
    icon: FolderOpen,
    roles: ['Admin'],
  },
  {
    title: 'Quản lý SLA',
    href: '/sla',
    icon: Clock,
    roles: ['Admin', 'IT_Staff'],
  },
  {
    title: 'Báo cáo',
    href: '/reports',
    icon: BarChart3,
    roles: ['Admin', 'IT_Staff'],
  },
];

export const userNavigation: NavItem[] = [
  {
    title: 'Thông báo',
    href: '/notifications',
    icon: Bell,
  },
  {
    title: 'Cài đặt',
    href: '/settings',
    icon: Settings,
  },
];

// Combine all navigation for sidebar
export const sidebarNavigation = {
  main: mainNavigation,
  management: managementNavigation,
  user: userNavigation,
};

// Helper function to check if user has access to nav item
export function hasAccessToNavItem(item: NavItem, userRole?: string): boolean {
  if (!item.roles || item.roles.length === 0) {
    return true;
  }
  return userRole ? item.roles.includes(userRole) : false;
}

// Filter navigation items based on user role
export function filterNavigationByRole(items: NavItem[], userRole?: string): NavItem[] {
  return items.filter((item) => hasAccessToNavItem(item, userRole));
}
