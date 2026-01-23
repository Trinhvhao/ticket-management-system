'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/lib/api/reports.service';
import { ticketsService } from '@/lib/api/tickets.service';
import { QuickActions } from '@/components/dashboard';
import { 
  StatCard, 
  TicketStatusChart, 
  TicketTrendChart, 
  PriorityChart,
  SLAGaugeChart,
  CategoryPerformanceChart,
  StaffLeaderboard,
} from '@/components/charts';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Loader2,
  TrendingUp,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

const statusColors: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Assigned': 'bg-purple-100 text-purple-700',
  'In Progress': 'bg-orange-100 text-orange-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Resolved': 'bg-green-100 text-green-700',
  'Closed': 'bg-gray-100 text-gray-700',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [trendDays, setTrendDays] = useState(7);

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => reportsService.getDashboard(),
  });

  // Fetch recent tickets
  const { data: recentTickets } = useQuery({
    queryKey: ['recent-tickets'],
    queryFn: () => ticketsService.getAll({ limit: 5, sortBy: 'createdAt', sortOrder: 'DESC' }),
  });

  // Fetch trend data with dynamic days
  const { data: trendsData, isLoading: trendsLoading, isFetching: trendsFetching } = useQuery({
    queryKey: ['trends', 'day', trendDays],
    queryFn: () => reportsService.getTrends({ period: 'day', limit: trendDays }),
    staleTime: 30000, // Cache for 30 seconds
  });

  // Fetch category performance data
  const { data: categoryData } = useQuery({
    queryKey: ['tickets-by-category'],
    queryFn: () => reportsService.getTicketsByCategory(),
  });

  // Fetch staff performance data
  const { data: staffData } = useQuery({
    queryKey: ['staff-performance'],
    queryFn: () => reportsService.getStaffPerformance(),
    enabled: user?.role === 'Admin', // Only fetch for Admin
  });

  // Prepare chart data - Group statuses into logical categories
  const statusChartData = dashboardData ? [
    { 
      name: 'Open', 
      value: dashboardData.ticketsByStatus.new + dashboardData.ticketsByStatus.assigned, 
      color: '#3B82F6',
      description: 'New + Assigned'
    },
    { 
      name: 'In Progress', 
      value: dashboardData.ticketsByStatus.in_progress + dashboardData.ticketsByStatus.pending, 
      color: '#F59E0B',
      description: 'In Progress + Pending'
    },
    { 
      name: 'Resolved', 
      value: dashboardData.ticketsByStatus.resolved + dashboardData.ticketsByStatus.closed, 
      color: '#10B981',
      description: 'Resolved + Closed'
    },
  ].filter(item => item.value > 0) : []; // Only show categories with tickets

  const priorityChartData = dashboardData ? [
    { priority: 'Low', count: dashboardData.ticketsByPriority.low, color: '#10B981' },
    { priority: 'Medium', count: dashboardData.ticketsByPriority.medium, color: '#F59E0B' },
    { priority: 'High', count: dashboardData.ticketsByPriority.high, color: '#EF4444' },
  ] : [];

  // Transform trend data for chart - Backend already returns oldest to newest
  const trendData = trendsData?.map(item => {
    const date = new Date(item.period);
    // Format: "Th 2" (Monday), "Th 3" (Tuesday), etc.
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayNames = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];
    const dayName = dayNames[dayOfWeek];
    const dateStr = `${dayName} ${date.getDate()}/${date.getMonth() + 1}`;
    
    return {
      date: dateStr,
      fullDate: item.period,
      created: item.ticketsCreated || 0,
      resolved: item.ticketsResolved || 0,
      closed: item.ticketsClosed || 0,
      avgResolutionHours: item.averageResolutionHours || 0,
    };
  }) || []; // No reverse needed - backend returns correct order (oldest to newest)

  // Transform category data for chart
  const categoryChartData = categoryData?.map((cat, index) => {
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];
    return {
      name: cat.categoryName,
      ticketCount: cat.count,
      color: colors[index % colors.length],
    };
  }) || [];

  // Transform staff data for leaderboard
  const staffLeaderboardData = staffData?.map(staff => ({
    id: staff.staffId,
    name: staff.staffName,
    ticketsResolved: staff.resolvedTickets,
    avgResolutionTime: staff.averageResolutionHours,
    satisfactionRate: staff.slaComplianceRate, // Using SLA compliance as satisfaction proxy
    trend: 'stable' as const, // We don't have trend data yet
    trendValue: 0,
  })) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section - Modern Gradient */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-gradient-to-r from-[#0052CC] via-blue-600 to-purple-600 rounded-2xl p-8 text-white overflow-hidden"
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-2"
            >
              Chào mừng trở lại, {user?.fullName}! 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-blue-100"
            >
              Đây là tổng quan về các yêu cầu hỗ trợ hôm nay.
            </motion.p>
          </div>
          
          {/* Quick stats in header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:flex items-center gap-6"
          >
            <div className="text-center">
              <p className="text-3xl font-bold">{dashboardData?.openTickets || 0}</p>
              <p className="text-sm text-blue-200">Đang mở</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">{dashboardData?.closedToday || 0}</p>
              <p className="text-sm text-blue-200">Đã giải quyết hôm nay</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">{dashboardData?.slaComplianceRate || 0}%</p>
              <p className="text-sm text-blue-200">Tỷ lệ SLA</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <QuickActions />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng số ticket"
          value={dashboardData?.totalTickets || 0}
          icon={Ticket}
          color="text-blue-600"
          bgColor="bg-blue-50"
          change={{ value: 12, trend: 'up' }}
        />
        <StatCard
          title="Ticket đang mở"
          value={dashboardData?.openTickets || 0}
          icon={Clock}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          change={{ value: 5, trend: 'up' }}
        />
        <StatCard
          title="Đã giải quyết hôm nay"
          value={dashboardData?.closedToday || 0}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
          change={{ value: 8, trend: 'up' }}
        />
        <StatCard
          title="Thời gian xử lý TB"
          value={`${dashboardData?.avgResolutionTime || 0}h`}
          icon={TrendingUp}
          color="text-purple-600"
          bgColor="bg-purple-50"
          change={{ value: 15, trend: 'down' }}
        />
      </div>

      {/* Charts Row 1 - Status & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketStatusChart data={statusChartData} />
        <PriorityChart data={priorityChartData} />
      </div>

      {/* Charts Row 2 - Trend & SLA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketTrendChart 
          data={trendData} 
          onTimeRangeChange={setTrendDays}
          currentRange={trendDays}
          isLoading={trendsLoading || trendsFetching}
        />
        <SLAGaugeChart 
          value={dashboardData?.slaComplianceRate || 0}
          target={95}
          breachedCount={dashboardData?.slaBreached || 0}
          atRiskCount={dashboardData?.slaAtRisk || 0}
        />
      </div>

      {/* Charts Row 3 - Category & Staff Performance */}
      {(categoryChartData.length > 0 || staffLeaderboardData.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categoryChartData.length > 0 && (
            <CategoryPerformanceChart data={categoryChartData} />
          )}
          {staffLeaderboardData.length > 0 && user?.role === 'Admin' && (
            <StaffLeaderboard data={staffLeaderboardData} period="This Month" />
          )}
        </div>
      )}

      {/* Recent Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3" />
            Ticket gần đây
          </h3>
          <button
            onClick={() => router.push('/tickets')}
            className="text-sm text-[#0052CC] hover:text-[#0047B3] font-medium flex items-center group"
          >
            Xem tất cả
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="space-y-3">
          {recentTickets?.tickets.slice(0, 5).map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => router.push(`/tickets/${ticket.id}`)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-all hover:scale-[1.01] group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate group-hover:text-[#0052CC] transition-colors">
                  {ticket.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  #{ticket.ticketNumber} • {new Date(ticket.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <span className={`ml-3 px-3 py-1.5 text-xs font-medium rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </motion.div>
          ))}
          {(!recentTickets?.tickets || recentTickets.tickets.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Không có ticket gần đây</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
