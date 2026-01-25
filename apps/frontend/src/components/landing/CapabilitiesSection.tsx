'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FileText, Zap, Clock, BarChart3, Shield, Users } from 'lucide-react';

export function CapabilitiesSection() {
  const { ref, inView } = useInView({ 
    threshold: 0.1,
    triggerOnce: true 
  });

  const features = [
    {
      icon: FileText,
      title: 'Trung tâm yêu cầu thống nhất',
      description: 'Tập trung ticket, sự cố và yêu cầu dịch vụ từ mọi kênh vào một bảng điều khiển duy nhất.',
    },
    {
      icon: Zap,
      title: 'Tự động hóa thông minh',
      description: 'Tự động hóa các tác vụ lặp lại, quy tắc định tuyến và phê duyệt để giảm công việc thủ công.',
    },
    {
      icon: Clock,
      title: 'Theo dõi SLA động',
      description: 'Đảm bảo cam kết được thực hiện với giám sát SLA thời gian thực và cảnh báo vi phạm tự động.',
    },
    {
      icon: BarChart3,
      title: 'Báo cáo quản lý',
      description: 'Trực quan hóa hiệu suất với bảng điều khiển và báo cáo tùy chỉnh cho các bên liên quan.',
    },
    {
      icon: Shield,
      title: 'Bảo mật doanh nghiệp',
      description: 'Mã hóa cấp ngân hàng, kiểm soát truy cập theo vai trò và nhật ký kiểm toán để tuân thủ.',
    },
    {
      icon: Users,
      title: 'Cộng tác nhóm',
      description: 'Chat tích hợp, đề cập và không gian làm việc chung để làm việc nhóm liền mạch.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-[#172B4D]">
            Được thiết kế cho
            <span className="text-[#0052CC]"> kiểm soát vận hành</span>
          </h2>
          <p className="text-lg text-gray-500">
            Tập trung hóa quy trình IT và trao quyền cho đội ngũ của bạn với bộ công cụ quản lý dịch vụ mạnh mẽ
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              className="group bg-gray-50 hover:bg-white p-8 rounded-2xl border border-gray-100 hover:border-[#0052CC]/30 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-14 h-14 bg-[#0052CC]/10 group-hover:bg-[#0052CC] rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-[#0052CC] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#172B4D]">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
