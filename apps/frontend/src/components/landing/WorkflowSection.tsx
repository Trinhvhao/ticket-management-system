'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Inbox, GitBranch, Wrench, LineChart } from 'lucide-react';

export function WorkflowSection() {
  const { ref, inView } = useInView({ 
    threshold: 0.2,
    triggerOnce: true 
  });

  const steps = [
    {
      icon: Inbox,
      number: '01',
      title: 'Thu thập',
      description: 'Tiếp nhận đa kênh qua cổng thông tin, email hoặc API đảm bảo không bỏ sót yêu cầu nào.',
    },
    {
      icon: GitBranch,
      number: '02',
      title: 'Định tuyến',
      description: 'Phân loại hỗ trợ AI và tự động phân công cho đội chuyên gia phù hợp.',
    },
    {
      icon: Wrench,
      number: '03',
      title: 'Giải quyết',
      description: 'Nhân viên thực hiện quy trình được hướng dẫn và tận dụng cơ sở tri thức.',
    },
    {
      icon: LineChart,
      number: '04',
      title: 'Tối ưu hóa',
      description: 'Đánh giá sau sự cố và tổng hợp dữ liệu để xác định cải tiến hệ thống.',
    },
  ];

  return (
    <section id="workflow" className="py-24 bg-[#172B4D] relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0052CC] rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
            Chu trình dịch vụ
            <span className="text-[#4C9AFF]"> minh bạch</span>
          </h2>
          <p className="text-lg text-blue-200">
            Từ yêu cầu đến giải quyết với quy trình có cấu trúc, có thể kiểm toán và giữ cho các bên liên quan được thông báo
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div 
              key={i} 
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Connector Line */}
              {i < 3 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-[#0052CC] to-transparent z-0"></div>
              )}

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 bg-[#0052CC] rounded-xl flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-5xl font-black text-white/10">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{step.title}</h3>
                <p className="text-blue-200 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
