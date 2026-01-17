'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
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
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bgColor: string;
  roles?: UserRole[];
}

const quickActions: QuickAction[] = [
  {
    title: 'Create Ticket',
    description: 'Submit a new support request',
    icon: Plus,
    href: '/tickets/new',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
  },
  {
    title: 'My Tickets',
    description: 'View tickets you created',
    icon: Ticket,
    href: '/tickets?view=my-tickets',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
  },
  {
    title: 'Assigned to Me',
    description: 'Tickets assigned to you',
    icon: UserCheck,
    href: '/tickets?view=assigned-to-me',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100',
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    title: 'Search Knowledge',
    description: 'Find solutions in KB',
    icon: BookOpen,
    href: '/knowledge',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100',
  },
  {
    title: 'SLA Dashboard',
    description: 'Monitor SLA compliance',
    icon: Clock,
    href: '/sla',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 hover:bg-yellow-100',
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    title: 'View Reports',
    description: 'Analytics and insights',
    icon: BarChart3,
    href: '/reports',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
    roles: [UserRole.IT_STAFF, UserRole.ADMIN],
  },
  {
    title: 'Manage Users',
    description: 'User administration',
    icon: Users,
    href: '/users',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 hover:bg-pink-100',
    roles: [UserRole.ADMIN],
  },
  {
    title: 'Quick Search',
    description: 'Search tickets and articles',
    icon: Search,
    href: '/search',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
  },
];

export default function QuickActions() {
  const router = useRouter();
  const { user } = useAuthStore();

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
            key={action.title}
            onClick={() => router.push(action.href)}
            className={`${action.bgColor} rounded-xl p-6 text-left transition-all hover:shadow-md border border-transparent hover:border-gray-200 group`}
          >
            <div className={`w-12 h-12 ${action.bgColor.replace('hover:', '')} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-6 h-6 ${action.color}`} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
            <p className="text-sm text-gray-600">{action.description}</p>
          </button>
        );
      })}
    </div>
  );
}
