import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-md mx-auto">

        {/* 404 Error */}
        <div className="mb-6">
          <h1 className="text-8xl font-century-gothic-black font-bold mb-2">404</h1>
          <h2 className="text-2xl font-century-gothic-black font-bold uppercase">Page Not Found</h2>
        </div>

        {/* Message */}
        <p className="text-lg mb-8 text-blue-100">
          Looks like this page didn&apos;t pass the review gate. Don&apos;t worry, we&apos;ll help you get back on track.
        </p>

        {/* Navigation */}
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-white text-blue-600 font-century-gothic-black font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Return Home
          </Link>
          
          <div className="text-sm text-blue-200">
            or explore our{' '}
            <Link href="/quote-to-order" className="text-yellow-300 hover:text-yellow-200 underline">
              AI Workflows Demo
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-orange-300 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-blue-300 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
}
