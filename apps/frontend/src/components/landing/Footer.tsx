'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#172B4D] pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* CTA Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to transform your
            <span className="text-[#4C9AFF]"> IT operations?</span>
          </h2>
          <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto">
            Join organizations using NexusFlow to standardize IT delivery and improve organizational resilience.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-[#0052CC] hover:bg-blue-600 text-white font-bold rounded-lg transition-all shadow-lg shadow-[#0052CC]/25"
            >
              Start Free Trial
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-white/20 text-white hover:bg-white/10 font-semibold rounded-lg transition-all"
            >
              Schedule Demo
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16 border-t border-white/10 pt-16">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0052CC] to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-white text-xl font-bold">NexusFlow</span>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed">
              Enterprise IT service management platform built for reliability and transparency.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Product</h4>
            <ul className="space-y-4 text-blue-200 text-sm">
              <li><a href="#features" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition">Security</a></li>
              <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Resources</h4>
            <ul className="space-y-4 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">API Reference</a></li>
              <li><a href="#" className="hover:text-white transition">Case Studies</a></li>
              <li><a href="#" className="hover:text-white transition">Support</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Company</h4>
            <ul className="space-y-4 text-blue-200 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Partners</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-blue-300">
          <p>© 2025 Công ty TNHH 28H. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">SLA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
