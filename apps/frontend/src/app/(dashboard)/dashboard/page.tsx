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
  StaffLeaderboard
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

const statusColors: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Assigned': 'bg-purple-100 text-purple-700',
  'In_Progress': 'bg-yellow-100 text-yellow-700',
  'Resolved': 'bg-green-100 text-green-700',
  'Closed': 'bg-gray-100 text-gray-700',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

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

  // Fetch trend data
  const { data: trendsData } = useQuery({
    queryKey: ['trends', 'week'],
    queryFn: () => reportsService.getTrends({ period: 'day' }),
  });

  // Prepare chart data
  const statusChartData = dashboardData ? [
    { name: 'New', value: dashboardData.ticketsByStatus.new, color: '#3B82F6' },
    { name: 'Assigned', value: dashboardData.ticketsByStatus.assigned, color: '#8B5CF6' },
    { name: 'In Progress', value: dashboardData.ticketsByStatus.in_progress, color: '#F59E0B' },
    { name: 'Resolved', value: dashboardData.ticketsByStatus.resolved, color: '#10B981' },
    { name: 'Closed', value: dashboardData.ticketsByStatus.closed, color: '#6B7280' },
  ] : [];

  const priorityChartData = dashboardData ? [
    { priority: 'Low', count: dashboardData.ticketsByPriority.low, color: '#10B981' },
    { priority: 'Medium', count: dashboardData.ticketsByPriority.medium, color: '#F59E0B' },
    { priority: 'High', count: dashboardData.ticketsByPriority.high, color: '#EF4444' },
  ] : [];

  // Transform trend data for chart
  const trendData = trendsData?.map(item => {
    const date = new Date(item.period);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      date: dayName,
      created: item.created,
      resolved: item.resolved,
      closed: 0,
    };
  }) || [];

  // Mock data for new charts (replace with real API data when available)
  const categoryData = [
    { name: 'Hardware', icon: '💻', ticketCount: 45, avgResolutionTime: 4.5, satisfactionRate: 92, color: '#3B82F6' },
    { name: 'Software', icon: '📱', ticketCount: 38, avgResolutionTime: 3.2, satisfactionRate: 88, color: '#8B5CF6' },
    { name: 'Network', icon: '🌐', ticketCount: 28, avgResolutionTime: 2.8, satisfactionRate: 95, color: '#10B981' },
    { name: 'Account', icon: '👤', ticketCount: 22, avgResolutionTime: 1.5, satisfactionRate: 90, color: '#F59E0B' },
    { name: 'Other', icon: '📋', ticketCount: 15, avgResolutionTime: 5.0, satisfactionRate: 85, color: '#6B7280' },
  ];

  const staffData = [
    { id: 1, name: 'Nguyễn Văn A', ticketsResolved: 45, avgResolutionTime: 2.5, satisfactionRate: 96, trend: 'up' as const, trendValue: 12 },
    { id: 2, name: 'Trần Thị B', ticketsResolved: 42, avgResolutionTime: 3.0, satisfactionRate: 94, trend: 'up' as const, trendValue: 8 },
    { id: 3, name: 'Lê Văn C', ticketsResolved: 38, avgResolutionTime: 2.8, satisfactionRate: 92, trend: 'stable' as const, trendValue: 0 },
    { id: 4, name: 'Phạm Thị D', ticketsResolved: 35, avgResolutionTime: 3.5, satisfactionRate: 90, trend: 'down' as const, trendValue: 5 },
    { id: 5, name: 'Hoàng Văn E', ticketsResolved: 30, avgResolutionTime: 4.0, satisfactionRate: 88, trend: 'up' as const, trendValue: 15 },
  ];

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
              Welcome back, {user?.fullName}! 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-blue-100"
            >
              Here's what's happening with your tickets today.
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
              <p className="text-sm text-blue-200">Open</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">{dashboardData?.closedToday || 0}</p>
              <p className="text-sm text-blue-200">Resolved Today</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">{dashboardData?.slaComplianceRate || 0}%</p>
              <p className="text-sm text-blue-200">SLA Rate</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tickets"
          value={dashboardData?.totalTickets || 0}
          icon={Ticket}
          color="text-blue-600"
          bgColor="bg-blue-50"
          change={{ value: 12, trend: 'up' }}
        />
        <StatCard
          title="Open Tickets"
          value={dashboardData?.openTickets || 0}
          icon={Clock}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
          change={{ value: 5, trend: 'up' }}
        />
        <StatCard
          title="Resolved Today"
          value={dashboardData?.closedToday || 0}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
          change={{ value: 8, trend: 'up' }}
        />
        <StatCard
          title="Avg Resolution"
          value={`${dashboardData?.avgResolutionTime || 0}h`}
          icon={TrendingUp}
          color="text-purple-600"
          bgColor="bg-purple-50"
          change={{ value: 15, trend: 'down' }}
        />
      </div>

      {/* Charts Row 1 - Status & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketStatusChart data={statusChartData} />
        <TicketTrendChart data={trendData} />
      </div>

      {/* Charts Row 2 - SLA & Priority */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SLAGaugeChart 
          value={dashboardData?.slaComplianceRate || 85}
          target={95}
          breachedCount={dashboardData?.slaBreached || 3}
          atRiskCount={5}
        />
        <PriorityChart data={priorityChartData} />
      </div>

      {/* Charts Row 3 - Category & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPerformanceChart data={categoryData} />
        <StaffLeaderboard data={staffData} period="This Week" />
      </div>

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
            Recent Tickets
          </h3>
          <button
            onClick={() => router.push('/tickets')}
            className="text-sm text-[#0052CC] hover:text-[#0047B3] font-medium flex items-center group"
          >
            View all
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
              <p>No recent tickets</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
