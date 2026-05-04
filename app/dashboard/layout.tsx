import { BarChart3, LayoutDashboard, Settings, Users, FileDown, UserCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800/60 bg-slate-900/50 backdrop-blur-xl flex flex-col z-10 print:hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">GradeSense</h2>
          <p className="text-xs text-indigo-400 mt-1 font-medium">Risk Analyzer Core</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/dashboard/students" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
            <Users className="w-5 h-5" />
            Student Directory
          </Link>
          <Link href="/dashboard/analytics" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
            <BarChart3 className="w-5 h-5" />
            Risk Analytics
          </Link>
          <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
            <FileDown className="w-5 h-5" />
            Export Reports
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800/60 flex flex-col gap-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <UserCircle className="w-8 h-8 text-slate-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Admin Account</span>
              <span className="text-xs text-slate-400">Manage settings</span>
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <p className="text-xs text-slate-400 leading-relaxed">
              System Status: <br/>
              <span className="text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Operational
              </span>
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0a0f1d] relative print:overflow-visible print:bg-white">
        {/* Subtle background element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none print:hidden"></div>
        <div className="p-8 relative z-10 print:p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
