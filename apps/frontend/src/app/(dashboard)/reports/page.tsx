'use client';

import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/lib/api/reports.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Loader2,
  Shield,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

export default function ReportsPage() {
  const { user } = useAuthStore();

  if (user?.role === UserRole.EMPLOYEE) {
    return (
      <div className="text-center py-20">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500">Reports are only available for IT Staff and Admins.</p>
      </div>
    );
  }

  const { data: dashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ['reports', 'dashboard'],
    queryFn: () => reportsService.getDashboard(),
  });

  const { data: slaCompliance, isLoading: loadingSLA } = useQuery({
    queryKey: ['reports', 'sla'],
    queryFn: () => reportsService.getSLACompliance(),
  });

  const { data: staffPerformance, isLoading: loadingStaff } = useQuery({
    queryKey: ['reports', 'staff'],
    queryFn: () => reportsService.getStaffPerformance(),
    enabled: user?.role === UserRole.ADMIN,
  });

  const isLoading = loadingDashboard || loadingSLA;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-500 mt-1">Performance metrics and insights</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{dashboard?.totalTickets || 0}</h3>
          <p className="text-sm text-gray-500 mt-1">Total Tickets</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-green-600">{slaCompliance?.complianceRate || 0}%</h3>
          <p className="text-sm text-gray-500 mt-1">SLA Compliance</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-purple-600">{dashboard?.avgResolutionTime || '0h'}</h3>
          <p className="text-sm text-gray-500 mt-1">Avg Resolution Time</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-3xl font-bold text-orange-600">{dashboard?.closedThisWeek || 0}</h3>
          <p className="text-sm text-gray-500 mt-1">Closed This Week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Compliance Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SLA Compliance by Priority</h2>
          {slaCompliance?.byPriority?.length ? (
            <div className="space-y-4">
              {slaCompliance.byPriority.map((item) => (
                <div key={item.priority} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      item.priority === 'High' ? 'bg-red-100 text-red-700' :
                      item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.priority}
                    </span>
                    <span className="text-sm text-gray-600">{item.total} tickets</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.rate >= 80 ? 'bg-green-500' : item.rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{item.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No SLA data available</p>
          )}
        </div>

        {/* Tickets by Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tickets by Status</h2>
          <div className="space-y-3">
            {[
              { label: 'New', count: dashboard?.ticketsByStatus?.new || 0, color: 'bg-blue-500' },
              { label: 'Assigned', count: dashboard?.ticketsByStatus?.assigned || 0, color: 'bg-purple-500' },
              { label: 'In Progress', count: dashboard?.ticketsByStatus?.in_progress || 0, color: 'bg-orange-500' },
              { label: 'Pending', count: dashboard?.ticketsByStatus?.pending || 0, color: 'bg-yellow-500' },
              { label: 'Resolved', count: dashboard?.ticketsByStatus?.resolved || 0, color: 'bg-green-500' },
              { label: 'Closed', count: dashboard?.ticketsByStatus?.closed || 0, color: 'bg-gray-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Performance (Admin only) */}
      {user?.role === UserRole.ADMIN && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">IT Staff Performance</h2>
          {loadingStaff ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : staffPerformance?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Staff</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Assigned</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Resolved</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Avg Time</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">SLA Rate</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Workload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {staffPerformance.map((staff) => (
                    <tr key={staff.staffId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {staff.staffName?.charAt(0) || '?'}
                          </div>
                          <span className="font-medium text-gray-900">{staff.staffName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{staff.assignedTickets}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{staff.resolvedTickets}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{staff.averageResolutionHours}h</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          staff.slaComplianceRate >= 80 ? 'bg-green-100 text-green-700' :
                          staff.slaComplianceRate >= 50 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {staff.slaComplianceRate}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">{staff.currentWorkload}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No staff performance data</p>
          )}
        </div>
      )}
    </div>
  );
}
