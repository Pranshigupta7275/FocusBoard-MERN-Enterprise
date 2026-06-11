import { type JSX } from 'react';
import { Link } from 'react-router-dom';

const Welcome = (): JSX.Element => {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-800 font-sans overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        
        {/* Top Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[70vh]">
          
          {/* Left Side: Text and Buttons */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              <span className="block text-slate-900">Welcome to</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-2">
                FocusBoard
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Organize your life with our beautiful and intuitive task management application. 
              Create, manage, and track your tasks with ease. Stay productive and never miss a deadline again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                to="/register" 
                className="inline-flex justify-center items-center px-8 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/30 transform transition-all duration-200 hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="inline-flex justify-center items-center px-8 py-4 text-lg font-semibold rounded-xl text-indigo-600 bg-white border-2 border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 shadow-sm transition-all duration-200 hover:-translate-y-1"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Side: Floating Visual Graphic */}
          <div className="hidden lg:flex justify-center items-center relative">
            {/* Decorative soft glow background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-40 -z-10"></div>
            
            {/* Floating Glassmorphism Card */}
            <div className="bg-white/80 backdrop-blur-xl p-10 border border-white/60 rounded-[2rem] shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1 max-w-sm">
              <span className="text-6xl mb-6 block text-center w-full">🎯</span>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">Stay Focused</h3>
              <p className="text-slate-600 text-center leading-relaxed text-lg">Clear your mind, conquer your day, and achieve your biggest goals.</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          
          {/* Card 1 */}
          <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 text-center">
            <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <span className="text-4xl">🚀</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-4">Lightning Fast</h4>
            <p className="text-slate-600 leading-relaxed">Built for speed and ultimate efficiency so you can focus on what matters most.</p>
          </div>
          
          {/* Card 2 */}
          <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 text-center">
            <div className="w-20 h-20 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <span className="text-4xl">📊</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-4">Analytics Dashboard</h4>
            <p className="text-slate-600 leading-relaxed">Track your productivity with detailed insights and beautiful charts.</p>
          </div>
          
          {/* Card 3 */}
          <div className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-2 text-center">
            <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <span className="text-4xl">🔒</span>
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-4">Secure & Private</h4>
            <p className="text-slate-600 leading-relaxed">Your tasks and personal data are encrypted and securely stored.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Welcome;