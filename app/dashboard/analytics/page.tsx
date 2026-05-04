import Image from "next/image";
import { LineChart, AlertTriangle, UserX } from "lucide-react";
import { db } from "@/db";
import { students, riskProfiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const allStudents = await db.select({
      id: students.id,
      name: students.name,
      rollNo: students.rollNo,
      department: students.department,
      section: students.section,
      predictedRiskScore: riskProfiles.predictedRiskScore,
      isAtRisk: riskProfiles.isAtRisk,
  })
  .from(students)
  .leftJoin(riskProfiles, eq(students.id, riskProfiles.studentId))
  .orderBy(desc(riskProfiles.predictedRiskScore));
  
  const atRiskStudents = allStudents.filter(s => s.isAtRisk);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Risk Analytics Overview</h1>
          <p className="text-slate-400 mt-1">Class-wide risk distribution and targeted intervention list.</p>
        </div>
      </div>

      {/* The Graph (Full Width) */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/60 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
              <LineChart className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-white">Overall Risk Factors Graph</h2>
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-xl border border-slate-800/50 p-4 flex items-center justify-center overflow-hidden">
          <Image 
            src="/risk_factors_graph.png" 
            alt="Machine Learning Feature Importances" 
            width={1200} 
            height={600}
            className="w-full max-h-[500px] object-contain rounded-lg"
            unoptimized
          />
        </div>
      </div>

      {/* Needs Improvement List (Grid) */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800/60 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-white">Students Needing Improvement</h2>
          </div>
          <span className="px-4 py-1.5 bg-rose-500/10 text-rose-400 rounded-full text-sm font-bold border border-rose-500/20">
             {atRiskStudents.length} At Risk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {atRiskStudents.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500">
                 <UserX className="w-12 h-12 mb-3 text-slate-600" />
                 <p>Excellent! No students are currently in the high-risk category.</p>
              </div>
           ) : (
              atRiskStudents.map((student) => (
                 <div key={student.id} className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between shadow-sm hover:border-rose-500/30 transition-colors">
                    <div>
                       <h3 className="font-bold text-white text-lg">{student.name}</h3>
                       <p className="text-sm text-slate-400 mt-1">{student.rollNo}</p>
                       <span className="inline-block mt-2 px-2 py-0.5 bg-slate-900 rounded text-xs text-slate-400 border border-slate-700">{student.department} - {student.section}</span>
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Risk Score</p>
                       <div className="w-14 h-14 rounded-full border-4 border-rose-500/30 flex items-center justify-center bg-rose-500/10">
                         <span className="text-lg font-bold text-rose-400">{student.predictedRiskScore}%</span>
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
