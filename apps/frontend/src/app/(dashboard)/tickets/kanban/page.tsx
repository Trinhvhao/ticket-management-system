'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { toast } from 'react-hot-toast';
import { ticketsService } from '@/lib/api/tickets.service';
import { Ticket, TicketStatus } from '@/lib/types/ticket.types';
import KanbanColumn from '@/components/kanban/KanbanColumn';
import KanbanCard from '@/components/kanban/KanbanCard';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { 
  Loader2, 
  FileText, 
  UserCheck, 
  PlayCircle, 
  CheckCircle, 
  XCircle,
  LayoutGrid,
  List,
  Filter,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const COLUMNS = [
  {
    id: 'open',
    title: 'Open',
    statuses: [TicketStatus.NEW, TicketStatus.ASSIGNED],
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    icon: <FileText className="w-5 h-5 text-white" />,
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    statuses: [TicketStatus.IN_PROGRESS],
    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    icon: <PlayCircle className="w-5 h-5 text-white" />,
  },
  {
    id: 'pending',
    title: 'Pending',
    statuses: [TicketStatus.PENDING],
    color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    icon: <Clock className="w-5 h-5 text-white" />,
  },
  {
    id: 'done',
    title: 'Done',
    statuses: [TicketStatus.RESOLVED, TicketStatus.CLOSED],
    color: 'bg-gradient-to-r from-green-500 to-green-600',
    icon: <CheckCircle className="w-5 h-5 text-white" />,
  },
];

export default function KanbanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const permissions = usePermissions();
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  // Fetch tickets
  const { data: response, isLoading } = useQuery({
    queryKey: ['tickets', 'kanban'],
    queryFn: () => ticketsService.getAll({ limit: 1000 }),
  });

  const tickets = response?.tickets || [];

  // Filter tickets by priority
  const filteredTickets = useMemo(() => {
    if (filterPriority === 'all') return tickets;
    return tickets.filter(t => t.priority === filterPriority);
  }, [tickets, filterPriority]);

  // Group tickets by column (multiple statuses per column)
  const ticketsByColumn = useMemo(() => {
    const grouped: Record<string, Ticket[]> = {};
    
    COLUMNS.forEach(column => {
      grouped[column.id] = filteredTickets.filter(ticket => 
        column.statuses.includes(ticket.status as TicketStatus)
      );
    });

    return grouped;
  }, [filteredTickets]);

  // Update ticket status mutation with optimistic updates
  const updateStatusMutation = useMutation({
    mutationFn: ({ ticketId, newStatus }: { ticketId: number; newStatus: string }) =>
      ticketsService.changeStatus(ticketId, newStatus),
    onMutate: async ({ ticketId, newStatus }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ['tickets', 'kanban'] });

      // Snapshot the previous value
      const previousTickets = queryClient.getQueryData(['tickets', 'kanban']);

      // Optimistically update the ticket status
      queryClient.setQueryData(['tickets', 'kanban'], (old: any) => {
        if (!old?.tickets) return old;
        
        return {
          ...old,
          tickets: old.tickets.map((ticket: Ticket) =>
            ticket.id === ticketId
              ? { ...ticket, status: newStatus }
              : ticket
          ),
        };
      });

      // Return context with previous value for rollback
      return { previousTickets };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Ticket status updated');
    },
    onError: (error: any, variables, context) => {
      // Rollback to previous state on error
      if (context?.previousTickets) {
        queryClient.setQueryData(['tickets', 'kanban'], context.previousTickets);
      }
      
      const errorMessage = error.response?.data?.message || 'Failed to update ticket status';
      toast.error(errorMessage);
    },
  });

  // Drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find(t => t.id === event.active.id);
    setActiveTicket(ticket || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTicket(null);

    if (!over) return;

    const ticketId = active.id as number;
    const columnId = over.id as string;
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket) return;

    // Find the column and get the first status (default status for that column)
    const targetColumn = COLUMNS.find(col => col.id === columnId);
    if (!targetColumn) return;

    const newStatus = targetColumn.statuses[0]; // Use first status as default
    
    if (ticket.status === newStatus) return;

    // Check permission
    if (!permissions.canChangeTicketStatus(ticket)) {
      toast.error('You do not have permission to change ticket status');
      return;
    }

    // Update status
    updateStatusMutation.mutate({ ticketId, newStatus });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutGrid className="w-7 h-7 text-[#0052CC]" />
            Kanban Board
          </h1>
          <p className="text-gray-600 mt-1">Drag and drop tickets to change status</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* View Toggle */}
          <button
            onClick={() => router.push('/tickets')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <List className="w-4 h-4" />
            List View
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{col.title}</span>
              <span className="text-2xl font-bold text-gray-900">
                {ticketsByColumn[col.id]?.length || 0}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 overflow-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                id={column.id}
                tickets={ticketsByColumn[column.id] || []}
                title={column.title}
                color={column.color}
                icon={column.icon}
              />
            ))}
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeTicket ? (
              <div className="rotate-3 scale-105">
                <KanbanCard ticket={activeTicket} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
