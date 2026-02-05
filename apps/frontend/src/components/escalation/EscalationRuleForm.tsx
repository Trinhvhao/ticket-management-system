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
      alert('Vui lòng nhập tên quy tắc');
      return;
    }

    if (formData.targetType === 'user' && !formData.targetUserId) {
      alert('Vui lòng chọn người dùng đích');
      return;
    }

    if (formData.targetType === 'role' && !formData.targetRole) {
      alert('Vui lòng chọn vai trò đích');
      return;
    }

    if ((formData.triggerType === 'no_assignment' || formData.triggerType === 'no_response') 
        && !formData.triggerHours) {
      alert('Vui lòng nhập số giờ kích hoạt');
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
            {rule ? 'Sửa Quy tắc Escalation' : 'Tạo Quy tắc Escalation Mới'}
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
              Tên Quy tắc <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="VD: Vi phạm SLA Ưu tiên Cao"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Mô tả khi nào quy tắc này được kích hoạt..."
            />
          </div>

          {/* Trigger Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại Kích hoạt <span className="text-red-500">*</span>
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
              <option value="sla_breached">Vi phạm SLA</option>
              <option value="sla_at_risk">SLA có Rủi ro (80%)</option>
              <option value="no_assignment">Chưa Phân công sau X giờ</option>
              <option value="no_response">Chưa Phản hồi sau X giờ</option>
            </select>
          </div>

          {/* Trigger Hours (conditional) */}
          {needsTriggerHours && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kích hoạt Sau (Giờ) <span className="text-red-500">*</span>
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
                placeholder="VD: 2"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Leo thang nếu không có {formData.triggerType === 'no_assignment' ? 'phân công' : 'phản hồi'} sau số giờ này
              </p>
            </div>
          )}

          {/* Escalation Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cấp Escalation <span className="text-red-500">*</span>
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
              <option value="1">Cấp 1 (Leo thang Đầu tiên)</option>
              <option value="2">Cấp 2</option>
              <option value="3">Cấp 3</option>
              <option value="4">Cấp 4</option>
              <option value="5">Cấp 5 (Cao nhất)</option>
            </select>
          </div>

          {/* Target Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leo thang Đến <span className="text-red-500">*</span>
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
              <option value="role">Vai trò (Dựa trên khối lượng)</option>
              <option value="user">Người dùng Cụ thể</option>
              <option value="manager">Quản lý</option>
            </select>
          </div>

          {/* Target Role (conditional) */}
          {formData.targetType === 'role' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò Đích <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="IT_Staff">Nhân viên IT</option>
                <option value="Admin">Admin</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Sẽ phân công cho người có ít ticket mở nhất trong vai trò này
              </p>
            </div>
          )}

          {/* Target User (conditional) */}
          {formData.targetType === 'user' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Người dùng Đích <span className="text-red-500">*</span>
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
                <option value="">Chọn người dùng...</option>
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
              Lọc Độ ưu tiên (Tùy chọn)
            </label>
            <select
              value={formData.priority || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                priority: e.target.value as any || undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả Độ ưu tiên</option>
              <option value="High">Chỉ Cao</option>
              <option value="Medium">Chỉ Trung bình</option>
              <option value="Low">Chỉ Thấp</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Để trống để áp dụng cho tất cả độ ưu tiên
            </p>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lọc Danh mục (Tùy chọn)
            </label>
            <select
              value={formData.categoryId || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                categoryId: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả Danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Để trống để áp dụng cho tất cả danh mục
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
              Thông báo tất cả Admin khi leo thang
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
              Kích hoạt quy tắc này ngay lập tức
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
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Đang lưu...'
                : rule
                ? 'Cập nhật Quy tắc'
                : 'Tạo Quy tắc'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
