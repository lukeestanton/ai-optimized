import Image from "next/image";
import Link from "next/link";
import { Download, Pause, Play } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
          >
            <Image
              src="/AIOLogoDarkV4.svg"
              alt="AI Optimized Logo"
              width={140}
              height={40}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
            <Link className="transition hover:text-slate-900" href="#">
              Workflows
            </Link>
            <Link className="transition hover:text-slate-900" href="#">
              Runs
            </Link>
            <Link className="transition hover:text-slate-900" href="#">
              Logs
            </Link>
            <Link className="transition hover:text-slate-900" href="#">
              Settings
            </Link>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
              Help
            </button>
            <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Contact sales
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex flex-col gap-4 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:max-w-6xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Workflow demo
            </p>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              Inquiry-to-Quote Autopilot <span className="text-slate-400">• Run ID QO-1027</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
              <Play className="h-4 w-4" /> Start run
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900">
              <Pause className="h-4 w-4" /> Pause
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              <Download className="h-4 w-4" /> Export run
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
