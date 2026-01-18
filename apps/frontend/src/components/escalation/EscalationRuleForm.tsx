'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { 
  escalationService, 
  EscalationRule, 
  CreateEscalationRuleDto 
} from '@/lib/api/escalation.service';
import { categoriesService } from '@/lib/api/categories.service';
import { usersService } from '@/lib/api/users.service';
import { Button } from '@/components/ui/Button';

interface EscalationRuleFormProps {
  rule?: EscalationRule | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EscalationRuleForm({ rule, onClose, onSuccess }: EscalationRuleFormProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<CreateEscalationRuleDto>({
    name: '',
    description: '',
    triggerType: 'sla_breached',
    escalationLevel: 1,
    targetType: 'role',
    targetRole: 'Admin',
    notifyManager: true,
    isActive: true,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(true),
  });

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersService.getAll({ isActive: true }),
  });

  const users = usersData?.users || [];

  useEffect(() => {
    if (rule) {
      setFormData({
        name: rule.name,
        description: rule.description,
        priority: rule.priority,
        categoryId: rule.categoryId,
        triggerType: rule.triggerType,
        triggerHours: rule.triggerHours,
        escalationLevel: rule.escalationLevel,
        targetType: rule.targetType,
        targetRole: rule.targetRole,
        targetUserId: rule.targetUserId,
        notifyManager: rule.notifyManager,
        isActive: rule.isActive,
      });
    }
  }, [rule]);

  const createMutation = useMutation({
    mutationFn: (data: CreateEscalationRuleDto) => escalationService.createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalation-rules'] });
      onSuccess();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateEscalationRuleDto) => 
      escalationService.updateRule(rule!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalation-rules'] });
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name.trim()) {
      alert('Please enter a rule name');
      return;
    }

    if (formData.targetType === 'user' && !formData.targetUserId) {
      alert('Please select a target user');
      return;
    }

    if (formData.targetType === 'role' && !formData.targetRole) {
      alert('Please select a target role');
      return;
    }

    if ((formData.triggerType === 'no_assignment' || formData.triggerType === 'no_response') 
        && !formData.triggerHours) {
      alert('Please enter trigger hours');
      return;
    }

    if (rule) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const needsTriggerHours = 
    formData.triggerType === 'no_assignment' || 
    formData.triggerType === 'no_response';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {rule ? 'Edit Escalation Rule' : 'Create New Escalation Rule'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rule Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., High Priority SLA Breach"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe when this rule should trigger..."
            />
          </div>

          {/* Trigger Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trigger Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.triggerType}
              onChange={(e) => setFormData({ 
                ...formData, 
                triggerType: e.target.value as any,
                triggerHours: undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="sla_breached">SLA Breached</option>
              <option value="sla_at_risk">SLA At Risk (80%)</option>
              <option value="no_assignment">No Assignment After X Hours</option>
              <option value="no_response">No Response After X Hours</option>
            </select>
          </div>

          {/* Trigger Hours (conditional) */}
          {needsTriggerHours && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trigger After (Hours) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="168"
                value={formData.triggerHours || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  triggerHours: parseInt(e.target.value) 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Escalate if no {formData.triggerType === 'no_assignment' ? 'assignment' : 'response'} after this many hours
              </p>
            </div>
          )}

          {/* Escalation Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escalation Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.escalationLevel}
              onChange={(e) => setFormData({ 
                ...formData, 
                escalationLevel: parseInt(e.target.value) 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="1">Level 1 (First Escalation)</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
              <option value="4">Level 4</option>
              <option value="5">Level 5 (Highest)</option>
            </select>
          </div>

          {/* Target Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escalate To <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.targetType}
              onChange={(e) => setFormData({ 
                ...formData, 
                targetType: e.target.value as any,
                targetRole: e.target.value === 'role' ? 'Admin' : undefined,
                targetUserId: undefined
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="role">Role (Workload-based)</option>
              <option value="user">Specific User</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          {/* Target Role (conditional) */}
          {formData.targetType === 'role' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Role <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="IT_Staff">IT Staff</option>
                <option value="Admin">Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Will assign to user with least open tickets in this role
              </p>
            </div>
          )}

          {/* Target User (conditional) */}
          {formData.targetType === 'user' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target User <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.targetUserId || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  targetUserId: parseInt(e.target.value) 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a user...</option>
                {users
                  .filter(u => u.role === 'IT_Staff' || u.role === 'Admin')
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.fullName} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority Filter (Optional)
            </label>
            <select
              value={formData.priority || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                priority: e.target.value as any || undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low Only</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to apply to all priorities
            </p>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Filter (Optional)
            </label>
            <select
              value={formData.categoryId || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                categoryId: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to apply to all categories
            </p>
          </div>

          {/* Notify Manager */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notifyManager"
              checked={formData.notifyManager}
              onChange={(e) => setFormData({ 
                ...formData, 
                notifyManager: e.target.checked 
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="notifyManager" className="text-sm text-gray-700">
              Notify all Admins when escalated
            </label>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ 
                ...formData, 
                isActive: e.target.checked 
              })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Activate this rule immediately
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Saving...'
                : rule
                ? 'Update Rule'
                : 'Create Rule'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
