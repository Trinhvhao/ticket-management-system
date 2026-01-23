'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  BookOpen, 
  Settings,
  BarChart3,
  FolderKanban,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { reportsService } from '@/lib/api/reports.service';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permissionCheck?: (permissions: ReturnType<typeof usePermissions>) => boolean;
  showBadge?: boolean;
}

const navigation: NavItem[] = [
  { 
    name: 'Tổng quan', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    permissionCheck: (p) => p.canViewDashboard()
  },
  { 
    name: 'Ticket', 
    href: '/tickets', 
    icon: Ticket,
    showBadge: true
  },
  { 
    name: 'Kho kiến thức', 
    href: '/knowledge', 
    icon: BookOpen 
  },
  {
    name: 'Thông báo',
    href: '/notifications',
    icon: Bell
  },
  { 
    name: 'Người dùng', 
    href: '/users', 
    icon: Users,
    permissionCheck: (p) => p.canViewUsers()
  },
  { 
    name: 'Danh mục', 
    href: '/categories', 
    icon: FolderKanban,
    permissionCheck: (p) => p.canManageCategories()
  },
  { 
    name: 'Quy tắc SLA', 
    href: '/sla', 
    icon: Clock,
    permissionCheck: (p) => p.canManageSLA()
  },
  { 
    name: 'Báo cáo leo thang', 
    href: '/escalation', 
    icon: TrendingUp,
    permissionCheck: (p) => p.canManageSLA()
  },
  { 
    name: 'Báo cáo', 
    href: '/reports', 
    icon: BarChart3,
    permissionCheck: (p) => p.canViewReports()
  },
  { 
    name: 'Cài đặt', 
    href: '/settings', 
    icon: Settings 
  },
];

// Logo Icon Component
function LogoIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const permissions = usePermissions();

  // Fetch action required count for badge
  const { data: actionData } = useQuery({
    queryKey: ['action-required'],
    queryFn: () => reportsService.getActionRequired(),
    staleTime: 30000, // Cache for 30 seconds
    refetchInterval: 60000, // Refetch every minute
    enabled: !!user,
  });

  const getBadgeInfo = (): { value: string; tooltip: string } | undefined => {
    if (!actionData || actionData.actionRequired === 0) return undefined;
    
    const { breakdown } = actionData;
    let tooltip = '';
    
    if (user?.role === 'Admin') {
      // Smart tooltip for Admin
      if (breakdown.newTickets > 0 && breakdown.unassigned === 0) {
        // All action items are new tickets
        if (breakdown.newUnassigned === breakdown.newTickets) {
          tooltip = `${breakdown.newTickets} new (all unassigned)`;
        } else if (breakdown.newUnassigned === 0) {
          tooltip = `${breakdown.newTickets} new (all assigned)`;
        } else {
          tooltip = `${breakdown.newTickets} new (${breakdown.newUnassigned} unassigned)`;
        }
      } else if (breakdown.newTickets === 0 && breakdown.unassigned > 0) {
        // Only unassigned non-new tickets
        tooltip = `${breakdown.unassigned} unassigned`;
      } else {
        // Mix of new and other unassigned
        const newDesc = breakdown.newUnassigned === breakdown.newTickets 
          ? `${breakdown.newTickets} new (all unassigned)` 
          : `${breakdown.newTickets} new (${breakdown.newUnassigned} unassigned)`;
        tooltip = `${newDesc}, ${breakdown.unassigned} other unassigned`;
      }
    } else if (user?.role === 'IT_Staff') {
      // Smart tooltip for IT Staff
      if (breakdown.newTickets > 0 && breakdown.assignedToMe === 0) {
        tooltip = `${breakdown.newTickets} new tickets`;
      } else if (breakdown.newTickets === 0 && breakdown.assignedToMe > 0) {
        tooltip = `${breakdown.assignedToMe} assigned to you`;
      } else {
        tooltip = `${breakdown.newTickets} new, ${breakdown.assignedToMe} assigned to you`;
      }
    } else {
      // Employee
      tooltip = `${breakdown.myOpenTickets} open tickets`;
    }
    
    return {
      value: String(actionData.actionRequired),
      tooltip
    };
  };

  const badgeInfo = getBadgeInfo();

  const filteredNavigation = navigation.filter(item => {
    if (!item.permissionCheck) return true;
    return item.permissionCheck(permissions);
  });

  return (
    <div 
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-72'
      } flex flex-col h-screen`}
    >
      {/* Logo & Brand */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <Link href="/dashboard" className={`flex items-center space-x-3 min-w-0 ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-[#0052CC] to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <LogoIcon className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-gray-900 truncate">NexusFlow</span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 flex-shrink-0 ml-auto"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed - inside navigation */}
      {collapsed && (
        <div className="px-3 py-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 flex items-center justify-center"
            title="Expand sidebar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Quick Action - Create Ticket */}
      <div className="px-3 py-4">
        <Link
          href="/tickets/new"
          className={`flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-[#0052CC] hover:bg-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md ${
            collapsed ? 'px-0' : ''
          }`}
          title="Tạo ticket mới"
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Tạo ticket</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const showBadge = item.showBadge && badgeInfo;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${
                isActive
                  ? 'bg-blue-50 text-[#0052CC] font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={collapsed ? item.name : undefined}
              onMouseEnter={() => showBadge && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="flex items-center min-w-0">
                <Icon className={`w-5 h-5 flex-shrink-0 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && (
                  <span className="text-sm truncate">{item.name}</span>
                )}
              </div>
              {!collapsed && showBadge && (
                <div className="relative">
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 flex items-center gap-1 ${
                    isActive 
                      ? 'bg-[#0052CC] text-white' 
                      : 'bg-orange-100 text-orange-700 group-hover:bg-orange-200'
                  }`}>
                    <AlertCircle className="w-3 h-3" />
                    {badgeInfo.value}
                  </span>
                  {/* Tooltip */}
                  {showTooltip && (
                    <div className="absolute right-0 top-full mt-2 z-50 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg">
                      <div className="font-medium mb-1">Cần xử lý</div>
                      <div className="text-gray-300">{badgeInfo.tooltip}</div>
                      <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  )}
                </div>
              )}
              {collapsed && showBadge && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {badgeInfo.value}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {user && (
        <div className={`p-4 border-t border-gray-200 ${collapsed ? '' : 'bg-gray-50'}`}>
          <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0052CC] to-blue-600 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.fullName}</p>
                <div className="flex items-center mt-0.5">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <p className="text-xs text-gray-500 truncate">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
