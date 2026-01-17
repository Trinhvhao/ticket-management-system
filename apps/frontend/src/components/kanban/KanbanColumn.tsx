'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Ticket } from '@/lib/types/ticket.types';
import KanbanCard from './KanbanCard';
import { motion } from 'framer-motion';

interface KanbanColumnProps {
  id: string;
  tickets: Ticket[];
  title: string;
  color: string;
  icon: React.ReactNode;
}

export default function KanbanColumn({ id, tickets, title, color, icon }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`rounded-t-xl p-4 ${color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-semibold text-white text-base">{title}</h3>
          </div>
          <span className="bg-white/20 text-white px-2.5 py-1 rounded-full text-sm font-medium">
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={`bg-gray-50 rounded-b-xl p-4 min-h-[500px] max-h-[calc(100vh-400px)] overflow-y-auto transition-colors ${
          isOver ? 'bg-blue-50 ring-2 ring-blue-400' : ''
        }`}
      >
        <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tickets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No tickets</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {tickets.map((ticket) => (
                <KanbanCard key={ticket.id} ticket={ticket} />
              ))}
            </motion.div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
