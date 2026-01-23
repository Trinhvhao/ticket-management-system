'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { knowledgeService, ArticleFilters } from '@/lib/api/knowledge.service';
import { categoriesService } from '@/lib/api/categories.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole } from '@/lib/types/auth.types';
import {
  Plus,
  Search,
  BookOpen,
  Eye,
  ThumbsUp,
  Calendar,
  Tag,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function KnowledgePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [filters, setFilters] = useState<ArticleFilters>({ page: 1, limit: 12, isPublished: true });
  const [searchQuery, setSearchQuery] = useState('');

  const canCreate = user?.role === UserRole.ADMIN || user?.role === UserRole.IT_STAFF;

  const { data: articlesData, isLoading } = useQuery({
    queryKey: ['knowledge', filters],
    queryFn: () => knowledgeService.getAll(filters),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getActive(),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">Find solutions and helpful articles</p>
        </div>
        {canCreate && (
          <button
            onClick={() => router.push('/knowledge/new')}
            className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>New Article</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.categoryId || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value ? Number(e.target.value) : undefined, page: 1 }))}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories?.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </form>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : !articlesData?.articles?.length ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-500 mb-6">
            {filters.search ? 'Try different search terms' : 'Knowledge base is empty'}
          </p>
          {canCreate && (
            <button
              onClick={() => router.push('/knowledge/new')}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              <span>Create First Article</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlesData.articles.map((article) => (
              <div
                key={article.id}
                onClick={() => router.push(`/knowledge/${article.id}`)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {article.category?.name || 'General'}
                  </span>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span className="flex items-center"><Eye className="w-4 h-4 mr-1" />{article.viewCount}</span>
                    <span className="flex items-center"><ThumbsUp className="w-4 h-4 mr-1" />{article.helpfulVotes}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                  {article.tags && (() => {
                    try {
                      let tagsArray: string[] = [];
                      const tags = article.tags as any;
                      if (typeof tags === 'string') {
                        if (tags.trim().startsWith('[')) {
                          tagsArray = JSON.parse(tags);
                        } else {
                          tagsArray = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
                        }
                      } else if (Array.isArray(tags)) {
                        tagsArray = tags;
                      }
                      return tagsArray.length > 0 ? (
                        <div className="flex items-center space-x-1">
                          <Tag className="w-3.5 h-3.5" />
                          <span>{tagsArray.slice(0, 2).join(', ')}</span>
                        </div>
                      ) : null;
                    } catch (e) {
                      const tags = article.tags as any;
                      if (typeof tags === 'string') {
                        const tagsArray = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
                        return tagsArray.length > 0 ? (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3.5 h-3.5" />
                            <span>{tagsArray.slice(0, 2).join(', ')}</span>
                          </div>
                        ) : null;
                      }
                      return null;
                    }
                  })()}
                </div>
              </div>
            ))}
          </div>

          {articlesData.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                disabled={articlesData.page === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600">Page {articlesData.page} of {articlesData.totalPages}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                disabled={articlesData.page === articlesData.totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
