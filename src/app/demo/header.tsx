import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Pause, Download } from 'lucide-react';

export default function Header() {
    return (
        <>
            {/* Gradient Header (Console Top Bar as Header) */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <Image
                src="/AIOLogoDarkV4.svg"
                alt="AI Optimized Logo"
                width={160}
                height={64}
              />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-white">
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  Workflow
                </div>
                <div className="font-century-gothic-black">
                  Inquiry-to-Quote Autopilot
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  Run ID
                </div>
                <div className="font-century-gothic-black">#QO-1027</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">
                  Client
                </div>
                <div className="font-century-gothic-black">
                  Riverton Powerwash Services
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 bg-white/10 text-white font-bold text-sm py-2 px-3 rounded-lg shadow-lg hover:bg-white/20 transition-all">
              <Play className="h-4 w-4" /> Start Run
            </button>
            <button className="inline-flex items-center gap-2 bg-white text-blue-700 border border-white/80 font-bold text-sm py-2 px-3 rounded-lg hover:bg-yellow-50 transition-colors">
              <Pause className="h-4 w-4" /> Pause Workflow
            </button>
            <button className="inline-flex items-center gap-2 bg-white text-blue-700 border border-white/80 font-bold text-sm py-2 px-3 rounded-lg hover:bg-yellow-50 transition-colors">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>
      </div>
    </header>
        </>
    )
}