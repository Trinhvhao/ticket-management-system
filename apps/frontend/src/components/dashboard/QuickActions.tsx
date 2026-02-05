'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import {
  Plus,
  Ticket,
  UserCheck,
  Search,
  BarChart3,
  Users,
  BookOpen,
  Clock,
} from 'lucide-react';

interface QuickAction {
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bgColor: string;
  roles?: UserRole[];
}

const getQuickActions = (): QuickAction[] => [
  {
    titleKey: 'tickets.createTicket',
    descriptionKey: 'dashboard.quickActions',
    icon: Plus,
    href: '/tickets/new',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    titleKey: 'tickets.myTickets',
    descriptionKey: 'tickets.myTickets',
    icon: Ticket,
    href: '/tickets?view=my-tickets',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
  },
  {
    titleKey: 'tickets.assignee',
    descriptionKey: 'tickets.assignee',
    icon: UserCheck,
    href: '/tickets?view=assigned-to-me',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    titleKey: 'knowledge.searchArticles',
    descriptionKey: 'knowledge.title',
    icon: BookOpen,
    href: '/knowledge',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
  },
  {
    titleKey: 'sla.title',
    descriptionKey: 'sla.compliance',
    icon: Clock,
    href: '/sla',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    titleKey: 'reports.title',
    descriptionKey: 'reports.trendAnalysis',
    icon: BarChart3,
    href: '/reports',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    titleKey: 'users.title',
    descriptionKey: 'users.title',
    icon: Users,
    href: '/users',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100',
    roles: [UserRole.ADMIN],
  },
  {
    titleKey: 'common.search',
    descriptionKey: 'common.search',
    icon: Search,
    href: '/search',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
  },
];

export default function QuickActions() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useLanguage();

  const quickActions = getQuickActions();

  const filteredActions = quickActions.filter(action => {
    if (!action.roles) return true;
    return user?.role && action.roles.includes(user.role);
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredActions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.titleKey}
            onClick={() => router.push(action.href)}
            className={`${action.bgColor} rounded-xl p-6 text-left transition-all hover:shadow-md border border-transparent hover:border-gray-200 group`}
          >
            <div className={`w-12 h-12 ${action.bgColor.replace('hover:', '')} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{t(action.titleKey)}</h3>
            <p className="text-sm text-gray-600">{t(action.descriptionKey)}</p>
          </button>
        );
      })}
    </div>
  );
}
