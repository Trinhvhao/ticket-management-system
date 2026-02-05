'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { usersService, UsersFilters } from '@/lib/api/users.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users as UsersIcon,
  Shield,
  Mail,
  Phone,
} from 'lucide-react';

const roleColors: Record<string, string> = {
  'Admin': 'bg-purple-100 text-purple-700',
  'IT_Staff': 'bg-blue-100 text-blue-700',
  'Employee': 'bg-gray-100 text-gray-700',
};

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [filters, setFilters] = useState<UsersFilters>({ page: 1, limit: 10 });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Check admin access
  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="text-center py-20">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('users.accessDenied')}</h2>
        <p className="text-gray-500">{t('users.noPermission')}</p>
      </div>
    );
  }

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getAll(filters),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }));
  };

  const handleFilterChange = (key: keyof UsersFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('users.title')}</h1>
          <p className="text-gray-500 mt-1">{t('users.description')}</p>
        </div>
        <button
          onClick={() => router.push('/users/new')}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>{t('users.addUser')}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('users.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>{t('common.filter')}</span>
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('users.role')}</label>
              <select
                value={filters.role || ''}
                onChange={(e) => handleFilterChange('role', e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('users.allRoles')}</option>
                {Object.values(UserRole).map(role => (
                  <option key={role} value={role}>{t(`role.${role}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('common.status')}</label>
              <select
                value={filters.isActive === undefined ? '' : String(filters.isActive)}
                onChange={(e) => handleFilterChange('isActive', e.target.value === '' ? undefined : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('users.allStatus')}</option>
                <option value="true">{t('common.active')}</option>
                <option value="false">{t('common.inactive')}</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setFilters({ page: 1, limit: 10 }); setSearchQuery(''); }}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                {t('users.clearFilters')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : !usersData?.users?.length ? (
          <div className="text-center py-20">
            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('users.noUsers')}</h3>
            <p className="text-gray-500">{t('users.adjustFilters')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('users.user')}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('users.role')}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">{t('users.department')}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">{t('users.contact')}</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('common.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usersData.users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/users/${u.id}`)}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{u.fullName}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${roleColors[u.role]}`}>
                          {t(`role.${u.role}`)}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-600">{u.department || '-'}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          {u.phone && (
                            <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{u.phone}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                          u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {u.isActive ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {usersData.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {t('common.showing')} {((usersData.page - 1) * (filters.limit || 10)) + 1} {t('common.to')} {Math.min(usersData.page * (filters.limit || 10), usersData.total)} {t('common.of')} {usersData.total}
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                    disabled={usersData.page === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">{t('common.page')} {usersData.page} {t('common.of')} {usersData.totalPages}</span>
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                    disabled={usersData.page === usersData.totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
