export default function PilotTimelineSection() {
  const timelineSteps = [
    {
      id: 1,
      title: "Day 1–4: Map & Align",
      description: "We zero in on one pain point, study how your team handles it today, and set the guardrails for AI to take over safely.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Day 5–15: Build",
      description: "We fine-tune AI workers for each step, wire reviewer checkpoints and gates, and run Draft-Only end-to-end.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      color: "from-orange-500 to-orange-600"
    },
    {
      id: 3,
      title: "Day 16–19: Prove",
      description: "We replay your examples, tune prompts/rubrics, set thresholds for Autopilot on low-risk steps, keep high-risk steps Assisted.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      color: "from-green-500 to-green-600"
    },
    {
      id: 4,
      title: "Day 20–21: Go Live",
      description: "We flip proven steps to Autopilot, keep human gates where judgment matters, finalize the weekly scorecard.",
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <section className="bg-blue-50 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight font-century-gothic-black uppercase mb-6">
            From Draft to Autopilot in {' '}
            <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-4 py-1 rounded-lg inline-block not-italic uppercase">Three Weeks</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your AI workflow journey from concept to production in just 21 days. 
            We map your process, build the solution, prove it works, then flip it to autopilot.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Desktop Timeline */}
          <div className="hidden lg:block">
            {/* Connecting Line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-orange-500 via-green-500 to-purple-500 rounded-full"></div>
            
            {/* Timeline Steps */}
            <div className="grid grid-cols-4 gap-8">
              {timelineSteps.map((step) => (
                <div key={step.id} className="relative">
                  {/* Step Card */}
                  <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 font-century-gothic-black uppercase">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden">
            <div className="space-y-8">
              {timelineSteps.map((step, index) => (
                <div key={step.id} className="relative flex items-start">
                  {/* Vertical Line */}
                  {index < timelineSteps.length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-blue-500 to-orange-500"></div>
                  )}
                  
                  {/* Step Card */}
                  <div className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer ml-4 flex-1">
                    <div className="flex items-start space-x-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <div className="w-6 h-6">
                          {step.icon}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 font-century-gothic-black uppercase">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-500 to-orange-500 text-white font-bold py-4 px-8 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Start Your 21-Day Journey
          </button>
        </div>
      </div>
    </section>
  );
}
