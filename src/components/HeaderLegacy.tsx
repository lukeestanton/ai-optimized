import Image from 'next/image';
import Link from 'next/link';

export default function HeaderLegacy() {
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
          <nav className="hidden md:flex space-x-8 text-white">
            {/* AI SERVICES */}
            <div className="relative group">
              <button className="flex items-center hover:text-yellow-300 hover:scale-105 transition-all duration-200 font-century-gothic-black text-base cursor-pointer">
                AI SERVICES
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Large Dropdown Menu */}
              <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-screen max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40">
                <div className="p-8">
                  <div className="grid grid-cols-4 gap-8">
                    {/* Column 1: Getting Started */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">GETTING STARTED</h3>
                      </div>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/services/diagnostic" className="text-gray-700 hover:text-blue-600 transition-colors">AI Opportunity Diagnostic</Link>
                        </li>
                        <li>
                          <Link href="/services/process-mapping" className="text-gray-700 hover:text-blue-600 transition-colors">Process Mapping Sprint</Link>
                        </li>
                        <li>
                          <Link href="/services/workflow-prototype" className="text-gray-700 hover:text-blue-600 transition-colors">Workflow Prototype (2 weeks)</Link>
                        </li>
                        <li>
                          <Link href="/services/pilot" className="text-gray-700 hover:text-blue-600 transition-colors">Pilot Implementation</Link>
                        </li>
                        <li>
                          <Link href="/services/retainer" className="text-gray-700 hover:text-blue-600 transition-colors">Coaching & Retainer</Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 2: Core Services */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">CORE SERVICES</h3>
                      </div>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/services/lead-to-quote" className="text-gray-700 hover:text-blue-600 transition-colors">Lead-to-Quote Autopilots</Link>
                        </li>
                        <li>
                          <Link href="/services/support-copilot" className="text-gray-700 hover:text-blue-600 transition-colors">Support Inbox Copilot</Link>
                        </li>
                        <li>
                          <Link href="/services/ops-automation" className="text-gray-700 hover:text-blue-600 transition-colors">Back-Office Automations</Link>
                        </li>
                        <li>
                          <Link href="/services/knowledge-chat" className="text-gray-700 hover:text-blue-600 transition-colors">Knowledgebase Search & Chat</Link>
                        </li>
                        <li>
                          <Link href="/services/guardrails" className="text-gray-700 hover:text-blue-600 transition-colors">Agent Handoff & Guardrails</Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 3: Industries*/}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">INDUSTRIES</h3>
                      </div>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/industries/home-services" className="text-gray-700 hover:text-blue-600 transition-colors">Home Services</Link>
                        </li>
                        <li>
                          <Link href="/industries/agencies" className="text-gray-700 hover:text-blue-600 transition-colors">Agencies</Link>
                        </li>
                        <li>
                          <Link href="/industries/clinics" className="text-gray-700 hover:text-blue-600 transition-colors">Clinics & Practices</Link>
                        </li>
                        <li>
                          <Link href="/industries/ecommerce" className="text-gray-700 hover:text-blue-600 transition-colors">E-commerce & Retail</Link>
                        </li>
                        <li>
                          <Link href="/industries/logistics" className="text-gray-700 hover:text-blue-600 transition-colors">Logistics & Trades</Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 4: CTA Card */}
                    <div>
                      <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex space-x-2 mb-4">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Ready to Transform Your Business?</h4>
                        <p className="text-sm text-gray-600 mb-4">Get a free AI assessment and discover how AI can revolutionize your operations.</p>
                        <Link href="/contact" className="inline-block bg-gradient-to-r from-blue-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 text-sm">
                          Get Free Assessment
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI STRATEGIES */}
            <div className="relative group">
              <button className="flex items-center hover:text-yellow-300 hover:scale-105 transition-all duration-200 font-century-gothic-black text-base cursor-pointer">
                AI STRATEGIES
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Large Dropdown Menu */}
              <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-screen max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40">
                <div className="p-8">
                  <div className="grid grid-cols-4 gap-8">
                    {/* Column 1: Strategy Types */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">STRATEGY TYPES</h3>
                      </div>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/strategies/workflow-first" className="text-gray-700 hover:text-blue-600 transition-colors">Workflow-First Strategy</Link>
                        </li>
                        <li>
                          <Link href="/strategies/agentic" className="text-gray-700 hover:text-blue-600 transition-colors">Agentic Automation</Link>
                        </li>
                        <li>
                          <Link href="/strategies/hitl" className="text-gray-700 hover:text-blue-600 transition-colors">Human-in-the-Loop Design</Link>
                        </li>
                        <li>
                          <Link href="/strategies/data-readiness" className="text-gray-700 hover:text-blue-600 transition-colors">Data Readiness & RAG</Link>
                        </li>
                        <li>
                          <Link href="/strategies/vendor-stack" className="text-gray-700 hover:text-blue-600 transition-colors">Vendor Stack & Buy/Build</Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 2: Implementation */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">IMPLEMENTATION</h3>
                      </div>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/strategies/architecture" className="text-gray-700 hover:text-blue-600 transition-colors">Technical Architecture</Link>
                        </li>
                        <li>
                          <Link href="/strategies/integrations" className="text-gray-700 hover:text-blue-600 transition-colors">Integrations & Tools</Link>
                        </li>
                        <li>
                          <Link href="/strategies/evaluation" className="text-gray-700 hover:text-blue-600 transition-colors">Evaluation & QA</Link>
                        </li>
                        <li>
                          <Link href="/strategies/rollout" className="text-gray-700 hover:text-blue-600 transition-colors">Rollout & Change Mgmt</Link>
                        </li>
                        <li>
                          <Link href="/strategies/roi-measurement" className="text-gray-700 hover:text-blue-600 transition-colors">ROI Measurement</Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 3: Best Practices */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">BEST PRACTICES</h3>
                      </div>
                      <ul className="space-y-3">
                        <li><Link href="/strategies/prompt-standards" className="text-gray-700 hover:text-blue-600 transition-colors">Prompt Standards & Versioning</Link></li>
                        <li><Link href="/strategies/security" className="text-gray-700 hover:text-blue-600 transition-colors">Security & PII Handling</Link></li>
                        <li><Link href="/strategies/compliance" className="text-gray-700 hover:text-blue-600 transition-colors">Compliance & Audit Trails</Link></li>
                        <li><Link href="/strategies/incident-response" className="text-gray-700 hover:text-blue-600 transition-colors">Incident Response for AI</Link></li>
                        <li><Link href="/strategies/team-enablement" className="text-gray-700 hover:text-blue-600 transition-colors">Team Enablement</Link></li>
                      </ul>
                    </div>

                    {/* Column 4: CTA Card */}
                    <div>
                      <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex space-x-2 mb-4">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Strategic AI Planning</h4>
                        <p className="text-sm text-gray-600 mb-4">Get a comprehensive AI strategy tailored to your business goals and industry.</p>
                        <Link href="/strategies/consultation" className="inline-block bg-gradient-to-r from-blue-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 text-sm">
                          Get Strategy Session
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI RESOURCES */}
            <div className="relative group">
              <button className="flex items-center hover:text-yellow-300 hover:scale-105 transition-all duration-200 font-century-gothic-black text-base cursor-pointer">
                AI RESOURCES
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Large Dropdown Menu */}
              <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-screen max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40">
                <div className="p-8">
                  <div className="grid grid-cols-4 gap-8">
                    {/* Column 1: Learning */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.482 0l5.5-2.35a1 1 0 00.89-.89 11.115 11.115 0 01.25 3.762 8.968 8.968 0 00-1.05.174L9.3 16.573z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">LEARNING</h3>
                      </div>
                      <ul className="space-y-3">
                        <li><Link href="/resources/what-to-automate" className="text-gray-700 hover:text-blue-600 transition-colors">What to Automate</Link></li>
                        <li><Link href="/resources/webinars" className="text-gray-700 hover:text-blue-600 transition-colors">Webinars & Training</Link></li>
                        <li><Link href="/resources/certifications" className="text-gray-700 hover:text-blue-600 transition-colors">AI Certifications</Link></li>
                        <li><Link href="/resources/case-studies" className="text-gray-700 hover:text-blue-600 transition-colors">Case Studies</Link></li>
                        <li><Link href="/resources/whitepapers" className="text-gray-700 hover:text-blue-600 transition-colors">White Papers</Link></li>
                      </ul>
                    </div>

                    {/* Column 2: Tools */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">TOOLS</h3>
                      </div>
                      <ul className="space-y-3">
                        <li><Link href="/resources/ai-tools" className="text-gray-700 hover:text-blue-600 transition-colors">AI Tool Directory</Link></li>
                        <li><Link href="/resources/calculators" className="text-gray-700 hover:text-blue-600 transition-colors">ROI Calculators</Link></li>
                        <li><Link href="/resources/templates" className="text-gray-700 hover:text-blue-600 transition-colors">AI Templates</Link></li>
                        <li><Link href="/resources/checklists" className="text-gray-700 hover:text-blue-600 transition-colors">Implementation Checklists</Link></li>
                        <li><Link href="/resources/assessments" className="text-gray-700 hover:text-blue-600 transition-colors">AI Readiness Assessment</Link></li>
                      </ul>
                    </div>

                    {/* Column 3: Community */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">COMMUNITY</h3>
                      </div>
                      <ul className="space-y-3">
                        <li><Link href="/resources/blog" className="text-gray-700 hover:text-blue-600 transition-colors">AI Blog</Link></li>
                        <li><Link href="/resources/newsletter" className="text-gray-700 hover:text-blue-600 transition-colors">Newsletter</Link></li>
                        <li><Link href="/resources/events" className="text-gray-700 hover:text-blue-600 transition-colors">Events & Conferences</Link></li>
                        <li><Link href="/resources/forums" className="text-gray-700 hover:text-blue-600 transition-colors">Community Forums</Link></li>
                        <li><Link href="/resources/partners" className="text-gray-700 hover:text-blue-600 transition-colors">Partner Network</Link></li>
                      </ul>
                    </div>

                    {/* Column 4: CTA Card */}
                    <div>
                      <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex space-x-2 mb-4">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Stay AI-Informed</h4>
                        <p className="text-sm text-gray-600 mb-4">Get the latest AI insights, tools, and strategies delivered to your inbox.</p>
                        <Link href="/resources/newsletter" className="inline-block bg-gradient-to-r from-blue-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 text-sm">
                          Subscribe Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI WORKFLOWS */}
            <div className="relative group">
              <button className="flex items-center hover:text-yellow-300 hover:scale-105 transition-all duration-200 font-century-gothic-black text-base cursor-pointer">
                AI WORKFLOWS
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Large Dropdown Menu */}
              <div className="fixed top-16 left-1/2 transform -translate-x-1/2 w-screen max-w-6xl bg-white rounded-xl shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-40">
                <div className="p-8">
                  <div className="grid grid-cols-4 gap-8">
                    {/* Column 1: Live Demos */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">LIVE DEMOS</h3>
                      </div>
                      <ul className="space-y-3">
                        <li>
                          <Link href="/workflows/revenue-rescuer-demo" className="text-gray-700 hover:text-blue-600 transition-colors">Revenue Rescuer (Lawn)</Link>
                        </li>
                        <li>
                          <Link href="/workflows/claims-triage-demo" className="text-gray-700 hover:text-blue-600 transition-colors">Claims Intake Triage</Link>
                        </li>
                        <li>
                          <Link href="/workflows/subcontractor-compliance-demo" className="text-gray-700 hover:text-blue-600 transition-colors">Subcontractor Compliance</Link>
                        </li>
                        <li>
                          <Link href="/workflows/evidence-intake-demo" className="text-gray-700 hover:text-blue-600 transition-colors">Evidence Intake</Link>
                        </li>
                        <li>
                          <Link href="/workflows/inquiry-to-quote-demo" className="text-gray-700 hover:text-blue-600 transition-colors">Inquiry-to-Quote</Link>
                        </li>
                      </ul>
                    </div>

                    {/* Column 2: Workflow Types */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">WORKFLOW TYPES</h3>
                      </div>
                      <ul className="space-y-3">
                        <li><Link href="/workflows/revenue" className="text-gray-700 hover:text-blue-600 transition-colors">Revenue & Upsell Loops</Link></li>
                        <li><Link href="/workflows/support" className="text-gray-700 hover:text-blue-600 transition-colors">Support & CX</Link></li>
                        <li><Link href="/workflows/ops" className="text-gray-700 hover:text-blue-600 transition-colors">Ops & Back-Office</Link></li>
                        <li><Link href="/workflows/sales" className="text-gray-700 hover:text-blue-600 transition-colors">Sales & Outreach</Link></li>
                        <li><Link href="/workflows/data" className="text-gray-700 hover:text-blue-600 transition-colors">Data & ETL Summaries</Link></li>
                      </ul>
                    </div>

                    {/* Column 3: Implementation (Workflow Anatomy) */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm uppercase">IMPLEMENTATION</h3>
                      </div>
                      <ul className="space-y-3">
                        <li><Link href="/workflows/guardrails" className="text-gray-700 hover:text-blue-600 transition-colors">Guardrails Library</Link></li>
                        <li><Link href="/workflows/tooling" className="text-gray-700 hover:text-blue-600 transition-colors">Tools & Agent Connectors</Link></li>
                        <li><Link href="/workflows/orchestrator" className="text-gray-700 hover:text-blue-600 transition-colors">Branching Orchestrator</Link></li>
                        <li><Link href="/workflows/human-review" className="text-gray-700 hover:text-blue-600 transition-colors">Human Review Console</Link></li>
                        <li><Link href="/workflows/analytics" className="text-gray-700 hover:text-blue-600 transition-colors">Analytics & A/B Tests</Link></li>
                      </ul>
                    </div>

                    {/* Column 4: CTA Card */}
                    <div>
                      <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 border border-gray-100">
                        <div className="flex space-x-2 mb-4">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">See AI Workflows in Action</h4>
                        <p className="text-sm text-gray-600 mb-4">Experience how AI can automate your business processes with our interactive demos.</p>
                        <Link href="/demo" className="inline-block bg-gradient-to-r from-blue-500 to-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-orange-600 transition-all duration-300 text-sm">
                          Try Demo Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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


