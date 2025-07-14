import React from 'react';
import { TrendingUp, Users, Shield, Zap } from 'lucide-react';
import { calculateStatistics } from '../utils/statistics';

const HeroSection = () => {
  const statistics = calculateStatistics();
  
  return (
    <section className="relative bg-gradient-to-br from-nordic-50 via-white to-primary-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-nordic-200 rounded-full opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-blue-100 rounded-full opacity-40 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4 mr-2" />
                AI-drevet økonomi platform
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-display font-bold text-nordic-900 leading-tight">
                Få styr på dine{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-600">
                  penge
                </span>
                <br />
                med smart teknologi
              </h1>
              
              <p className="text-xl text-nordic-600 leading-relaxed max-w-2xl">
                Vi samler automatisk de bedste danske artikler om privatøkonomi, 
                så du altid har adgang til friske råd og inspiration.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-900">Daglige opdateringer</h3>
                  <p className="text-sm text-nordic-600">Nye artikler hver dag</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-900">Kvalitetsindhold</h3>
                  <p className="text-sm text-nordic-600">Kun de bedste kilder</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-900">For alle danskere</h3>
                  <p className="text-sm text-nordic-600">Studerende til pensionister</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-nordic-900">Smart kategorisering</h3>
                  <p className="text-sm text-nordic-600">AI-drevet tagging</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Udforsk artikler
              </button>
              <button className="px-8 py-4 border-2 border-nordic-300 text-nordic-700 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-700 transition-colors">
                Lær mere
              </button>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="relative">
            {/* Main illustration container */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-nordic-100">
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">💰</span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">📈</span>
              </div>

              {/* Central illustration */}
              <div className="text-center space-y-6">
                {/* Danish flag colors as background */}
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-white to-red-500 rounded-full opacity-20"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-primary-100 to-blue-100 rounded-full flex items-center justify-center">
                    <div className="text-6xl">🏠</div>
                  </div>
                </div>

                {/* Article cards floating around */}
                <div className="absolute top-8 left-8 w-32 h-20 bg-white rounded-lg shadow-md border border-nordic-200 transform rotate-6">
                  <div className="p-3">
                    <div className="w-full h-2 bg-nordic-200 rounded mb-2"></div>
                    <div className="w-3/4 h-2 bg-nordic-200 rounded"></div>
                  </div>
                </div>

                <div className="absolute top-16 right-12 w-28 h-16 bg-white rounded-lg shadow-md border border-nordic-200 transform -rotate-3">
                  <div className="p-2">
                    <div className="w-full h-2 bg-nordic-200 rounded mb-1"></div>
                    <div className="w-2/3 h-2 bg-nordic-200 rounded"></div>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 w-36 h-20 bg-white rounded-lg shadow-md border border-nordic-200 transform rotate-2">
                  <div className="p-3">
                    <div className="w-full h-2 bg-nordic-200 rounded mb-2"></div>
                    <div className="w-4/5 h-2 bg-nordic-200 rounded"></div>
                  </div>
                </div>

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" style={{zIndex: -1}}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.3"/>
                    </linearGradient>
                  </defs>
                  <path d="M 50 50 Q 100 25 150 50" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
                  <path d="M 150 50 Q 200 75 250 50" stroke="url(#lineGradient)" strokeWidth="2" fill="none"/>
                </svg>
              </div>

              {/* Stats at bottom */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">{statistics.totalArticles}</div>
                  <div className="text-sm text-nordic-600">Artikler</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{statistics.totalSources}</div>
                  <div className="text-sm text-nordic-600">Kilder</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">24/7</div>
                  <div className="text-sm text-nordic-600">Opdatering</div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-2 left-1/4 bg-white rounded-full px-4 py-2 shadow-lg border border-nordic-200">
              <span className="text-sm font-medium text-nordic-700">SU & Studerende</span>
            </div>
            
            <div className="absolute top-1/2 -right-2 bg-white rounded-full px-4 py-2 shadow-lg border border-nordic-200">
              <span className="text-sm font-medium text-nordic-700">Bolig & Hus</span>
            </div>
            
            <div className="absolute -bottom-2 left-1/3 bg-white rounded-full px-4 py-2 shadow-lg border border-nordic-200">
              <span className="text-sm font-medium text-nordic-700">Investering</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 