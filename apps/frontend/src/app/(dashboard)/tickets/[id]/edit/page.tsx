'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ticketsService } from '@/lib/api/tickets.service';
import { categoriesService, Category } from '@/lib/api/categories.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
import { TicketPriority } from '@/lib/types/ticket.types';
import { ArrowLeft, Loader2, Save, AlertCircle } from 'lucide-react';

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const ticketId = Number(params.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium' as TicketPriority,
    categoryId: 0,
  });

  // Fetch ticket
  const { data: ticket, isLoading: ticketLoading, error: ticketError } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsService.getById(ticketId),
    enabled: !!ticketId,
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAll(),
  });

  // Populate form when ticket loads
  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority as TicketPriority,
        categoryId: ticket.categoryId,
      });
    }
  }, [ticket]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: () => ticketsService.update(ticketId, {
      ...formData,
      priority: formData.priority as TicketPriority,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      toast.success('Đã cập nhật ticket');
      router.push(`/tickets/${ticketId}`);
    },
    onError: () => toast.error('Không thể cập nhật ticket'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.categoryId) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    updateMutation.mutate();
  };

  // Check permissions
  const isOwner = ticket?.submitterId === user?.id;
  const isITStaffOrAdmin = user?.role === UserRole.IT_STAFF || user?.role === UserRole.ADMIN;
  const canEdit = (isOwner || isITStaffOrAdmin) && ticket?.status !== 'Closed';

  if (ticketLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
      </div>
    );
  }

  if (ticketError || !ticket) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy ticket</h2>
        <button onClick={() => router.push('/tickets')} className="text-[#0052CC] hover:underline">
          ← Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Không có quyền chỉnh sửa</h2>
        <p className="text-gray-600 mb-4">Bạn không có quyền chỉnh sửa ticket này hoặc ticket đã đóng.</p>
        <button onClick={() => router.push(`/tickets/${ticketId}`)} className="text-[#0052CC] hover:underline">
          ← Quay lại chi tiết ticket
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.push(`/tickets/${ticketId}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa Ticket #{ticket.id}</h1>
          <p className="text-gray-600">Cập nhật thông tin ticket</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
            placeholder="Nhập tiêu đề ticket"
          />
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
            >
              <option value={0}>Chọn danh mục</option>
              {categories.map((cat: Category) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức độ ưu tiên <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent"
            >
              <option value={TicketPriority.LOW}>Thấp</option>
              <option value={TicketPriority.MEDIUM}>Trung bình</option>
              <option value={TicketPriority.HIGH}>Cao</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả chi tiết <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none"
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.push(`/tickets/${ticketId}`)}
            className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-[#0052CC] text-white rounded-lg hover:bg-[#0047B3] disabled:opacity-50 transition-colors"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}
