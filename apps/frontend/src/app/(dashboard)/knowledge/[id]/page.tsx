'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { knowledgeService } from '@/lib/api/knowledge.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
import { toast } from 'react-hot-toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  User,
  Tag,
  Loader2,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const articleId = Number(params.id);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.IT_STAFF;

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['knowledge', articleId],
    queryFn: () => knowledgeService.getById(articleId),
    enabled: !!articleId,
  });

  const voteMutation = useMutation({
    mutationFn: (helpful: boolean) => knowledgeService.vote(articleId, helpful),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge', articleId] });
      setHasVoted(true);
      toast.success('Thank you for your feedback!');
    },
    onError: () => toast.error('Failed to submit vote'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => knowledgeService.delete(articleId),
    onSuccess: () => {
      toast.success('Article deleted successfully');
      router.push('/knowledge');
    },
    onError: () => toast.error('Failed to delete article'),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Article Not Found</h2>
        <button onClick={() => router.push('/knowledge')} className="text-blue-600 hover:underline">
          Back to Knowledge Base
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.push('/knowledge')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Knowledge Base</span>
              {article.category && (
                <>
                  <span>/</span>
                  <span>{article.category.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push(`/knowledge/${articleId}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          {/* Title & Meta */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{article.author?.fullName || 'Unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{article.viewCount} views</span>
              </div>
              {!article.isPublished && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  Draft
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {article.tags && (
            <div className="flex flex-wrap gap-2 mb-8">
              {(() => {
                try {
                  // Try to parse as JSON array first
                  if (typeof article.tags === 'string') {
                    // Check if it looks like JSON
                    if (article.tags.trim().startsWith('[')) {
                      return JSON.parse(article.tags);
                    }
                    // Otherwise split by comma
                    return article.tags.split(',').map(t => t.trim()).filter(Boolean);
                  }
                  // Already an array
                  if (Array.isArray(article.tags)) {
                    return article.tags;
                  }
                  return [];
                } catch (e) {
                  // If JSON parse fails, split by comma
                  if (typeof article.tags === 'string') {
                    return article.tags.split(',').map(t => t.trim()).filter(Boolean);
                  }
                  return [];
                }
              })().map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-blue max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Feedback Section */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Was this article helpful?</p>
              <p className="text-sm text-gray-500">
                {article.helpfulVotes} found this helpful • {article.notHelpfulVotes} did not
              </p>
            </div>
            {!hasVoted ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => voteMutation.mutate(true)}
                  disabled={voteMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 disabled:opacity-50"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Yes
                </button>
                <button
                  onClick={() => voteMutation.mutate(false)}
                  disabled={voteMutation.isPending}
                  className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  No
                </button>
              </div>
            ) : (
              <span className="text-green-600 font-medium">Thanks for your feedback!</span>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Article</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this article? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
