import React, { useState } from 'react';
import { BookOpen, Calculator, FileSpreadsheet, Brain, ArrowRight, ExternalLink, TrendingUp, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import InvestmentCalculator from '../components/InvestmentCalculator';
import StudentBudgetTemplate from '../components/StudentBudgetTemplate';
import InvestmentQuiz from '../components/InvestmentQuiz';
import PlatformComparison from '../components/PlatformComparison';
import SEOHead from '../components/SEOHead';

const StudentInvestmentGuide = () => {
  const [activeTab, setActiveTab] = useState('article');

  const tabs = [
    { id: 'article', label: 'Artikel', icon: BookOpen },
    { id: 'calculator', label: 'Beregner', icon: Calculator },
    { id: 'template', label: 'Budget Template', icon: FileSpreadsheet },
    { id: 'platforms', label: 'Platforms', icon: TrendingUp },
    { id: 'quiz', label: 'Quiz', icon: Brain }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <InvestmentCalculator />;
      case 'template':
        return <StudentBudgetTemplate />;
      case 'platforms':
        return <PlatformComparison />;
      case 'quiz':
        return <InvestmentQuiz />;
      default:
        return <ArticleContent />;
    }
  };

  const ArticleContent = () => (
    <div className="max-w-4xl mx-auto">
      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            ✨ Original Content
          </span>
          <span className="text-sm text-gray-500">• 15 min læsning</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎓 Studerende og Investering - Kom Godt i Gang
        </h1>
        
        <p className="text-xl text-gray-600 mb-6">
          En komplet guide til at starte din investeringsrejse som studerende i Danmark
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Skrevet af MinePenge teamet</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString('da-DK')}</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Hurtig oversigt</h3>
          <ul className="text-blue-700 space-y-1">
            <li>• Hvorfor investere som studerende?</li>
            <li>• Hvor meget kan du investere?</li>
            <li>• Danske platforms og apps</li>
            <li>• Praktiske tips og strategier</li>
          </ul>
        </div>

        <h2>Hvorfor skal studerende investere?</h2>
        <p>
          Som studerende har du noget, som mange andre ikke har: <strong>tid</strong>. 
          Selv små beløb kan vokse til betydelige summer over tid takket være compound interest 
          (renter på renter). Lad os se på et eksempel:
        </p>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-green-800 mb-2">Eksempel: Emma, 20 år</h4>
          <p className="text-green-700 mb-3">
            Emma investerer 500 kr/måned fra hun er 20 til hun er 30 år. 
            Derefter stopper hun med at investere, men pengene fortsætter med at vokse.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">60.000 kr</div>
              <div className="text-sm text-green-600">Hun har investeret</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">+7% årligt</div>
              <div className="text-sm text-green-600">Gennemsnitligt afkast</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">~200.000 kr</div>
              <div className="text-sm text-green-600">Værdi ved 30 år</div>
            </div>
          </div>
        </div>

        <h2>Hvor meget kan du investere som studerende?</h2>
        <p>
          Det afhænger af din situation, men her er en realistisk tilgang:
        </p>

        <h3>50/30/20 reglen tilpasset studerende</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">50%</div>
            <div className="text-sm font-medium text-red-700">Nødvendige udgifter</div>
            <div className="text-xs text-red-600 mt-1">
              Bolig, mad, transport, forsikringer
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">30%</div>
            <div className="text-sm font-medium text-blue-700">Ønsker og underholdning</div>
            <div className="text-xs text-blue-600 mt-1">
              Byen, streaming, shopping, ferier
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">20%</div>
            <div className="text-sm font-medium text-green-700">Opsparing og investering</div>
            <div className="text-xs text-green-600 mt-1">
              Emergency fund, aktier, pension
            </div>
          </div>
        </div>

        <h3>Realistiske beløb for studerende</h3>
        <ul>
          <li><strong>100-300 kr/måned:</strong> Hvis du kun har SU</li>
          <li><strong>300-800 kr/måned:</strong> Hvis du har deltidsjob</li>
          <li><strong>800+ kr/måned:</strong> Hvis du har godt betalt studiejob</li>
        </ul>

        <h2>Danske platforms og apps</h2>
        <p>
          Som dansker har du adgang til flere gode platforms. Her er de bedste muligheder:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Nordnet</h4>
            <p className="text-sm text-gray-600 mb-3">
              Danmarks største online børsmægler. Perfekt for begyndere.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✓ Gratis månedsopsparing</li>
              <li>✓ Lav minimumsindbetaling</li>
              <li>✓ God app og kundeservice</li>
              <li>✓ Bredt udvalg af ETF'er</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Saxo Bank</h4>
            <p className="text-sm text-gray-600 mb-3">
              International platform med lave gebyrer og god teknologi.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✓ Meget lave gebyrer</li>
              <li>✓ Avanceret handelsplatform</li>
              <li>✓ Global tilgang</li>
              <li>✓ God research</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Lunar</h4>
            <p className="text-sm text-gray-600 mb-3">
              Digital bank med indbyggede investeringsmuligheder.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✓ Nem integration</li>
              <li>✓ Automatisk investering</li>
              <li>✓ Moderne app</li>
              <li>✓ Lav minimumsindbetaling</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Danske Bank</h4>
            <p className="text-sm text-gray-600 mb-3">
              Traditionel bank med online investeringsmuligheder.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✓ Hvis du allerede er kunde</li>
              <li>✓ Personlig rådgivning</li>
              <li>✓ Sikker og pålidelig</li>
              <li>✓ Højere gebyrer</li>
            </ul>
          </div>
        </div>

        <h2>ETF vs. Enkeltaktier for begyndere</h2>
        <p>
          Som begynder er ETF'er (Exchange Traded Funds) din bedste ven. Her er hvorfor:
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-yellow-800 mb-3">ETF'er - Perfekt for begyndere</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-yellow-700 mb-2">Fordele:</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Automatisk diversificering</li>
                <li>• Lavere risiko</li>
                <li>• Mindre tid på research</li>
                <li>• Lav minimumsindbetaling</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-yellow-700 mb-2">Populære danske ETF'er:</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• iShares MSCI World</li>
                <li>• Sparindex INDEX Globale Aktier</li>
                <li>• Danske Invest Global Indeks</li>
                <li>• Storebrand Global All Countries</li>
              </ul>
            </div>
          </div>
        </div>

        <h2>Risikostyring og emergency fund</h2>
        <p>
          Før du begynder at investere, skal du have et emergency fund på plads:
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-red-800 mb-3">Emergency Fund først!</h4>
          <p className="text-red-700 mb-3">
            Spar 3-6 måneders udgifter op før du begynder at investere. 
            Dette giver dig sikkerhed og frihed til at investere uden at skulle 
            sælge i dårlige tider.
          </p>
          <div className="text-sm text-red-600">
            <strong>Eksempel:</strong> Hvis dine månedlige udgifter er 5.000 kr, 
            skal du spare 15.000-30.000 kr op først.
          </div>
        </div>

        <h2>Skatteimplikationer for studerende</h2>
        <p>
          Som dansker skal du være opmærksom på skattereglerne:
        </p>

        <ul>
          <li><strong>Lagerbeskatning:</strong> Du betaler skat af urealiserede gevinster hvert år</li>
          <li><strong>Realisationsbeskatning:</strong> Du betaler kun skat når du sælger</li>
          <li><strong>ASK (Aktiesparekonto):</strong> 17% skat i stedet for 27-42%</li>
          <li><strong>Pensionsopsparing:</strong> Skattefordel på indbetalinger</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-blue-800 mb-2">Tip: Brug din ASK</h4>
          <p className="text-blue-700">
            Aktiesparekontoen giver dig 17% skat i stedet for de normale 27-42%. 
            Du kan indbetale op til 106.600 kr (2024). Perfekt for studerende!
          </p>
        </div>

        <h2>Almindelige fejl at undgå</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h4 className="font-semibold text-red-800 mb-2">❌ Gør IKKE dette:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Invester penge du skal bruge snart</li>
              <li>• Sæt alt i én aktie</li>
              <li>• Køb og sælg hurtigt</li>
              <li>• Ignorer gebyrer</li>
              <li>• Invester uden emergency fund</li>
            </ul>
          </div>
          
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h4 className="font-semibold text-green-800 mb-2">✅ Gør dette i stedet:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Invester kun penge du kan undvære</li>
              <li>• Brug ETF'er til diversificering</li>
              <li>• Hold i lang tid (5+ år)</li>
              <li>• Vælg platforms med lave gebyrer</li>
              <li>• Start med emergency fund</li>
            </ul>
          </div>
        </div>

        <h2>Næste skridt</h2>
        <p>
          Nu hvor du har læst guiden, er det tid til at tage handling:
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-blue-800 mb-4">Din handlingsplan:</h4>
          <ol className="space-y-3 text-blue-700">
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">1</span>
              <span>Prøv vores investeringsberegner for at se potentialet</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">2</span>
              <span>Download budget template og planlæg dine udgifter</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">3</span>
              <span>Tag quiz'en for at teste din viden</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">4</span>
              <span>Opret konto på Nordnet eller Saxo Bank</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">5</span>
              <span>Start med små beløb og øg gradvist</span>
            </li>
          </ol>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-gray-800 mb-2">Relaterede artikler fra vores netværk:</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                "Sådan starter du med at investere" - Nordnet Blog
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                "Budget guide for studerende" - MoneyPenny
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                "ASK - Aktiesparekontoen forklaret" - Saxo Bank
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> Dette er ikke finansiel rådgivning. 
            Investering indebærer risiko for tab af kapital. 
            Konsulter altid en professionel rådgiver før du investerer.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEOHead 
        title="Studerende og Investering - Kom Godt i Gang | MinePenge.nu"
        description="En komplet guide til at starte din investeringsrejse som studerende i Danmark. Lær om platforms, strategier og få praktiske værktøjer."
        keywords="studerende investering, investering for begyndere, danske aktier, ETF, Nordnet, Saxo Bank, ASK"
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation Header */}
          <div className="mb-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Forside
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Student Investment Guide</span>
            </div>
            
            <div className="flex items-center justify-end">
              <Link 
                to="/" 
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Forside
              </Link>
            </div>
          </div>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Student Investment Guide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alt du skal vide om investering som studerende - fra teori til praksis
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>

                    {/* Call to Action */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Klar til at starte din investeringsrejse?
              </h3>
              <p className="text-gray-600 mb-6">
                Brug vores værktøjer til at planlægge og komme i gang
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  Prøv beregneren
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('template')}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  Download budget template
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('platforms')}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <TrendingUp className="w-5 h-5" />
                  Sammenlign platforms
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Brain className="w-5 h-5" />
                  Tag quiz'en
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Back to Articles */}
          <div className="text-center mt-8">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tilbage til alle artikler
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentInvestmentGuide; 