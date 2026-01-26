'use client';

import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
import { TicketStatus, TicketFilters } from '@/lib/types/ticket.types';
import { 
  Inbox, 
  User, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Users,
  AlertCircle,
  Bookmark
} from 'lucide-react';

export interface QuickFilterPreset {
  id: string;
  label: string;
  icon: React.ReactNode;
  filters: Partial<TicketFilters>;
  roles?: UserRole[]; // Which roles can see this filter
}

interface QuickFiltersProps {
  activePreset: string | null;
  onPresetChange: (preset: QuickFilterPreset | null) => void;
  ticketCounts?: Record<string, number>;
}

export const QUICK_FILTER_PRESETS: QuickFilterPreset[] = [
  {
    id: 'all',
    label: 'Tất cả',
    icon: <Inbox className="w-4 h-4" />,
    filters: {},
  },
  {
    id: 'my-tickets',
    label: 'Ticket của tôi',
    icon: <User className="w-4 h-4" />,
    filters: { createdById: -1 }, // -1 = current user, will be replaced
    roles: [UserRole.EMPLOYEE, UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    id: 'assigned-to-me',
    label: 'Được giao cho tôi',
    icon: <Bookmark className="w-4 h-4" />,
    filters: { assigneeId: -1 }, // -1 = current user
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    id: 'unassigned',
    label: 'Chưa phân công',
    icon: <Users className="w-4 h-4" />,
    filters: { assigneeId: null as any }, // null = unassigned tickets
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    id: 'high-priority',
    label: 'Ưu tiên cao',
    icon: <AlertTriangle className="w-4 h-4" />,
    filters: { priority: 'High' as any },
  },
  {
    id: 'sla-breached',
    label: 'Quá hạn SLA',
    icon: <AlertCircle className="w-4 h-4" />,
    filters: { slaBreached: true } as any,
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    id: 'sla-at-risk',
    label: 'Sắp quá hạn',
    icon: <Clock className="w-4 h-4" />,
    filters: { slaAtRisk: true } as any,
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    id: 'pending',
    label: 'Đang chờ',
    icon: <Clock className="w-4 h-4" />,
    filters: { status: TicketStatus.PENDING },
  },
];

export default function QuickFilters({ activePreset, onPresetChange, ticketCounts }: QuickFiltersProps) {
  const { user } = useAuthStore();

  // Filter presets based on user role
  const visiblePresets = QUICK_FILTER_PRESETS.filter(preset => {
    if (!preset.roles) return true;
    return user?.role && preset.roles.includes(user.role as UserRole);
  });

  return (
    <div className="flex flex-wrap gap-2">
      {visiblePresets.map((preset) => {
        const isActive = activePreset === preset.id;
        const count = ticketCounts?.[preset.id];
        
        return (
          <button
            key={preset.id}
            onClick={() => onPresetChange(preset)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-[#0052CC] text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {preset.icon}
            <span>{preset.label}</span>
            {count !== undefined && count > 0 && (
              <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
