'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { slaService, SlaRule, CreateSlaRuleRequest } from '@/lib/api/sla.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import {
  Clock,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Shield,
  AlertTriangle,
  X,
  Check,
} from 'lucide-react';

export default function SlaPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<SlaRule | null>(null);
  const [formData, setFormData] = useState<CreateSlaRuleRequest>({
    priority: 'Medium',
    responseTimeHours: 4,
    resolutionTimeHours: 24,
  });

  const isAdmin = user?.role === UserRole.ADMIN;

  if (user?.role === UserRole.EMPLOYEE) {
    return (
      <div className="text-center py-20">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('sla.accessDenied')}</h2>
        <p className="text-gray-500">{t('sla.employeeRestriction')}</p>
      </div>
    );
  }

  const { data: rules, isLoading } = useQuery({
    queryKey: ['sla-rules'],
    queryFn: () => slaService.getRules(),
  });

  const { data: atRiskTickets } = useQuery({
    queryKey: ['sla-at-risk'],
    queryFn: () => slaService.getAtRiskTickets(),
  });

  const { data: breachedTickets } = useQuery({
    queryKey: ['sla-breached'],
    queryFn: () => slaService.getBreachedTickets(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSlaRuleRequest) => slaService.createRule(data),
    onSuccess: () => {
      toast.success(t('sla.ruleCreated'));
      queryClient.invalidateQueries({ queryKey: ['sla-rules'] });
      closeModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t('sla.createFailed')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSlaRuleRequest> }) =>
      slaService.updateRule(id, data),
    onSuccess: () => {
      toast.success(t('sla.ruleUpdated'));
      queryClient.invalidateQueries({ queryKey: ['sla-rules'] });
      closeModal();
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t('sla.updateFailed')),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => slaService.deleteRule(id),
    onSuccess: () => {
      toast.success(t('sla.ruleDeleted'));
      queryClient.invalidateQueries({ queryKey: ['sla-rules'] });
    },
    onError: (error: any) => toast.error(error.response?.data?.message || t('sla.deleteFailed')),
  });

  const openModal = (rule?: SlaRule) => {
    if (rule) {
      setEditingRule(rule);
      setFormData({
        priority: rule.priority,
        responseTimeHours: rule.responseTimeHours,
        resolutionTimeHours: rule.resolutionTimeHours,
      });
    } else {
      setEditingRule(null);
      setFormData({ priority: 'Medium', responseTimeHours: 4, resolutionTimeHours: 24 });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRule(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingRule) {
      updateMutation.mutate({ id: editingRule.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const priorityColors: Record<string, string> = {
    'High': 'bg-red-100 text-red-700',
    'Medium': 'bg-yellow-100 text-yellow-700',
    'Low': 'bg-green-100 text-green-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('sla.title')}</h1>
          <p className="text-gray-500 mt-1">{t('sla.description')}</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>{t('sla.addRule')}</span>
          </button>
        )}
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">{t('sla.atRiskTickets')}</h3>
              <p className="text-2xl font-bold text-yellow-600">{atRiskTickets?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">{t('sla.breachedTickets')}</h3>
              <p className="text-2xl font-bold text-red-600">{breachedTickets?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SLA Rules */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t('sla.rules')}</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : !rules?.length ? (
          <div className="text-center py-20">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('sla.noRules')}</h3>
            {isAdmin && (
              <button onClick={() => openModal()} className="text-blue-600 hover:text-blue-700 font-medium">
                {t('sla.createFirstRule')}
              </button>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('sla.priority')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('sla.responseTime')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('sla.resolutionTime')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('common.status')}</th>
                {isAdmin && <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">{t('common.actions')}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${priorityColors[rule.priority]}`}>
                      {t(`priority.${rule.priority}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rule.responseTimeHours} {t('sla.hours')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{rule.resolutionTimeHours} {t('sla.hours')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                      rule.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {rule.isActive ? t('common.active') : t('common.inactive')}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openModal(rule)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(t('sla.deleteConfirm'))) deleteMutation.mutate(rule.id);
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingRule ? t('sla.editRule') : t('sla.newRule')}
              </h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('sla.priority')} *</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High">{t('priority.High')}</option>
                  <option value="Medium">{t('priority.Medium')}</option>
                  <option value="Low">{t('priority.Low')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('sla.responseTimeHours')} *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.responseTimeHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, responseTimeHours: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('sla.resolutionTimeHours')} *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.resolutionTimeHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, resolutionTimeHours: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700 hover:text-gray-900">
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {editingRule ? t('common.update') : t('common.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
