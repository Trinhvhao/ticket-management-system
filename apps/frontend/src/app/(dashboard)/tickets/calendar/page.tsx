'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ticketsService } from '@/lib/api/tickets.service';
import { TicketCalendar } from '@/components/calendar';
import { TicketStatus, TicketPriority } from '@/lib/types/ticket.types';
import { 
  Calendar as CalendarIcon, 
  Table2, 
  LayoutGrid, 
  Loader2,
  Filter,
  X
} from 'lucide-react';

export default function CalendarPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<TicketStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch tickets with due dates
  const { data: ticketsData, isLoading } = useQuery({
    queryKey: ['tickets-calendar', statusFilter, priorityFilter],
    queryFn: () => ticketsService.getAll({
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
      sortBy: 'dueDate',
      sortOrder: 'ASC',
      limit: 1000, // Get all tickets for calendar view
    }),
  });

  // Filter tickets that have due dates
  const ticketsWithDueDate = ticketsData?.tickets.filter(t => t.dueDate) || [];

  // Check if ticket is SLA breached
  const ticketsWithSLA = ticketsWithDueDate.map(ticket => ({
    ...ticket,
    slaBreached: ticket.dueDate && new Date(ticket.dueDate) < new Date() && 
                 ticket.status !== 'Resolved' && ticket.status !== 'Closed' ? true : false,
  }));

  const clearFilters = () => {
    setStatusFilter('');
    setPriorityFilter('');
  };

  const hasActiveFilters = !!(statusFilter || priorityFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-500 mt-1">
            View tickets by due date and manage deadlines
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 border rounded-lg transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </button>
          <button
            onClick={() => router.push('/tickets')}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Table2 className="w-5 h-5" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => router.push('/tickets/kanban')}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="hidden sm:inline">Kanban</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700">Filter Tickets</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TicketStatus)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
              >
                <option value="">All Status</option>
                {Object.values(TicketStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TicketPriority)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
              >
                <option value="">All Priority</option>
                {Object.values(TicketPriority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Scheduled</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {ticketsWithDueDate.length}
              </p>
            </div>
            <CalendarIcon className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Due Today</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {ticketsWithSLA.filter(t => {
                  const due = new Date(t.dueDate!);
                  const today = new Date();
                  return due.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <CalendarIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {ticketsWithSLA.filter(t => t.slaBreached).length}
              </p>
            </div>
            <CalendarIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {ticketsWithSLA.filter(t => {
                  const due = new Date(t.dueDate!);
                  const today = new Date();
                  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                  return due >= today && due <= weekFromNow;
                }).length}
              </p>
            </div>
            <CalendarIcon className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Calendar */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
          <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
        </div>
      ) : (
        <TicketCalendar tickets={ticketsWithSLA} />
      )}
    </div>
  );
}
