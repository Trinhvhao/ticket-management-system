'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Cloud, Shield, Bot, Database, Server, Globe, Zap, Lock, RefreshCw } from 'lucide-react';
import CountUp from 'react-countup';

export function EcosystemSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="py-24 bg-[#172B4D] relative overflow-hidden" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0052CC]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full mb-6">
            <Globe className="w-4 h-4 text-[#4C9AFF] mr-2" />
            <span className="text-sm font-semibold text-[#4C9AFF]">Kiến trúc doanh nghiệp</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Xây dựng cho
            <span className="text-[#4C9AFF]"> quy mô vô hạn</span>
          </h2>
          <p className="text-lg text-blue-200">
            Hệ sinh thái linh hoạt kết nối hạ tầng đám mây, lớp bảo mật và các tác nhân AI
          </p>
        </motion.div>

        {/* Ecosystem Map */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Integrations */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Cloud className="w-5 h-5 text-[#4C9AFF] mr-2" />
              Hạ tầng đám mây
            </h3>
            {['AWS / Azure / GCP', 'Kubernetes Clusters', 'Nhóm tự động mở rộng', 'Phân phối CDN'].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-[#0052CC]/50 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-blue-100 text-sm">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Center - Main Hub */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative bg-gradient-to-br from-[#0052CC] to-blue-700 rounded-3xl p-8 border border-[#4C9AFF]/30">
              {/* Animated Ring */}
              <div className="absolute inset-0 rounded-3xl">
                <motion.div 
                  className="absolute inset-2 border-2 border-dashed border-white/20 rounded-2xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              <div className="relative text-center">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">NexusFlow Core</h3>
                <p className="text-blue-200 text-sm mb-6">Trung tâm trí tuệ</p>

                {/* Connection Lines */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Bot, label: 'Tác nhân AI' },
                    { icon: Database, label: 'Hồ dữ liệu' },
                    { icon: Shield, label: 'Bảo mật' },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-blue-200">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pulse Effect */}
              <motion.div 
                className="absolute inset-0 rounded-3xl border-2 border-[#4C9AFF]"
                animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Right Column - Security */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 text-green-400 mr-2" />
              Bảo mật & Tuân thủ
            </h3>
            {['SOC 2 Type II', 'Tuân thủ GDPR', 'Mã hóa đầu cuối', 'Kiến trúc Zero Trust'].map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center space-x-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-500/50 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Lock className="w-4 h-4 text-green-400" />
                <span className="text-blue-100 text-sm">{item}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scalability Stats */}
        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">Chứng minh khả năng mở rộng</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 10, suffix: 'Tr+', label: 'Tickets/Tháng', icon: Server },
              { value: 99.99, suffix: '%', label: 'SLA Uptime', icon: RefreshCw, decimals: 2 },
              { value: 50, suffix: 'ms', label: 'Phản hồi TB', icon: Zap },
              { value: 500, suffix: '+', label: 'Khách hàng DN', icon: Globe },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.1 }}
              >
                <div className="w-12 h-12 bg-[#0052CC]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-[#4C9AFF]" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                  {inView && (
                    <>
                      <CountUp 
                        end={stat.value} 
                        duration={2.5}
                        decimals={stat.decimals || 0}
                      />
                      {stat.suffix}
                    </>
                  )}
                </div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
