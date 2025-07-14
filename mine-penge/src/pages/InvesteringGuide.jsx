import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Calculator, PieChart, Brain, Download, BookOpen, Target, DollarSign, BarChart3, Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import InvestmentCalculator from '../components/InvestmentCalculator';
import PortfolioBalance from '../components/PortfolioBalance';
import InvestmentQuiz from '../components/InvestmentQuiz';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

const InvesteringGuide = () => {
  const [activeTab, setActiveTab] = useState('artikler');

  // SEO data
  const seoData = {
    title: 'Investering Guide - Komplet Guide til Investering | MinePenge.nu',
    description: 'Lær alt om investering i Danmark. Gratis guides, beregnere og værktøjer til at starte din investeringsrejse. ASK, ETF, aktier og mere.',
    keywords: 'investering danmark, aktiesparekonto, etf investering, nordnet, saxo bank, aktier danmark, investering for begyndere',
    url: '/investering-guide',
    type: 'article',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Hvordan investerer jeg i Danmark?",
      "description": "Komplet guide til investering i Danmark med praktiske værktøjer og tips",
      "image": "https://minepenge.nu/investering-guide.jpg",
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
          "name": "Forstå grundlæggende principper",
          "text": "Lær om risiko, afkast og tidshorisont før du starter"
        },
        {
          "@type": "HowToStep",
          "name": "Opret aktiesparekonto",
          "text": "Udnyt 17% skat på ASK i stedet for 27-42%"
        },
        {
          "@type": "HowToStep",
          "name": "Vælg platform",
          "text": "Nordnet, Saxo Bank eller din egen bank"
        },
        {
          "@type": "HowToStep",
          "name": "Start med ETF'er",
          "text": "Begynd med brede indeksfonde for diversificering"
        }
      ]
    }
  };

  const originalArticles = [
    {
      id: 'investering-grundlag',
      title: 'Investering for begyndere: Din komplette guide til at starte',
      excerpt: 'Lær de grundlæggende principper for investering og hvordan du kommer i gang med at bygge din formue. Vi gennemgår alt fra risikoprofil til valg af platform.',
      content: `
        <h2>Hvorfor investere?</h2>
        <p>Investering er en af de bedste måder at bygge formue på over tid. Mens penge på en almindelig bankkonto mister værdi på grund af inflation, kan investeringer give dig et positivt afkast der overstiger inflationen.</p>
        
        <h3>De fire grundprincipper</h3>
        <ol>
          <li><strong>Start tidligt:</strong> Tid er din største fordel takket være compound interest</li>
          <li><strong>Invester regelmæssigt:</strong> Automatiser dine investeringer for at undgå timing</li>
          <li><strong>Diversificer:</strong> Spred risikoen på tværs af forskellige aktiver</li>
          <li><strong>Hold i lang tid:</strong> Markederne svinger, men over tid stiger de</li>
        </ol>

        <h2>Første skridt</h2>
        <p>Før du starter med at investere, skal du sikre dig at du har:</p>
        <ul>
          <li>Et emergency fund på 3-6 måneders udgifter</li>
          <li>Ingen højforrentet gæld (kreditkort, forbrugslån)</li>
          <li>En plan for dine finansielle mål</li>
        </ul>

        <h2>Valg af platform</h2>
        <p>I Danmark er de mest populære platforme:</p>
        <ul>
          <li><strong>Nordnet:</strong> God for begyndere, lave gebyrer, dansk support</li>
          <li><strong>Saxo Bank:</strong> Bredt udvalg, professionelle værktøjer</li>
          <li><strong>Danske Bank:</strong> Nem integration hvis du allerede er kunde</li>
        </ul>
      `,
      category: 'Investering',
      readTime: '8 min',
      date: '2024-01-15',
      isOriginal: true
    },
    {
      id: 'aktiesparekonto',
      title: 'Aktiesparekonto (ASK): Den danske investeringsguldmine',
      excerpt: 'Aktiesparekontoen er en af Danmarks bedste investeringsprodukter med kun 17% skat. Lær hvordan du maksimerer fordelene og undgår de almindelige fejl.',
      content: `
        <h2>Hvad er aktiesparekontoen?</h2>
        <p>Aktiesparekontoen (ASK) er en særlig konto der giver dig 17% skat på afkast i stedet for de normale 27-42%. Det er en af de bedste måder at investere på i Danmark.</p>

        <h3>Fordele ved ASK</h3>
        <ul>
          <li>Kun 17% skat på afkast (vs. 27-42%)</li>
          <li>Ingen lagerbeskatning på urealiserede gevinster</li>
          <li>Maksimalt indskud på 106.600 kr (2024)</li>
          <li>Nem at administrere</li>
        </ul>

        <h2>Hvordan bruger du ASK optimalt?</h2>
        <p>For at få mest ud af din ASK:</p>
        <ol>
          <li><strong>Fyld den op:</strong> Indbetal det maksimale beløb hvert år</li>
          <li><strong>Vælg ETF'er:</strong> De giver bedre diversificering end enkeltaktier</li>
          <li><strong>Hold i lang tid:</strong> Undgå at sælge og købe ofte</li>
          <li><strong>Geninvester udbytter:</strong> Lad pengene vokse</li>
        </ol>

        <h2>Populære ETF'er til ASK</h2>
        <ul>
          <li><strong>iShares MSCI World:</strong> Global diversificering</li>
          <li><strong>Sparindex INDEX Globale Aktier:</strong> Danske omkostninger</li>
          <li><strong>Danske Invest Global Indeks:</strong> God dansk fond</li>
        </ul>

        <h2>Almindelige fejl at undgå</h2>
        <ul>
          <li>Ikke at fylde kontoen op hvert år</li>
          <li>At sælge for hurtigt</li>
          <li>At vælge for risikable enkeltaktier</li>
          <li>At glemme at geninvestere udbytter</li>
        </ul>
      `,
      category: 'Investering',
      readTime: '6 min',
      date: '2024-01-10',
      isOriginal: true
    },
    {
      id: 'portefolje-diversificering',
      title: 'Portefølje diversificering: Sådan spreder du risikoen',
      excerpt: 'Diversificering er nøglen til en sund investeringsportefølje. Lær hvordan du spreder risikoen på tværs af aktivklasser, sektorer og geografiske områder.',
      content: `
        <h2>Hvorfor diversificering?</h2>
        <p>Diversificering betyder at sprede dine investeringer på tværs af forskellige aktiver. Det reducerer risikoen fordi når én investering klarer sig dårligt, kan andre klare sig godt.</p>

        <h3>De tre lag af diversificering</h3>
        <ol>
          <li><strong>Aktivklasser:</strong> Aktier, obligationer, fast ejendom, kontanter</li>
          <li><strong>Sektorer:</strong> Teknologi, sundhed, finans, forbrugsvarer</li>
          <li><strong>Geografi:</strong> Danmark, Europa, USA, Asien</li>
        </ol>

        <h2>Standard portefølje allokering</h2>
        <p>En almindelig regel er "100 minus din alder" i aktier:</p>
        <ul>
          <li><strong>30 år:</strong> 70% aktier, 30% obligationer</li>
          <li><strong>40 år:</strong> 60% aktier, 40% obligationer</li>
          <li><strong>50 år:</strong> 50% aktier, 50% obligationer</li>
          <li><strong>60 år:</strong> 40% aktier, 60% obligationer</li>
        </ul>

        <h2>Hvordan diversificerer du?</h2>
        <p>Den nemmeste måde at diversificere på:</p>
        <ol>
          <li><strong>Køb ETF'er:</strong> De giver automatisk diversificering</li>
          <li><strong>Brug indeksfonde:</strong> De følger hele markedet</li>
          <li><strong>Køb globalt:</strong> Undgå at sætte alt i Danmark</li>
          <li><strong>Rebalancer regelmæssigt:</strong> Hold din målallokering</li>
        </ol>

        <h2>Diversificering vs. koncentration</h2>
        <p>Mens diversificering reducerer risiko, kan koncentration give højere afkast. Men for de fleste investorer er diversificering den bedste strategi.</p>

        <h2>Rebalancering</h2>
        <p>Rebalancering betyder at justere din portefølje tilbage til din målallokering. Gør det 1-2 gange årligt for at holde din risikoprofil.</p>
      `,
      category: 'Investering',
      readTime: '7 min',
      date: '2024-01-05',
      isOriginal: true
    },
    {
      id: 'investeringsstrategier',
      title: 'Investeringsstrategier: Find den der passer dig',
      excerpt: 'Fra buy-and-hold til value investing - lær om forskellige investeringsstrategier og find den der matcher din risikoprofil og tidshorisont.',
      content: `
        <h2>Buy and Hold</h2>
        <p>Den mest populære og historisk succesfulde strategi. Du køber kvalitetsaktier og holder dem i mange år.</p>
        <h4>Fordele:</h4>
        <ul>
          <li>Lave omkostninger</li>
          <li>Mindre skat</li>
          <li>Mindre stress</li>
          <li>Historisk godt afkast</li>
        </ul>

        <h2>Value Investing</h2>
        <p>Du køber aktier der er undervurderet i forhold til deres indre værdi. Warren Buffett er den mest kendte value investor.</p>
        <h4>Hvordan:</h4>
        <ul>
          <li>Analyser virksomhedens fundamentale værdi</li>
          <li>Køb når aktien handles under indre værdi</li>
          <li>Hold indtil markedet indser værdien</li>
        </ul>

        <h2>Growth Investing</h2>
        <p>Du investerer i virksomheder med høj vækstpotentiale, selv om de kan være dyre i forhold til deres nuværende indtjening.</p>
        <h4>Eksempler:</h4>
        <ul>
          <li>Teknologivirksomheder</li>
          <li>Biotech</li>
          <li>Emerging markets</li>
        </ul>

        <h2>Dividend Investing</h2>
        <p>Du fokuserer på aktier der udbetaler høje udbytter. God for passiv indkomst.</p>
        <h4>Fordele:</h4>
        <ul>
          <li>Regelmæssig indkomst</li>
          <li>Mindre volatilitet</li>
          <li>Compound effect på udbytter</li>
        </ul>

        <h2>Index Investing</h2>
        <p>Du køber fonde der følger et indeks som OMX C25 eller MSCI World. Perfekt for begyndere.</p>
        <h4>Fordele:</h4>
        <ul>
          <li>Automatisk diversificering</li>
          <li>Lave omkostninger</li>
          <li>Nem at administrere</li>
          <li>Slår de fleste aktive fonde</li>
        </ul>

        <h2>Hvordan vælger du?</h2>
        <p>Overvej:</p>
        <ul>
          <li><strong>Din tidshorisont:</strong> Længere tid = mere risiko</li>
          <li><strong>Din risikoprofil:</strong> Kan du tåle store svingninger?</li>
          <li><strong>Din tid:</strong> Hvor meget tid vil du bruge på investering?</li>
          <li><strong>Dine mål:</strong> Hvad vil du opnå med investeringerne?</li>
        </ul>
      `,
      category: 'Investering',
      readTime: '9 min',
      date: '2024-01-01',
      isOriginal: true
    }
  ];

  const tabs = [
    { id: 'artikler', label: 'Artikler', icon: BookOpen },
    { id: 'beregner', label: 'Investeringsberegner', icon: Calculator },
    { id: 'portefolje', label: 'Portefølje Balance', icon: PieChart },
    { id: 'quiz', label: 'Investerings Quiz', icon: Brain }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'artikler':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Investering Guide
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Alt du skal vide om investering - fra grundlæggende principper til avancerede strategier. 
                Uanset om du er begynder eller erfaren investor, finder du her den viden du skal bruge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {originalArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Original
                      </span>
                      <span className="text-gray-500 text-sm">{article.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-gray-800 mb-3">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 mb-4">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString('da-DK')}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Læs artikel →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Kom i gang med at investere
              </h3>
              <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
                Brug vores interaktive værktøjer til at planlægge din investeringsstrategi, 
                analysere din portefølje og teste din viden.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setActiveTab('beregner')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  Prøv beregneren
                </button>
                <button 
                  onClick={() => setActiveTab('portefolje')}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <PieChart className="w-5 h-5" />
                  Analyser portefølje
                </button>
                <button 
                  onClick={() => setActiveTab('quiz')}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Brain className="w-5 h-5" />
                  Tag quiz'en
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'beregner':
        return <InvestmentCalculator />;
      
      case 'portefolje':
        return <PortfolioBalance />;
      
      case 'quiz':
        return <InvestmentQuiz />;
      
      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead {...seoData} />
      
      <div className="min-h-screen bg-nordic-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Breadcrumbs 
              items={[
                { label: 'Hjem', href: '/' },
                { label: 'Investering Guide', href: '/investering-guide' }
              ]} 
            />
            
            <div className="mt-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Investering Guide
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Alt du skal vide om investering - fra grundlæggende principper til avancerede strategier
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-nordic-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-nordic-500 hover:text-nordic-700 hover:border-nordic-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>

        {/* Footer CTA */}
        {activeTab === 'artikler' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Har du spørgsmål om investering?
              </h3>
              <p className="text-gray-600 mb-6">
                Vores guides og værktøjer hjælper dig med at tage informerede beslutninger om din økonomiske fremtid.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <BookOpen className="w-5 h-5" />
                  Se alle artikler
                </Link>
                <Link
                  to="/kontakt"
                  className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Target className="w-5 h-5" />
                  Kontakt os
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InvesteringGuide; 