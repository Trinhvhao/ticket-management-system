'use client';

import { Ticket, TicketStatus, TicketPriority } from '@/lib/types/ticket.types';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  User, 
  AlertCircle, 
  CheckCircle,
  MoreHorizontal,
  MessageSquare,
  Paperclip,
  Eye,
  Edit,
  UserPlus
} from 'lucide-react';
import { useState } from 'react';
import { usePermissions } from '@/lib/hooks/usePermissions';

interface CompactTicketListProps {
  tickets: Ticket[];
  selectedIds: number[];
  onSelect: (id: number) => void;
  onSelectAll: () => void;
  onQuickAction?: (action: string, ticketId: number) => void;
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  'New': { color: 'text-blue-600', bg: 'bg-blue-500' },
  'Assigned': { color: 'text-purple-600', bg: 'bg-purple-500' },
  'In Progress': { color: 'text-orange-600', bg: 'bg-orange-500' },
  'Pending': { color: 'text-yellow-600', bg: 'bg-yellow-500' },
  'Resolved': { color: 'text-green-600', bg: 'bg-green-500' },
  'Closed': { color: 'text-gray-600', bg: 'bg-gray-500' },
};

const priorityConfig: Record<string, { color: string; dot: string }> = {
  'High': { color: 'text-red-600', dot: 'bg-red-500' },
  'Medium': { color: 'text-yellow-600', dot: 'bg-yellow-500' },
  'Low': { color: 'text-green-600', dot: 'bg-green-500' },
};

export default function CompactTicketList({ 
  tickets, 
  selectedIds, 
  onSelect, 
  onSelectAll,
  onQuickAction 
}: CompactTicketListProps) {
  const router = useRouter();
  const permissions = usePermissions();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [showActionsFor, setShowActionsFor] = useState<number | null>(null);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const mins = Math.floor(diff / (1000 * 60));
        return `${mins}m ago`;
      }
      return `${hours}h ago`;
    }
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="divide-y divide-gray-100">
      {/* Header */}
      <div className="px-4 py-2 bg-gray-50 flex items-center gap-4 text-xs font-medium text-gray-500 uppercase">
        <input
          type="checkbox"
          checked={selectedIds.length === tickets.length && tickets.length > 0}
          onChange={onSelectAll}
          className="w-4 h-4 text-[#0052CC] border-gray-300 rounded"
        />
        <span className="flex-1">Ticket</span>
        <span className="w-24 text-center hidden sm:block">Status</span>
        <span className="w-20 text-center hidden md:block">Priority</span>
        <span className="w-32 hidden lg:block">Assignee</span>
        <span className="w-20 text-right hidden sm:block">Updated</span>
        <span className="w-8"></span>
      </div>

      {/* Tickets */}
      {tickets.map((ticket) => {
        const status = statusConfig[ticket.status] || statusConfig['New'];
        const priority = priorityConfig[ticket.priority] || priorityConfig['Medium'];
        const isSelected = selectedIds.includes(ticket.id);
        const isHovered = hoveredId === ticket.id;

        return (
          <div
            key={ticket.id}
            className={`px-4 py-3 flex items-center gap-4 transition-colors cursor-pointer ${
              isSelected ? 'bg-blue-50' : isHovered ? 'bg-gray-50' : ''
            }`}
            onMouseEnter={() => setHoveredId(ticket.id)}
            onMouseLeave={() => {
              setHoveredId(null);
              setShowActionsFor(null);
            }}
            onClick={() => router.push(`/tickets/${ticket.id}`)}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(ticket.id);
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 text-[#0052CC] border-gray-300 rounded"
            />

            {/* Ticket Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {/* Priority Dot */}
                <span className={`w-2 h-2 rounded-full ${priority.dot} flex-shrink-0`} />
                
                {/* Title */}
                <span className="font-medium text-gray-900 truncate">
                  {ticket.title}
                </span>
                
                {/* SLA Breach */}
                {ticket.slaBreached && (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                )}
              </div>
              
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="font-mono">{ticket.ticketNumber}</span>
                {ticket.category && (
                  <>
                    <span>•</span>
                    <span>{ticket.category.name}</span>
                  </>
                )}
                {ticket.submitter && (
                  <>
                    <span>•</span>
                    <span>by {ticket.submitter.fullName}</span>
                  </>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="w-24 hidden sm:flex justify-center">
              <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${status.color} bg-opacity-10`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status.bg}`} />
                {ticket.status}
              </span>
            </div>

            {/* Priority */}
            <div className="w-20 hidden md:flex justify-center">
              <span className={`text-xs font-medium ${priority.color}`}>
                {ticket.priority}
              </span>
            </div>

            {/* Assignee */}
            <div className="w-32 hidden lg:block">
              {ticket.assignee ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium">
                    {ticket.assignee.fullName.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-600 truncate">
                    {ticket.assignee.fullName}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-gray-400">Unassigned</span>
              )}
            </div>

            {/* Updated */}
            <div className="w-20 text-right hidden sm:block">
              <span className="text-xs text-gray-500">
                {formatDate(ticket.updatedAt)}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="w-8 relative">
              {isHovered && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActionsFor(showActionsFor === ticket.id ? null : ticket.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              )}

              {/* Actions Dropdown */}
              {showActionsFor === ticket.id && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionsFor(null);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px] z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tickets/${ticket.id}`);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {permissions.canEditTicket(ticket) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/tickets/${ticket.id}/edit`);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Edit Ticket
                      </button>
                    )}
                    {permissions.canAssignTicket() && !ticket.assignee && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onQuickAction?.('assign', ticket.id);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Assign
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
