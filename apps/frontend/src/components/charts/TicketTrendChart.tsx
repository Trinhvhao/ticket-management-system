'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { useState } from 'react';
import ChartModal from './ChartModal';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface TrendData {
  date: string;
  fullDate?: string;
  created: number;
  resolved: number;
  closed: number;
  avgResolutionHours?: number;
}

interface TicketTrendChartProps {
  data: TrendData[];
  onTimeRangeChange?: (days: number) => void;
  currentRange?: number;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-lg shadow-xl border border-gray-200"
      >
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {data.fullDate && (
          <p className="text-xs text-gray-500 mb-2">{new Date(data.fullDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        )}
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm flex items-center justify-between gap-4">
            <span className="flex items-center">
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}:
            </span>
            <span className="font-medium">{entry.value}</span>
          </p>
        ))}
        {data.avgResolutionHours > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              Thời gian xử lý TB: <span className="font-medium">{data.avgResolutionHours}h</span>
            </p>
          </div>
        )}
      </motion.div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, stroke, payload, dataKey } = props;
  
  // Only show dot if value > 0
  if (!payload[dataKey] || payload[dataKey] === 0) return null;
  
  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="white"
      stroke={stroke}
      strokeWidth={3}
      className="drop-shadow-lg"
    />
  );
};

export default function TicketTrendChart({ data, onTimeRangeChange, currentRange = 7, isLoading = false }: TicketTrendChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();
  
  // Check if there's any real data
  const hasData = data.some(item => item.created > 0 || item.resolved > 0 || item.closed > 0);
  
  // Calculate summary stats
  const totalCreated = data.reduce((sum, item) => sum + item.created, 0);
  const totalResolved = data.reduce((sum, item) => sum + item.resolved, 0);
  const totalClosed = data.reduce((sum, item) => sum + item.closed, 0);
  
  const timeRanges = [
    { label: t('common.days7'), value: 7 },
    { label: t('common.days14'), value: 14 },
    { label: t('common.days30'), value: 30 },
  ];
  
  const ChartContent = ({ height = 300, showStats = false }: { height?: number; showStats?: boolean }) => (
    <>
      {showStats && hasData && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 mb-1">{t('common.created')}</p>
            <p className="text-2xl font-bold text-blue-700">{totalCreated}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 mb-1">{t('status.Resolved')}</p>
            <p className="text-2xl font-bold text-green-700">{totalResolved}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">{t('status.Closed')}</p>
            <p className="text-2xl font-bold text-gray-700">{totalClosed}</p>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">{t('common.loading')}</p>
          </div>
        </div>
      ) : !hasData ? (
        <div className="flex items-center justify-center text-gray-400" style={{ height: `${height}px` }}>
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-medium">{t('common.noData')}</p>
            <p className="text-xs mt-1">{t('tickets.createTicket')}</p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            <defs>
              {/* Jira-inspired blue for created tickets */}
              <linearGradient id="lineGradientCreated" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#0052CC" stopOpacity={1}/>
                <stop offset="100%" stopColor="#0065FF" stopOpacity={1}/>
              </linearGradient>
              {/* Professional green for resolved tickets */}
              <linearGradient id="lineGradientResolved" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00875A" stopOpacity={1}/>
                <stop offset="100%" stopColor="#36B37E" stopOpacity={1}/>
              </linearGradient>
              {/* Neutral grey for closed tickets */}
              <linearGradient id="lineGradientClosed" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#5E6C84" stopOpacity={1}/>
                <stop offset="100%" stopColor="#8993A4" stopOpacity={1}/>
              </linearGradient>
              <filter id="lineShadow">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#6B7280"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tickLine={false}
            />
            <YAxis 
              stroke="#6B7280"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="created" 
              stroke="url(#lineGradientCreated)"
              strokeWidth={3}
              name={t('common.created')}
              animationDuration={800}
              filter="url(#lineShadow)"
              dot={<CustomDot />}
              activeDot={{ r: 7, strokeWidth: 3 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="resolved" 
              stroke="url(#lineGradientResolved)"
              strokeWidth={3}
              name={t('status.Resolved')}
              animationDuration={800}
              filter="url(#lineShadow)"
              dot={<CustomDot />}
              activeDot={{ r: 7, strokeWidth: 3 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="closed" 
              stroke="url(#lineGradientClosed)"
              strokeWidth={3}
              name={t('status.Closed')}
              animationDuration={800}
              filter="url(#lineShadow)"
              dot={<CustomDot />}
              activeDot={{ r: 7, strokeWidth: 3 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
  
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow relative overflow-hidden group"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-green-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-green-600 rounded-full mr-3" />
              {t('reports.trendAnalysis')}
            </h3>
            
            <div className="flex items-center gap-2">
              {/* Time Range Selector */}
              {onTimeRangeChange && (
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {timeRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => onTimeRangeChange(range.value)}
                      className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                        currentRange === range.value
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Expand Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors group/btn"
                title={t('common.view')}
              >
                <Maximize2 className="w-4 h-4 text-gray-500 group-hover/btn:text-blue-600" />
              </button>
            </div>
          </div>
          
          <ChartContent />
        </div>
      </motion.div>

      {/* Fullscreen Modal */}
      <ChartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('reports.trendAnalysis')}
      >
        <ChartContent height={600} showStats={true} />
      </ChartModal>
    </>
  );
}
