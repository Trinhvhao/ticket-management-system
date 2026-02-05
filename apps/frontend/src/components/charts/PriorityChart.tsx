'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface PriorityData {
  priority: string;
  count: number;
  color: string;
}

interface PriorityChartProps {
  data: PriorityData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-xl border border-gray-200"
      >
        <p className="font-semibold text-gray-900">{payload[0].payload.priority}</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{payload[0].value}</span> ticket
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function PriorityChart({ data }: PriorityChartProps) {
  const { t } = useLanguage();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow relative overflow-hidden group"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/30 via-red-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-1 h-6 bg-gradient-to-b from-orange-600 to-red-600 rounded-full mr-3" />
          {t('reports.ticketsByPriority')}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`bar-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.9}/>
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                </linearGradient>
              ))}
              <filter id="bar-shadow">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.3"/>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="priority" 
              stroke="#6B7280"
              style={{ fontSize: '12px', fontWeight: 500 }}
            />
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '12px', fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar 
              dataKey="count" 
              name={t('tickets.title')}
              radius={[12, 12, 0, 0]}
              filter="url(#bar-shadow)"
              animationDuration={1000}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#bar-gradient-${index})`}
                  stroke={entry.color}
                  strokeWidth={2}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
