'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Ticket {
  id: number;
  ticketNumber: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string | null;
  slaBreached?: boolean;
}

interface TicketCalendarProps {
  tickets: Ticket[];
  onDateClick?: (date: Date) => void;
}

const statusColors: Record<string, string> = {
  'New': 'bg-blue-500',
  'Assigned': 'bg-purple-500',
  'In_Progress': 'bg-yellow-500',
  'Pending': 'bg-orange-500',
  'Resolved': 'bg-green-500',
  'Closed': 'bg-gray-400',
};

const priorityBorders: Record<string, string> = {
  'High': 'border-l-4 border-l-red-500',
  'Medium': 'border-l-4 border-l-yellow-500',
  'Low': 'border-l-4 border-l-green-500',
};

export default function TicketCalendar({ tickets, onDateClick }: TicketCalendarProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get calendar data
  const { year, month, daysInMonth, firstDayOfMonth, today } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const today = new Date();
    
    return { year, month, daysInMonth, firstDayOfMonth, today };
  }, [currentDate]);

  // Group tickets by date
  const ticketsByDate = useMemo(() => {
    const grouped: Record<string, Ticket[]> = {};
    
    tickets.forEach(ticket => {
      if (ticket.dueDate) {
        const date = new Date(ticket.dueDate);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(ticket);
      }
    });
    
    return grouped;
  }, [tickets]);

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get tickets for a specific date
  const getTicketsForDate = (day: number): Ticket[] => {
    const key = `${year}-${month}-${day}`;
    return ticketsByDate[key] || [];
  };

  // Check if date is today
  const isToday = (day: number): boolean => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (day: number): boolean => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  // Handle date click
  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    onDateClick?.(date);
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const day = i - firstDayOfMonth + 1;
      const isValidDay = day > 0 && day <= daysInMonth;
      const dayTickets = isValidDay ? getTicketsForDate(day) : [];
      const hasTickets = dayTickets.length > 0;
      const hasSLABreach = dayTickets.some(t => t.slaBreached);

      days.push(
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.01 }}
          className={`min-h-[120px] border border-gray-200 p-2 ${
            !isValidDay ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
          } ${isToday(day) ? 'ring-2 ring-[#0052CC] ring-inset' : ''} ${
            isSelected(day) ? 'bg-blue-50' : ''
          } transition-all cursor-pointer`}
          onClick={() => isValidDay && handleDateClick(day)}
        >
          {isValidDay && (
            <>
              {/* Date number */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-semibold ${
                    isToday(day)
                      ? 'w-7 h-7 flex items-center justify-center rounded-full bg-[#0052CC] text-white'
                      : 'text-gray-700'
                  }`}
                >
                  {day}
                </span>
                {hasSLABreach && (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
              </div>

              {/* Tickets */}
              <div className="space-y-1">
                {dayTickets.slice(0, 3).map((ticket, idx) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/tickets/${ticket.id}`);
                    }}
                    className={`text-xs p-1.5 rounded ${priorityBorders[ticket.priority] || ''} bg-white hover:shadow-md transition-all cursor-pointer group`}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          statusColors[ticket.status] || 'bg-gray-400'
                        }`}
                      />
                      <span className="truncate text-gray-700 group-hover:text-[#0052CC] font-medium">
                        {ticket.ticketNumber}
                      </span>
                    </div>
                    <p className="truncate text-gray-600 mt-0.5 text-[10px]">
                      {ticket.title}
                    </p>
                  </motion.div>
                ))}
                {dayTickets.length > 3 && (
                  <div className="text-[10px] text-gray-500 text-center py-1">
                    +{dayTickets.length - 3} more
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0052CC] to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CalendarIcon className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">
                {monthNames[month]} {year}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {tickets.filter(t => t.dueDate).length} tickets scheduled
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 font-medium">Status:</span>
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1">
                <span className={`w-3 h-3 rounded-full ${color}`} />
                <span className="text-gray-600 text-xs">{status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-gray-600 text-xs">SLA Breach</span>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 bg-blue-50 overflow-hidden"
          >
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <div className="space-y-2">
                {getTicketsForDate(selectedDate.getDate()).map(ticket => (
                  <div
                    key={ticket.id}
                    onClick={() => router.push(`/tickets/${ticket.id}`)}
                    className={`p-3 bg-white rounded-lg ${priorityBorders[ticket.priority] || ''} hover:shadow-md transition-all cursor-pointer`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            statusColors[ticket.status] || 'bg-gray-400'
                          }`}
                        />
                        <span className="font-medium text-gray-900">
                          {ticket.ticketNumber}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      {ticket.slaBreached && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{ticket.title}</p>
                  </div>
                ))}
                {getTicketsForDate(selectedDate.getDate()).length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No tickets scheduled for this date
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
