'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { 
  FileText, Clock, User, Tag, MessageSquare, Paperclip, 
  ChevronRight, CheckCircle, AlertCircle, Timer, Users,
  ArrowRight, Sparkles
} from 'lucide-react';

export function TicketDemoSection() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'resolve'>('create');

  return (
    <section className="py-24 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center px-4 py-2 bg-[#0052CC]/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-[#0052CC] mr-2" />
            <span className="text-sm font-semibold text-[#0052CC]">Product Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#172B4D] mb-6 tracking-tight">
            See NexusFlow
            <span className="text-[#0052CC]"> in action</span>
          </h2>
          <p className="text-lg text-gray-500">
            Experience the complete ticket lifecycle from creation to resolution
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-200">
            {[
              { id: 'create', label: 'Create Ticket', icon: FileText },
              { id: 'manage', label: 'Manage Queue', icon: Users },
              { id: 'resolve', label: 'Resolve & Close', icon: CheckCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0052CC] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#0052CC]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Demo Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {activeTab === 'create' && <CreateTicketDemo />}
          {activeTab === 'manage' && <ManageQueueDemo />}
          {activeTab === 'resolve' && <ResolveTicketDemo />}
        </motion.div>
      </div>
    </section>
  );
}

function CreateTicketDemo() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center">
      {/* Form Preview */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-[#172B4D] px-6 py-4 flex items-center justify-between">
          <span className="text-white font-semibold">New Support Request</span>
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
            <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-[#172B4D]">
              Unable to access email on mobile device
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-[#172B4D] flex items-center justify-between">
                <span>Email & Communication</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
              <div className="w-full px-4 py-3 bg-yellow-50 rounded-lg border border-yellow-200 text-yellow-700 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>Medium</span>
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <div className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-600 text-sm h-24">
              I've been trying to set up my work email on my new iPhone but keep getting an authentication error...
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <Paperclip className="w-4 h-4" />
              <span className="text-sm">Attach files</span>
            </button>
          </div>
          <button className="w-full py-3 bg-[#0052CC] hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center justify-center space-x-2">
            <span>Submit Ticket</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Features List */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-[#172B4D]">Smart ticket creation</h3>
        <p className="text-gray-600">
          Intuitive forms with AI-powered suggestions make it easy for employees to submit detailed requests.
        </p>
        <ul className="space-y-4">
          {[
            'Auto-categorization based on keywords',
            'Smart priority suggestions',
            'File attachments up to 25MB',
            'Rich text formatting',
            'Template library for common issues',
          ].map((item, i) => (
            <motion.li 
              key={i} 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-gray-700">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ManageQueueDemo() {
  const tickets = [
    { id: 'TKT-2024', title: 'VPN connection issues', priority: 'high', status: 'In Progress', assignee: 'John D.', sla: '2h left' },
    { id: 'TKT-2023', title: 'New laptop setup request', priority: 'medium', status: 'Open', assignee: 'Unassigned', sla: '4h left' },
    { id: 'TKT-2022', title: 'Password reset for CRM', priority: 'low', status: 'Open', assignee: 'Sarah M.', sla: '8h left' },
    { id: 'TKT-2021', title: 'Printer not responding', priority: 'medium', status: 'Pending', assignee: 'Mike R.', sla: '1h left' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-[#172B4D] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-white font-semibold">Ticket Queue</span>
          <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">24 Open</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 bg-[#0052CC] text-white text-sm rounded-lg">Filter</button>
          <button className="px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg">Sort</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ticket</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assignee</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">SLA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tickets.map((ticket, i) => (
              <motion.tr 
                key={ticket.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-[#172B4D]">{ticket.title}</div>
                    <div className="text-sm text-gray-500">{ticket.id}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    ticket.priority === 'high' ? 'bg-red-100 text-red-600' :
                    ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                    ticket.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-[#0052CC] rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{ticket.assignee}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Timer className={`w-4 h-4 ${
                      ticket.sla.includes('1h') ? 'text-red-500' : 'text-green-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      ticket.sla.includes('1h') ? 'text-red-600' : 'text-gray-600'
                    }`}>{ticket.sla}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResolveTicketDemo() {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Ticket Detail */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-green-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">Ticket Resolved</span>
          </div>
          <span className="text-white/80 text-sm">TKT-2020</span>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#172B4D] mb-2">Email sync issue on mobile</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> Resolved in 1h 23m</span>
            <span className="flex items-center"><User className="w-4 h-4 mr-1" /> By John Doe</span>
          </div>

          {/* Resolution Timeline */}
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-[#172B4D]">Ticket Created</div>
                <div className="text-xs text-gray-500">10:30 AM</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-[#172B4D]">Assigned to John Doe</div>
                <div className="text-xs text-gray-500">10:32 AM</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-[#172B4D]">Solution provided</div>
                <div className="text-xs text-gray-500">11:45 AM</div>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-[#172B4D]">Confirmed resolved</div>
                <div className="text-xs text-gray-500">11:53 AM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Satisfaction Survey */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-[#172B4D] mb-4">Customer Satisfaction</h3>
          <div className="flex items-center justify-center space-x-4 mb-6">
            {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
              <button 
                key={i}
                className={`w-12 h-12 text-2xl rounded-full transition-all ${
                  i === 4 ? 'bg-green-100 ring-2 ring-green-500 scale-110' : 'hover:bg-gray-100'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">Excellent!</div>
            <div className="text-sm text-gray-500">Thank you for your feedback</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0052CC] to-blue-700 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">Resolution Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold">94%</div>
              <div className="text-blue-200 text-sm">First Contact Resolution</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.8/5</div>
              <div className="text-blue-200 text-sm">Avg. Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
