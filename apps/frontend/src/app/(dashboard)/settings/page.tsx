'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';
import {
  User,
  Lock,
  Bell,
  Palette,
  Save,
  Loader2,
  Mail,
  Send,
} from 'lucide-react';

type TabType = 'profile' | 'password' | 'notifications' | 'appearance';

interface UpdateProfileRequest {
  fullName?: string;
  phone?: string;
  department?: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { t, language, setLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    department: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailTicketUpdates: true,
    emailSLAWarnings: true,
    browserNotifications: true,
  });

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
      });
    }
  }, [user]);

  const tabs = [
    { id: 'profile' as TabType, label: t('settings.profile'), icon: User },
    { id: 'password' as TabType, label: t('settings.security'), icon: Lock },
    { id: 'notifications' as TabType, label: t('settings.notifications'), icon: Bell },
    { id: 'appearance' as TabType, label: t('settings.appearance'), icon: Palette },
  ];

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await apiClient.patch('/users/profile', data);
      return response.data;
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await apiClient.post('/users/change-password', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  // Test email mutation
  const testEmailMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/notifications/test-email');
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(`Test email sent to ${data.recipient}! Check your inbox.`);
      } else {
        toast.error('Failed to send test email. Check SMTP configuration.');
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to send test email');
    },
  });

  const handleSaveProfile = async () => {
    const updateData: UpdateProfileRequest = {};
    if (profileData.fullName !== user?.fullName) updateData.fullName = profileData.fullName;
    if (profileData.phone !== user?.phone) updateData.phone = profileData.phone;
    if (profileData.department !== user?.department) updateData.department = profileData.department;

    if (Object.keys(updateData).length === 0) {
      toast.success('No changes to save');
      return;
    }

    updateProfileMutation.mutate(updateData);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }

    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const saving = updateProfileMutation.isPending || changePasswordMutation.isPending;
  const sendingEmail = testEmailMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
        <p className="text-gray-500 mt-1">{t('settings.description')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">{t('settings.profileInfo')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.fullName')}</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.email')}</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.phone')}</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.department')}</label>
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    {t('settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">{t('settings.changePassword')}</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.currentPassword')}</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.newPassword')}</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.confirmPassword')}</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleChangePassword}
                    disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                    className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                    {t('settings.changePassword')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">{t('settings.notificationPreferences')}</h2>
                  <button
                    onClick={() => testEmailMutation.mutate()}
                    disabled={sendingEmail}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {sendingEmail ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t('settings.sendingEmail')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t('settings.testEmail')}
                      </>
                    )}
                  </button>
                </div>

                {/* Email Configuration Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900">{t('settings.emailNotifications')}</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        {t('settings.emailTestInfo')} <strong>{user?.email}</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">{t('settings.emailTicketUpdates')}</p>
                      <p className="text-sm text-gray-500">{t('settings.emailTicketUpdatesDesc')}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailTicketUpdates}
                      onChange={(e) => setNotifications(prev => ({ ...prev, emailTicketUpdates: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">{t('settings.emailSlaWarnings')}</p>
                      <p className="text-sm text-gray-500">{t('settings.emailSlaWarningsDesc')}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.emailSLAWarnings}
                      onChange={(e) => setNotifications(prev => ({ ...prev, emailSLAWarnings: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">{t('settings.browserNotifications')}</p>
                      <p className="text-sm text-gray-500">{t('settings.browserNotificationsDesc')}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={notifications.browserNotifications}
                      onChange={(e) => setNotifications(prev => ({ ...prev, browserNotifications: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">{t('settings.appearance')}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">{t('settings.theme')}</label>
                    <div className="flex space-x-4">
                      <button className="flex-1 p-4 border-2 border-blue-500 rounded-lg bg-white">
                        <div className="w-full h-8 bg-gray-100 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center">{t('settings.light')}</p>
                      </button>
                      <button className="flex-1 p-4 border-2 border-gray-200 rounded-lg bg-gray-800">
                        <div className="w-full h-8 bg-gray-700 rounded mb-2"></div>
                        <p className="text-sm font-medium text-center text-white">{t('settings.dark')}</p>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('settings.language')}</label>
                    <div className="relative w-full max-w-xs">
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as 'en' | 'vi')}
                        className="w-full px-4 py-2.5 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {language === 'vi' ? (
                          <svg className="w-6 h-6" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg">
                            <rect width="30" height="20" fill="#DA251D"/>
                            <polygon points="15,4 16.5,9 21.5,9 17.5,12 19,17 15,14 11,17 12.5,12 8.5,9 13.5,9" fill="#FFFF00"/>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" viewBox="0 0 60 30" xmlns="http://www.w3.org/2000/svg">
                            <clipPath id="s">
                              <path d="M0,0 v30 h60 v-30 z"/>
                            </clipPath>
                            <clipPath id="t">
                              <path d="M30,15 h30 v15 z v-15 h-30 z h-30 v15 z v-15 h30 z"/>
                            </clipPath>
                            <g clipPath="url(#s)">
                              <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                              <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                              <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                            </g>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
