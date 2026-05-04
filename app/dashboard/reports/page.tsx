import { db } from "@/db";
import { students, riskProfiles } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import ExportButtons from "./ExportButtons";
import { AlertTriangle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
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

  const atRisk = allStudents.filter(s => s.isAtRisk);
  const moderateRisk = allStudents.filter(s => !s.isAtRisk && s.predictedRiskScore !== null && s.predictedRiskScore >= 30);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10 print:m-0 print:max-w-none print:w-full print:bg-white print:text-black">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Export Reports</h1>
          <p className="text-slate-400 mt-1">Generate and download official student risk analysis reports.</p>
        </div>
        <ExportButtons data={allStudents} />
      </div>
      
      {/* Printable Report Section */}
      <div className="glass-card p-8 rounded-2xl border border-slate-800/60 print:border-none print:p-0 print:shadow-none print:bg-white">
        
        {/* Print Header (Only visible when printing or in the preview box) */}
        <div className="border-b border-slate-800/50 print:border-gray-300 pb-6 mb-6">
           <div className="flex justify-between items-center">
              <div>
                 <h2 className="text-2xl font-bold text-white print:text-black">GradeSense Risk Report</h2>
                 <p className="text-slate-400 print:text-gray-600 mt-1">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                 <p className="text-sm text-slate-500 print:text-gray-500">Total Monitored: {allStudents.length}</p>
                 <p className="text-sm font-bold text-rose-400 mt-1">{atRisk.length} High Risk Students</p>
              </div>
           </div>
        </div>

        {/* Report Content */}
        <div className="space-y-8">
           
           {/* High Risk Section */}
           <div>
              <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2 mb-4">
                 <AlertTriangle className="w-5 h-5"/> Action Required: High Risk
              </h3>
              {atRisk.length === 0 ? (
                 <p className="text-slate-500 italic print:text-gray-600">No high-risk students found.</p>
              ) : (
                 <div className="overflow-hidden rounded-xl border border-slate-800/50 print:border print:border-gray-300 print:rounded-none">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-900/50 print:bg-gray-100 text-slate-400 print:text-gray-800 border-b border-slate-800/50 print:border-gray-300">
                          <tr>
                             <th className="p-4 font-semibold">Roll No</th>
                             <th className="p-4 font-semibold">Name</th>
                             <th className="p-4 font-semibold">Department</th>
                             <th className="p-4 font-semibold">Risk Score</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/50 print:divide-gray-300">
                          {atRisk.map(s => (
                             <tr key={s.id} className="text-slate-300 print:text-black">
                                <td className="p-4">{s.rollNo}</td>
                                <td className="p-4 font-medium">{s.name}</td>
                                <td className="p-4">{s.department} - {s.section}</td>
                                <td className="p-4 font-bold text-rose-400 print:text-red-700">{s.predictedRiskScore}%</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              )}
           </div>

           {/* Moderate Risk Section */}
           <div className="print:break-inside-avoid pt-4">
              <h3 className="text-lg font-bold text-amber-400 print:text-amber-600 flex items-center gap-2 mb-4">
                 <Clock className="w-5 h-5"/> Monitor Closely: Moderate Risk
              </h3>
              {moderateRisk.length === 0 ? (
                 <p className="text-slate-500 italic print:text-gray-600">No moderate-risk students found.</p>
              ) : (
                 <div className="overflow-hidden rounded-xl border border-slate-800/50 print:border print:border-gray-300 print:rounded-none">
                    <table className="w-full text-left text-sm">
                       <thead className="bg-slate-900/50 print:bg-gray-100 text-slate-400 print:text-gray-800 border-b border-slate-800/50 print:border-gray-300">
                          <tr>
                             <th className="p-4 font-semibold">Roll No</th>
                             <th className="p-4 font-semibold">Name</th>
                             <th className="p-4 font-semibold">Department</th>
                             <th className="p-4 font-semibold">Risk Score</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/50 print:divide-gray-300">
                          {moderateRisk.map(s => (
                             <tr key={s.id} className="text-slate-300 print:text-black">
                                <td className="p-4">{s.rollNo}</td>
                                <td className="p-4 font-medium">{s.name}</td>
                                <td className="p-4">{s.department} - {s.section}</td>
                                <td className="p-4 font-medium text-amber-400 print:text-amber-700">{s.predictedRiskScore}%</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              )}
           </div>

        </div>
      </div>
    </div>
  );
}
