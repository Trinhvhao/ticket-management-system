'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function StatCard({ title, value, change, icon: Icon, color, bgColor }: StatCardProps) {
  const isNumeric = typeof value === 'number';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all relative overflow-hidden group"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {isNumeric ? (
              <CountUp 
                end={value as number} 
                duration={2}
                separator=","
                preserveValue
              />
            ) : (
              value
            )}
          </p>
          {change && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center mt-2"
            >
              <span className={`text-sm font-medium flex items-center ${
                change.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <motion.span
                  animate={{ y: change.trend === 'up' ? [-2, 0] : [2, 0] }}
                  transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
                >
                  {change.trend === 'up' ? '↑' : '↓'}
                </motion.span>
                <span className="ml-1">{Math.abs(change.value)}%</span>
              </span>
              <span className="text-xs text-gray-500 ml-2">vs last period</span>
            </motion.div>
          )}
        </div>
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className={`w-14 h-14 ${bgColor} rounded-lg flex items-center justify-center shadow-lg`}
          style={{
            background: `linear-gradient(135deg, ${bgColor.includes('blue') ? '#3B82F6' : bgColor.includes('yellow') ? '#F59E0B' : bgColor.includes('green') ? '#10B981' : '#EF4444'} 0%, ${bgColor.includes('blue') ? '#1E40AF' : bgColor.includes('yellow') ? '#D97706' : bgColor.includes('green') ? '#059669' : '#DC2626'} 100%)`
          }}
        >
          <Icon className="w-7 h-7 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}
