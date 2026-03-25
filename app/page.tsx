"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [stage, setStage] = useState<"home" | "details" | "marks" | "result">("home");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    roll_no: "",
    department: "",
    section: "",
    assignment_1: "",
    assignment_2: "",
    assignment_3: "",
    assignment_4: "",
    assignment_5: "",
    cycle_test_1: "",
    cycle_test_2: "",
    cycle_test_3: "",
    cat_1: "",
    cat_2: "",
    cat_3: "",
    attendance: "",
    lab_marks: "",
  });

  const [result, setResult] = useState<{ risk_level: string; graph_image: string } | null>(null);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStart = () => setStage("details");

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.roll_no || !formData.department) {
      setError("Please fill in all required fields.");
      return;
    }
    setError("");
    setStage("marks");
  };

  const handleMarksSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      setResult({
        risk_level: data.risk_level,
        graph_image: data.graph_image,
      });
      setStage("result");
    } catch (err) {
      setError("Failed to connect to the backend. Is Python running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      roll_no: "",
      department: "",
      section: "",
      assignment_1: "",
      assignment_2: "",
      assignment_3: "",
      assignment_4: "",
      assignment_5: "",
      cycle_test_1: "",
      cycle_test_2: "",
      cycle_test_3: "",
      cat_1: "",
      cat_2: "",
      cat_3: "",
      attendance: "",
      lab_marks: "",
    });
    setResult(null);
    setStage("home");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-100">
      <div className="w-full max-w-5xl rounded-3xl bg-white/70 backdrop-blur-xl p-8 md:p-12 shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-white">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-primary/10 p-4 rounded-3xl mb-4 border border-primary/20">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            GradeSense AI
          </h1>
          <p className="mt-2 text-center text-slate-500 font-medium tracking-wide">
            Intelligent Student Academic Risk Prediction
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-600 flex items-center gap-3 animate-fade-in font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {stage === "home" && (
          <div className="flex flex-col items-center animate-fade-in max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
              {[
                { title: 'ML Driven', desc: 'Pre-trained risk assessment', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { title: 'Real-time', desc: 'Instant graphical feedback', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2' },
                { title: 'Actionable', desc: 'Identify students at risk early', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/50 border border-white hover:shadow-lg transition-all text-center group">
                  <div className="text-primary bg-primary/10 w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                  <h3 className="font-bold text-slate-800">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
            
            <button onClick={handleStart} className="btn-primary flex items-center gap-2 text-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Start New Student Analysis
            </button>
          </div>
        )}

        {stage === "details" && (
          <form onSubmit={handleDetailsSubmit} className="space-y-8 animate-fade-in max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</span>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Student Profile Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="label-text">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="input-field cursor-pointer"
                    required
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="label-text">Roll / Registration No.</label>
                  <input
                    type="text"
                    name="roll_no"
                    placeholder="Unique ID"
                    value={formData.roll_no}
                    onChange={handleInputChange}
                    className="input-field font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="label-text">Section</label>
                  <input
                    type="text"
                    name="section"
                    placeholder="e.g. A, B or C"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-8">
              <button type="submit" className="btn-primary group">
                Enter Marks Data
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </form>
        )}

        {stage === "marks" && (
          <form onSubmit={handleMarksSubmit} className="space-y-10 animate-fade-in">
            <div className="flex items-center gap-4">
              <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">2</span>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Academic Performance Metrics</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                {/* Assignments */}
                <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <h3 className="text-md font-bold text-indigo-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    Weekly Assignments
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <div key={`assign-${num}`}>
                        <label className="text-[10px] font-bold text-slate-400 uppercase text-center block mb-1">A{num}</label>
                        <input
                          type="number"
                          name={`assignment_${num}`}
                          value={(formData as any)[`assignment_${num}`]}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border-slate-200 p-2 text-center text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none border transition-all"
                          required min="0" max="100"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cycle Tests */}
                <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <h3 className="text-md font-bold text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Cycle Tests (Internal)
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((num) => (
                      <div key={`cycle-${num}`}>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Test {num}</label>
                        <input
                          type="number"
                          name={`cycle_test_${num}`}
                          value={(formData as any)[`cycle_test_${num}`]}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border-slate-200 p-3 font-semibold focus:ring-2 focus:ring-primary/20 outline-none border transition-all"
                          required min="0" max="100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* CATs */}
                <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <h3 className="text-md font-bold text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    CAT Assessments
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((num) => (
                      <div key={`cat-${num}`}>
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">CAT {num}</label>
                        <input
                          type="number"
                          name={`cat_${num}`}
                          value={(formData as any)[`cat_${num}`]}
                          onChange={handleInputChange}
                          className="w-full rounded-lg border-slate-200 p-3 font-semibold focus:ring-2 focus:ring-primary/20 outline-none border transition-all"
                          required min="0" max="100"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Others */}
                <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
                  <h3 className="text-md font-bold text-blue-400 uppercase tracking-widest mb-4">Core Metrics</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Attendance %</label>
                      <input
                        type="number"
                        name="attendance"
                        value={formData.attendance}
                        onChange={handleInputChange}
                        className="w-full rounded-lg bg-slate-800 border-slate-700 p-3 font-bold text-white focus:ring-2 focus:ring-blue-500/50 outline-none border transition-all"
                        required min="0" max="100"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Lab Marks</label>
                      <input
                        type="number"
                        name="lab_marks"
                        value={formData.lab_marks}
                        onChange={handleInputChange}
                        className="w-full rounded-lg bg-slate-800 border-slate-700 p-3 font-bold text-white focus:ring-2 focus:ring-blue-500/50 outline-none border transition-all"
                        required min="0" max="100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <button type="button" onClick={() => setStage("details")} className="btn-secondary group flex items-center gap-2">
                <span className="inline-block group-hover:-translate-x-1 transition-transform">←</span>
                Profile
              </button>
              <button type="submit" disabled={loading} className="btn-primary min-w-[200px] flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Running ML...
                  </>
                ) : (
                  <>Prediction Report</>
                )}
              </button>
            </div>
          </form>
        )}

        {stage === "result" && result && (
          <div className="flex flex-col items-center animate-fade-in space-y-8">
            <div className="text-center">
              <span className="text-sm font-bold text-indigo-500 uppercase tracking-[0.2em] mb-2 block">Risk Assessment Result</span>
              <h2 className="text-3xl font-black text-slate-800 mb-2">Student Analysis Report</h2>
              <div className="h-1.5 w-20 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className={`text-5xl md:text-6xl font-black px-12 py-8 rounded-[40px] shadow-2xl transition-all hover:scale-105 cursor-default ${
              result.risk_level === 'High Risk' ? 'bg-red-50 text-red-600 shadow-red-200/50' :
              result.risk_level === 'Medium Risk' ? 'bg-amber-50 text-amber-600 shadow-amber-200/50' :
              'bg-emerald-50 text-emerald-600 shadow-emerald-200/50'
            }`}>
              {result.risk_level}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl overflow-hidden group">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-4">Performance Insights</h3>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-600">Student</span>
                      <span className="font-black text-primary uppercase">{formData.name}</span>
                   </div>
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-slate-600">ID</span>
                      <span className="font-bold text-slate-800 font-mono">{formData.roll_no}</span>
                   </div>
                   <div className="pt-4">
                      <p className="text-sm text-slate-500 leading-relaxed italic">
                        The risk level is calculated based on attendance trends, continuous assessments, and historical data patterns using our trained classifier.
                      </p>
                   </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl group">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 border-b pb-4">Visual Analytics</h3>
                {result.graph_image ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner group-hover:scale-[1.02] transition-transform">
                    <img 
                      src={`data:image/png;base64,${result.graph_image}`} 
                      alt="Student Performance Graph" 
                      className="w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="h-48 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                    No graph available
                  </div>
                )}
              </div>
            </div>

            <button onClick={resetForm} className="btn-primary mt-8 flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Generate New Analysis
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
