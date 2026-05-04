"use client";

import { useState, useEffect } from "react";
import { Plus, X, ChevronRight, ChevronLeft, Check, Users, Search, Filter, AlertTriangle, FileText, Activity } from "lucide-react";
import { createStudentAction, getStudentsAction, analyzeStudentAction } from "./actions";

// Types
type Subject = {
  id: string;
  name: string;
  hasLab: boolean;
  assignments: (number | "")[];
  cats: (number | "")[];
  cycleTests: (number | "")[];
};

export default function StudentDirectory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Student List State
  const [studentList, setStudentList] = useState<any[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  
  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const fetchStudents = async () => {
    setIsLoadingList(true);
    const res = await getStudentsAction();
    if (res.success) {
      setStudentList(res.data);
    }
    setIsLoadingList(false);
  };

  useEffect(() => {
    fetchStudents();
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("search");
      if (q) setSearchQuery(q);
    }
  }, []);

  const filteredStudents = studentList.filter(s => 
     s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Form State
  const [basicInfo, setBasicInfo] = useState({ name: "", rollNo: "", department: "", section: "" });
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const availableSubjects = ["Mathematics", "Physics", "Chemistry", "Computer Science", "Electronics", "Mechanical Engineering"];

  const toggleSubject = (subjName: string) => {
    if (subjects.find(s => s.name === subjName)) {
      setSubjects(subjects.filter(s => s.name !== subjName));
    } else {
      setSubjects([...subjects, { 
        id: Math.random().toString(), 
        name: subjName, 
        hasLab: false, 
        assignments: ["","","","",""], 
        cats: ["","","","",""], 
        cycleTests: ["","",""] 
      }]);
    }
  };

  const handleNext = () => setStep(s => Math.min(5, s + 1));
  const handlePrev = () => setStep(s => Math.max(1, s - 1));

  const resetForm = () => {
    setStep(1);
    setBasicInfo({ name: "", rollNo: "", department: "", section: "" });
    setSubjects([]);
    setIsModalOpen(false);
    fetchStudents();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-400 mt-1">Manage and add students to the system.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          <Plus className="w-5 h-5" />
          Create Student
        </button>
      </div>

      {/* Directory Search */}
      <div className="glass-card rounded-2xl border border-slate-800/60 p-1 mb-6">
         <div className="p-4 flex justify-between items-center bg-slate-900/40 rounded-xl">
            <div className="relative w-full max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search directory..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg border border-slate-700">
              <Filter className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Student List Grid */}
      {isLoadingList ? (
        <div className="flex justify-center p-12">
           <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="glass-card rounded-2xl border border-slate-800/60 p-12 text-center text-slate-500 flex flex-col items-center">
            <Users className="w-12 h-12 mb-4 text-slate-600" />
            <p>No students found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div key={student.id} onClick={() => setSelectedStudent(student)} className="glass-card p-6 rounded-2xl border border-slate-800/60 hover:border-indigo-500/50 transition-all cursor-pointer group relative overflow-hidden shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">
               {student.isAtRisk && (
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
               )}
               <div className="flex justify-between items-start mb-3">
                 <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{student.name}</h3>
                 <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                   {student.name.charAt(0)}
                 </div>
               </div>
               <p className="text-slate-400 text-sm mb-4">Roll No: <span className="text-slate-300">{student.rollNo}</span></p>
               <div className="flex items-center gap-2 mb-5">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium border border-indigo-500/20">{student.department}</span>
                  <span className="px-3 py-1 bg-slate-800/80 text-slate-300 rounded-full text-xs font-medium border border-slate-700">Sec {student.section}</span>
               </div>
               <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">ML Risk Score</span>
                  {student.predictedRiskScore !== null ? (
                    <span className={`font-bold ${student.isAtRisk ? 'text-rose-400' : 'text-emerald-400'}`}>{student.predictedRiskScore}% Risk</span>
                  ) : (
                    <span className="text-slate-500 text-sm">Pending...</span>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={resetForm}></div>
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">Add New Student (Stage {step} of 5)</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1">
              
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-4">Stage 1: Basic Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Full Name</label>
                      <input 
                        type="text" 
                        value={basicInfo.name} 
                        onChange={e => setBasicInfo({...basicInfo, name: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Roll No.</label>
                      <input 
                        type="text" 
                        value={basicInfo.rollNo} 
                        onChange={e => setBasicInfo({...basicInfo, rollNo: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Department</label>
                      <select 
                        value={basicInfo.department}
                        onChange={e => setBasicInfo({...basicInfo, department: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">Select Dept</option>
                        <option value="CSE">Computer Science</option>
                        <option value="ECE">Electronics</option>
                        <option value="MECH">Mechanical</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-slate-400">Section</label>
                      <select 
                        value={basicInfo.section}
                        onChange={e => setBasicInfo({...basicInfo, section: e.target.value})}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="">Select Section</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Subjects & Labs */}
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-4">Stage 2: Select Subjects & Labs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {availableSubjects.map(subj => {
                      const isSelected = subjects.some(s => s.name === subj);
                      return (
                        <div key={subj} className={`p-4 rounded-xl border ${isSelected ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-slate-800/50'} flex flex-col gap-3 transition-colors cursor-pointer`} onClick={() => toggleSubject(subj)}>
                           <div className="flex justify-between items-center">
                             <span className={`font-medium ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>{subj}</span>
                             <div className={`w-5 h-5 rounded border ${isSelected ? 'bg-indigo-500 border-indigo-500 flex items-center justify-center' : 'border-slate-500'}`}>
                               {isSelected && <Check className="w-3 h-3 text-white" />}
                             </div>
                           </div>
                           {isSelected && (
                             <div className="mt-2" onClick={e => e.stopPropagation()}>
                               <label className="flex items-center gap-2 text-sm text-slate-400">
                                 <input 
                                   type="checkbox" 
                                   checked={subjects.find(s => s.name === subj)?.hasLab || false}
                                   onChange={(e) => {
                                     setSubjects(subjects.map(s => s.name === subj ? {...s, hasLab: e.target.checked} : s));
                                   }}
                                   className="rounded border-slate-600 bg-slate-700"
                                 />
                                 Includes Lab Component?
                               </label>
                             </div>
                           )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Assignments */}
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-4">Stage 3: Assignment Marks (Out of 10)</h3>
                  {subjects.length === 0 ? (
                    <p className="text-slate-400">No subjects selected in Stage 2.</p>
                  ) : (
                    <div className="space-y-6">
                      {subjects.map((subj, i) => (
                        <div key={subj.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
                          <h4 className="font-medium text-indigo-300">{subj.name}</h4>
                          <div className="flex flex-wrap gap-4">
                            {[0, 1, 2, 3, 4].map(idx => (
                              <div key={idx}>
                                <label className="text-xs text-slate-500 block mb-1">A{idx + 1}</label>
                                <input 
                                  type="number" 
                                  max="10"
                                  min="0"
                                  placeholder="0-10"
                                  value={subj.assignments[idx]}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const newSubjs = [...subjects];
                                    newSubjs[i].assignments[idx] = val === "" ? "" : Number(val);
                                    setSubjects(newSubjs);
                                  }}
                                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-center text-white focus:outline-none focus:border-indigo-500" 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: CATs */}
              {step === 4 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-4">Stage 4: CAT (Internal Exam) Marks (Out of 50)</h3>
                  {subjects.length === 0 ? (
                    <p className="text-slate-400">No subjects selected in Stage 2.</p>
                  ) : (
                    <div className="space-y-6">
                      {subjects.map((subj, i) => (
                        <div key={subj.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
                          <h4 className="font-medium text-indigo-300">{subj.name}</h4>
                          <div className="flex flex-wrap gap-4">
                            {[0, 1, 2, 3, 4].map(idx => (
                              <div key={idx}>
                                <label className="text-xs text-slate-500 block mb-1">CAT {idx + 1}</label>
                                <input 
                                  type="number" 
                                  max="50"
                                  min="0"
                                  placeholder="0-50"
                                  value={subj.cats[idx]}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const newSubjs = [...subjects];
                                    newSubjs[i].cats[idx] = val === "" ? "" : Number(val);
                                    setSubjects(newSubjs);
                                  }}
                                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-center text-white focus:outline-none focus:border-indigo-500" 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Cycle Tests */}
              {step === 5 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-4">Stage 5: Cycle Test Marks (Out of 100)</h3>
                  {subjects.length === 0 ? (
                    <p className="text-slate-400">No subjects selected in Stage 2.</p>
                  ) : (
                    <div className="space-y-6">
                      {subjects.map((subj, i) => (
                        <div key={subj.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl space-y-3">
                          <h4 className="font-medium text-indigo-300">{subj.name}</h4>
                          <div className="flex flex-wrap gap-4">
                            {[0, 1, 2].map(idx => (
                              <div key={idx}>
                                <label className="text-xs text-slate-500 block mb-1">CT {idx + 1}</label>
                                <input 
                                  type="number" 
                                  max="100"
                                  min="0"
                                  placeholder="0-100"
                                  value={subj.cycleTests[idx]}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const newSubjs = [...subjects];
                                    newSubjs[i].cycleTests[idx] = val === "" ? "" : Number(val);
                                    setSubjects(newSubjs);
                                  }}
                                  className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-center text-white focus:outline-none focus:border-indigo-500" 
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900 flex justify-between shrink-0">
              <button 
                onClick={handlePrev}
                disabled={step === 1}
                className="px-6 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              {step < 5 ? (
                <button 
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)] flex items-center gap-2"
                >
                  Next Stage <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  disabled={isSaving}
                  onClick={async () => {
                    setIsSaving(true);
                    const res = await createStudentAction({ basicInfo, subjects });
                    setIsSaving(false);
                    if (res.success) {
                      alert("Student successfully saved to Neon Database!");
                      resetForm();
                    } else {
                      alert("Error saving data: " + res.error);
                    }
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> {isSaving ? "Saving..." : "Complete & Save"}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}></div>
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                {selectedStudent.name}
                {selectedStudent.isAtRisk && <span className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-full text-xs font-bold uppercase flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> High Risk</span>}
              </h2>
              <button onClick={() => { setSelectedStudent(null); setAnalysisResult(null); }} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8">
               <div className="grid grid-cols-3 gap-4">
                 <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Roll Number</p>
                    <p className="text-white font-medium">{selectedStudent.rollNo}</p>
                 </div>
                 <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Department</p>
                    <p className="text-white font-medium">{selectedStudent.department}</p>
                 </div>
                 <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-1">Section</p>
                    <p className="text-white font-medium">{selectedStudent.section}</p>
                 </div>
               </div>

               {/* ML Analysis Section */}
               <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-indigo-300 flex items-center gap-2"><Activity className="w-5 h-5"/> ML Risk Analyzer</h3>
                   {!analysisResult && (
                     <button 
                       onClick={async () => {
                         setIsAnalyzing(true);
                         const res = await analyzeStudentAction(selectedStudent);
                         setIsAnalyzing(false);
                         if (res.success) setAnalysisResult(res.data);
                       }}
                       disabled={isAnalyzing}
                       className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)] disabled:opacity-50"
                     >
                       {isAnalyzing ? "Analyzing..." : "Run Deep Analysis"}
                     </button>
                   )}
                 </div>
                 
                 {analysisResult && (
                   <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                     <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                       <div className="flex-1">
                         <p className="text-sm text-slate-400">Predicted Risk</p>
                         <p className={`text-2xl font-bold ${analysisResult.is_at_risk ? 'text-rose-400' : 'text-emerald-400'}`}>
                           {analysisResult.risk_probability}%
                         </p>
                       </div>
                       <div className="flex-1">
                         <p className="text-sm text-slate-400">Recommendation</p>
                         <p className="text-white font-medium">{analysisResult.is_at_risk ? "Requires immediate intervention." : "Student is performing adequately."}</p>
                       </div>
                     </div>
                     <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-[#0f172a]">
                       <img src={analysisResult.graph} alt="Risk Factor Graph" className="w-full h-auto object-contain" />
                     </div>
                   </div>
                 )}
               </div>

               <div>
                 <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400"/> Academic Records</h3>
                 <div className="space-y-4">
                    {selectedStudent.academicRecords?.map((subj: any, i: number) => (
                      <div key={i} className="glass-card p-5 rounded-xl border border-slate-700/50">
                         <h4 className="text-indigo-300 font-medium mb-3">{subj.name} {subj.hasLab ? "(With Lab)" : ""}</h4>
                         <div className="grid grid-cols-3 gap-6">
                           <div>
                             <p className="text-slate-500 text-xs mb-2">Assignments (out of 10)</p>
                             <div className="flex flex-wrap gap-2">
                               {subj.assignments?.map((a:any, j:number) => <span key={j} className="w-8 h-8 flex items-center justify-center bg-slate-800 rounded text-slate-300 text-sm border border-slate-700">{a !== "" ? a : "-"}</span>)}
                             </div>
                           </div>
                           <div>
                             <p className="text-slate-500 text-xs mb-2">CAT Exams (out of 50)</p>
                             <div className="flex flex-wrap gap-2">
                               {subj.cats?.map((c:any, j:number) => <span key={j} className="w-9 h-8 flex items-center justify-center bg-slate-800 rounded text-slate-300 text-sm border border-slate-700">{c !== "" ? c : "-"}</span>)}
                             </div>
                           </div>
                           <div>
                             <p className="text-slate-500 text-xs mb-2">Cycle Tests (out of 100)</p>
                             <div className="flex flex-wrap gap-2">
                               {subj.cycleTests?.map((ct:any, j:number) => <span key={j} className="w-10 h-8 flex items-center justify-center bg-slate-800 rounded text-slate-300 text-sm border border-slate-700">{ct !== "" ? ct : "-"}</span>)}
                             </div>
                           </div>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
