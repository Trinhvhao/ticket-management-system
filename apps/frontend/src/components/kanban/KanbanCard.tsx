'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ticket, TicketPriority } from '@/lib/types/ticket.types';
import { Clock, User, AlertCircle, CheckCircle2, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface KanbanCardProps {
  ticket: Ticket;
}

const priorityConfig = {
  [TicketPriority.HIGH]: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  [TicketPriority.MEDIUM]: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  [TicketPriority.LOW]: { color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
};

export default function KanbanCard({ ticket }: KanbanCardProps) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priority = ticket.priority as TicketPriority;
  const config = priorityConfig[priority] || priorityConfig[TicketPriority.MEDIUM];

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-drag-handle]')) return;
    router.push(`/tickets/${ticket.id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg border border-gray-200 p-3 mb-3 cursor-pointer hover:shadow-md transition-all ${
        isDragging ? 'shadow-xl ring-2 ring-blue-500' : ''
      }`}
      onClick={handleClick}
    >
      {/* Drag Handle */}
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          data-drag-handle
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-0.5 flex-shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                {ticket.title}
              </h4>
              <p className="text-xs text-gray-500">#{ticket.ticketNumber}</p>
            </div>
            
            {/* Priority Badge */}
            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color} ${config.border} border whitespace-nowrap flex-shrink-0`}>
              {ticket.priority}
            </span>
          </div>

          {/* Category */}
          {ticket.category && (
            <div className="flex items-center gap-1 mb-2">
              <span className="text-base">{ticket.category.icon}</span>
              <span className="text-xs text-gray-600 truncate">{ticket.category.name}</span>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
            {/* Assignee */}
            <div className="flex items-center gap-1 min-w-0 flex-1">
              {ticket.assignee ? (
                <>
                  <User className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{ticket.assignee.fullName}</span>
                </>
              ) : (
                <span className="text-gray-400">Unassigned</span>
              )}
            </div>

            {/* SLA Status */}
            {ticket.slaBreached ? (
              <div className="flex items-center gap-1 text-red-600 flex-shrink-0 ml-2">
                <AlertCircle className="w-3 h-3" />
                <span>SLA</span>
              </div>
            ) : ticket.dueDate && (
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <Clock className="w-3 h-3" />
                <span className="whitespace-nowrap">{new Date(ticket.dueDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
