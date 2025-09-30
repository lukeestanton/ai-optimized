import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
              <Image src="/AIOLogoDarkV4.svg" alt="AI Optimized Logo" width={160} height={64} />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-white font-century-gothic-black text-base uppercase">
            {/* Learning (dropdown) */}
            <div className="relative group">
              <button className="flex items-center hover:text-yellow-300 transition-all duration-200 uppercase">
                Learning
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Dropdown panel */}
              <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-screen max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40">
                <div className="p-6">
                  <ul className="grid gap-3">
                    <li>
                      <Link href="/learning/what-to-automate" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors normal-case">
                        What to Automate
                      </Link>
                    </li>
                    <li>
                      <Link href="/learning/what-to-automate" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors normal-case">
                        Balh ba base
                      </Link>
                    </li>
                    <li>
                      <Link href="/learning/what-to-automate" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors normal-case">
                        Crazy town
                      </Link>
                    </li>
                    <li>
                      <Link href="/learning/what-to-automate" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors normal-case">
                        Bloody sunday
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Workflow Demos (dropdown) */}
            <div className="relative group">
              <button className="flex items-center hover:text-yellow-300 transition-all duration-200 uppercase">
                Workflow Demos
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Dropdown panel */}
              <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-screen max-w-md bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40">
                <div className="p-6">
                  <ul className="grid gap-3">
                    <li>
                      <Link href="/demo" className="block rounded-lg px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors normal-case">
                        Inquiry-to-Quote Demo
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <Link href="/about" className="hover:text-yellow-300 transition-colors">About</Link>
            <Link href="/pricing" className="hover:text-yellow-300 transition-colors">Pricing</Link>
            <Link href="/contact" className="hover:text-yellow-300 transition-colors">Contact</Link>
          </nav>

          {/* Get Proposal Link */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="cursor-pointer bg-white text-orange-400 px-4 py-2 rounded-full font-century-gothic-black text-base font-bold shadow-lg hover:shadow-xl hover:bg-yellow-400 hover:text-blue-800 transform hover:scale-105 transition-all duration-200 border-2 border-yellow-400">
              GET FREE PROPOSAL
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
