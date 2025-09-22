'use client';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-700 via-blue-600 to-orange-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Logo and tagline */}
          <div className="lg:col-span-1 space-y-6">
            <Image src="/AIOLogoDarkV3.svg" alt="AI Optimized Logo" width={200} height={75} />
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">
               Governed Automation, Proven <span className="text-cyan-300">Results</span>
              </h3>
            </div>
          </div>

          {/* Learn AI column */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Learn AI</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Automation Basics</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI Basics</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Glossary</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI Resources</a></li>
            </ul>
          </div>

          {/* AI Solutions column */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">AI Solutions</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Content Optimization</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Schema Markup Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI & Digital Marketing Services</a></li>
            </ul>
          </div>

          {/* AI Tools column */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">AI Tools</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI Checker</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Google Analytics</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Google Search Console</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Google PageSpeed Insights</a></li>
            </ul>
          </div>

          {/* Company column */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI Optimized Companies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI Case Studies</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Industries</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-blue-500">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Team attribution */}
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-300 uppercase">Designed, built, and run by AI Optimized</span>
              <div className="flex items-center space-x-3">
                
              </div>
            </div>

            {/* Copyright and links */}
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6 text-sm text-gray-300">
              <span>© 2025 AIOptimized.com</span>
              <div className="flex items-center space-x-4">
                <a href="#" className="hover:text-white transition-colors">Privacy & Terms</a>
                <div className="flex items-center space-x-1">
                  <span className="flag-icon">🇺🇸</span>
                  <span>English</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
