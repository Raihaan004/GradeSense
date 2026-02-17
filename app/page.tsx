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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-gray-900">
      <div className="w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
        <h1 className="mb-2 text-center text-3xl font-bold text-indigo-700">
          Student Performance Risk Analyzer
        </h1>
        <p className="mb-8 text-center text-gray-500">
          Machine Learning-based Academic Risk Prediction
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {stage === "home" && (
          <div className="flex flex-col items-center">
            <div className="mb-8 text-center">
              <p className="text-lg">
                Welcome to the analytics dashboard. Use this tool to predict
                student performance outcome based on their continuous assessment
                marks at various stages.
              </p>
            </div>
            <button
              onClick={handleStart}
              className="rounded-full bg-indigo-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-indigo-700 shadow-lg"
            >
              + New Student Analysis
            </button>
          </div>
        )}

        {stage === "details" && (
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Step 1: Student Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Roll/Reg No</label>
                <input
                  type="text"
                  name="roll_no"
                  value={formData.roll_no}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Section</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
              >
                Next: Enter Marks &rarr;
              </button>
            </div>
          </form>
        )}

        {stage === "marks" && (
          <form onSubmit={handleMarksSubmit} className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Step 2: Academic Performance (Marks)</h2>
            
            {/* Assignments */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Assignments (0-100)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={`assign-${num}`}>
                    <label className="block text-xs font-medium text-gray-500">Assign {num}</label>
                    <input
                      type="number"
                      name={`assignment_${num}`}
                      value={(formData as any)[`assignment_${num}`]}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border-gray-300 p-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Cycle Tests */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Cycle Tests (0-100)</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <div key={`cycle-${num}`}>
                    <label className="block text-xs font-medium text-gray-500">Cycle Test {num}</label>
                    <input
                      type="number"
                      name={`cycle_test_${num}`}
                      value={(formData as any)[`cycle_test_${num}`]}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border-gray-300 p-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* CATs */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">CAT Tests (0-100)</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((num) => (
                  <div key={`cat-${num}`}>
                    <label className="block text-xs font-medium text-gray-500">CAT {num}</label>
                    <input
                      type="number"
                      name={`cat_${num}`}
                      value={(formData as any)[`cat_${num}`]}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-md border-gray-300 p-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      min="0"
                      max="100"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Other */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Other Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attendance %</label>
                  <input
                    type="number"
                    name="attendance"
                    value={formData.attendance}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lab Marks (0-100)</label>
                  <input
                    type="number"
                    name="lab_marks"
                    value={formData.lab_marks}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setStage("details")}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
              >
                &larr; Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-green-600 px-8 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze Risk"}
              </button>
            </div>
          </form>
        )}

        {stage === "result" && result && (
          <div className="flex flex-col items-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Prediction Result</h2>
            
            <div className={`text-4xl font-extrabold mb-6 ${
              result.risk_level === 'High Risk' ? 'text-red-600' :
              result.risk_level === 'Medium Risk' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {result.risk_level}
            </div>
            
            <div className="w-full max-w-2xl bg-white p-4 rounded-lg border shadow-sm mb-8">
              <h3 className="text-lg font-semibold mb-4 text-center">Performance Overview Graph</h3>
              {result.graph_image ? (
                <img 
                  src={`data:image/png;base64,${result.graph_image}`} 
                  alt="Student Performance Graph" 
                  className="w-full h-auto"
                />
              ) : (
                <p>No graph available</p>
              )}
            </div>

            <button
              onClick={resetForm}
              className="rounded-full bg-indigo-600 px-8 py-3 text-white hover:bg-indigo-700 shadow-md"
            >
              Start New Analysis
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
