import Link from "next/link";
import { GraduationCap, ArrowRight, ShieldCheck, BarChart3, Users } from "lucide-react";
import { SignInButton, Show } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#090d16] text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center border-b border-gray-50 dark:border-slate-800/60 transition-colors duration-300">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600 dark:text-blue-500">
          <GraduationCap className="w-8 h-8" />
          <span>GradeSense</span>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">Sign In</button>
            </SignInButton>
            <Link 
              href="/sign-up" 
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              Get Started
            </Link>
          </Show>
          <Show when="signed-in">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none"
            >
              Go to Dashboard
            </Link>
          </Show>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-sm font-bold mb-8 animate-bounce">
          <ShieldCheck className="w-4 h-4" />
          <span>NEW: AI-Powered Risk Assessment v2.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight max-w-4xl leading-tight">
          Transform Your College's <span className="text-blue-600 dark:text-blue-400">Academic Outcomes</span>
        </h1>
        
        <p className="text-xl text-gray-500 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed">
          The ultimate platform for student performance tracking and early-risk prediction. 
          Help your students succeed with data-driven insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/dashboard" 
            className="group bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-none flex items-center gap-3"
          >
            Access Portal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="bg-white text-gray-900 border-2 border-gray-100 dark:bg-slate-900 dark:text-white dark:border-slate-800 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all cursor-pointer">
            Watch Demo
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-5xl">
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 dark:bg-slate-900/60 dark:border-slate-800/80 text-left hover:shadow-xl hover:shadow-blue-500/5 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-100 dark:shadow-none">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI Prediction</h3>
            <p className="text-gray-500 dark:text-slate-400 leading-relaxed">Our advanced models identify at-risk students with over 94% accuracy based on multi-factor data.</p>
          </div>
          
          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 dark:bg-slate-900/60 dark:border-slate-800/80 text-left hover:shadow-xl hover:shadow-indigo-500/5 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 dark:shadow-none">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">College Admin</h3>
            <p className="text-gray-500 dark:text-slate-400 leading-relaxed">Seamlessly manage departments, faculty, and student records in one centralized dashboard.</p>
          </div>

          <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 dark:bg-slate-900/60 dark:border-slate-800/80 text-left hover:shadow-xl hover:shadow-emerald-500/5 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-100 dark:shadow-none">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Real-time Insights</h3>
            <p className="text-gray-500 dark:text-slate-400 leading-relaxed">Instantly visualize classroom performance and generate detailed reports for faculty meetings.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <footer className="border-t border-gray-100 dark:border-slate-900/80 py-20 mt-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 dark:text-slate-500 font-medium mb-8 uppercase tracking-widest">Trusted by Leading Institutions</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale font-bold text-2xl text-gray-400 dark:text-slate-500">
            <span>STANFORD</span>
            <span>MIT</span>
            <span>OXFORD</span>
            <span>HARVARD</span>
          </div>
          <p className="mt-12 text-gray-300 dark:text-slate-600 text-sm">© 2026 GradeSense AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
