'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CheckCircle, MessageSquare, BarChart3, Bot, Sparkles, TrendingUp } from 'lucide-react';

export function FeaturesShowcase() {
  const { ref: ref1, inView: inView1 } = useInView({ threshold: 0.2, triggerOnce: true });
  const { ref: ref2, inView: inView2 } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Feature 1: AI Chatbot */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32" ref={ref1}>
          {/* Visual */}
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={inView1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <ChatbotIllustration />
          </motion.div>

          {/* Content */}
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={inView1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Bot className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-semibold text-purple-600">Hỗ trợ bởi AI</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#172B4D] mb-6 leading-tight">
              Chatbot
              <span className="text-[#0052CC]"> thực sự hữu ích</span>
            </h3>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Trợ lý ảo thông minh trả lời câu hỏi thường gặp, hướng dẫn người dùng và tự động tạo ticket khi cần. 
              Giảm khối lượng công việc IT 40%.
            </p>
            <ul className="space-y-4">
              {['Phản hồi tức thì 24/7', 'Tích hợp cơ sở tri thức', 'Học từ tương tác'].map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-600 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Feature 2: Dashboard - Dark Background */}
        <div className="bg-[#172B4D] rounded-3xl p-8 md:p-16" ref={ref2}>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-[#0052CC]/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-[#4C9AFF] mr-2" />
                <span className="text-sm font-semibold text-[#4C9AFF]">Phân tích thời gian thực</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Thông tin chi tiết
                <span className="text-[#4C9AFF]"> thúc đẩy quyết định</span>
              </h3>
              <p className="text-lg text-blue-200 mb-8 leading-relaxed">
                Theo dõi hiệu suất, xu hướng và KPI với bảng điều khiển trực quan. 
                Báo cáo tự động giúp quản lý đưa ra quyết định dựa trên dữ liệu.
              </p>
              <ul className="space-y-4">
                {['Số liệu thời gian thực', 'Báo cáo tùy chỉnh', 'Xuất đa định dạng'].map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#0052CC] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-blue-100 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <DashboardIllustration />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChatbotIllustration() {
  return (
    <div className="relative">
      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#0052CC] rounded-xl mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-white font-semibold text-sm">NexusFlow AI</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-blue-200 text-xs">Trực tuyến</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4">
          <motion.div 
            className="flex justify-end"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm text-[#172B4D]">Làm thế nào để đặt lại mật khẩu?</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-[#0052CC] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
              <p className="text-sm text-white">Tôi có thể giúp bạn! Vào Cài đặt → Bảo mật → Đặt lại mật khẩu. Bạn có cần tôi tạo ticket không?</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex justify-start space-x-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <button className="px-4 py-2 bg-green-100 text-green-700 text-sm font-medium rounded-full hover:bg-green-200 transition">
              Có, tạo ticket
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-200 transition">
              Không, cảm ơn
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating Badge */}
      <motion.div 
        className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-sm font-bold">Giảm 40% ticket</span>
      </motion.div>
    </div>
  );
}

function DashboardIllustration() {
  return (
    <div className="relative">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { value: '1,234', label: 'Tổng số', trend: '+12%', color: 'text-[#4C9AFF]' },
            { value: '94%', label: 'SLA', trend: '+3%', color: 'text-green-400' },
            { value: '2.4h', label: 'TG TB', trend: '-18%', color: 'text-purple-400' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="bg-white/5 rounded-xl p-4 border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-xs text-blue-200">{stat.label}</div>
              <div className="text-xs text-green-400 mt-1">{stat.trend}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-white">Xu hướng tuần</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex items-end justify-between h-32 gap-2">
            {[45, 65, 55, 80, 70, 90, 75].map((height, i) => (
              <motion.div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-[#0052CC] to-[#4C9AFF] rounded-t-sm"
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-blue-300">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
              <span key={i}>{day}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      <motion.div 
        className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 border border-gray-100"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#172B4D]">Đạt mục tiêu SLA</div>
            <div className="text-xs text-gray-500">Tháng này: 94%</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
