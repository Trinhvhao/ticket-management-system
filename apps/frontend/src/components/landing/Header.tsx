'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed w-full bg-[#172B4D] z-50 shadow-lg">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-[#0052CC] to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <span className="text-white text-xl font-bold tracking-tight">NexusFlow</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-gray-300 text-sm font-medium">
          <a href="#features" className="hover:text-white transition-colors">Giải pháp</a>
          <a href="#workflow" className="hover:text-white transition-colors">Tự động hóa</a>
          <a href="#" className="hover:text-white transition-colors">Phân tích AI</a>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/login" className="hidden md:inline-block text-sm text-gray-300 hover:text-white font-medium transition">
            Đăng nhập
          </Link>
          <Link 
            href="/register" 
            className="px-5 py-2 bg-[#0052CC] hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-all"
          >
            Dùng thử miễn phí
          </Link>
        </div>
      </nav>
    </header>
  );
}
