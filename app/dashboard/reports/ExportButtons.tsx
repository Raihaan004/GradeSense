"use client";

import { Download, Printer } from "lucide-react";

export default function ExportButtons({ data }: { data: any[] }) {
  
  const handleCSVExport = () => {
    const headers = ["ID", "Name", "Roll No", "Department", "Section", "Risk Score", "Status"];
    const csvRows = [headers.join(",")];
    
    data.forEach(student => {
      const status = student.isAtRisk ? "HIGH RISK" : (student.predictedRiskScore >= 30 ? "MODERATE RISK" : "ON TRACK");
      const row = [
        student.id,
        `"${student.name}"`,
        student.rollNo,
        student.department,
        student.section,
        student.predictedRiskScore !== null ? student.predictedRiskScore : "N/A",
        status
      ];
      csvRows.push(row.join(","));
    });
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `GradeSense_Risk_Report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="flex gap-4 print:hidden">
      <button 
        onClick={handleCSVExport}
        className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors border border-slate-700 shadow-sm"
      >
        <Download className="w-5 h-5" />
        Download CSV
      </button>
      <button 
        onClick={() => window.print()}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-[0_0_15px_rgba(99,102,241,0.3)]"
      >
        <Printer className="w-5 h-5" />
        Save as PDF
      </button>
    </div>
  );
}
