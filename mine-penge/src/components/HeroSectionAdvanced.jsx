import React from 'react';
import { TrendingUp, Users, Shield, Zap, Home, GraduationCap, PiggyBank, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSectionAdvanced = ({ statistics = {} }) => {
  const scrollToSearch = () => {
    const searchBar = document.querySelector('.search-container') || document.querySelector('input[type="text"]');
    if (searchBar) {
      // Scroll til søgebaren og placér den 100px fra toppen
      const searchBarRect = searchBar.getBoundingClientRect();
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetScrollTop = currentScrollTop + searchBarRect.top - 100;
      
      window.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
      
      // Focus på søgefeltet
      setTimeout(() => {
        const searchInput = searchBar.querySelector('input[type="text"]') || searchBar;
        if (searchInput) {
          searchInput.focus();
        }
      }, 500);
    }
  };
  return (
    <section className="relative bg-gradient-to-br from-nordic-50 via-white to-primary-50 overflow-hidden pb-4 lg:pb-6 mt-[50px]">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary-200 to-primary-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-200 to-green-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-40 animate-pulse delay-2000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left side - Content */}
          <div className="space-y-4">
            <div className="space-y-6">

              
              {/* Main headline */}
              <h1 className="text-5xl lg:text-7xl font-display font-bold text-nordic-900 leading-tight">
                Din guide til{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-blue-600 to-green-600">
                  smart privatøkonomi
                </span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-nordic-600 leading-relaxed max-w-2xl">
                Vi samler automatisk de bedste danske artikler om privatøkonomi, 
                kategoriserer dem med AI og præsenterer dem på en overskuelig måde.
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="group p-4 bg-white rounded-xl shadow-sm border border-nordic-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic-900 text-base">Daglige opdateringer</h3>
                    <p className="text-nordic-600 text-sm">Nye artikler hver dag fra de bedste kilder</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 bg-white rounded-xl shadow-sm border border-nordic-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic-900 text-base">Kvalitetsindhold</h3>
                    <p className="text-nordic-600 text-sm">Kun de mest relevante og pålidelige artikler</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 bg-white rounded-xl shadow-sm border border-nordic-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic-900 text-base">For alle danskere</h3>
                    <p className="text-nordic-600 text-sm">Fra studerende til pensionister</p>
                  </div>
                </div>
              </div>
              
              <div className="group p-4 bg-white rounded-xl shadow-sm border border-nordic-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-nordic-900 text-base">Smart kategorisering</h3>
                    <p className="text-nordic-600 text-sm">AI-drevet tagging og organisering</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToSearch}
                className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="flex items-center justify-center">
                  Udforsk artikler
                  <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <Link to="/om-os">
                <button className="px-8 py-4 border-2 border-nordic-300 text-nordic-700 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-700 transition-all duration-300 hover:bg-primary-50">
                  Se hvordan det virker
                </button>
              </Link>
            </div>
          </div>

          {/* Right side - Advanced Illustration */}
          <div className="relative">
            {/* Main illustration container */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-nordic-100 overflow-hidden">
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="2" fill="currentColor"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#dots)" />
                </svg>
              </div>

              {/* Central hub */}
              <div className="relative text-center space-y-8">
                {/* Main hub with Danish flag colors */}
                <div className="relative w-56 h-56 mx-auto">
                  {/* Outer ring */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-white to-red-500 rounded-full opacity-10 animate-spin" style={{animationDuration: '20s'}}></div>
                  
                  {/* Main hub */}
                  <div className="relative w-full h-full bg-gradient-to-br from-primary-100 via-blue-50 to-green-100 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    <div className="text-7xl animate-bounce" style={{animationDuration: '3s'}}>🏠</div>
                  </div>
                  
                  {/* Inner ring */}
                  <div className="absolute inset-4 bg-gradient-to-br from-primary-200 to-blue-200 rounded-full opacity-30 animate-pulse"></div>
                </div>

                {/* Floating category icons around the hub */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{animationDuration: '2s'}}>
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>

                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{animationDuration: '2.5s'}}>
                  <PiggyBank className="w-8 h-8 text-white" />
                </div>

                <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{animationDuration: '1.8s'}}>
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>

                <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{animationDuration: '2.2s'}}>
                  <Home className="w-8 h-8 text-white" />
                </div>

                {/* Article cards floating around */}
                <div className="absolute top-8 left-16 w-36 h-20 bg-white rounded-xl shadow-lg border border-nordic-200 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                  <div className="p-4">
                    <div className="w-full h-2 bg-nordic-200 rounded mb-2"></div>
                    <div className="w-3/4 h-2 bg-nordic-200 rounded mb-2"></div>
                    <div className="w-1/2 h-2 bg-primary-200 rounded"></div>
                  </div>
                </div>

                <div className="absolute top-16 right-16 w-32 h-16 bg-white rounded-xl shadow-lg border border-nordic-200 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="p-3">
                    <div className="w-full h-2 bg-nordic-200 rounded mb-1"></div>
                    <div className="w-2/3 h-2 bg-green-200 rounded"></div>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 w-40 h-20 bg-white rounded-xl shadow-lg border border-nordic-200 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="p-4">
                    <div className="w-full h-2 bg-nordic-200 rounded mb-2"></div>
                    <div className="w-4/5 h-2 bg-nordic-200 rounded mb-2"></div>
                    <div className="w-1/3 h-2 bg-blue-200 rounded"></div>
                  </div>
                </div>

                {/* Connection lines with animation */}
                <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4"/>
                      <stop offset="50%" stopColor="#10B981" stopOpacity="0.4"/>
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4"/>
                    </linearGradient>
                  </defs>
                  <path d="M 80 80 Q 120 60 160 80" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeDasharray="5,5" className="animate-pulse">
                    <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                  </path>
                  <path d="M 160 80 Q 200 100 240 80" stroke="url(#lineGradient)" strokeWidth="3" fill="none" strokeDasharray="5,5" className="animate-pulse">
                    <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>

              {/* Stats at bottom */}
              <div className="mt-12 grid grid-cols-3 gap-6 text-center">
                <div className="group">
                  <div className="text-3xl font-bold text-primary-600 group-hover:scale-110 transition-transform">
                    {statistics.totalArticles || '500+'}
                  </div>
                  <div className="text-sm text-nordic-600 font-medium">Artikler</div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-green-600 group-hover:scale-110 transition-transform">
                    {statistics.sources?.length || '15+'}
                  </div>
                  <div className="text-sm text-nordic-600 font-medium">Kilder</div>
                </div>
                <div className="group">
                  <div className="text-3xl font-bold text-blue-600 group-hover:scale-110 transition-transform">24/7</div>
                  <div className="text-sm text-nordic-600 font-medium">Opdatering</div>
                </div>
              </div>
            </div>

            {/* Floating category badges */}
            <div className="absolute -top-4 left-1/4 bg-white rounded-full px-6 py-3 shadow-xl border border-nordic-200 hover:shadow-2xl transition-shadow">
              <span className="text-sm font-semibold text-nordic-700">SU & Studerende</span>
            </div>
            
            <div className="absolute top-1/2 -right-4 bg-white rounded-full px-6 py-3 shadow-xl border border-nordic-200 hover:shadow-2xl transition-shadow">
              <span className="text-sm font-semibold text-nordic-700">Bolig & Hus</span>
            </div>
            
            <div className="absolute -bottom-4 left-1/3 bg-white rounded-full px-6 py-3 shadow-xl border border-nordic-200 hover:shadow-2xl transition-shadow">
              <span className="text-sm font-semibold text-nordic-700">Investering</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionAdvanced; 