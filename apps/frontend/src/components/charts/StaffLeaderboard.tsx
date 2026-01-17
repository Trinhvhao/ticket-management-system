'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Trophy, Medal, Star, Clock, CheckCircle, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';

interface StaffMember {
  id: number;
  name: string;
  avatar?: string;
  ticketsResolved: number;
  avgResolutionTime: number; // in hours
  satisfactionRate: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface StaffLeaderboardProps {
  data: StaffMember[];
  period?: string;
}

const rankConfig = [
  { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', gradient: 'from-yellow-400 to-amber-500' },
  { icon: Medal, color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-200', gradient: 'from-gray-300 to-gray-400' },
  { icon: Medal, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', gradient: 'from-amber-500 to-orange-500' },
];

export default function StaffLeaderboard({ data, period = 'This Week' }: StaffLeaderboardProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayData = showAll ? data : data.slice(0, 5);
  const maxResolved = Math.max(...data.map(d => d.ticketsResolved));

  const formatTime = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${(hours / 24).toFixed(1)}d`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow relative overflow-hidden group"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 via-orange-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full mr-3" />
            Top Performers
          </h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {period}
          </span>
        </div>

        {/* Leaderboard */}
        <div className="space-y-3">
          <AnimatePresence>
            {displayData.map((member, index) => {
              const rank = index + 1;
              const config = rankConfig[index] || { 
                icon: null, 
                color: 'text-gray-600', 
                bg: 'bg-gray-50', 
                border: 'border-gray-200',
                gradient: 'from-gray-400 to-gray-500'
              };
              const isExpanded = expandedId === member.id;
              const progressPercent = (member.ticketsResolved / maxResolved) * 100;

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  layout
                  className={`relative rounded-xl border transition-all cursor-pointer ${
                    rank <= 3 ? config.border : 'border-gray-100'
                  } ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setExpandedId(isExpanded ? null : member.id)}
                >
                  {/* Top 3 gradient border */}
                  {rank <= 3 && (
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${config.gradient} opacity-10`} />
                  )}

                  <div className="relative p-4">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        rank <= 3 ? `${config.bg} ${config.color}` : 'bg-gray-100 text-gray-500'
                      }`}>
                        {rank <= 3 && config.icon ? (
                          <config.icon className="w-5 h-5" />
                        ) : (
                          <span className="text-sm">#{rank}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="relative">
                        {member.avatar ? (
                          <img 
                            src={member.avatar} 
                            alt={member.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-md bg-gradient-to-br ${
                            rank === 1 ? 'from-yellow-400 to-orange-500' :
                            rank === 2 ? 'from-gray-400 to-gray-500' :
                            rank === 3 ? 'from-amber-500 to-orange-600' :
                            'from-blue-400 to-blue-600'
                          }`}>
                            {getInitials(member.name)}
                          </div>
                        )}
                        
                        {/* Trend indicator */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            member.trend === 'up' ? 'bg-green-500 text-white' :
                            member.trend === 'down' ? 'bg-red-500 text-white' :
                            'bg-gray-400 text-white'
                          }`}
                        >
                          {member.trend === 'up' ? '↑' : member.trend === 'down' ? '↓' : '−'}
                        </motion.div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                          {rank === 1 && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.8, type: "spring" }}
                              className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"
                            >
                              🏆 Top
                            </motion.span>
                          )}
                        </div>
                        
                        {/* Progress bar */}
                        <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              rank <= 3 ? config.gradient : 'from-blue-400 to-blue-600'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">{member.ticketsResolved}</p>
                        <p className="text-xs text-gray-500">resolved</p>
                      </div>

                      {/* Expand icon */}
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-gray-400"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </motion.div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 mt-4 border-t border-gray-200 grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg">
                              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <p className="text-lg font-bold text-gray-900">{member.ticketsResolved}</p>
                              <p className="text-xs text-gray-500">Resolved</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                                <Clock className="w-4 h-4" />
                              </div>
                              <p className="text-lg font-bold text-gray-900">{formatTime(member.avgResolutionTime)}</p>
                              <p className="text-xs text-gray-500">Avg Time</p>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg">
                              <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                                <Star className="w-4 h-4 fill-current" />
                              </div>
                              <p className="text-lg font-bold text-gray-900">{member.satisfactionRate}%</p>
                              <p className="text-xs text-gray-500">Satisfaction</p>
                            </div>
                          </div>
                          
                          {/* Trend info */}
                          <div className={`mt-3 p-2 rounded-lg text-sm flex items-center justify-center gap-2 ${
                            member.trend === 'up' ? 'bg-green-50 text-green-700' :
                            member.trend === 'down' ? 'bg-red-50 text-red-700' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            <TrendingUp className={`w-4 h-4 ${member.trend === 'down' ? 'rotate-180' : ''}`} />
                            {member.trend === 'up' ? `+${member.trendValue}%` : 
                             member.trend === 'down' ? `-${member.trendValue}%` : 
                             'No change'} vs last period
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Show more button */}
        {data.length > 5 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show All ({data.length})
              </>
            )}
          </motion.button>
        )}

        {/* Empty state */}
        {data.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No performance data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
