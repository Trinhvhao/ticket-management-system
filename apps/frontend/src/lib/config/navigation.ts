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
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tickets',
    href: '/tickets',
    icon: Ticket,
  },
  {
    title: 'Knowledge Base',
    href: '/knowledge',
    icon: BookOpen,
  },
];

export const managementNavigation: NavItem[] = [
  {
    title: 'Users',
    href: '/users',
    icon: Users,
    roles: ['Admin'],
  },
  {
    title: 'Categories',
    href: '/categories',
    icon: FolderOpen,
    roles: ['Admin'],
  },
  {
    title: 'SLA Management',
    href: '/sla',
    icon: Clock,
    roles: ['Admin', 'IT_Staff'],
  },
  {
    title: 'Reports',
    href: '/reports',
    icon: BarChart3,
    roles: ['Admin', 'IT_Staff'],
  },
];

export const userNavigation: NavItem[] = [
  {
    title: 'Notifications',
    href: '/notifications',
    icon: Bell,
  },
  {
    title: 'Settings',
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
