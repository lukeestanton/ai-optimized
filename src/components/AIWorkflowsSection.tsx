'use client';
import { useState } from 'react';
import { Car, Building2, Stethoscope, Calendar, Ship, Scale, Apple } from 'lucide-react';

interface WorkflowService {
  id: string;
  workflowName: string;
  businessName: string;
  icon: React.ComponentType<{ className?: string }>;
  challenge: string;
  workflow: string[];
  result: string[];
}

const workflowServices: WorkflowService[] = [
  {
    id: 'auto-parts',
    workflowName: 'Custom Order Fulfillment Workflow',
    businessName: 'Specialty Auto Parts Supplier',
    icon: Car,
    challenge: 'Every custom order required manual coordination: checking parts availability across multiple warehouses, validating compatibility with the customer\'s vehicle model, generating shipping quotes, and emailing confirmation. Staff spent hours per order.',
    workflow: [
      'AI worker parses customer\'s order form and VIN number',
      'Cross-checks parts availability across 3 warehouse systems',
      'Validates compatibility using technical docs + prior order history',
      'Drafts a shipping plan (best carrier, cost, delivery window)',
      'Routes to AI reviewer → flags errors (wrong model, low stock)',
      'If flagged, escalates to human reviewer',
      'If approved, generates invoice + confirmation email',
      'Syncs data into ERP + CRM',
      'Logs all actions for audit'
    ],
    result: [
      'Processing time per order: 90 minutes → 12 minutes',
      'Wrong-part returns: −43%',
      'Staff reallocated to higher-value customer work'
    ]
  },
  {
    id: 'construction',
    workflowName: 'Subcontractor Compliance Workflow',
    businessName: 'Regional Construction Firm',
    icon: Building2,
    challenge: 'Every project involved dozens of subcontractors. Staff had to collect insurance certificates, safety records, union paperwork, and tax forms. Missing documents stalled projects, exposed liability, and burned hours in email back-and-forth.',
    workflow: [
      'AI worker scans incoming subcontractor packets',
      'Extracts insurance coverage details, expiration dates, and policy numbers',
      'Validates compliance with contract requirements',
      'Cross-references licenses with state databases',
      'Flags expired/missing items → sends automated request email',
      'Human reviewer approves high-risk exceptions',
      'Once complete, auto-updates compliance tracker + project management tool',
      'Sends project manager a "Ready to Start" package'
    ],
    result: [
      'Compliance packet prep time: 5 hours → 40 minutes',
      'Expired insurance slips caught automatically',
      'Faster project start approvals, fewer legal risks'
    ]
  },
  {
    id: 'dental',
    workflowName: 'Insurance Claims Pre-Check Workflow',
    businessName: 'Multi-location Dental Group',
    icon: Stethoscope,
    challenge: 'Insurance claims were repeatedly delayed or denied due to missing X-rays, incorrect procedure codes, or mismatched patient info. Each claim required tedious checks by staff before submission.',
    workflow: [
      'AI worker extracts claim data from practice management system',
      'Verifies patient info matches insurance database',
      'Confirms required documentation (X-rays, chart notes, pre-authorizations)',
      'Pre-codes claims with CPT/ICD and checks against payer rules',
      'AI reviewer audits for compliance; escalates edge cases to human reviewer',
      'Generates final claim packet',
      'Submits into clearinghouse system',
      'Logs every step with status + error reasons'
    ],
    result: [
      'Staff time on pre-check: 35 minutes/claim → 7 minutes',
      'Claim denial rate: −28%',
      'Reimbursement cycles shortened by weeks'
    ]
  },
  {
    id: 'event-production',
    workflowName: 'Multi-Vendor Prep Workflow',
    businessName: 'Event Production Company',
    icon: Calendar,
    challenge: 'Large events involved dozens of vendors (AV, catering, security, permits). Project managers wasted days chasing confirmations, pulling permits, and aligning timelines.',
    workflow: [
      'AI worker compiles vendor list and contract deadlines from project management system',
      'Sends automated reminder emails for missing confirmations',
      'Reviews vendor responses and checks against requirements (insurance, staffing levels)',
      'Cross-checks city permit databases for approval status',
      'Human step: Site manager does a walk-through checklist of fire exits and physical layout, then uploads findings',
      'AI worker updates project timeline with all vendor and compliance statuses',
      'Generates a consolidated "Event Ready" packet for executives'
    ],
    result: [
      'Vendor packet prep: 3 days → 6 hours',
      'On-site safety gaps reduced by 40%',
      'PM team freed up for client-facing tasks'
    ]
  },
  {
    id: 'freight-broker',
    workflowName: 'Customs Clearance Workflow',
    businessName: 'Mid-size Freight Broker',
    icon: Ship,
    challenge: 'International shipments required juggling customs forms, HS codes, carrier updates, and compliance rules. Each shipment had a stack of documents that took hours to validate and send.',
    workflow: [
      'AI worker extracts shipment details from bills of lading',
      'Auto-generates customs declaration with proper HS codes',
      'Cross-checks tariff rules against destination country database',
      'Flags high-risk cargo (hazmat, restricted goods)',
      'AI reviewer checks compliance packet completeness',
      'Escalates flagged shipments to human compliance officer for final approval',
      'Once approved, auto-submits documents to customs portal',
      'Logs all actions with audit-ready trail'
    ],
    result: [
      'Clearance prep time: 2.5 hours → 25 minutes',
      'Compliance errors: −32%',
      'Average shipment release accelerated by 1.5 days'
    ]
  },
  {
    id: 'law-firm',
    workflowName: 'Evidence Intake & Discovery Workflow',
    businessName: 'Boutique Law Firm',
    icon: Scale,
    challenge: 'Incoming discovery packets (emails, PDFs, scanned docs) needed to be sorted, labeled, and linked to case strategy. Attorneys were stuck in hours of clerical work.',
    workflow: [
      'AI worker ingests and classifies all incoming documents by case',
      'Extracts key entities (dates, names, contract clauses)',
      'Links documents to case themes in the firm\'s knowledge system',
      'AI reviewer checks relevance tags; high-uncertainty items flagged',
      'Human attorney step: Reviews flagged documents for privilege and relevance (AI cannot safely decide attorney-client privilege)',
      'Once cleared, AI worker compiles an indexed discovery binder with citations',
      'Generates a case summary with supporting evidence links'
    ],
    result: [
      'Attorney time on clerical review: 12 hours/week → 3 hours/week',
      'Misfiled docs: −57%',
      'Faster discovery prep, stronger courtroom readiness'
    ],
  },
  {
    id: 'fitness-nutrition',
    workflowName: 'Personalized Meal Plan Fulfillment Workflow',
    businessName: 'Fitness & Nutrition Center',
    icon: Apple,
    challenge: 'The gym offered custom meal plans as part of premium memberships, but fulfilling them was chaotic. Manual coordination across dietitians, trainers, and inventory systems wasted hours each week and often led to errors.',
    workflow: [
      'AI worker ingests each member\'s nutrition goals and fitness program',
      'Generates a custom weekly meal plan balancing macros, cost, and kitchen capacity',
      'Cross-references recipes against real-time ingredient inventory',
      'If an ingredient is short, AI suggests substitutions and rebalances the plan',
      'Human dietitian step: Reviews the finalized plan for medical safety and makes judgment calls for edge cases (e.g., rare allergies, performance athletes)',
      'AI worker compiles a consolidated shopping and prep list for the kitchen team',
      'Syncs order quantities with suppliers, adjusting for bulk pricing and lead times',
      'Generates digital meal packets with nutrition breakdowns and prep instructions',
      'Logs all actions, tracks fulfillment status, and updates trainers on member compliance'
    ],
    result: [
      'Staff planning time: 4 hours/day → 40 minutes/day',
      'Ingredient waste: −28%',
      'Dietitian time reallocated to high-touch coaching instead of clerical checks'
    ],
  }
];

export default function AIWorkflowsSection() {
  const [activeService, setActiveService] = useState(workflowServices[0]);

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-century-gothic-black uppercase">
               Custom Workflows with {' '}
            <span className="bg-gradient-to-r from-blue-500 to-orange-500 text-white px-4 py-1 rounded-lg inline-block not-italic uppercase">
              Proven Results
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mt-4 leading-relaxed">
          There’s no one-size-fits-all workflow for success. Every business is unique, so every plan is custom built. 
          Below are examples of workflows we’ve built with proven results.
          </p>
        </div>

        {/* Interactive Services Section */}
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column - Service Buttons */}
          <div className="space-y-5">
            {workflowServices.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                  activeService.id === service.id
                    ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {activeService.id === service.id ? (
                    <service.icon className="w-7 h-7 flex-shrink-0 text-white" />
                  ) : (
                    <div className="w-7 h-7 flex-shrink-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-sm flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <span className="font-semibold text-lg leading-tight">{service.workflowName}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Right Column - Service Details */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8 max-h-[800px] overflow-y-auto border-2 border-transparent bg-gradient-to-r from-blue-500 to-orange-500 bg-clip-border" style={{background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #3b82f6, #f97316) border-box', border: '2px solid transparent'}}>
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-sm flex items-center justify-center">
                  <activeService.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">{activeService.workflowName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{activeService.businessName}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium mr-2">Challenge</span>
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {activeService.challenge}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium mr-2">Workflow we built</span>
                </h4>
                <ul className="space-y-2">
                  {activeService.workflow.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-600">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm font-medium mr-2">Result</span>
                </h4>
                <ul className="space-y-2">
                  {activeService.result.map((result, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600 font-medium">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
