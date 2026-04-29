import Image from "next/image";
import { BrainCircuit, LineChart, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Risk Analytics Model</h1>
          <p className="text-slate-400 mt-1">Machine Learning predictions and feature analysis based on student performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ML Model Explanation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-white">Random Forest ML</h2>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              The backend prediction system uses a Random Forest Machine Learning model trained on synthetic student data matching your schema. 
              It analyzes exactly 13 specific data points: 5 Assignments, 5 CATs (Internal Exams), and 3 Cycle Tests.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Model F1-Score</span>
                <span className="text-emerald-400 font-medium">96.0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-2xl border border-slate-800/60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-violet-500/20 text-violet-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-white">Key Risk Factors</h2>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              According to the generated model's feature importances, the final <strong className="text-white">Cycle Test 3 (CT3)</strong> and the later <strong className="text-white">CATs</strong> are the most heavily weighted indicators of a student falling into the high-risk category.
            </p>
          </div>
        </div>

        {/* The Graph */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 rounded-2xl border border-slate-800/60 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                  <LineChart className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-white">Feature Importances Graph</h2>
              </div>
            </div>
            
            <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800/50 p-4 flex items-center justify-center overflow-hidden relative">
              <Image 
                src="/risk_factors_graph.png" 
                alt="Machine Learning Feature Importances" 
                width={900} 
                height={700}
                className="w-full h-auto object-contain rounded-lg"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
