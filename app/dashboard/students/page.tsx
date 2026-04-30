"use client";

import { useState } from "react";
import { Plus, X, ChevronRight, ChevronLeft, Check, Users, Search, Filter } from "lucide-react";
import { createStudentAction } from "./actions";

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

      {/* Directory Table / List Placeholder */}
      <div className="glass-card rounded-2xl border border-slate-800/60 p-1">
         <div className="p-4 border-b border-slate-800/60 flex justify-between items-center bg-slate-900/40 rounded-t-2xl">
            <div className="relative w-full max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Search directory..." className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
            </div>
            <button className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg border border-slate-700">
              <Filter className="w-5 h-5" />
            </button>
         </div>
         <div className="p-12 text-center text-slate-500 flex flex-col items-center">
            <Users className="w-12 h-12 mb-4 text-slate-600" />
            <p>No students found. Click "Create Student" to add one.</p>
         </div>
      </div>

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

    </div>
  );
}
