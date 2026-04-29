import { Search, Filter, BellRing, UserCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header & Prominent Search */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Student Search</h1>
          <p className="text-slate-400 mt-1">Find students quickly to analyze their risk profiles.</p>
        </div>

        <div className="relative group max-w-3xl w-full mt-2">
          {/* Glowing backdrop effect for search bar */}
          <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
          
          <div className="relative flex items-center glass-card border border-slate-700/50 rounded-2xl p-2 shadow-2xl focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
            <div className="pl-4 pr-3 py-4 text-slate-400">
              <Search className="w-7 h-7" />
            </div>
            <input 
              type="text" 
              placeholder="Search by student name, ID, or email address..." 
              className="flex-1 bg-transparent border-none text-white text-xl placeholder:text-slate-500 focus:outline-none focus:ring-0 px-2"
            />
            <div className="pr-2 flex gap-2">
              <button className="p-4 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors">
                <Filter className="w-6 h-6" />
              </button>
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)] text-lg">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-10 border-t border-slate-800/50">
        {[
          { label: "Total Monitored", value: "2,405", sub: "Students active", color: "text-indigo-400" },
          { label: "High Risk", value: "84", sub: "Needs immediate attention", color: "text-rose-400" },
          { label: "Moderate Risk", value: "312", sub: "Monitor closely", color: "text-amber-400" },
          { label: "On Track", value: "2,009", sub: "Performing well", color: "text-emerald-400" },
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
          <h2 className="text-xl font-bold text-white">Critical Alerts & Recent Searches</h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All Alerts</button>
        </div>
        <div className="space-y-4">
          {[
            { name: "Sarah Jenkins", id: "STU-9482", issue: "Attendance dropped below 75%", time: "2 hours ago", urgent: true },
            { name: "Michael Chang", id: "STU-1029", issue: "Failed consecutive math assessments", time: "5 hours ago", urgent: true },
            { name: "Emma Watson", id: "STU-3392", issue: "Unusual behavior pattern detected", time: "1 day ago", urgent: false },
          ].map((alert, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800/40 transition-colors cursor-pointer group">
              <div className="p-3 rounded-full bg-slate-800 text-slate-400 group-hover:text-white transition-colors">
                <UserCircle className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-white font-medium text-lg">{alert.name} <span className="text-slate-500 text-sm ml-2 font-normal">{alert.id}</span></h4>
                  <span className="text-xs text-slate-500 mt-1">{alert.time}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className={`p-1 rounded-md ${alert.urgent ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    <BellRing className="w-3 h-3" />
                  </div>
                  <p className="text-slate-400 text-sm">{alert.issue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
