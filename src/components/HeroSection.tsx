'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  return (
    <>
      <section className="bg-blue-50 py-12 lg:py-16 pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 leading-tight font-century-gothic-black uppercase">
                 Automate What Works with AI {' '}
                  <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-4 py-0 rounded-lg inline-block not-italic">
                     Workflows
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                   Fill in the form to see how we can help you reach your business goals with AI in {new Date().getFullYear()}.
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900 capitalize">End-to-end workflow design -</span>
                    <span className="text-gray-600"> We map your current process, identify blockers, choose data sources (docs, email, CRM), and define guardrails so the workflow is clear, safe, and owned by your team.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">AI that actually does the work -</span>
                    <span className="text-gray-600"> Answers customers, updates the CRM, files docs, and moves the task forward, then asks for approval only when it should.</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900 capitalize">Humans where judgment wins -</span>
                    <span className="text-gray-600"> Refunds, pricing, and edge cases go to your team with a ready-to-send draft (approve, edit, or escalate in one click).</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <span className="font-semibold text-gray-900">Start in Draft, then Autopilot -</span>
                    <span className="text-gray-600"> We prove it against your team’s baseline, then flip the proven steps to auto to win back hours fast.</span>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <ReviewsCarousel />
              
            </div>

            {/* Right */}
            <div className="lg:ml-8 mt-8 lg:mt-0">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactForm() {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 rounded-2xl shadow-lg p-6 sm:p-7 pb-6 sm:pb-8 text-white flex flex-col lg:min-h-[800px]">
      <div className="flex justify-center mb-6">
        <Image src="/AIOLogoDarkV4.svg" alt="AI Optimized Logo" width={200} height={80} />
      </div>

      <form className="space-y-4 sm:space-y-6 flex-1 flex flex-col">
        {/* Full Name */}
        <div>
          <label className="block text-base font-medium mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Full Name *"
            className="w-full px-5 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-base font-medium mb-2">Email</label>
          <input
            type="text"
            placeholder="Email Address *"
            className="w-full px-5 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base"
          />
        </div>

        {/* Company and Website */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium mb-2">Company</label>
            <input
              type="text"
              placeholder="Company *"
              className="w-full px-5 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base"
            />
          </div>
          <div>
            <label className="block text-base font-medium mb-2">Website</label>
            <input
              type="url"
              placeholder="Website *"
              className="w-full px-5 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none text-base"
            />
          </div>
        </div>

        {/* Comments */}
        <div className="flex-1 flex flex-col">
          <label className="block text-base font-medium mb-2">Comments or Questions</label>
          <textarea
            rows={4}
            placeholder="What's your business's biggest bottleneck?"
            className="w-full px-5 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 border-0 focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none text-base flex-1 min-h-[100px] lg:min-h-[200px]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-white font-bold py-5 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg mt-auto"
        >
          <span className="bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-text text-transparent">Get My Free Proposal</span>
        </button>
      </form>
    </div>
  );
}

function ReviewsCarousel() {
  const reviews = [
    {
      id: 1,
      text: "AI Optimized transformed our customer service workflow. Response time improved by 60% and customer satisfaction is at an all-time high!",
      author: "Sarah Chen",
      company: "TechFlow Solutions",
      rating: 5
    },
    {
      id: 2,
      text: "The custom AI workflow they built for our sales process has increased our conversion rate by 45%. Incredible results! Would definitely recommend!",
      author: "Michael Rodriguez",
      company: "Growth Dynamics",
      rating: 5
    },
    {
      id: 3,
      text: "Outstanding service! They understood our complex requirements and delivered a solution that exceeded expectations. Highly recommend! The team is always available.",
      author: "Emily Watson",
      company: "InnovateCorp",
      rating: 5
    },
    {
      id: 4,
      text: "The ROI from their AI optimization was visible within the first month. Our team productivity has never been higher. Can't wait to see what they can do for us next!",
      author: "David Park",
      company: "NextGen Industries",
      rating: 5
    },
    {
      id: 5,
      text: "Professional, efficient, and results-driven. They helped us automate processes we didn't even know could be automated. Loved working with them!",
      author: "Lisa Thompson",
      company: "Future Forward",
      rating: 5
    }
  ];

  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000); // Swap: 4 secs

    return () => clearInterval(interval);
  }, [reviews.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <svg key={i} className="w-6 h-6 text-orange-400 fill-current" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-xl border-2 border-transparent" style={{background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #3b82f6, #f97316) border-box', border: '2px solid transparent'}}>
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentReview * 100}%)` }}
        >
          {reviews.map((review) => (
            <div key={review.id} className="w-full flex-shrink-0">
              <blockquote className="text-gray-600 italic mb-4 leading-relaxed">
                &quot;{review.text}&quot;
              </blockquote>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {review.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900 text-sm">{review.author}</div>
                    <div className="text-gray-500 text-xs">{review.company}</div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {renderStars(review.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentReview(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentReview ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

