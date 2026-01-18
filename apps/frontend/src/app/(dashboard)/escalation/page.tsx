'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff,
  AlertTriangle,
  Clock,
  Users,
  TrendingUp,
  Play,
  History
} from 'lucide-react';
import { escalationService, EscalationRule } from '@/lib/api/escalation.service';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { Button } from '@/components/ui/Button';
import { EscalationRuleForm } from '@/components/escalation/EscalationRuleForm';

export default function EscalationPage() {
  const [selectedRule, setSelectedRule] = useState<EscalationRule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  
  const permissions = usePermissions();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['escalation-rules', filter],
    queryFn: () => escalationService.getRules(
      filter === 'all' ? {} : { isActive: filter === 'active' }
    ),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => escalationService.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalation-rules'] });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      escalationService.updateRule(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalation-rules'] });
    },
  });

  const triggerCheckMutation = useMutation({
    mutationFn: () => escalationService.triggerCheck(),
    onSuccess: (data) => {
      alert(`Manual check completed! ${data.escalatedCount} tickets escalated.`);
    },
  });

  const getTriggerTypeLabel = (type: string) => {
    const labels = {
      sla_at_risk: 'SLA At Risk',
      sla_breached: 'SLA Breached',
      no_assignment: 'No Assignment',
      no_response: 'No Response',
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTriggerTypeIcon = (type: string) => {
    const icons = {
      sla_at_risk: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      sla_breached: <AlertTriangle className="w-4 h-4 text-red-500" />,
      no_assignment: <Users className="w-4 h-4 text-blue-500" />,
      no_response: <Clock className="w-4 h-4 text-orange-500" />,
    };
    return icons[type as keyof typeof icons] || null;
  };

  const getTargetTypeLabel = (rule: EscalationRule) => {
    if (rule.targetType === 'role') return `Role: ${rule.targetRole}`;
    if (rule.targetType === 'user') return `User: ${rule.targetUser?.fullName}`;
    return 'Manager';
  };

  if (!permissions.canManageSLA()) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">You don't have permission to manage escalation rules.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Escalation Management</h1>
            <p className="text-sm text-gray-500 mt-1">
              Auto-escalate tickets based on SLA, assignment, and response time
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/escalation/history')}
              variant="outline"
            >
              <History className="w-4 h-4 mr-2" />
              View History
            </Button>
            <Button
              onClick={() => triggerCheckMutation.mutate()}
              disabled={triggerCheckMutation.isPending}
              variant="outline"
            >
              <Play className="w-4 h-4 mr-2" />
              {triggerCheckMutation.isPending ? 'Checking...' : 'Run Check Now'}
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Rule
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Rules</p>
                <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Rules</p>
                <p className="text-2xl font-bold text-green-600">
                  {rules.filter(r => r.isActive).length}
                </p>
              </div>
              <Power className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">SLA Rules</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {rules.filter(r => r.triggerType.includes('sla')).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Time-based</p>
                <p className="text-2xl font-bold text-orange-600">
                  {rules.filter(r => r.triggerType === 'no_response' || r.triggerType === 'no_assignment').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Rules
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'active'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Active Only
        </button>
        <button
          onClick={() => setFilter('inactive')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'inactive'
              ? 'bg-gray-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Inactive Only
        </button>
      </div>

      {/* Rules List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Loading rules...</p>
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No escalation rules found</p>
          <Button onClick={() => setShowForm(true)} className="mt-4">
            Create First Rule
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTriggerTypeIcon(rule.triggerType)}
                    <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rule.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {rule.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      Level {rule.escalationLevel}
                    </span>
                  </div>

                  {rule.description && (
                    <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                  )}

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Trigger:</span>
                      <p className="font-medium text-gray-900">
                        {getTriggerTypeLabel(rule.triggerType)}
                      </p>
                    </div>
                    {rule.triggerHours && (
                      <div>
                        <span className="text-gray-500">After:</span>
                        <p className="font-medium text-gray-900">{rule.triggerHours}h</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Target:</span>
                      <p className="font-medium text-gray-900">{getTargetTypeLabel(rule)}</p>
                    </div>
                    {rule.priority && (
                      <div>
                        <span className="text-gray-500">Priority:</span>
                        <p className="font-medium text-gray-900">{rule.priority}</p>
                      </div>
                    )}
                    {rule.category && (
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium text-gray-900">{rule.category.name}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Notify Manager:</span>
                      <p className="font-medium text-gray-900">
                        {rule.notifyManager ? 'Yes' : 'No'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => toggleActiveMutation.mutate({ 
                      id: rule.id, 
                      isActive: !rule.isActive 
                    })}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title={rule.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {rule.isActive ? (
                      <PowerOff className="w-4 h-4" />
                    ) : (
                      <Power className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRule(rule);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this rule?')) {
                        deleteMutation.mutate(rule.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <EscalationRuleForm
          rule={selectedRule}
          onClose={() => {
            setShowForm(false);
            setSelectedRule(null);
          }}
          onSuccess={() => {
            // Success handled by form
          }}
        />
      )}
    </div>
  );
}
