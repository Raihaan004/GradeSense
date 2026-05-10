"use client";

import { BarChart3, LayoutDashboard, Settings, Users, FileDown } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Student Directory", href: "/dashboard/students", icon: Users },
    { name: "Risk Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Export Reports", href: "/dashboard/reports", icon: FileDown },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800/60 bg-slate-900/50 backdrop-blur-xl flex flex-col z-10 print:hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white tracking-tight">GradeSense</h2>
          <p className="text-xs text-indigo-400 mt-1 font-medium">Risk Analyzer Core</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/60 flex flex-col gap-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">My Account</span>
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
