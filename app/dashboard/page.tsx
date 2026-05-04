import { Search, Filter, BellRing, UserCircle, AlertTriangle } from "lucide-react";
import { db } from "@/db";
import { students, riskProfiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const allProfiles = await db.select({
     score: riskProfiles.predictedRiskScore,
     isAtRisk: riskProfiles.isAtRisk,
     lastAnalyzedAt: riskProfiles.lastAnalyzedAt,
     studentName: students.name,
     studentRollNo: students.rollNo
  }).from(riskProfiles).innerJoin(students, eq(riskProfiles.studentId, students.id)).orderBy(desc(riskProfiles.predictedRiskScore));
  
  const allStudentsCount = await db.select().from(students).then(res => res.length);
  
  const totalMonitored = allStudentsCount;
  const highRisk = allProfiles.filter(p => p.isAtRisk).length;
  const moderateRisk = allProfiles.filter(p => !p.isAtRisk && p.score !== null && p.score >= 30).length;
  const onTrack = totalMonitored - highRisk - moderateRisk;

  const criticalAlerts = allProfiles.filter(p => p.isAtRisk).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header & Prominent Search */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Student Search</h1>
          <p className="text-slate-400 mt-1">Find students quickly to analyze their risk profiles.</p>
        </div>

        <div className="relative group max-w-3xl w-full mt-2">
          {/* Glowing backdrop effect for search bar */}
          <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
          
          <form action="/dashboard/students" method="GET" className="relative flex items-center glass-card border border-slate-700/50 rounded-2xl p-2 shadow-2xl focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
            <div className="pl-4 pr-3 py-4 text-slate-400">
              <Search className="w-7 h-7" />
            </div>
            <input 
              type="text" 
              name="search"
              placeholder="Search by student name or roll number..." 
              className="flex-1 bg-transparent border-none text-white text-xl placeholder:text-slate-500 focus:outline-none focus:ring-0 px-2"
            />
            <div className="pr-2 flex gap-2">
              <button type="button" className="p-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                <Filter className="w-6 h-6" />
              </button>
              <button type="submit" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)] text-lg">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-10 border-t border-slate-800/50">
        {[
          { label: "Total Monitored", value: totalMonitored.toLocaleString(), sub: "Students active", color: "text-indigo-400" },
          { label: "High Risk", value: highRisk.toLocaleString(), sub: "Needs immediate attention", color: "text-rose-400" },
          { label: "Moderate Risk", value: moderateRisk.toLocaleString(), sub: "Monitor closely", color: "text-amber-400" },
          { label: "On Track", value: onTrack.toLocaleString(), sub: "Performing well", color: "text-emerald-400" },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-2xl border border-slate-800/60 hover:border-slate-700 transition-colors">
            <h3 className="text-slate-400 text-sm font-medium">{stat.label}</h3>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Suggested / Recent Students */}
      <div className="glass-card border border-slate-800/60 rounded-2xl p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Critical Alerts</h2>
          <a href="/dashboard/analytics" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View Risk Analytics</a>
        </div>
        <div className="space-y-4">
          {criticalAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <p>No critical alerts right now. All students are performing adequately.</p>
            </div>
          ) : (
            criticalAlerts.map((alert, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer group">
                <div className="p-3 rounded-full bg-slate-800 text-slate-400 group-hover:text-white transition-colors">
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="text-white font-medium text-lg">{alert.studentName} <span className="text-slate-500 text-sm ml-2 font-normal">{alert.studentRollNo}</span></h4>
                    <span className="text-xs text-slate-500 mt-1">Risk Score: {alert.score}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`p-1 rounded-md bg-rose-500/20 text-rose-400`}>
                      <BellRing className="w-3 h-3" />
                    </div>
                    <p className="text-slate-400 text-sm">Identified as high risk by ML prediction algorithm</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
