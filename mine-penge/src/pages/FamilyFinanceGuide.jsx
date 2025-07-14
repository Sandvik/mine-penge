import React, { useState } from 'react';
import { BookOpen, Calculator, FileSpreadsheet, Shield, Brain, ArrowRight, ExternalLink, TrendingUp, Home, ArrowLeft, Users, Baby, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChildSavingsCalculator from '../components/ChildSavingsCalculator';
import FamilyBudgetTemplate from '../components/FamilyBudgetTemplate';
import InsuranceComparison from '../components/InsuranceComparison';
import FamilyFinanceQuiz from '../components/FamilyFinanceQuiz';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

const FamilyFinanceGuide = () => {
  const [activeTab, setActiveTab] = useState('article');

  const tabs = [
    { id: 'article', label: 'Artikel', icon: BookOpen },
    { id: 'calculator', label: 'Børneopsparing', icon: Calculator },
    { id: 'budget', label: 'Budget Template', icon: FileSpreadsheet },
    { id: 'insurance', label: 'Forsikringer', icon: Shield },
    { id: 'quiz', label: 'Quiz', icon: Brain }
  ];

  // SEO data
  const seoData = {
    title: 'Børne familie og Økonomi - Komplet Guide | MinePenge.nu',
    description: 'Lær om familieøkonomi, børneopsparing, forsikringer og budgetplanlægning for familier med børn i Danmark. Gratis værktøjer og beregnere.',
    keywords: 'familieøkonomi, børneopsparing, familie budget, forsikringer familier, børnepasning udgifter, skattefordele børn',
    url: '/family-finance-guide',
    type: 'article',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Hvordan planlægger jeg familieøkonomi?",
      "description": "Komplet guide til økonomisk planlægning for familier med børn i Danmark",
      "image": "https://minepenge.nu/family-finance-guide.jpg",
      "author": {
        "@type": "Organization",
        "name": "MinePenge.nu"
      },
      "publisher": {
        "@type": "Organization",
        "name": "MinePenge.nu"
      },
      "step": [
        {
          "@type": "HowToStep",
          "name": "Forstå familieøkonomi",
          "text": "Som familie har du ansvar for både nuværende og fremtidige behov"
        },
        {
          "@type": "HowToStep",
          "name": "Opret børneopsparing",
          "text": "Udnyt Danmarks bedste skattefordel med børneopsparing"
        },
        {
          "@type": "HowToStep",
          "name": "Planlæg familiebudget",
          "text": "Brug 50/30/20 reglen tilpasset familiens behov"
        },
        {
          "@type": "HowToStep",
          "name": "Sikre forsikringer",
          "text": "Sørg for at hele familien er dækket med de rigtige forsikringer"
        }
      ]
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <ChildSavingsCalculator />;
      case 'budget':
        return <FamilyBudgetTemplate />;
      case 'insurance':
        return <InsuranceComparison />;
      case 'quiz':
        return <FamilyFinanceQuiz />;
      default:
        return <ArticleContent />;
    }
  };

  const ArticleContent = () => (
    <div className="max-w-4xl mx-auto">
      {/* Article Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-green-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            ✨ Original Content
          </span>
          <span className="text-sm text-gray-500">• 18 min læsning</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          👨‍👩‍👧‍👦 Børne familie og Økonomi - Komplet Guide
        </h1>
        
        <p className="text-xl text-gray-600 mb-6">
          Alt du skal vide om økonomisk planlægning for familier med børn i Danmark
        </p>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Skrevet af MinePenge teamet</span>
          <span>•</span>
          <span>{new Date().toLocaleDateString('da-DK')}</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-green-50 border-l-4 border-green-500 p-6 mb-8 rounded-r-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Hurtig oversigt</h3>
          <ul className="text-green-700 space-y-1">
            <li>• Hvorfor er familie økonomi vigtig?</li>
            <li>• Børneopsparing og skattefordele</li>
            <li>• Familie budget og udgifter</li>
            <li>• Forsikringer for familier</li>
            <li>• Langtidssikkerhed og pension</li>
          </ul>
        </div>

        <h2>Hvorfor er familie økonomi vigtig?</h2>
        <p>
          Som familie med børn har du ikke kun ansvar for dig selv, men også for dine børns fremtid. 
          God økonomisk planlægning sikrer ikke kun familiens nuværende velvære, men også børnenes 
          muligheder for uddannelse, bolig og en sikker fremtid.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-blue-800 mb-2">Eksempel: Familie Hansen</h4>
          <p className="text-blue-700 mb-3">
            Familie Hansen med to børn starter børneopsparing da børnene er 0 og 2 år. 
            De indbetaler 500 kr per barn per måned i 18 år.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">180.000 kr</div>
              <div className="text-sm text-blue-600">Total indbetaling</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">+4% årligt</div>
              <div className="text-sm text-blue-600">Gennemsnitligt afkast</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">~250.000 kr</div>
              <div className="text-sm text-blue-600">Værdi ved 18 år</div>
            </div>
          </div>
        </div>

        <h2>Børneopsparing - Danmarks bedste skattefordel</h2>
        <p>
          Børneopsparing er en af Danmarks mest fordelagtige spareprodukter. Her er hvorfor:
        </p>

        <h3>Skattefordele på børneopsparing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">✅ Fordele</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Skattefordel på indbetalinger</li>
              <li>• Kun 15% skat af afkast</li>
              <li>• Barnet ejer pengene</li>
              <li>• Fleksibel til uddannelse</li>
              <li>• Højere indbetalingsloft</li>
            </ul>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">❌ Begrænsninger</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Barnet får adgang ved 18 år</li>
              <li>• Indbetalingsloft per år</li>
              <li>• Begrænset investeringsvalg</li>
              <li>• Kan ikke hæves tidligt</li>
            </ul>
          </div>
        </div>

        <h3>Hvor meget kan du indbetale?</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-yellow-800 mb-3">Indbetalingsloft 2024</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">6.000 kr</div>
              <div className="text-sm text-yellow-600">Per barn per år</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">72.000 kr</div>
              <div className="text-sm text-yellow-600">Total over 12 år</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">15%</div>
              <div className="text-sm text-yellow-600">Skat af afkast</div>
            </div>
          </div>
        </div>

        <h2>Familie budget - Realistisk planlægning</h2>
        <p>
          Som familie skal du budgettere anderledes end som single. Her er en realistisk tilgang:
        </p>

        <h3>50/30/20 reglen tilpasset familier</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">50%</div>
            <div className="text-sm font-medium text-red-700">Nødvendige udgifter</div>
            <div className="text-xs text-red-600 mt-1">
              Bolig, mad, transport, forsikringer, børnepasning
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">30%</div>
            <div className="text-sm font-medium text-blue-700">Ønsker og underholdning</div>
            <div className="text-xs text-blue-600 mt-1">
              Fritidsaktiviteter, ferier, underholdning
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">20%</div>
            <div className="text-sm font-medium text-green-700">Opsparing og investering</div>
            <div className="text-xs text-green-600 mt-1">
              Børneopsparing, pension, emergency fund
            </div>
          </div>
        </div>

        <h3>Typiske familie udgifter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Børnepasning</h4>
            <p className="text-sm text-gray-600 mb-3">
              Oftest familiens største udgift efter bolig.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Dagpleje: 3.000-4.000 kr/måned</li>
              <li>• Vuggestue: 3.500-4.500 kr/måned</li>
              <li>• SFO: 1.500-2.500 kr/måned</li>
              <li>• Klub: 800-1.200 kr/måned</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Fritidsaktiviteter</h4>
            <p className="text-sm text-gray-600 mb-3">
              Sport, musik, og andre hobbyer tilføjer op.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Sport: 300-600 kr/måned per barn</li>
              <li>• Musikundervisning: 400-800 kr/måned</li>
              <li>• Legegrupper: 200-400 kr/måned</li>
              <li>• Udstyr og materialer: 500-1.000 kr/år</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Mad og husholdning</h4>
            <p className="text-sm text-gray-600 mb-3">
              Familiens madbudget vokser med børnene.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• 2 voksne: 3.000-4.000 kr/måned</li>
              <li>• +1 barn: +1.000-1.500 kr/måned</li>
              <li>• +2 børn: +2.000-3.000 kr/måned</li>
              <li>• Takeaway: 500-1.000 kr/måned</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Transport</h4>
            <p className="text-sm text-gray-600 mb-3">
              Børn kræver ofte bil eller offentlig transport.
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Bil: 3.000-5.000 kr/måned</li>
              <li>• Offentlig transport: 1.000-2.000 kr/måned</li>
              <li>• Cykler og udstyr: 500-1.000 kr/år</li>
              <li>• Ferietransport: 2.000-5.000 kr/år</li>
            </ul>
          </div>
        </div>

        <h2>Forsikringer for familier</h2>
        <p>
          Som familie har du brug for bredere forsikringsdækning. Her er de vigtigste:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h4 className="font-semibold text-blue-800 mb-2">Sundhedsforsikring</h4>
            <p className="text-sm text-blue-700 mb-3">
              Essentiel for familier med børn. Sikrer hurtig behandling.
            </p>
            <ul className="text-xs text-blue-600 space-y-1">
              <li>✓ Hurtig lægebehandling</li>
              <li>✓ Tandlæge dækning</li>
              <li>✓ Fysioterapi</li>
              <li>✓ Speciallæge</li>
            </ul>
          </div>
          
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h4 className="font-semibold text-green-800 mb-2">Husforsikring</h4>
            <p className="text-sm text-green-700 mb-3">
              Dækker bolig, indbo og ansvar. Vigtig med børn.
            </p>
            <ul className="text-xs text-green-600 space-y-1">
              <li>✓ Bolig og indbo</li>
              <li>✓ Ansvar for børn</li>
              <li>✓ Glasskade</li>
              <li>✓ Naturkatastrofer</li>
            </ul>
          </div>
          
          <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
            <h4 className="font-semibold text-purple-800 mb-2">Livsforsikring</h4>
            <p className="text-sm text-purple-700 mb-3">
              Sikrer familiens økonomi hvis den primære forsørger dør.
            </p>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>✓ Økonomisk sikkerhed</li>
              <li>✓ Børnenes fremtid</li>
              <li>✓ Boliglån dækning</li>
              <li>✓ Fleksibel dækning</li>
            </ul>
          </div>
          
          <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
            <h4 className="font-semibold text-orange-800 mb-2">Ulykkesforsikring</h4>
            <p className="text-sm text-orange-700 mb-3">
              Værdifuld med aktive børn. Dækker ulykker og invaliditet.
            </p>
            <ul className="text-xs text-orange-600 space-y-1">
              <li>✓ Ulykker og skader</li>
              <li>✓ Invaliditet</li>
              <li>✓ Dødsfald</li>
              <li>✓ Børn inkluderet</li>
            </ul>
          </div>
        </div>

        <h2>Langtidssikkerhed og pension</h2>
        <p>
          Som familie skal du tænke længere frem end som single. Her er vigtige overvejelser:
        </p>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-blue-800 mb-4">Din pensionsstrategi som familie:</h4>
          <ol className="space-y-3 text-blue-700">
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">1</span>
              <span>Maksimer din arbejdsmarkedspension (ATP)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">2</span>
              <span>Opret privat pensionsopsparing med skattefordel</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">3</span>
              <span>Overvej ratepension eller livrente</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">4</span>
              <span>Planlæg for børnenes uddannelse og fremtid</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-blue-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">5</span>
              <span>Gennemgå din strategi årligt</span>
            </li>
          </ol>
        </div>

        <h2>Almindelige fejl at undgå</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <h4 className="font-semibold text-red-800 mb-2">❌ Gør IKKE dette:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Ignorer børneopsparing</li>
              <li>• Undervurder børnepasning</li>
              <li>• Glem forsikringer</li>
              <li>• Spender alt hvad du tjener</li>
              <li>• Ignorer pension</li>
            </ul>
          </div>
          
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h4 className="font-semibold text-green-800 mb-2">✅ Gør dette i stedet:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Start børneopsparing tidligt</li>
              <li>• Budgetter realistisk</li>
              <li>• Få de rigtige forsikringer</li>
              <li>• Spar først, spendér derefter</li>
              <li>• Planlæg din pension</li>
            </ul>
          </div>
        </div>

        <h2>Næste skridt</h2>
        <p>
          Nu hvor du har læst guiden, er det tid til at tage handling:
        </p>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-green-800 mb-4">Din familie handlingsplan:</h4>
          <ol className="space-y-3 text-green-700">
            <li className="flex items-start gap-3">
              <span className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">1</span>
              <span>Prøv vores børneopsparing beregner</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">2</span>
              <span>Download familie budget template</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">3</span>
              <span>Sammenlign forsikringer</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">4</span>
              <span>Tag familie økonomi quiz'en</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-green-600 text-white text-sm font-bold px-2 py-1 rounded-full min-w-[24px] text-center">5</span>
              <span>Opret børneopsparing hos din bank</span>
            </li>
          </ol>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 my-6">
          <h4 className="font-semibold text-gray-800 mb-2">Relaterede artikler fra vores netværk:</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                "Sådan starter du med børneopsparing" - Danske Bank
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                "Forsikringer for familier med børn" - Tryg
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                "Budget guide for børne familie" - Nordea
                <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> Dette er ikke finansiel rådgivning. 
            Økonomisk planlægning indebærer risiko. 
            Konsulter altid en professionel rådgiver før du træffer økonomiske beslutninger.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEOHead {...seoData} />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Navigation Header */}
          <div className="mb-6">
            <Breadcrumbs 
              items={[
                { label: 'Hjem', href: '/' },
                { label: 'Børne familie Guide', href: '/family-finance-guide' }
              ]} 
            />
            
            <div className="flex items-center justify-end">
              <Link 
                to="/" 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Forside
              </Link>
            </div>
          </div>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Børne familie Guide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alt du skal vide om økonomisk planlægning for familier med børn
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
                      ? 'bg-green-600 text-white shadow-md'
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
                Klar til at forbedre din families økonomi?
              </h3>
              <p className="text-gray-600 mb-6">
                Brug vores værktøjer til at planlægge og komme i gang
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => setActiveTab('calculator')}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  Prøv børneopsparing beregneren
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('budget')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  Download budget template
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab('insurance')}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  Sammenlign forsikringer
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

export default FamilyFinanceGuide; 