import { ArrowRight, BrainCircuit, LineChart, ShieldAlert, Users, Activity, Target } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Navbar */}
      <header className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-indigo-500" />
          <span className="text-2xl font-bold text-white tracking-tight">GradeSense</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium px-5 py-2.5 transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]">
            Go to Dashboard
          </Link>
        </div>
      </header>

      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

      <main className="relative flex flex-col items-center justify-center pt-40 pb-16 px-6 sm:px-12 lg:px-24">
        
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-indigo-500/30 text-indigo-300 text-sm font-medium mb-4 animate-float">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
            Introducing the AI-Powered Risk Analyzer
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Intelligent <br />
            <span className="text-gradient">Student Management</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300">
            A comprehensive student management system with a core focus on risk analysis. 
            Identify struggling students early, predict academic outcomes, and intervene before it's too late.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 glass-card hover:bg-slate-800/80 text-white rounded-full font-semibold transition-all">
              View Analytics Demo
            </button>
          </div>
        </div>

        {/* Dashboard Preview / Core Feature Showcase */}
        <div className="w-full max-w-6xl mx-auto mt-24 z-10 animate-float" style={{ animationDuration: '8s' }}>
          <div className="glass-card rounded-2xl p-4 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-700/50 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-400" />
                  Live Risk Analyzer
                </h2>
                <p className="text-slate-400 mt-1">Real-time student performance metrics</p>
              </div>
              <div className="mt-4 md:mt-0 flex gap-3">
                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 text-sm border border-rose-500/30">
                  12 At-Risk
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
                  848 On Track
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Predictive Dropout Rate", value: "2.4%", trend: "-0.8%", isGood: true, icon: LineChart },
                { title: "Avg Engagement Score", value: "86/100", trend: "+4.2%", isGood: true, icon: Target },
                { title: "Critical Alerts", value: "7", trend: "+2", isGood: false, icon: ShieldAlert },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-slate-900/50 rounded-lg">
                      <stat.icon className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-md ${stat.isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {stat.trend}
                    </span>
                  </div>
                  <h3 className="text-slate-400 text-sm font-medium">{stat.title}</h3>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mt-32 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">More Than Just Records</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Our system goes beyond traditional student management by integrating deep learning models to analyze behavior, attendance, and grades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Risk Analysis Engine",
                description: "Algorithms detect subtle patterns in attendance and grades to flag students needing help.",
                icon: BrainCircuit,
              },
              {
                title: "Complete Student Profiles",
                description: "Centralized database for all academic, behavioral, and extracurricular data.",
                icon: Users,
              },
              {
                title: "Automated Interventions",
                description: "Trigger automatic alerts to counselors and parents when risk thresholds are met.",
                icon: ShieldAlert,
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
