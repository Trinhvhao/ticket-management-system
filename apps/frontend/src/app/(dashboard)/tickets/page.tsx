'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ticketsService } from '@/lib/api/tickets.service';
import { categoriesService } from '@/lib/api/categories.service';
import { TicketStatus, TicketPriority, TicketFilters } from '@/lib/types/ticket.types';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useSavedViews } from '@/lib/hooks/useSavedViews';
import BulkActionBar from '@/components/tickets/BulkActionBar';
import QuickFilters, { QuickFilterPreset } from '@/components/tickets/QuickFilters';
import CompactTicketList from '@/components/tickets/CompactTicketList';
import AdvancedFilters from '@/components/tickets/AdvancedFilters';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ticket as TicketIcon,
  LayoutGrid,
  List,
  Table2,
  Bookmark,
  X,
  Trash2,
  SlidersHorizontal,
  Calendar as CalendarIcon,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700',
  'Assigned': 'bg-purple-100 text-purple-700',
  'In Progress': 'bg-orange-100 text-orange-700',
  'Pending': 'bg-yellow-100 text-yellow-700',
  'Resolved': 'bg-green-100 text-green-700',
  'Closed': 'bg-gray-100 text-gray-700',
};

// Status dot colors for visual indicator
const statusDotColors: Record<string, string> = {
  'New': 'bg-blue-500',
  'Assigned': 'bg-purple-500',
  'In Progress': 'bg-orange-500',
  'Pending': 'bg-yellow-500',
  'Resolved': 'bg-green-500',
  'Closed': 'bg-gray-400',
};

// Row highlight for tickets needing attention
const getRowHighlight = (status: string, assignee: any): string => {
  if (status === 'New') return 'border-l-4 border-l-blue-500 bg-blue-50/30';
  if (status === 'Assigned' && !assignee) return 'border-l-4 border-l-orange-500 bg-orange-50/30';
  return '';
};

const priorityColors: Record<string, string> = {
  'High': 'bg-red-100 text-red-700',
  'Medium': 'bg-yellow-100 text-yellow-700',
  'Low': 'bg-green-100 text-green-700',
};

type ViewMode = 'table' | 'compact';

export default function TicketsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { savedViews, saveView, deleteView } = useSavedViews();
  
  // State
  const [filters, setFilters] = useState<TicketFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showSavedViews, setShowSavedViews] = useState(false);

  // Fetch tickets
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketsService.getAll(filters),
  });

  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getActive(),
  });

  // Calculate counts for quick filters
  const ticketCounts = useMemo(() => {
    // This would ideally come from backend, but for now we'll show counts from current data
    return {};
  }, [ticketsData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }));
    setActivePreset(null);
  };

  const handleFilterChange = (key: keyof TicketFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value || undefined, page: 1 }));
    setActivePreset(null);
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' });
    setSearchQuery('');
    setActivePreset(null);
  };

  const handlePresetChange = (preset: QuickFilterPreset | null) => {
    if (!preset) {
      clearFilters();
      return;
    }

    // Replace -1 with current user ID
    const processedFilters = { ...preset.filters };
    if (processedFilters.createdById === -1 && user?.id) {
      processedFilters.createdById = user.id;
    }
    if (processedFilters.assigneeId === -1 && user?.id) {
      processedFilters.assigneeId = user.id;
    }

    setFilters(prev => ({
      ...prev,
      ...processedFilters,
      page: 1,
    }));
    setActivePreset(preset.id);
    setSearchQuery('');
  };

  const handleSavedViewSelect = (view: typeof savedViews[0]) => {
    setFilters({ ...view.filters, page: 1 });
    setActivePreset(null);
    setShowSavedViews(false);
  };

  const handleSaveView = (name: string, viewFilters: TicketFilters) => {
    saveView(name, viewFilters);
    toast.success(`View "${name}" saved`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Bulk operations mutations
  const bulkAssignMutation = useMutation({
    mutationFn: (assigneeId: number) => ticketsService.bulkAssign(selectedIds, assigneeId),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success(`Assigned ${result.success} tickets successfully`);
      if (result.failed > 0) toast.error(`Failed to assign ${result.failed} tickets`);
      setSelectedIds([]);
    },
    onError: () => toast.error('Failed to assign tickets'),
  });

  const bulkStatusMutation = useMutation({
    mutationFn: (status: TicketStatus) => ticketsService.bulkChangeStatus(selectedIds, status),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success(`Updated ${result.success} tickets successfully`);
      if (result.failed > 0) toast.error(`Failed to update ${result.failed} tickets`);
      setSelectedIds([]);
    },
    onError: () => toast.error('Failed to update tickets'),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: () => ticketsService.bulkDelete(selectedIds),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success(`Deleted ${result.success} tickets successfully`);
      if (result.failed > 0) toast.error(`Failed to delete ${result.failed} tickets`);
      setSelectedIds([]);
    },
    onError: () => toast.error('Failed to delete tickets'),
  });

  // Selection handlers
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === ticketsData?.tickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(ticketsData?.tickets.map(t => t.id) || []);
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} tickets?`)) {
      bulkDeleteMutation.mutate();
    }
  };

  // Check if any filters are active
  const hasActiveFilters = !!(filters.status || filters.priority || filters.categoryId || filters.search || filters.assigneeId);

  return (
    <div className="space-y-6">
      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedIds.length}
        onAssign={(assigneeId) => bulkAssignMutation.mutate(assigneeId)}
        onStatusChange={(status) => bulkStatusMutation.mutate(status)}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedIds([])}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Ticket</h1>
          <p className="text-gray-500 mt-1">Quản lý và theo dõi các yêu cầu hỗ trợ</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/tickets/calendar')}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <CalendarIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Lịch</span>
          </button>
          <button
            onClick={() => router.push('/tickets/kanban')}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
          <button
            onClick={() => router.push('/tickets/new')}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-[#0052CC] text-white rounded-lg hover:bg-[#0047B3] transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Tạo ticket</span>
          </button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Bộ lọc nhanh</h3>
          <div className="flex items-center gap-2">
            {/* Saved Views */}
            <div className="relative">
              <button
                onClick={() => setShowSavedViews(!showSavedViews)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  showSavedViews ? 'bg-[#0052CC] text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Lưu bộ lọc
                {savedViews.length > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    showSavedViews ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {savedViews.length}
                  </span>
                )}
              </button>

              {showSavedViews && savedViews.length > 0 && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowSavedViews(false)} />
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-20">
                    {savedViews.map(view => (
                      <div key={view.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                        <button
                          onClick={() => handleSavedViewSelect(view)}
                          className="flex-1 text-left text-sm text-gray-700"
                        >
                          {view.name}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteView(view.id);
                            toast.success('View deleted');
                          }}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <QuickFilters
          activePreset={activePreset}
          onPresetChange={handlePresetChange}
          ticketCounts={ticketCounts}
        />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search - Made smaller */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm ticket..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              />
            </div>
          </form>

          {/* Filter Buttons - Moved view toggle here */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle - Moved here */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm' : ''}`}
                title="Dạng bảng"
              >
                <Table2 className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded transition-colors ${viewMode === 'compact' ? 'bg-white shadow-sm' : ''}`}
                title="Dạng thu gọn"
              >
                <List className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Bộ lọc</span>
            </button>
            <button
              onClick={() => setShowAdvancedFilters(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Nâng cao</span>
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Xóa</span>
              </button>
            )}
          </div>
        </div>

        {/* Basic Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value as TicketStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
              >
                <option value="">Tất cả trạng thái</option>
                {Object.values(TicketStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Độ ưu tiên</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value as TicketPriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
              >
                <option value="">Tất cả độ ưu tiên</option>
                {Object.values(TicketPriority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                value={filters.categoryId || ''}
                onChange={(e) => handleFilterChange('categoryId', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
              >
                <option value="">Tất cả danh mục</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters Modal */}
      {showAdvancedFilters && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="mt-20 w-full max-w-4xl">
            <AdvancedFilters
              filters={filters}
              onFilterChange={(newFilters) => {
                setFilters(newFilters);
                setActivePreset(null);
                setShowAdvancedFilters(false);
              }}
              onSaveView={handleSaveView}
              onClose={() => setShowAdvancedFilters(false)}
            />
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
          </div>
        ) : !ticketsData?.tickets?.length ? (
          <div className="text-center py-20">
            <TicketIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy ticket</h3>
            <p className="text-gray-500 mb-6">
              {hasActiveFilters ? 'Thử điều chỉnh bộ lọc của bạn' : 'Tạo ticket đầu tiên để bắt đầu'}
            </p>
            <button
              onClick={() => router.push('/tickets/new')}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-[#0052CC] text-white rounded-lg hover:bg-[#0047B3] transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Tạo ticket</span>
            </button>
          </div>
        ) : viewMode === 'compact' ? (
          <CompactTicketList
            tickets={ticketsData.tickets}
            selectedIds={selectedIds}
            onSelect={toggleSelect}
            onSelectAll={toggleSelectAll}
          />
        ) : (
          <>
            {/* Table View */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === ticketsData.tickets.length && ticketsData.tickets.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-[#0052CC] border-gray-300 rounded focus:ring-[#0052CC]"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ticket</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Độ ưu tiên</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden xl:table-cell">Danh mục</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Người xử lý</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Hạn xử lý</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">Ngày tạo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ticketsData.tickets.map((ticket) => {
                    const rowHighlight = getRowHighlight(ticket.status, ticket.assignee);
                    const needsAttention = ticket.status === 'New' || (ticket.status === 'Assigned' && !ticket.assignee);
                    
                    return (
                      <tr 
                        key={ticket.id} 
                        className={`hover:bg-gray-50 transition-colors ${rowHighlight}`}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(ticket.id)}
                            onChange={() => toggleSelect(ticket.id)}
                            className="w-4 h-4 text-[#0052CC] border-gray-300 rounded focus:ring-[#0052CC]"
                          />
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                          <div className="flex items-start space-x-3">
                            {/* Status indicator dot */}
                            <div className="flex-shrink-0 mt-1.5">
                              <span className={`inline-block w-2.5 h-2.5 rounded-full ${statusDotColors[ticket.status] || 'bg-gray-400'} ${needsAttention ? 'animate-pulse' : ''}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900 truncate">{ticket.title}</p>
                                {needsAttention && (
                                  <span className="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-semibold bg-orange-100 text-orange-700 rounded">
                                    CẦN XỬ LÝ
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{ticket.ticketNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority] || 'bg-gray-100 text-gray-700'}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden xl:table-cell cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                          <span className="text-sm text-gray-600">{ticket.category?.name || '-'}</span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                          {ticket.assignee ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-xs font-medium text-blue-600">{ticket.assignee.fullName.charAt(0)}</span>
                              </div>
                              <span className="text-sm text-gray-600">{ticket.assignee.fullName}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-orange-500 font-medium">⚠ Chưa phân công</span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell cursor-pointer" onClick={() => router.push(`/tickets/${ticket.id}`)}>
                          {ticket.dueDate ? (
                            <div className="flex flex-col">
                              <span className={`text-sm ${
                                new Date(ticket.dueDate) < new Date() && ticket.status !== 'Resolved' && ticket.status !== 'Closed'
                                  ? 'text-red-600 font-semibold'
                                  : new Date(ticket.dueDate).getTime() - new Date().getTime() < 2 * 60 * 60 * 1000
                                  ? 'text-orange-600 font-medium'
                                  : 'text-gray-600'
                              }`}>
                                {new Date(ticket.dueDate).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {new Date(ticket.dueDate) < new Date() && ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
                                <span className="text-xs text-red-500 font-medium">⚠️ Quá hạn</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <span className="text-sm text-gray-500">{formatDate(ticket.createdAt)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {ticketsData && ticketsData.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị {((ticketsData.page - 1) * (filters.limit || 10)) + 1} đến{' '}
              {Math.min(ticketsData.page * (filters.limit || 10), ticketsData.total)} trong tổng số {ticketsData.total} ticket
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(ticketsData.page - 1)}
                disabled={ticketsData.page === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">Trang {ticketsData.page} / {ticketsData.totalPages}</span>
              <button
                onClick={() => handlePageChange(ticketsData.page + 1)}
                disabled={ticketsData.page === ticketsData.totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
