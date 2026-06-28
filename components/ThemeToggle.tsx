'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <div className="w-20 h-10 rounded-full bg-gray-100 dark:bg-slate-800/50 animate-pulse border border-transparent" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-20 h-10 p-1.5 rounded-full bg-gray-100 dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 cursor-pointer select-none transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-700"
      aria-label="Toggle Dark Mode"
    >
      {/* Sliding Highlight */}
      <span
        className={`absolute top-[5px] left-[5px] w-7 h-7 rounded-full bg-white dark:bg-blue-600 shadow-md transition-transform duration-300 ease-out ${
          theme === 'dark' ? 'translate-x-[40px]' : 'translate-x-0'
        }`}
      />
      
      {/* Sun Icon */}
      <div className={`z-10 flex items-center justify-center w-7 h-7 transition-colors duration-300 ${theme === 'light' ? 'text-amber-500' : 'text-gray-400'}`}>
        <Sun className="w-4 h-4" />
      </div>

      {/* Moon Icon */}
      <div className={`z-10 flex items-center justify-center w-7 h-7 transition-colors duration-300 ${theme === 'dark' ? 'text-blue-100' : 'text-gray-400'}`}>
        <Moon className="w-4 h-4" />
      </div>
    </button>
  );
}
