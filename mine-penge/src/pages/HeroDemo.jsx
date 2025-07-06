import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import HeroSectionAdvanced from '../components/HeroSectionAdvanced';
import SEOHead from '../components/SEOHead';

const HeroDemo = () => {
  const [selectedVersion, setSelectedVersion] = useState('basic');

  return (
    <>
      <SEOHead 
        title="Hero Section Demo"
        description="Se forskellige versioner af hero sections til MinePenge.nu"
      />
      
      <div className="min-h-screen bg-nordic-50">
        {/* Version selector */}
        <div className="sticky top-0 z-50 bg-white border-b border-nordic-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-nordic-900">
                Hero Section Demo
              </h1>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedVersion('basic')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedVersion === 'basic'
                      ? 'bg-primary-600 text-white'
                      : 'bg-nordic-100 text-nordic-700 hover:bg-nordic-200'
                  }`}
                >
                  Basic Version
                </button>
                <button
                  onClick={() => setSelectedVersion('advanced')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedVersion === 'advanced'
                      ? 'bg-primary-600 text-white'
                      : 'bg-nordic-100 text-nordic-700 hover:bg-nordic-200'
                  }`}
                >
                  Advanced Version
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hero section */}
        {selectedVersion === 'basic' ? <HeroSection /> : <HeroSectionAdvanced />}

        {/* Info section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <h2 className="text-3xl font-bold text-nordic-900">
                Hero Section Funktioner
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-nordic-900">Basic Version</h3>
                  <ul className="text-left space-y-2 text-nordic-600">
                    <li>• Ren og simpel design</li>
                    <li>• Fokus på indhold</li>
                    <li>• Hurtig loading</li>
                    <li>• Mobil-venlig</li>
                    <li>• Let at vedligeholde</li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-nordic-900">Advanced Version</h3>
                  <ul className="text-left space-y-2 text-nordic-600">
                    <li>• Avancerede animationer</li>
                    <li>• Interaktive elementer</li>
                    <li>• Sophisticerede illustrationer</li>
                    <li>• Hover effects</li>
                    <li>• Mere engagerende UX</li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 p-6 bg-nordic-50 rounded-2xl">
                <h3 className="text-lg font-semibold text-nordic-900 mb-4">
                  Implementering
                </h3>
                <p className="text-nordic-600">
                  For at bruge en af disse hero sections, importer komponenten i din App.jsx og 
                  erstat den nuværende header sektion. Begge versioner er responsive og 
                  optimeret til alle enheder.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HeroDemo; 