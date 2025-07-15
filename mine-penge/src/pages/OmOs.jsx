import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import { Users, Target, Shield, TrendingUp, Heart, BookOpen, ExternalLink, Linkedin, Globe } from 'lucide-react';
import { getStatistics } from '../services/articleService';

function OmOs() {
  const [statistics, setStatistics] = useState({
    totalArticles: 0,
    sources: [],
    availableTags: 0
  });

  // Function to get source URL and display name
  const getSourceInfo = (sourceName) => {
    const sourceUrls = {
      'budgetnoerden': 'https://budgetnoerden.dk',
      'budgetnørden': 'https://budgetnoerden.dk',
      'budget nørden': 'https://budgetnoerden.dk',
      'mitteldorf': 'https://mitteldorf.dk',
      'mitteldorfdk': 'https://mitteldorf.dk',
      'mitteldorf blog': 'https://mitteldorf.dk',
      'moneypenny': 'https://moneypennyandmore.dk',
      'moneypennyandmore': 'https://moneypennyandmore.dk',
      'moneypennydk': 'https://moneypennyandmore.dk',
      'nordnet': 'https://nordnet.dk',
      'nordnetdk': 'https://nordnet.dk',
      'ungmedpenge': 'https://ungmedpenge.dk',
      'ungmedpengedk': 'https://ungmedpenge.dk',
      'forbrugerrådet tænk': 'https://taenk.dk',
      'taenk': 'https://taenk.dk'
    };
    
    const displayNames = {
      'budgetnoerden': 'BudgetNørden',
      'budgetnørden': 'BudgetNørden',
      'budget nørden': 'BudgetNørden',
      'mitteldorf': 'Mitteldorf',
      'mitteldorfdk': 'Mitteldorf',
      'mitteldorf blog': 'Mitteldorf',
      'moneypenny': 'Moneypenny & More',
      'moneypennyandmore': 'Moneypenny & More',
      'moneypennydk': 'Moneypenny & More',
      'nordnet': 'Nordnet',
      'nordnetdk': 'Nordnet',
      'ungmedpenge': 'Ung Med Penge',
      'ungmedpengedk': 'Ung Med Penge',
      'forbrugerrådet tænk': 'Forbrugerrådet Tænk',
      'taenk': 'Forbrugerrådet Tænk'
    };
    
    return {
      url: sourceUrls[sourceName.toLowerCase()] || null,
      displayName: displayNames[sourceName.toLowerCase()] || sourceName
    };
  };

  useEffect(() => {
    const stats = getStatistics();
    setStatistics(stats);
  }, []);

  return (
    <>
      <SEOHead 
        title="Om os"
        description="Lær mere om MinePenge.nu - din guide til smart privatøkonomi. Vi hjælper danskere med at spare penge, investere klogt og bygge en sund økonomisk fremtid."
        keywords="om minepenge, privatøkonomi guide, dansk økonomi, budget hjælp, investering råd"
      />
      
      <div className="min-h-screen bg-nordic-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-nordic-900 mb-4">
              Om MinePenge.nu
            </h1>
            <p className="text-xl text-nordic-600 max-w-3xl mx-auto">
              Din guide til smart privatøkonomi. Vi samler automatisk de bedste artikler og råd 
              fra Danmarks førende økonomieksperter på ét sted ved hjælp af AI-teknologi.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-soft">
            <div className="flex items-center mb-6">
              <Target className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-nordic-900">Vores Mission</h2>
            </div>
            <p className="text-lg text-nordic-700 leading-relaxed mb-4">
              Jeg vil gøre privatøkonomi tilgængelig og forståelig for alle danskere. 
              Uanset om du er studerende, børnefamilie eller pensionist, hjælper MinePenge.nu dig 
              med at træffe kloge økonomiske beslutninger gennem automatisk indsamling og kategorisering af kvalitetsindhold.
            </p>
            <p className="text-lg text-nordic-700 leading-relaxed">
              Ud over at samle de bedste artikler fra eksperter, udvikler vi også vores egne omfattende guides 
              under "Quick Links" - fra studerende økonomi til boligkøb og investering. Disse guides giver dig 
              en struktureret vejledning gennem komplekse økonomiske emner, suppleret med praktiske værktøjer 
              og beregnere.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold text-nordic-900">Pålidelighed</h3>
              </div>
              <p className="text-nordic-700">
                Vi samler kun indhold fra pålidelige kilder og eksperter. 
                Alle artikler gennemgås for at sikre kvalitet og nøjagtighed.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold text-nordic-900">Empati</h3>
              </div>
              <p className="text-nordic-700">
                Vi forstår, at økonomi kan være kompliceret og følsomt. 
                Vores tilgang er venlig, støttende og uden løftede pegefingre.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold text-nordic-900">Læring</h3>
              </div>
              <p className="text-nordic-700">
                Vi tror på kontinuerlig læring og udvikling. 
                Vores indhold opdateres regelmæssigt med de nyeste trends og forskning.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600 mr-3" />
                <h3 className="text-xl font-semibold text-nordic-900">Vækst</h3>
              </div>
              <p className="text-nordic-700">
                Vi hjælper dig med at vokse økonomisk - både gennem opsparing, 
                investering og smarte økonomiske beslutninger.
              </p>
            </div>
          </div>

          {/* Creator */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-soft">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 text-primary-600 mr-3" />
                              <h2 className="text-2xl font-bold text-nordic-900">Skaberen bag MinePenge.nu</h2>
            </div>
            <p className="text-lg text-nordic-700 leading-relaxed mb-6">
              MinePenge.nu er skabt af Thomas Sandvik, en software udvikler og AI-entusiast, 
              der gør privatøkonomi tilgængelig for alle danskere.
            </p>
            
            <div className="bg-nordic-50 rounded-xl p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-xl">TS</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-nordic-900 mb-2">Thomas Sandvik</h3>
                  <p className="text-nordic-700 mb-3">
                    Software udvikler og AI-entusiast med fokus på at skabe digitale løsninger, 
                    der gør komplekse emner som privatøkonomi nemme at forstå og navigere i.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a 
                      href="https://linkedin.com/in/thomas-sandvik" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">LinkedIn</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                    <a 
                      href="https://aipops.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">AIPops.com</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                    <a 
                      href="https://thomassandvik.dk" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">ThomasSandvik.dk</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">🤖</span>
                </div>
                <h4 className="font-semibold text-nordic-900 mb-2">AI & Automatisering</h4>
                <p className="text-sm text-nordic-600">
                  Automatisk indsamling og kategorisering af artikler
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">💻</span>
                </div>
                <h4 className="font-semibold text-nordic-900 mb-2">Web Udvikling</h4>
                <p className="text-sm text-nordic-600">
                  Moderne React-baseret platform
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">📊</span>
                </div>
                <h4 className="font-semibold text-nordic-900 mb-2">Data Analyse</h4>
                <p className="text-sm text-nordic-600">
                  Smart tagging og filtrering af indhold
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-soft">
              <div className="text-3xl font-bold text-primary-600 mb-2">{statistics.totalArticles.toLocaleString()}</div>
              <div className="text-sm text-nordic-600">Artikler</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-soft">
              <div className="text-3xl font-bold text-primary-600 mb-2">{statistics.sources.length}</div>
              <div className="text-sm text-nordic-600">Kilder</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-soft">
              <div className="text-3xl font-bold text-primary-600 mb-2">{statistics.availableTags}</div>
              <div className="text-sm text-nordic-600">Tags</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-soft">
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-sm text-nordic-600">Tilgængelig</div>
            </div>
          </div>

          {/* Sources */}
          <div className="bg-white rounded-2xl p-8 mb-12 shadow-soft">
            <h2 className="text-2xl font-bold text-nordic-900 mb-6">Vores Kilder</h2>
            <p className="text-lg text-nordic-700 leading-relaxed mb-6">
              Vi samler indhold fra Danmarks førende økonomieksperter og finansmedier 
              for at give dig det bedste og mest aktuelle råd.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statistics.sources.map((source, index) => {
                const sourceInfo = getSourceInfo(source);
                return (
                  <div key={index} className="bg-nordic-50 rounded-lg p-4 border border-nordic-200 hover:shadow-md transition-shadow">
                    {sourceInfo.url ? (
                      <a 
                        href={sourceInfo.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center hover:text-primary-600 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-bold text-sm">
                            {sourceInfo.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-nordic-900">{sourceInfo.displayName}</span>
                        <ExternalLink className="h-4 w-4 ml-auto text-nordic-400" />
                      </a>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-bold text-sm">
                            {sourceInfo.displayName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-nordic-900">{sourceInfo.displayName}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-nordic-600">
                Nye kilder tilføjes automatisk når de opdages af vores AI-system
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary-600 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              Kom i gang med din økonomiske rejse
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Udforsk vores artikler og find de råd, der passer til din situation
            </p>
            <a 
              href="/" 
              className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-nordic-100 transition-colors"
            >
              Start her
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default OmOs; 