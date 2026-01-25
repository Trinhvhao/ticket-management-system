'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, TrendingUp, BarChart3, FileText, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative bg-white pt-20 pb-16 md:pt-24 md:pb-20 overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute w-96 h-96 bg-gradient-to-br from-[#0052CC]/10 to-transparent rounded-full blur-3xl top-[10%] left-[5%]"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute w-80 h-80 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl top-[50%] right-[10%]"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute w-64 h-64 bg-gradient-to-br from-[#0052CC]/5 to-transparent rounded-full blur-2xl bottom-[10%] left-[30%]"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        <motion.div 
          className="absolute w-72 h-72 bg-gradient-to-br from-blue-300/8 to-transparent rounded-full blur-3xl top-[30%] right-[25%]"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Small floating circles */}
        <motion.div 
          className="absolute w-20 h-20 bg-[#0052CC]/20 rounded-full blur-xl top-[20%] left-[15%]"
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute w-16 h-16 bg-blue-400/20 rounded-full blur-xl top-[60%] right-[20%]"
          animate={{ 
            y: [0, 25, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        <motion.div 
          className="absolute w-24 h-24 bg-[#0052CC]/15 rounded-full blur-xl bottom-[25%] left-[50%]"
          animate={{ 
            x: [0, 20, 0],
            y: [0, -15, 0],
            opacity: [0.25, 0.5, 0.25]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left: Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div 
            className="inline-flex items-center px-4 py-2 bg-[#0052CC]/10 rounded-full mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-sm font-semibold text-[#0052CC] tracking-wide uppercase">
              Sẵn sàng 2026: Công nghệ tiên tiến
            </span>
          </motion.div>

          {/* Headline - Modern Typography */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#172B4D] leading-[1.1] tracking-tight mb-6">
            Quản lý dịch vụ IT{' '}
            <span className="text-[#0052CC]">thông minh</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 mb-10 leading-relaxed max-w-lg">
            Được xây dựng cho các kỹ sư phát triển. Chuẩn hóa, tự động hóa và mở rộng 
            hệ thống quản lý ticket IT của bạn với tốc độ ánh sáng.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-[#0052CC] hover:bg-blue-700 text-white font-bold rounded-lg transition-all text-center shadow-lg shadow-[#0052CC]/25"
            >
              Bắt đầu miễn phí
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-gray-200 text-[#172B4D] hover:border-[#0052CC] hover:text-[#0052CC] font-semibold rounded-lg transition-all text-center"
            >
              Đăng nhập
            </Link>
          </div>
        </motion.div>

        {/* Right: Animated Dashboard Illustration */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative"
        >
          <AnimatedTicketDashboard />
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedTicketDashboard() {
  return (
    <div className="relative w-full">
      {/* Main Dashboard Card */}
      <motion.div 
        className="bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 relative z-10"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Header with Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          </div>
          <motion.div 
            className="text-xs text-gray-400 font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SYSTEM HEALTH: 99.9%
          </motion.div>
        </div>

        {/* Quick Stats Bar */}
        <motion.div 
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="text-2xl font-bold text-[#0052CC]">24</div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <div className="text-2xl font-bold text-green-600">156</div>
            <div className="text-xs text-gray-500">Resolved</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">8</div>
            <div className="text-xs text-gray-500">Urgent</div>
          </div>
        </motion.div>

        {/* Ticket Items */}
        <div className="space-y-3">
          <motion.div 
            className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-transparent rounded-xl border border-red-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <div>
                <div className="font-semibold text-[#172B4D] text-sm">Ticket #2026: Hạ tầng AI</div>
                <div className="text-xs text-gray-400 mt-1">Ưu tiên: Cao • 2 giờ trước</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">KHẨN CẤP</span>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-transparent rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div>
                <div className="font-semibold text-[#172B4D] text-sm">Tối ưu hóa Database</div>
                <div className="text-xs text-gray-400 mt-1">Ưu tiên: Trung bình • 5 giờ trước</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">CHỜ XỬ LÝ</span>
          </motion.div>

          <motion.div 
            className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl border border-green-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <div>
                <div className="font-semibold text-green-700 text-sm">Triển khai AI Agent mới</div>
                <div className="text-xs text-gray-400 mt-1">Ưu tiên: Thấp • 1 ngày trước</div>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">ĐANG XỬ LÝ</span>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div 
          className="mt-6 pt-4 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Tiến độ hôm nay</span>
            <span className="text-xs text-[#0052CC] font-bold">87%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#0052CC] to-blue-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '87%' }}
              transition={{ duration: 1.5, delay: 1.7, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating AI Badge with Animation */}
      <motion.div 
        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#0052CC] to-blue-600 text-white p-4 rounded-2xl shadow-2xl z-20"
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ 
          opacity: 1, 
          scale: 1, 
          x: 0,
          y: [0, -10, 0]
        }}
        transition={{ 
          opacity: { duration: 0.6, delay: 1.3 },
          scale: { duration: 0.6, delay: 1.3 },
          x: { duration: 0.6, delay: 1.3 },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Zap className="w-6 h-6" />
      </motion.div>

      {/* Floating Stats Cards */}
      <motion.div 
        className="absolute -left-6 top-8 bg-white rounded-xl shadow-lg p-3 border border-gray-100 z-20"
        initial={{ opacity: 0, x: -20, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <div>
            <div className="text-xs text-gray-400">Thời gian phản hồi</div>
            <div className="text-sm font-bold text-green-600">-23%</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute -right-8 bottom-12 bg-white rounded-xl shadow-lg p-3 border border-gray-100 z-20"
        initial={{ opacity: 0, x: 20, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-[#0052CC]" />
          <div>
            <div className="text-xs text-gray-400">Hài lòng</div>
            <div className="text-sm font-bold text-[#0052CC]">98.5%</div>
          </div>
        </div>
      </motion.div>

      {/* Animated Background Circles */}
      <motion.div 
        className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#0052CC]/10 to-transparent rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
}
