'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeService, CreateArticleRequest } from '@/lib/api/knowledge.service';
import { categoriesService } from '@/lib/api/categories.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Save, Loader2, Shield, X, Plus } from 'lucide-react';

export default function EditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const articleId = Number(params.id);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState<CreateArticleRequest>({
    title: '',
    content: '',
    categoryId: undefined,
    tags: [],
    isPublished: false,
  });

  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.IT_STAFF;

  const { data: article, isLoading } = useQuery({
    queryKey: ['knowledge', articleId],
    queryFn: () => knowledgeService.getById(articleId),
    enabled: !!articleId,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getActive(),
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        categoryId: article.categoryId || undefined,
        tags: article.tags || [],
        isPublished: article.isPublished,
      });
    }
  }, [article]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateArticleRequest>) => knowledgeService.update(articleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', articleId] });
      queryClient.invalidateQueries({ queryKey: ['knowledge'] });
      toast.success('Article updated successfully');
      router.push(`/knowledge/${articleId}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update article');
    },
  });

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Tiêu đề là bắt buộc');
      return;
    }
    if (!formData.content.trim()) {
      toast.error('Nội dung là bắt buộc');
      return;
    }

    updateMutation.mutate(formData);
  };

  if (!canEdit) {
    return (
      <div className="text-center py-20">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Truy cập Bị từ chối</h2>
        <p className="text-gray-500">Bạn không có quyền chỉnh sửa bài viết.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sửa Bài viết</h1>
          <p className="text-gray-500">Cập nhật nội dung bài viết</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tiêu đề bài viết"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn danh mục</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={formData.isPublished ? 'published' : 'draft'}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.value === 'published' }))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thẻ</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Thêm thẻ"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={15}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Viết nội dung bài viết tại đây... (Hỗ trợ HTML)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Bạn có thể sử dụng thẻ HTML để định dạng</p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Lưu Thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
