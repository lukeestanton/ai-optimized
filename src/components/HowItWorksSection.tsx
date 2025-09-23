'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function HowItWorksSection() {
  const [showModal, setShowModal] = useState(false);

  // Loom embed configuration (placeholder URL)
  const loomUrl = 'https://www.loom.com/embed/473fad25ebd24b5ea8091503253dfecf?sid=509c34fa-d46d-4ca6-8cda-6625220a261e';

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: Video */}
          <div className="flex flex-col">
            <div id="how-video" className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                <div className="hidden lg:block absolute inset-0">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`${loomUrl}?autoplay=false&muted=1&hide_speed=true&hideEmbedTopBar=true`}
                    title="Draft → Autopilot in 60 seconds"
                    allow="autoplay; encrypted-media"
                  />
                </div>
                <div className="lg:hidden absolute inset-0">
                  <button type="button" onClick={() => setShowModal(true)} className="w-full h-full relative">
                    <Image
                      src="/AboutPortraitPlaceholder.jpg"
                      alt="Draft → Autopilot in 60 seconds"
                      fill
                      className="object-cover"
                      priority={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/90 shadow-md">
                        <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                      </span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="font-semibold text-gray-900">Draft → Autopilot in 60 seconds</div>
                <div className="text-sm text-gray-600">Support example; same system for Sales & Ops</div>
              </div>
            </div>
          </div>

          {/* Right: Title and description */}
          <div className="space-y-4 lg:space-y-6 flex flex-col">
            <h2 className="text-2xl lg:text-4xl font-bold leading-tight text-white font-century-gothic-black uppercase">
            A smarter way to automate complex business{' '}
              <span className="bg-white px-3 py-1 rounded-xl inline-block align-baseline">
                <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">Processes</span>
              </span>
            </h2>
            <div className="space-y-3">
              <p className="text-lg text-white/90">
                We begin by identifying areas of your business where complex work can be automated.
                Then, we break those processes into controlled steps and build AI workers fine-tuned to complete each task.
                After every step, the work passes through a review checkpoint with either another AI auditing quality or a human reviewer for steps that require judgment.
              </p>
              <p className="text-lg text-white/90">
                From there, the system decides whether the step advances or loops back for correction, ensuring the workflow continues only when output meets your standards.
                The result is a seamless chain of AI and human oversight where even complex processes run reliably end-to-end.
                Every action is logged and measurable, giving you efficiency without sacrificing control.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile modal for Loom */}
      {showModal && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-[92%] max-w-xl overflow-hidden">
            <div className="relative aspect-video bg-gray-100">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`${loomUrl}?autoplay=1&muted=1`}
                title="Draft → Autopilot in 60 seconds"
                allow="autoplay; encrypted-media"
              />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Draft → Autopilot in 60 seconds</div>
                <div className="text-sm text-gray-600">Support example; same system for Sales & Ops</div>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="p-2 rounded-md hover:bg-gray-100" aria-label="Close">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


