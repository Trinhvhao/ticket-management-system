'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';

export function StatsSection() {
  const { ref, inView } = useInView({ 
    threshold: 0.3,
    triggerOnce: true 
  });

  const stats = [
    { icon: CheckCircle, value: 10000, suffix: '+', label: 'Tickets xử lý', color: 'text-green-500', bg: 'bg-green-50' },
    { icon: Clock, value: 2, prefix: '<', suffix: 'h', label: 'Phản hồi TB', color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: TrendingUp, value: 45, suffix: '%', label: 'Nhanh hơn', color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: BarChart3, value: 95, suffix: '%', label: 'Hài lòng', color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <section className="py-20 bg-[#172B4D]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 ${stat.bg} rounded-xl mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                {inView && (
                  <>
                    {stat.prefix}
                    <CountUp 
                      end={stat.value} 
                      duration={2.5}
                      separator=","
                    />
                    {stat.suffix}
                  </>
                )}
              </div>
              <div className="text-sm text-blue-200 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
