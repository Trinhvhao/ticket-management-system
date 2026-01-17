'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ticketsService } from '@/lib/api/tickets.service';
import { commentsService, CommentType, Comment } from '@/lib/api/comments.service';
import { attachmentsService, Attachment } from '@/lib/api/attachments.service';
import { ticketHistoryService, TicketHistory } from '@/lib/api/ticket-history.service';
import { usersService } from '@/lib/api/users.service';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UserRole, User } from '@/lib/types/auth.types';
import { usePermissions } from '@/lib/hooks/usePermissions';
import {
  ArrowLeft, Loader2, Clock, User as UserIcon, Calendar, Tag, AlertCircle, CheckCircle,
  Play, XCircle, RotateCcw, Star, MessageSquare, Paperclip, Edit2, Trash2,
  Send, Upload, Download, UserPlus, History, X, Lock, Building,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  'New': 'bg-blue-100 text-blue-700 border-blue-200',
  'Assigned': 'bg-purple-100 text-purple-700 border-purple-200',
  'In Progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Pending': 'bg-orange-100 text-orange-700 border-orange-200',
  'Resolved': 'bg-green-100 text-green-700 border-green-200',
  'Closed': 'bg-gray-100 text-gray-700 border-gray-200',
};

const priorityColors: Record<string, string> = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low': 'bg-green-100 text-green-700 border-green-200',
};

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const permissions = usePermissions();
  const ticketId = Number(params.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');

  // Comment states
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<CommentType>(CommentType.PUBLIC);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  // Tab state
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments' | 'history'>('comments');

  // Fetch ticket
  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ['ticket', ticketId],
    queryFn: () => ticketsService.getById(ticketId),
    enabled: !!ticketId,
  });

  // Fetch comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => commentsService.getByTicket(ticketId),
    enabled: !!ticketId,
  });

  // Fetch attachments
  const { data: attachments = [], isLoading: attachmentsLoading } = useQuery({
    queryKey: ['attachments', ticketId],
    queryFn: () => attachmentsService.getByTicket(ticketId),
    enabled: !!ticketId,
  });

  // Fetch history
  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: ['ticket-history', ticketId],
    queryFn: () => ticketHistoryService.getByTicket(ticketId),
    enabled: !!ticketId && activeTab === 'history',
  });

  // Fetch IT staff for assignment
  const { data: itStaffData } = useQuery({
    queryKey: ['it-staff'],
    queryFn: () => usersService.getAll({ role: UserRole.IT_STAFF }),
    enabled: showAssignModal && permissions.canAssignTicket(),
  });

  const itStaff = itStaffData?.users || [];

  // Permission checks (legacy - keeping for backward compatibility)
  const isITStaffOrAdmin = user?.role === UserRole.IT_STAFF || user?.role === UserRole.ADMIN;
  const isAdmin = user?.role === UserRole.ADMIN;
  const isOwner = ticket?.submitterId === user?.id;
  const isAssignee = ticket?.assigneeId === user?.id;

  // Mutations
  const startProgressMutation = useMutation({
    mutationFn: () => ticketsService.startProgress(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticket-history', ticketId] });
      toast.success('Đã bắt đầu xử lý ticket');
    },
    onError: () => toast.error('Không thể bắt đầu xử lý ticket'),
  });

  const resolveMutation = useMutation({
    mutationFn: (notes: string) => ticketsService.resolve(ticketId, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticket-history', ticketId] });
      setShowResolveModal(false);
      setResolutionNotes('');
      toast.success('Ticket đã được giải quyết');
    },
    onError: () => toast.error('Không thể giải quyết ticket'),
  });

  const closeMutation = useMutation({
    mutationFn: () => ticketsService.close(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticket-history', ticketId] });
      toast.success('Ticket đã được đóng');
    },
    onError: () => toast.error('Không thể đóng ticket'),
  });

  const reopenMutation = useMutation({
    mutationFn: () => ticketsService.reopen(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticket-history', ticketId] });
      toast.success('Ticket đã được mở lại');
    },
    onError: () => toast.error('Không thể mở lại ticket'),
  });

  const assignMutation = useMutation({
    mutationFn: (assigneeId: number) => ticketsService.assign(ticketId, { assigneeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticket-history', ticketId] });
      setShowAssignModal(false);
      setSelectedAssignee(null);
      toast.success('Đã gán ticket thành công');
    },
    onError: () => toast.error('Không thể gán ticket'),
  });

  const rateMutation = useMutation({
    mutationFn: () => ticketsService.rate(ticketId, { rating, feedback: ratingFeedback }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] });
      setShowRatingModal(false);
      setRating(0);
      setRatingFeedback('');
      toast.success('Cảm ơn bạn đã đánh giá!');
    },
    onError: () => toast.error('Không thể gửi đánh giá'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => ticketsService.delete(ticketId),
    onSuccess: () => {
      toast.success('Đã xóa ticket');
      router.push('/tickets');
    },
    onError: () => toast.error('Không thể xóa ticket'),
  });

  // Comment mutations
  const addCommentMutation = useMutation({
    mutationFn: () => commentsService.create({ ticketId, content: newComment, type: commentType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticket-history', ticketId] });
      setNewComment('');
      toast.success('Đã thêm bình luận');
    },
    onError: () => toast.error('Không thể thêm bình luận'),
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) => 
      commentsService.update(id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
      setEditingCommentId(null);
      setEditingContent('');
      toast.success('Đã cập nhật bình luận');
    },
    onError: () => toast.error('Không thể cập nhật bình luận'),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (id: number) => commentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
      toast.success('Đã xóa bình luận');
    },
    onError: () => toast.error('Không thể xóa bình luận'),
  });

  // Attachment mutations
  const uploadAttachmentMutation = useMutation({
    mutationFn: (file: File) => attachmentsService.upload(ticketId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', ticketId] });
      queryClient.invalidateQueries({ queryKey: ['ticket-history', ticketId] });
      toast.success('Đã tải lên file');
    },
    onError: () => toast.error('Không thể tải lên file'),
  });

  const deleteAttachmentMutation = useMutation({
    mutationFn: (id: number) => attachmentsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', ticketId] });
      toast.success('Đã xóa file');
    },
    onError: () => toast.error('Không thể xóa file'),
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAttachmentMutation.mutate(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      const blob = await attachmentsService.download(attachment.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.originalName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      toast.error('Không thể tải xuống file');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#0052CC]" />
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy ticket</h2>
        <p className="text-gray-600 mb-4">Ticket không tồn tại hoặc bạn không có quyền xem.</p>
        <button onClick={() => router.push('/tickets')} className="text-[#0052CC] hover:underline">
          ← Quay lại danh sách
        </button>
      </div>
    );
  }


  // Determine available actions based on permissions
  const canEdit = ticket && permissions.canEditTicket(ticket);
  const canDelete = permissions.canDeleteTicket();
  const canAssign = permissions.canAssignTicket();
  const canRate = ticket && permissions.canRateTicket(ticket);
  const canComment = ticket && permissions.canAddComment(ticket);
  
  // Status-based actions (with permission checks)
  const canStartProgress = isAssignee && ticket.status === 'Assigned' && permissions.canChangeTicketStatus(ticket);
  const canResolve = isAssignee && ['Assigned', 'In Progress', 'Pending'].includes(ticket.status) && permissions.canChangeTicketStatus(ticket);
  const canClose = (isOwner || isAdmin) && ticket.status === 'Resolved' && permissions.canChangeTicketStatus(ticket);
  const canReopen = (isOwner || isITStaffOrAdmin) && ['Resolved', 'Closed'].includes(ticket.status) && permissions.canChangeTicketStatus(ticket);
  const canUpload = ticket.status !== 'Closed' && canComment;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/tickets')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">#{ticket.id}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[ticket.status] || 'bg-gray-100'}`}>
                {ticket.status}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[ticket.priority] || 'bg-gray-100'}`}>
                {ticket.priority}
              </span>
            </div>
            <h2 className="text-lg text-gray-700 mt-1">{ticket.title}</h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={() => router.push(`/tickets/${ticketId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa
            </button>
          )}
          {canStartProgress && (
            <button
              onClick={() => startProgressMutation.mutate()}
              disabled={startProgressMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50"
            >
              <Play className="w-4 h-4" />
              Bắt đầu xử lý
            </button>
          )}
          {canResolve && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <CheckCircle className="w-4 h-4" />
              Giải quyết
            </button>
          )}
          {canClose && (
            <button
              onClick={() => closeMutation.mutate()}
              disabled={closeMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              Đóng ticket
            </button>
          )}
          {canReopen && (
            <button
              onClick={() => reopenMutation.mutate()}
              disabled={reopenMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Mở lại
            </button>
          )}
          {canAssign && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <UserPlus className="w-4 h-4" />
              Gán
            </button>
          )}
          {canRate && (
            <button
              onClick={() => setShowRatingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white rounded-lg hover:bg-[#0047B3]"
            >
              <Star className="w-4 h-4" />
              Đánh giá
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Mô tả</h3>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </div>
            {ticket.resolutionNotes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-md font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Ghi chú giải quyết
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.resolutionNotes}</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'comments'
                      ? 'border-[#0052CC] text-[#0052CC]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Bình luận ({comments.length})
                </button>
                <button
                  onClick={() => setActiveTab('attachments')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'attachments'
                      ? 'border-[#0052CC] text-[#0052CC]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Paperclip className="w-4 h-4 inline mr-2" />
                  Đính kèm ({attachments.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'history'
                      ? 'border-[#0052CC] text-[#0052CC]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <History className="w-4 h-4 inline mr-2" />
                  Lịch sử
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Comments Tab */}
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  {canComment && (
                    <div className="space-y-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none"
                      />
                      <div className="flex items-center justify-between">
                        {permissions.canAddInternalComment() && (
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                checked={commentType === CommentType.PUBLIC}
                                onChange={() => setCommentType(CommentType.PUBLIC)}
                                className="text-[#0052CC]"
                              />
                              <span className="text-sm text-gray-600">Công khai</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                checked={commentType === CommentType.INTERNAL}
                                onChange={() => setCommentType(CommentType.INTERNAL)}
                                className="text-[#0052CC]"
                              />
                              <span className="text-sm text-gray-600">Nội bộ IT</span>
                            </label>
                          </div>
                        )}
                        <button
                          onClick={() => addCommentMutation.mutate()}
                          disabled={!newComment.trim() || addCommentMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white rounded-lg hover:bg-[#0047B3] disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                        >
                          <Send className="w-4 h-4" />
                          Gửi
                        </button>
                      </div>
                    </div>
                  )}

                  {commentsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0052CC]" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Chưa có bình luận nào</p>
                  ) : (
                    <div className="space-y-4 mt-6">
                      {comments.map((comment: Comment) => (
                        <CommentItem
                          key={comment.id}
                          comment={comment}
                          currentUserId={user?.id}
                          isITStaffOrAdmin={isITStaffOrAdmin}
                          permissions={permissions}
                          editingCommentId={editingCommentId}
                          editingContent={editingContent}
                          setEditingCommentId={setEditingCommentId}
                          setEditingContent={setEditingContent}
                          onUpdate={(id, content) => updateCommentMutation.mutate({ id, content })}
                          onDelete={(id) => deleteCommentMutation.mutate(id)}
                          formatDate={formatDate}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Attachments Tab */}
              {activeTab === 'attachments' && (
                <div className="space-y-4">
                  {canUpload && (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadAttachmentMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#0052CC] hover:bg-gray-50 transition-colors w-full justify-center"
                      >
                        {uploadAttachmentMutation.isPending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5 text-gray-500" />
                        )}
                        <span className="text-gray-600">Tải lên file đính kèm</span>
                      </button>
                    </div>
                  )}

                  {attachmentsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0052CC]" />
                    </div>
                  ) : attachments.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Chưa có file đính kèm</p>
                  ) : (
                    <div className="space-y-2">
                      {attachments.map((attachment: Attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{attachmentsService.getFileIcon(attachment.mimeType)}</span>
                            <div>
                              <p className="font-medium text-gray-900">{attachment.originalName}</p>
                              <p className="text-sm text-gray-500">
                                {attachmentsService.formatFileSize(attachment.fileSize)} • {formatDate(attachment.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDownload(attachment)}
                              className="p-2 text-[#0052CC] hover:bg-blue-50 rounded-lg"
                              title="Tải xuống"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            {(user?.id === attachment.uploadedBy || isAdmin) && (
                              <button
                                onClick={() => deleteAttachmentMutation.mutate(attachment.id)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                title="Xóa"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <div>
                  {historyLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-[#0052CC]" />
                    </div>
                  ) : history.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Chưa có lịch sử</p>
                  ) : (
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                      <div className="space-y-4">
                        {history.map((item: TicketHistory) => (
                          <div key={item.id} className="relative pl-10">
                            <div className={`absolute left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs ${ticketHistoryService.getActionColor(item.action)}`}>
                              {ticketHistoryService.getActionIcon(item.action)}
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-900">{item.description}</p>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.user?.fullName || 'Hệ thống'} • {formatDate(item.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Danh mục</p>
                  <p className="font-medium text-gray-900">{ticket.category?.name || 'Chưa phân loại'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Người tạo</p>
                  <p className="font-medium text-gray-900">{ticket.submitter?.fullName}</p>
                  <p className="text-sm text-gray-500">{ticket.submitter?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserPlus className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Người xử lý</p>
                  <p className="font-medium text-gray-900">
                    {ticket.assignee?.fullName || <span className="text-gray-400 italic">Chưa gán</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phòng ban</p>
                  <p className="font-medium text-gray-900">{ticket.submitter?.department || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Ngày tạo</p>
                  <p className="font-medium text-gray-900">{formatDate(ticket.createdAt)}</p>
                </div>
              </div>
              {ticket.resolvedAt && (
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày giải quyết</p>
                    <p className="font-medium text-gray-900">{formatDate(ticket.resolvedAt)}</p>
                  </div>
                </div>
              )}
              {ticket.closedAt && (
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Ngày đóng</p>
                    <p className="font-medium text-gray-900">{formatDate(ticket.closedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SLA Info */}
          {ticket.slaRule && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                SLA
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Thời gian phản hồi</p>
                  <p className="font-medium text-gray-900">{ticket.slaRule.responseTime} giờ</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Thời gian giải quyết</p>
                  <p className="font-medium text-gray-900">{ticket.slaRule.resolutionTime} giờ</p>
                </div>
                {ticket.slaBreached && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-medium">Vi phạm SLA</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rating */}
          {ticket.satisfactionRating && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Đánh giá
              </h3>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${star <= ticket.satisfactionRating! ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              {ticket.satisfactionFeedback && (
                <p className="text-gray-600 text-sm mt-2">{ticket.satisfactionFeedback}</p>
              )}
            </div>
          )}
        </div>
      </div>


      {/* Resolve Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Giải quyết Ticket</h3>
              <button onClick={() => setShowResolveModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Nhập ghi chú giải quyết..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResolveModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={() => resolveMutation.mutate(resolutionNotes)}
                disabled={!resolutionNotes.trim() || resolveMutation.isPending}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                {resolveMutation.isPending ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gán Ticket</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {itStaff.map((staff: User) => (
                <label
                  key={staff.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedAssignee === staff.id ? 'bg-blue-50 border-2 border-[#0052CC]' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="assignee"
                    checked={selectedAssignee === staff.id}
                    onChange={() => setSelectedAssignee(staff.id)}
                    className="hidden"
                  />
                  <div className="w-10 h-10 bg-[#0052CC] text-white rounded-full flex items-center justify-center font-semibold">
                    {staff.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{staff.fullName}</p>
                    <p className="text-sm text-gray-500">{staff.email}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={() => selectedAssignee && assignMutation.mutate(selectedAssignee)}
                disabled={!selectedAssignee || assignMutation.isPending}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
              >
                {assignMutation.isPending ? 'Đang xử lý...' : 'Gán'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Đánh giá dịch vụ</h3>
              <button onClick={() => setShowRatingModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mb-4">
              <p className="text-gray-600 mb-3">Bạn hài lòng với dịch vụ hỗ trợ như thế nào?</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={ratingFeedback}
              onChange={(e) => setRatingFeedback(e.target.value)}
              placeholder="Nhận xét thêm (tùy chọn)..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={() => rateMutation.mutate()}
                disabled={rating === 0 || rateMutation.isPending}
                className="px-4 py-2 bg-[#0052CC] text-white rounded-lg hover:bg-[#0047B3] disabled:opacity-50"
              >
                {rateMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Xóa Ticket</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa ticket <strong>#{ticket.id}</strong>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Comment Item Component
interface CommentItemProps {
  comment: Comment;
  currentUserId?: number;
  isITStaffOrAdmin: boolean;
  permissions: ReturnType<typeof usePermissions>;
  editingCommentId: number | null;
  editingContent: string;
  setEditingCommentId: (id: number | null) => void;
  setEditingContent: (content: string) => void;
  onUpdate: (id: number, content: string) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
}

function CommentItem({
  comment,
  currentUserId,
  isITStaffOrAdmin,
  permissions,
  editingCommentId,
  editingContent,
  setEditingCommentId,
  setEditingContent,
  onUpdate,
  onDelete,
  formatDate,
}: CommentItemProps) {
  const isOwner = comment.userId === currentUserId;
  
  // Use permission checks
  const canEdit = permissions.canEditComment(comment.userId) && comment.type !== CommentType.SYSTEM;
  const canDelete = permissions.canDeleteComment(comment.userId);
  
  const isInternal = comment.type === CommentType.INTERNAL;
  const isSystem = comment.type === CommentType.SYSTEM;

  // Hide internal comments from non-IT staff
  if (isInternal && !isITStaffOrAdmin) return null;

  const isEditing = editingCommentId === comment.id;

  return (
    <div className={`p-4 rounded-lg ${isInternal ? 'bg-yellow-50 border border-yellow-200' : isSystem ? 'bg-gray-50' : 'bg-gray-50'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0052CC] text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {comment.user?.fullName?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{comment.user?.fullName || 'Unknown'}</span>
              {isInternal && (
                <span className="px-2 py-0.5 bg-yellow-200 text-yellow-800 text-xs rounded-full">Nội bộ</span>
              )}
              {isSystem && (
                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">Hệ thống</span>
              )}
              {comment.isEdited && (
                <span className="text-xs text-gray-400">(đã chỉnh sửa)</span>
              )}
            </div>
            <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
          </div>
        </div>
        {!isSystem && (canEdit || canDelete) && !isEditing && (
          <div className="flex items-center gap-1">
            {canEdit && (
              <button
                onClick={() => {
                  setEditingCommentId(comment.id);
                  setEditingContent(comment.content);
                }}
                className="p-1 text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0052CC] focus:border-transparent resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setEditingCommentId(null);
                setEditingContent('');
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
            >
              Hủy
            </button>
            <button
              onClick={() => onUpdate(comment.id, editingContent)}
              disabled={!editingContent.trim()}
              className="px-3 py-1 text-sm bg-[#0052CC] text-white rounded hover:bg-[#0047B3] disabled:opacity-50"
            >
              Lưu
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      )}
    </div>
  );
}
