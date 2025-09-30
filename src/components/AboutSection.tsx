import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="bg-blue-50 py-10 lg:py-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Placeholder. MAKE ACTUAL PIC */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <Image 
                src="/AboutPortraitPlaceholder.jpg" 
                alt="AI Optimized Team" 
                width={600} 
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Right side - About content */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
              About AI Optimized
            </h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                AI Optimized is a team of software engineers, AI researchers, and marketing 
                experts who design, build, and maintain AI workflows your team actually uses. 
                We plug modern AI into the work that moves your business: support, sales, knowledge 
                upkeep, and back-office ops, so handoffs get faster, bottlenecks shrink, and 
                outcomes are measurable in hours saved, response times, and conversion lift.
              </p>
              <p>
                When you choose AI Optimized as your AI workflow partner, you won’t get a cookie-cutter 
                playbook. We take the time to learn your processes, tools, compliance needs, and success 
                metrics, then map a clear workflow, pilot it quickly (often within 14 days), and improve 
                it with human-in-the-loop controls, security you can explain, and a monthly tuning 
                cadence, so you reach your goals with reliable, repeatable workflows.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
