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
      title: 'Unified Request Hub',
      description: 'Consolidate tickets, incidents, and service requests from all channels into a single dashboard.',
    },
    {
      icon: Zap,
      title: 'Smart Automation',
      description: 'Automate repetitive tasks, routing rules, and approvals to reduce manual effort.',
    },
    {
      icon: Clock,
      title: 'Dynamic SLA Tracking',
      description: 'Ensure commitments are met with real-time SLA monitoring and automatic breach alerts.',
    },
    {
      icon: BarChart3,
      title: 'Executive Reports',
      description: 'Visualize performance with customizable dashboards and reports for stakeholders.',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption, role-based access, and audit trails for compliance.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Built-in chat, mentions, and shared workspaces for seamless teamwork.',
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
            Engineered for
            <span className="text-[#0052CC]"> operational control</span>
          </h2>
          <p className="text-lg text-gray-500">
            Centralize IT processes and empower your team with a powerful service management toolkit
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
