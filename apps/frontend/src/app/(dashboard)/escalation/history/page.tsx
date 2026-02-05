'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  TrendingUp, 
  User, 
  Calendar,
  FileText,
  Filter
} from 'lucide-react';
import { escalationService, EscalationHistory } from '@/lib/api/escalation.service';
import { Button } from '@/components/ui/Button';

export default function EscalationHistoryPage() {
  const router = useRouter();
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['escalation-history', filters],
    queryFn: () => escalationService.getAllHistory(filters),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDistanceToNow = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(date.toISOString());
  };

  const getEscalationColor = (level: number) => {
    if (level === 1) return 'bg-blue-100 text-blue-700';
    if (level === 2) return 'bg-yellow-100 text-yellow-700';
    if (level === 3) return 'bg-orange-100 text-orange-700';
    if (level === 4) return 'bg-red-100 text-red-700';
    return 'bg-purple-100 text-purple-700';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử Escalation</h1>
            <p className="text-sm text-gray-500 mt-1">
              Xem tất cả các lần leo thang ticket và chi tiết
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setFilters({ startDate: '', endDate: '' })}
          >
            Xóa
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Tổng Escalation</p>
          <p className="text-2xl font-bold text-gray-900">{history.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Cấp 1</p>
          <p className="text-2xl font-bold text-blue-600">
            {history.filter(h => h.toLevel === 1).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Cấp 2+</p>
          <p className="text-2xl font-bold text-orange-600">
            {history.filter(h => h.toLevel >= 2).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">Hôm nay</p>
          <p className="text-2xl font-bold text-green-600">
            {history.filter(h => {
              const today = new Date();
              const escalationDate = new Date(h.createdAt);
              return escalationDate.toDateString() === today.toDateString();
            }).length}
          </p>
        </div>
      </div>

      {/* History List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-500">Đang tải lịch sử...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Không tìm thấy lịch sử escalation</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.ticket?.ticketNumber} - {item.ticket?.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(item.createdAt))}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEscalationColor(item.fromLevel)}`}>
                        Từ C{item.fromLevel}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getEscalationColor(item.toLevel)}`}>
                        Đến C{item.toLevel}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-500">Leo thang bởi:</span>
                        <p className="font-medium text-gray-900">{item.escalatedBy}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-500">Leo thang đến:</span>
                        <p className="font-medium text-gray-900">
                          {item.escalatedToUser?.fullName || item.escalatedToRole || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <span className="text-gray-500">Ngày:</span>
                        <p className="font-medium text-gray-900">{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {item.reason && (
                    <div className="mt-3 flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <span className="text-sm text-gray-500">Lý do:</span>
                        <p className="text-sm text-gray-900">{item.reason}</p>
                      </div>
                    </div>
                  )}

                  {item.rule && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">Quy tắc: </span>
                      <span className="text-xs font-medium text-blue-600">{item.rule.name}</span>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/tickets/${item.ticketId}`)}
                  className="ml-4"
                >
                  Xem Ticket
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
