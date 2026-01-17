'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Camera, Brain, Smile, Frown, Meh, AlertTriangle, CheckCircle, Cpu, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';

export function AIFeaturesSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full mb-6">
            <Brain className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-semibold text-purple-600">AI-Powered Intelligence</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#172B4D] mb-6 tracking-tight">
            Next-gen AI that
            <span className="text-[#0052CC]"> understands context</span>
          </h2>
          <p className="text-lg text-gray-500">
            Leverage computer vision and NLP to automate triage, detect sentiment, and resolve issues faster
          </p>
        </motion.div>

        {/* Two Column Features */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visual Triage - Computer Vision */}
          <motion.div
            className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 p-8 overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-[#0052CC] rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#172B4D]">Visual Triage</h3>
                <p className="text-sm text-gray-500">YOLO-powered detection</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Upload a photo of damaged hardware — AI automatically identifies the device type, 
              detects issues, and creates a categorized ticket.
            </p>

            <VisualTriageDemo />
          </motion.div>

          {/* Sentiment Analysis - NLP */}
          <motion.div
            className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 p-8 overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#172B4D]">Sentiment Analysis</h3>
                <p className="text-sm text-gray-500">NLP emotion detection</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              AI analyzes ticket content to detect user frustration levels, 
              automatically prioritizing urgent cases for faster resolution.
            </p>

            <SentimentAnalysisDemo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function VisualTriageDemo() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setIsScanning(true), 1000);
    const timer2 = setTimeout(() => {
      setIsScanning(false);
      setScanComplete(true);
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative">
      {/* Laptop Mockup Container */}
      <div className="relative">
        {/* Laptop Frame */}
        <div className="relative bg-gray-800 rounded-t-2xl p-3 shadow-2xl">
          {/* Screen Bezel */}
          <div className="bg-gray-900 rounded-lg p-2 relative overflow-hidden">
            {/* Screen Content - Simulated Broken Laptop Display */}
            <div className="aspect-video bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded relative overflow-hidden">
              {/* Simulated Screen with Damage */}
              <div className="absolute inset-0 bg-blue-900/20"></div>
              
              {/* Crack Effect */}
              <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 300">
                <path d="M 200 150 L 250 100 L 280 120 M 200 150 L 180 180 L 160 220" 
                      stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none"/>
                <path d="M 200 150 L 220 120 L 240 90" 
                      stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>
              </svg>
              
              {/* Dead Pixels Area */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-24 h-16 bg-black/60 rounded-lg blur-sm"></div>
              
              {/* Warning Icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <AlertTriangle className="w-12 h-12 text-red-400/80" />
              </div>

              {/* Scanning Animation */}
              {isScanning && (
                <motion.div 
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Scan Line */}
                  <motion.div 
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-lg shadow-green-400/50"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  {/* Corner Brackets */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-green-400 animate-pulse"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-green-400 animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-green-400 animate-pulse"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-green-400 animate-pulse"></div>
                </motion.div>
              )}

              {/* Detection Boxes */}
              {scanComplete && (
                <motion.div 
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Laptop Detection Box */}
                  <motion.div 
                    className="absolute inset-4 border-2 border-green-400 rounded-lg shadow-lg shadow-green-400/30"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="absolute -top-7 left-2 bg-green-500 text-white text-xs px-3 py-1 rounded-md font-mono shadow-lg">
                      Laptop: 98.5%
                    </div>
                  </motion.div>
                  
                  {/* Screen Damage Detection Box */}
                  <motion.div 
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-28 h-20 border-2 border-red-400 rounded shadow-lg shadow-red-400/30"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="absolute -top-7 left-0 bg-red-500 text-white text-xs px-3 py-1 rounded-md font-mono whitespace-nowrap shadow-lg">
                      Screen Damage: 94.2%
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Status Badge */}
              <div className="absolute top-2 right-2 flex items-center space-x-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                <Eye className="w-3 h-3 text-green-400" />
                <span className="text-xs text-white font-mono">
                  {isScanning ? 'Analyzing...' : scanComplete ? 'Complete' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Camera Notch */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-950 rounded-full"></div>
        </div>
        
        {/* Laptop Base */}
        <div className="h-3 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-2xl shadow-xl"></div>
        <div className="h-1 bg-gray-600 mx-auto w-3/4 rounded-b-lg"></div>
      </div>

      {/* Auto-generated Ticket */}
      {scanComplete && (
        <motion.div 
          className="mt-6 bg-white rounded-xl border border-gray-200 p-4 shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-gray-400">Auto-generated ticket</span>
            <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">HIGH</span>
          </div>
          <div className="text-sm font-semibold text-[#172B4D]">Hardware: Laptop Screen Damage</div>
          <div className="text-xs text-gray-500 mt-1">Category: Hardware → Display → Physical Damage</div>
        </motion.div>
      )}
    </div>
  );
}

function SentimentAnalysisDemo() {
  const [activeIndex, setActiveIndex] = useState(0);

  const tickets = [
    {
      text: "This is UNACCEPTABLE! My laptop has been broken for 3 days and nobody is helping!!!",
      sentiment: 'negative',
      score: 92,
      priority: 'URGENT',
      emotion: 'Frustrated',
      icon: Frown,
      color: 'red'
    },
    {
      text: "Hi, could you please help me reset my password when you get a chance? Thanks!",
      sentiment: 'positive',
      score: 78,
      priority: 'LOW',
      emotion: 'Polite',
      icon: Smile,
      color: 'green'
    },
    {
      text: "The printer on floor 3 is not working again. Need it fixed.",
      sentiment: 'neutral',
      score: 45,
      priority: 'MEDIUM',
      emotion: 'Neutral',
      icon: Meh,
      color: 'yellow'
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % tickets.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const current = tickets[activeIndex];
  const Icon = current.icon;

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Ticket Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-gray-500">U</span>
          </div>
          <div className="flex-1">
            <motion.p 
              key={activeIndex}
              className="text-sm text-[#172B4D] leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              "{current.text}"
            </motion.p>
          </div>
        </div>
      </div>

      {/* AI Analysis Result */}
      <motion.div 
        key={activeIndex}
        className="bg-gradient-to-br from-purple-50 via-blue-50 to-purple-50 rounded-xl border border-purple-200 p-5 flex-1 flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600">NLP Analysis</span>
          </div>
          <span className="text-xs text-gray-400 font-mono">Processing: 0.3s</span>
        </div>

        <div className="grid grid-cols-3 gap-4 flex-1">
          {/* Emotion */}
          <div className="text-center flex flex-col justify-center">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center shadow-md ${
              current.color === 'red' ? 'bg-red-100' : 
              current.color === 'green' ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <Icon className={`w-6 h-6 ${
                current.color === 'red' ? 'text-red-500' : 
                current.color === 'green' ? 'text-green-500' : 'text-yellow-500'
              }`} />
            </div>
            <div className="text-xs text-gray-500 mb-1">Emotion</div>
            <div className="text-sm font-bold text-[#172B4D]">{current.emotion}</div>
          </div>

          {/* Score */}
          <div className="text-center flex flex-col justify-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center shadow-md">
              <span className="text-lg font-bold text-purple-600">{current.score}</span>
            </div>
            <div className="text-xs text-gray-500 mb-1">Urgency</div>
            <div className="text-sm font-bold text-[#172B4D]">{current.score}%</div>
          </div>

          {/* Priority */}
          <div className="text-center flex flex-col justify-center">
            <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center shadow-md ${
              current.priority === 'URGENT' ? 'bg-red-100' : 
              current.priority === 'LOW' ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              <CheckCircle className={`w-6 h-6 ${
                current.priority === 'URGENT' ? 'text-red-500' : 
                current.priority === 'LOW' ? 'text-green-500' : 'text-yellow-500'
              }`} />
            </div>
            <div className="text-xs text-gray-500 mb-1">Auto-Priority</div>
            <div className={`text-sm font-bold ${
              current.priority === 'URGENT' ? 'text-red-600' : 
              current.priority === 'LOW' ? 'text-green-600' : 'text-yellow-600'
            }`}>{current.priority}</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-purple-200">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Confidence Level</span>
            <span className="font-bold text-purple-600">High (94%)</span>
          </div>
          <div className="mt-2 w-full bg-purple-100 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '94%' }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Indicator Dots */}
      <div className="flex justify-center space-x-2 pt-2">
        {tickets.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === activeIndex ? 'bg-purple-600 w-6' : 'bg-gray-300 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
