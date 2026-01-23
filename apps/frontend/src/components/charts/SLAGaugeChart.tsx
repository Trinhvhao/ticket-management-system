'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface SLAGaugeChartProps {
  value: number; // 0-100
  target?: number; // Target percentage
  breachedCount?: number;
  atRiskCount?: number;
}

export default function SLAGaugeChart({ 
  value, 
  target = 95, 
  breachedCount = 0, 
  atRiskCount = 0 
}: SLAGaugeChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animated value
  const springValue = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(springValue, (v) => Math.round(v));
  
  useEffect(() => {
    setIsVisible(true);
    springValue.set(value);
  }, [value, springValue]);

  // Calculate gauge parameters
  const radius = 80;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const startAngle = -225;
  const endAngle = 45;
  const totalAngle = endAngle - startAngle;
  
  // Color based on value
  const getColor = (val: number) => {
    if (val >= 95) return { main: '#10B981', light: '#D1FAE5', gradient: ['#10B981', '#059669'] };
    if (val >= 80) return { main: '#F59E0B', light: '#FEF3C7', gradient: ['#F59E0B', '#D97706'] };
    return { main: '#EF4444', light: '#FEE2E2', gradient: ['#EF4444', '#DC2626'] };
  };
  
  const colors = getColor(value);
  const targetColors = getColor(target);

  // SVG arc path
  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const describeArc = (cx: number, cy: number, r: number, startAng: number, endAng: number) => {
    const start = polarToCartesian(cx, cy, r, endAng);
    const end = polarToCartesian(cx, cy, r, startAng);
    const largeArcFlag = endAng - startAng <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  const valueAngle = startAngle + (value / 100) * totalAngle;
  const targetAngle = startAngle + (target / 100) * totalAngle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow relative overflow-hidden group"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-yellow-50/20 to-red-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3" />
          Tuân thủ SLA
        </h3>

        <div className="flex flex-col items-center">
          {/* Gauge SVG */}
          <div className="relative w-48 h-32">
            <svg viewBox="0 0 200 120" className="w-full h-full">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={colors.gradient[0]} />
                  <stop offset="100%" stopColor={colors.gradient[1]} />
                </linearGradient>
                <filter id="gaugeShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={colors.main} floodOpacity="0.3"/>
                </filter>
                <filter id="glowFilter">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Background arc */}
              <path
                d={describeArc(100, 100, radius, startAngle, endAngle)}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {/* Value arc - animated */}
              <motion.path
                d={describeArc(100, 100, radius, startAngle, valueAngle)}
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                filter="url(#gaugeShadow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isVisible ? 1 : 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              {/* Target marker */}
              {target && (
                <g>
                  <motion.circle
                    cx={polarToCartesian(100, 100, radius, targetAngle).x}
                    cy={polarToCartesian(100, 100, radius, targetAngle).y}
                    r="6"
                    fill="white"
                    stroke={targetColors.main}
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  />
                  <motion.text
                    x={polarToCartesian(100, 100, radius + 20, targetAngle).x}
                    y={polarToCartesian(100, 100, radius + 20, targetAngle).y}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    Target
                  </motion.text>
                </g>
              )}

              {/* Scale markers */}
              {[0, 25, 50, 75, 100].map((mark) => {
                const angle = startAngle + (mark / 100) * totalAngle;
                const pos = polarToCartesian(100, 100, radius + 15, angle);
                return (
                  <text
                    key={mark}
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-400"
                  >
                    {mark}
                  </text>
                );
              })}
            </svg>

            {/* Center value */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <motion.span 
                className="text-4xl font-bold"
                style={{ color: colors.main }}
              >
                <motion.span>{displayValue}</motion.span>%
              </motion.span>
              <span className="text-xs text-gray-500 mt-1">Tỷ lệ tuân thủ</span>
            </div>
          </div>

          {/* Status indicators */}
          <div className="grid grid-cols-2 gap-4 mt-6 w-full">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{breachedCount}</p>
                <p className="text-xs text-red-600/70">Vi phạm SLA</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{atRiskCount}</p>
                <p className="text-xs text-yellow-600/70">Có rủi ro</p>
              </div>
            </motion.div>
          </div>

          {/* Status message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className={`mt-4 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${
              value >= target 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {value >= target ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Đạt mục tiêu SLA
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                Dưới mục tiêu ({target}%)
              </>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
