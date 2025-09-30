import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'About Luke Stanton | AI Optimized',
  description:
    'Learn about Luke Stanton, the college CS student and marketing operator behind AI Optimized. Discover the story, process, and principles that power every AI workflow engagement.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-600 via-blue-500 to-orange-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <div className="grid lg:grid-cols-[3fr_2fr] gap-12 items-start">
              <div className="space-y-8">
                <div className="space-y-6">
                  <p className="font-semibold tracking-wide uppercase text-white/70">About AI Optimized</p>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight font-century-gothic-black uppercase">
                    I build AI workflows that actually move the numbers
                  </h1>
                  <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                    Hey, I’m Luke Stanton — a college computer science student who refuses to keep AI as a side project. I’ve spent the last few years launching marketing campaigns, writing copy that converts, and nerding out on workflow automation. Today, AI Optimized is how I combine both worlds: the disciplined engineering mindset from CS and the real-world revenue instincts earned in marketing.
                  </p>
                  <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                    I partner with founders, marketing leaders, and operations teams who want AI that feels like a teammate. Every workflow I ship is scoped around your outcomes: lower response times, cleaner pipelines, happier customers, and dashboards your CFO can actually trust.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                    <h3 className="text-2xl font-bold">CS x Marketing</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Studying full-stack development, machine learning foundations, and systems design while still shipping campaigns that bring in leads and revenue.
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5">
                    <h3 className="text-2xl font-bold">Workflow First</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      I figure out where the human loop breaks, translate that into prompts, actions, and guardrails, and only then let automation run on autopilot.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                  >
                    Book a call with me
                  </Link>
                  <Link
                    href="/resources/what-to-automate"
                    className="inline-flex items-center justify-center border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-200"
                  >
                    See what I automate
                  </Link>
                </div>
              </div>

              <div className="bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative">
                  <Image
                    src="/AboutPortraitPlaceholder.jpg"
                    alt="Luke Stanton working on AI workflows"
                    width={640}
                    height={640}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                </div>
                <div className="p-8 space-y-4">
                  <h2 className="text-2xl font-bold">What clients say</h2>
                  <p className="text-gray-600 leading-relaxed">
                    “Luke made our AI vision feel like a practical plan. He connected the tools we already used, shipped a pilot in days, and kept iterating until the analytics dashboard showed what our leadership team needed.”
                  </p>
                  <p className="text-sm text-gray-500">
                    *Real client names coming soon. Until then, this is what you can expect: measurable wins and a builder who keeps you in the loop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">From dorm room prototypes to boardroom results</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  My first automations were built in lecture halls between algorithms classes. They helped student clubs manage inbound requests, drip emails to sponsors, and track signups without drowning in spreadsheets. Those projects taught me how to translate fuzzy goals into precise logic — a skill that now anchors every client engagement.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Outside the classroom I led lifecycle marketing for local businesses and early-stage startups. Cold emails, retargeting flows, lead magnets — I shipped it all. That marketing experience keeps my AI builds grounded in customer psychology, not just cool tech. I start with the buyer journey, map your handoffs, then decide where AI belongs and where humans stay in control.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Today, the playbook looks like this: discover the real friction, design the workflow visually, craft prompt stacks that sound like you, integrate with your stack, measure every run, and keep tuning. You get a builder who understands data structures and demand gen in equal parts.
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-10 space-y-6">
                <h3 className="text-2xl font-bold text-blue-900">Where I plug in</h3>
                <ul className="space-y-4 text-blue-900/80 text-base leading-relaxed">
                  <li>
                    <span className="font-semibold text-blue-900">Inbound & support teams:</span> Triage tickets, draft responses, update CRMs, and surface insights so agents spend their time on the tricky cases that need empathy.
                  </li>
                  <li>
                    <span className="font-semibold text-blue-900">Revenue workflows:</span> Qualify leads, prep quotes, summarize calls, and nurture prospects with messaging that keeps your brand voice intact.
                  </li>
                  <li>
                    <span className="font-semibold text-blue-900">Knowledge ops:</span> Keep SOPs fresh, push updates across tools, and make sure your team always has the latest answer without digging through docs.
                  </li>
                  <li>
                    <span className="font-semibold text-blue-900">Founder enablement:</span> Build dashboards that translate every automation run into KPI impact so you can report wins confidently.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase">
                My principles when we work together
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                This isn’t about dropping in a chatbot and hoping adoption follows. It’s about co-owning the workflow, showing wins fast, and empowering your team to keep the momentum long after the pilot wraps.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Clarity over hype</h3>
                <p className="text-gray-600 leading-relaxed">
                  I translate AI jargon into language your operators, marketers, and execs can act on. You’ll see flowcharts, prompts, and integrations spelled out clearly so buy-in is never an obstacle.
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Co-building from day one</h3>
                <p className="text-gray-600 leading-relaxed">
                  Your subject-matter experts stay in the loop. I interview them, capture their edge cases, and invite them into the iterations. You own the workflow as much as I do.
                </p>
              </div>
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">Measurable from the start</h3>
                <p className="text-gray-600 leading-relaxed">
                  Every build has a scoreboard: time saved, replies sent, opportunities opened, tickets resolved. We agree on the metric together and report on it weekly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[2fr_3fr] gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Beyond the screen</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  When I’m not writing prompts or pushing to GitHub, you’ll find me coaching younger students through hackathon projects, helping local founders test their messaging, or experimenting with AI-assisted creative tools. I believe in sharing what I learn, which is why I host weekend study sessions on campus and document my builds so your internal team can replicate them.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  I approach every partnership with curiosity first. We’ll map your process in plain language, experiment quickly, and dial in the automations that keep your brand human. If that sounds like the kind of partner you need, let’s chat.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
                  >
                    Start a project
                  </Link>
                  <Link
                    href="mailto:hello@aioptimized.com"
                    className="inline-flex items-center justify-center border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition-all duration-200"
                  >
                    Email me directly
                  </Link>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-blue-100/60 border border-blue-200 rounded-3xl h-64 flex items-center justify-center text-blue-700 text-center text-sm px-6">
                  Future photo placeholder — drop in a shot from an on-site session or a campus build night.
                </div>
                <div className="bg-orange-100/60 border border-orange-200 rounded-3xl h-64 flex items-center justify-center text-orange-700 text-center text-sm px-6">
                  Future testimonial video goes here. Embed a Loom or upload a thumbnail when it’s ready.
                </div>
                <div className="bg-white border border-dashed border-gray-400 rounded-3xl h-64 flex items-center justify-center text-gray-500 text-center text-sm px-6">
                  Placeholder space for a case study download or PDF preview.
                </div>
                <div className="bg-white border border-dashed border-gray-400 rounded-3xl h-64 flex items-center justify-center text-gray-500 text-center text-sm px-6">
                  Placeholder space for another gallery image or behind-the-scenes clip.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-blue-600 to-orange-500 py-20 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold uppercase">Ready to see your workflow in motion?</h2>
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
              Let’s take one process you rely on — onboarding new leads, responding to support tickets, prepping campaigns — and prove how AI can make it faster, smarter, and more accountable. I’ll bring the prompts, the integrations, and the analytics. You bring the problems worth solving.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                Schedule a discovery call
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center border border-white/60 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                Watch the inquiry-to-quote demo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
