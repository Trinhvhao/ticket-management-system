'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Folder, Clock, Star, TrendingUp } from 'lucide-react';

interface CategoryData {
  name: string;
  icon?: string;
  ticketCount: number;
  avgResolutionTime?: number; // in hours (optional until backend provides it)
  satisfactionRate?: number; // 0-100 (optional until backend provides it)
  color: string;
}

interface CategoryPerformanceChartProps {
  data: CategoryData[];
}

export default function CategoryPerformanceChart({ data }: CategoryPerformanceChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'tickets' | 'time' | 'satisfaction'>('tickets');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sort data based on selected metric
  const sortedData = [...data].sort((a, b) => {
    switch (sortBy) {
      case 'tickets':
        return b.ticketCount - a.ticketCount;
      case 'time':
        return (a.avgResolutionTime || 0) - (b.avgResolutionTime || 0);
      case 'satisfaction':
        return (b.satisfactionRate || 0) - (a.satisfactionRate || 0);
      default:
        return 0;
    }
  });

  const maxTickets = Math.max(...data.map(d => d.ticketCount));
  const maxTime = Math.max(...data.map(d => d.avgResolutionTime || 0));

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${(hours / 24).toFixed(1)}d`;
  };

  // Handle sort change with transition
  const handleSortChange = (newSort: 'tickets' | 'time' | 'satisfaction') => {
    if (newSort === sortBy) return;
    
    setIsTransitioning(true);
    setSortBy(newSort);
    
    // Reset transition after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow relative overflow-hidden group"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-3" />
            Hiệu suất theo danh mục
          </h3>
          
          {/* Sort buttons */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'tickets', icon: Folder, label: 'Ticket' },
              { key: 'time', icon: Clock, label: 'Thời gian' },
              { key: 'satisfaction', icon: Star, label: 'Đánh giá' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => handleSortChange(key as any)}
                disabled={isTransitioning}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  sortBy === key 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                } ${isTransitioning ? 'opacity-50 cursor-wait' : ''}`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading overlay */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600 font-medium">Đang cập nhật...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category bars */}
        <div className="space-y-4 relative">
          <AnimatePresence mode="popLayout">
            {sortedData.map((category, index) => {
            const ticketPercent = (category.ticketCount / maxTickets) * 100;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={`${category.name}-${sortBy}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`relative p-3 rounded-lg transition-all cursor-pointer ${
                  isHovered ? 'bg-gray-50 scale-[1.02]' : ''
                }`}
              >
                {/* Category info */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      {category.icon || '📁'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.ticketCount} tickets</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="flex items-center gap-4">
                    {category.avgResolutionTime !== undefined && (
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span className="text-sm font-medium">{formatTime(category.avgResolutionTime)}</span>
                        </div>
                        <p className="text-xs text-gray-400">Avg. time</p>
                      </div>
                    )}
                    {category.satisfactionRate !== undefined && (
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium text-gray-900">{category.satisfactionRate}%</span>
                        </div>
                        <p className="text-xs text-gray-400">Satisfaction</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${category.color}, ${category.color}99)`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${ticketPercent}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  />
                  
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '400%' }}
                    transition={{ 
                      duration: 2, 
                      delay: 1 + index * 0.1,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                </div>

                {/* Expanded details on hover */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ 
                    height: isHovered ? 'auto' : 0, 
                    opacity: isHovered ? 1 : 0 
                  }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 mt-3 border-t border-gray-100 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{category.ticketCount}</p>
                      <p className="text-xs text-gray-500">Tổng ticket</p>
                    </div>
                    {category.avgResolutionTime !== undefined && (
                      <div>
                        <p className="text-lg font-bold text-gray-900">{formatTime(category.avgResolutionTime)}</p>
                        <p className="text-xs text-gray-500">TG xử lý TB</p>
                      </div>
                    )}
                    {category.satisfactionRate !== undefined && (
                      <div>
                        <p className="text-lg font-bold text-gray-900">{category.satisfactionRate}%</p>
                        <p className="text-xs text-gray-500">Hài lòng</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Folder className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Không có dữ liệu danh mục</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
