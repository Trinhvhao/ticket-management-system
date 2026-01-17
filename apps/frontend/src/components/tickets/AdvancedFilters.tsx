'use client';

import { useState } from 'react';
import { TicketStatus, TicketPriority, TicketFilters } from '@/lib/types/ticket.types';
import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/lib/api/categories.service';
import { usersService } from '@/lib/api/users.service';
import { UserRole } from '@/lib/types/auth.types';
import { useAuthStore } from '@/lib/stores/auth.store';
import { 
  Calendar, 
  X, 
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AdvancedFiltersProps {
  filters: TicketFilters;
  onFilterChange: (filters: TicketFilters) => void;
  onSaveView?: (name: string, filters: TicketFilters) => void;
  onClose: () => void;
}

export default function AdvancedFilters({ 
  filters, 
  onFilterChange, 
  onSaveView,
  onClose 
}: AdvancedFiltersProps) {
  const { user } = useAuthStore();
  const [localFilters, setLocalFilters] = useState<TicketFilters>(filters);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [viewName, setViewName] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    status: true,
    priority: true,
    dates: true,
    assignment: true,
    sla: true,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getActive(),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users', 'it-staff'],
    queryFn: () => usersService.getAll({ role: UserRole.IT_STAFF }),
    enabled: user?.role === UserRole.ADMIN || user?.role === UserRole.IT_STAFF,
  });

  const itStaff = usersData?.users || [];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleChange = (key: keyof TicketFilters, value: any) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      [key]: value === '' ? undefined : value 
    }));
  };

  const handleApply = () => {
    onFilterChange({ ...localFilters, page: 1 });
    onClose();
  };

  const handleReset = () => {
    const resetFilters: TicketFilters = { page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'DESC' };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const handleSaveView = () => {
    if (viewName.trim() && onSaveView) {
      onSaveView(viewName.trim(), localFilters);
      setShowSaveDialog(false);
      setViewName('');
    }
  };

  const SectionHeader = ({ 
    title, 
    section 
  }: { 
    title: string; 
    section: keyof typeof expandedSections 
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-700"
    >
      {title}
      {expandedSections[section] ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status Section */}
        <div className="space-y-3">
          <SectionHeader title="Status" section="status" />
          {expandedSections.status && (
            <div className="space-y-2">
              {Object.values(TicketStatus).map(status => (
                <label key={status} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.status === status}
                    onChange={(e) => handleChange('status', e.target.checked ? status : undefined)}
                    className="w-4 h-4 text-[#0052CC] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{status}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Priority Section */}
        <div className="space-y-3">
          <SectionHeader title="Priority" section="priority" />
          {expandedSections.priority && (
            <div className="space-y-2">
              {Object.values(TicketPriority).map(priority => (
                <label key={priority} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={localFilters.priority === priority}
                    onChange={(e) => handleChange('priority', e.target.checked ? priority : undefined)}
                    className="w-4 h-4 text-[#0052CC] border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{priority}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Section */}
        <div className="space-y-3">
          <SectionHeader title="Date Range" section="dates" />
          {expandedSections.dates && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Created From</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={(localFilters as any).createdFrom || ''}
                    onChange={(e) => handleChange('createdFrom' as any, e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Created To</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={(localFilters as any).createdTo || ''}
                    onChange={(e) => handleChange('createdTo' as any, e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assignment Section */}
        <div className="space-y-3">
          <SectionHeader title="Assignment" section="assignment" />
          {expandedSections.assignment && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Assignee</label>
                <select
                  value={localFilters.assigneeId || ''}
                  onChange={(e) => handleChange('assigneeId', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                >
                  <option value="">All Assignees</option>
                  <option value="unassigned">Unassigned</option>
                  {itStaff.map((staff: any) => (
                    <option key={staff.id} value={staff.id}>{staff.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Category</label>
                <select
                  value={localFilters.categoryId || ''}
                  onChange={(e) => handleChange('categoryId', e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories?.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* SLA Section */}
        <div className="space-y-3">
          <SectionHeader title="SLA Status" section="sla" />
          {expandedSections.sla && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(localFilters as any).slaBreached === true}
                  onChange={(e) => handleChange('slaBreached' as any, e.target.checked ? true : undefined)}
                  className="w-4 h-4 text-[#0052CC] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">SLA Breached</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(localFilters as any).slaAtRisk === true}
                  onChange={(e) => handleChange('slaAtRisk' as any, e.target.checked ? true : undefined)}
                  className="w-4 h-4 text-[#0052CC] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">SLA At Risk (within 2 hours)</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All
        </button>

        <div className="flex items-center gap-3">
          {onSaveView && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-4 py-2 text-[#0052CC] hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Save View
            </button>
          )}
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-[#0052CC] text-white rounded-lg hover:bg-[#0047B3] transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Save View Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Save Filter View</h4>
            <input
              type="text"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              placeholder="Enter view name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveView}
                disabled={!viewName.trim()}
                className="px-4 py-2 bg-[#0052CC] text-white rounded-lg hover:bg-[#0047B3] disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
