'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '@/lib/api/users.service';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { TicketStatus } from '@/lib/types/ticket.types';
import { UserRole } from '@/lib/types/auth.types';
import { 
  UserCheck, 
  RefreshCw, 
  Trash2, 
  X,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BulkActionBarProps {
  selectedCount: number;
  onAssign: (assigneeId: number) => void;
  onStatusChange: (status: TicketStatus) => void;
  onDelete: () => void;
  onClear: () => void;
}

export default function BulkActionBar({
  selectedCount,
  onAssign,
  onStatusChange,
  onDelete,
  onClear,
}: BulkActionBarProps) {
  const permissions = usePermissions();
  const [showAssignMenu, setShowAssignMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Fetch IT Staff for assignment
  const { data: usersData } = useQuery({
    queryKey: ['users', 'it-staff'],
    queryFn: () => usersService.getAll({ role: UserRole.IT_STAFF }),
    enabled: permissions.canAssignTicket(),
  });

  const users = usersData?.users || [];

  const statusOptions = [
    { value: TicketStatus.ASSIGNED, label: 'Assigned', color: 'text-purple-600' },
    { value: TicketStatus.IN_PROGRESS, label: 'In Progress', color: 'text-orange-600' },
    { value: TicketStatus.RESOLVED, label: 'Resolved', color: 'text-green-600' },
    { value: TicketStatus.CLOSED, label: 'Closed', color: 'text-gray-600' },
  ];

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 px-6 py-4 flex items-center gap-4">
            {/* Selected Count */}
            <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
              <div className="w-8 h-8 bg-[#0052CC] text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {selectedCount}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {selectedCount === 1 ? 'ticket selected' : 'tickets selected'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Assign Button */}
              {permissions.canAssignTicket() && (
                <div className="relative">
                  <button
                    onClick={() => setShowAssignMenu(!showAssignMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                  >
                    <UserCheck className="w-4 h-4" />
                    Assign
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showAssignMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowAssignMenu(false)}
                      />
                      <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-20">
                        {users.length === 0 ? (
                          <div className="px-4 py-2 text-sm text-gray-500">
                            No IT Staff available
                          </div>
                        ) : (
                          users.map((user: any) => (
                            <button
                              key={user.id}
                              onClick={() => {
                                onAssign(user.id);
                                setShowAssignMenu(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                            >
                              <div className="font-medium text-gray-900">{user.fullName}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Status Button */}
              {permissions.canChangeTicketStatus() && (
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Status
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showStatusMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowStatusMenu(false)}
                      />
                      <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[180px] z-20">
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              onStatusChange(option.value);
                              setShowStatusMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <span className={`font-medium ${option.color}`}>
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Delete Button */}
              {permissions.canDeleteTicket() && (
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>

            {/* Clear Button */}
            <button
              onClick={onClear}
              className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Clear selection"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Warning for mixed permissions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-lg text-xs">
              <AlertCircle className="w-3 h-3" />
              Some actions may fail due to permissions
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
