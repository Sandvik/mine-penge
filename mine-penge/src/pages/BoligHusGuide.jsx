import React, { useState } from 'react';
import { ArrowLeft, Home, Calculator, BarChart3, Brain, Download, BookOpen, Target, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MortgageCalculator from '../components/MortgageCalculator';
import PropertyComparison from '../components/PropertyComparison';
import HousingQuiz from '../components/HousingQuiz';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

const BoligHusGuide = () => {
  const [activeTab, setActiveTab] = useState('artikler');

  // SEO data
  const seoData = {
    title: 'Bolig & Hus Guide - Komplet Guide til Boligkøb | MinePenge.nu',
    description: 'Lær alt om boligkøb i Danmark. Gratis guides, beregnere og værktøjer til boliglån, udbetaling, skatter og købsprocessen.',
    keywords: 'boligkøb danmark, boliglån, udbetaling bolig, ejendomsskat, boligkøbsprocessen, fastforrentet lån, variabel rente',
    url: '/bolig-hus-guide',
    type: 'article',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Hvordan køber jeg bolig i Danmark?",
      "description": "Komplet guide til boligkøb i Danmark med praktiske værktøjer og tips",
      "image": "https://minepenge.nu/bolig-hus-guide.jpg",
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
          "name": "Spare op til udbetaling",
          "text": "Du skal have mindst 20% af boligprisen sparet op"
        },
        {
          "@type": "HowToStep",
          "name": "Få lånebevis",
          "text": "Få bekræftet fra banken hvor meget du kan låne"
        },
        {
          "@type": "HowToStep",
          "name": "Find bolig",
          "text": "Søg efter boliger der passer til dit budget og ønsker"
        },
        {
          "@type": "HowToStep",
          "name": "Køb bolig",
          "text": "Gennemfør købsprocessen med advokat og bank"
        }
      ]
    }
  };

  const originalArticles = [
    {
      id: 'boligkoeb-grundlag',
      title: 'Boligkøb for begyndere: Din komplette guide til at købe bolig',
      excerpt: 'Alt du skal vide om at købe bolig i Danmark - fra opsparing til udbetaling, boliglån, omkostninger og købsprocessen. Vi gennemgår hele rejsen fra drøm til nøgle.',
      content: `
        <h2>Hvorfor købe bolig?</h2>
        <p>At købe bolig er en af de største finansielle beslutninger du tager i dit liv. Det giver dig sikkerhed, frihed og potentiale for værdistigning over tid.</p>
        
        <h3>Fordele ved at eje bolig</h3>
        <ul>
          <li><strong>Værdistigning:</strong> Boliger stiger typisk i værdi over tid</li>
          <li><strong>Sikkerhed:</strong> Du kan ikke blive smidt ud af din egen bolig</li>
          <li><strong>Frihed:</strong> Du kan renovere og ændre som du vil</li>
          <li><strong>Opsparing:</strong> Afdrag på boliglån er tvungen opsparing</li>
        </ul>

        <h2>Første skridt</h2>
        <p>Før du starter din boligjagt, skal du sikre dig at du har:</p>
        <ul>
          <li>Sparet op til mindst 20% udbetaling</li>
          <li>Stabil indkomst og job</li>
          <li>Ingen højforrentet gæld</li>
          <li>En plan for dine boligønsker</li>
        </ul>

        <h2>Udbetaling og boliglån</h2>
        <p>De fleste banker kræver 20% udbetaling for at give dig et boliglån. Dette betyder:</p>
        <ul>
          <li>Du skal spare op til 20% af boligprisen</li>
          <li>Du kan låne op til 80% af boligprisen</li>
          <li>Højere udbetaling kan give bedre lånevilkår</li>
        </ul>

        <h2>Omkostninger ved boligkøb</h2>
        <p>Ud over boligprisen skal du regne med:</p>
        <ul>
          <li><strong>Advokatomkostninger:</strong> 15.000-25.000 kr</li>
          <li><strong>Tinglysning:</strong> 1.750 kr</li>
          <li><strong>Ejendomsmægler:</strong> 1-2% af boligprisen</li>
          <li><strong>Flytning:</strong> 5.000-15.000 kr</li>
        </ul>
      `,
      category: 'Bolig & Hus',
      readTime: '10 min',
      date: '2024-01-20',
      isOriginal: true
    },
    {
      id: 'boliglaan-typer',
      title: 'Boliglån: Sådan vælger du det rigtige lån',
      excerpt: 'Fastforrentet, variabel rente eller flexlån? Lær om forskellige boliglånstyper og find det der passer bedst til din situation og risikoprofil.',
      content: `
        <h2>Fastforrentet boliglån</h2>
        <p>Et fastforrentet boliglån har en fast rente i hele lånets løbetid. Det giver sikkerhed og forudsigelighed.</p>
        
        <h4>Fordele:</h4>
        <ul>
          <li>Kendt ydelse i hele lånets løbetid</li>
          <li>Beskyttelse mod stigende renter</li>
          <li>Nem at budgettere med</li>
        </ul>
        
        <h4>Ulemper:</h4>
        <ul>
          <li>Højere rente end variabel rente</li>
          <li>Ingen gevinst ved faldende renter</li>
          <li>Dyrere at omlægge</li>
        </ul>

        <h2>Variabel rente</h2>
        <p>Variabel rente følger markedets renteudvikling og kan ændre sig løbende.</p>
        
        <h4>Fordele:</h4>
        <ul>
          <li>Laveste rente lige nu</li>
          <li>Gevinst ved faldende renter</li>
          <li>Nemmere at omlægge</li>
        </ul>
        
        <h4>Ulemper:</h4>
        <ul>
          <li>Uforudsigelig fremtidig rente</li>
          <li>Risiko for stigende ydelser</li>
          <li>Sværere at budgettere</li>
        </ul>

        <h2>Flexlån</h2>
        <p>Flexlån kombinerer fast og variabel rente og giver fleksibilitet.</p>
        
        <h4>Fordele:</h4>
        <ul>
          <li>Fleksibilitet mellem rentetyper</li>
          <li>Mulighed for at justere løbetid</li>
          <li>Kombination af sikkerhed og fleksibilitet</li>
        </ul>
        
        <h4>Ulemper:</h4>
        <ul>
          <li>Mere kompleks struktur</li>
          <li>Kan være dyrere i omkostninger</li>
          <li>Kræver mere aktiv forvaltning</li>
        </ul>

        <h2>Hvordan vælger du?</h2>
        <p>Overvej:</p>
        <ul>
          <li><strong>Din risikoprofil:</strong> Kan du tåle stigende renter?</li>
          <li><strong>Din tidshorisont:</strong> Hvor længe vil du bo i boligen?</li>
          <li><strong>Din økonomi:</strong> Har du råd til højere ydelser?</li>
          <li><strong>Renteudviklingen:</strong> Hvad forventer du fremover?</li>
        </ul>
      `,
      category: 'Bolig & Hus',
      readTime: '8 min',
      date: '2024-01-15',
      isOriginal: true
    },
    {
      id: 'ejendomsskat',
      title: 'Ejendomsskat og ejendomsværdiskat: Alt du skal vide',
      excerpt: 'Lær om de forskellige skatter der følger med boligejerskab i Danmark. Vi gennemgår ejendomsskat, ejendomsværdiskat og hvordan de påvirker din økonomi.',
      content: `
        <h2>Ejendomsskat</h2>
        <p>Ejendomsskat er en årlig skat baseret på din boligs værdi. Den betales til kommunen og bruges til at finansiere lokale tjenester.</p>

        <h3>Hvordan beregnes ejendomsskat?</h3>
        <ul>
          <li>Baseret på boligens offentlige vurdering</li>
          <li>Forskellige satser i forskellige kommuner</li>
          <li>Typisk 0,5-2,5% af boligværdien</li>
          <li>Betales årligt i to rater</li>
        </ul>

        <h2>Ejendomsværdiskat</h2>
        <p>Ejendomsværdiskat er en skat på din boligs værdi over 3,04 mio. kr (2024). Den betales til staten.</p>

        <h3>Hvordan beregnes ejendomsværdiskat?</h3>
        <ul>
          <li>1% af boligværdien over 3,04 mio. kr</li>
          <li>3% af boligværdien over 4,08 mio. kr</li>
          <li>Betales årligt sammen med ejendomsskat</li>
        </ul>

        <h2>Eksempel på skatteberegning</h2>
        <p>For en bolig til 4 mio. kr:</p>
        <ul>
          <li>Ejendomsskat: 40.000 kr (1% af værdien)</li>
          <li>Ejendomsværdiskat: 9.600 kr (1% af 960.000 kr)</li>
          <li>Total årlig skat: 49.600 kr</li>
        </ul>

        <h2>Hvordan påvirker det din økonomi?</h2>
        <p>Skatten påvirker din økonomi på flere måder:</p>
        <ul>
          <li><strong>Månedlige udgifter:</strong> Skatten skal betales årligt</li>
          <li><strong>Boligpris:</strong> Højere skat kan påvirke boligprisen</li>
          <li><strong>Lønsomhed:</strong> Skatten påvirker afkastet på din investering</li>
        </ul>

        <h2>Tips til at minimere skatten</h2>
        <ul>
          <li>Undersøg skatten før du køber</li>
          <li>Overvej boliger under 3,04 mio. kr</li>
          <li>Få din bolig revurderet hvis den er undervurderet</li>
          <li>Planlæg din økonomi med skatten i mente</li>
        </ul>
      `,
      category: 'Bolig & Hus',
      readTime: '7 min',
      date: '2024-01-10',
      isOriginal: true
    },
    {
      id: 'boligkoebsprocessen',
      title: 'Boligkøbsprocessen: Fra drøm til nøgle',
      excerpt: 'En detaljeret guide til hele boligkøbsprocessen - fra at finde boligen til at få nøglen. Vi gennemgår alle trin og giver dig de bedste råd.',
      content: `
        <h2>Fase 1: Forberedelse</h2>
        <p>Før du starter din boligjagt, skal du forberede dig grundigt.</p>
        
        <h3>Økonomisk forberedelse</h3>
        <ul>
          <li>Spare op til 20% udbetaling</li>
          <li>Få din økonomi i orden</li>
          <li>Få et lånebevis fra banken</li>
          <li>Beregn dine maksimale omkostninger</li>
        </ul>

        <h3>Boligønsker</h3>
        <ul>
          <li>Definer dit budget</li>
          <li>Vælg ønsket område</li>
          <li>Bestem boligtype og størrelse</li>
          <li>Prioriter dine ønsker</li>
        </ul>

        <h2>Fase 2: Boligsøgning</h2>
        <p>Nu starter den spændende del - at finde din drømmebolig.</p>
        
        <h3>Hvor kan du finde boliger?</h3>
        <ul>
          <li>Boliga.dk</li>
          <li>Ejendomsmæglere</li>
          <li>Facebook grupper</li>
          <li>Netværk og bekendte</li>
        </ul>

        <h3>Hvad skal du kigge efter?</h3>
        <ul>
          <li>Lokation og transportmuligheder</li>
          <li>Boligens tilstand</li>
          <li>Energimærke</li>
          <li>Fremtidige udviklingsplaner</li>
        </ul>

        <h2>Fase 3: Købsprocessen</h2>
        <p>Når du har fundet din bolig, starter den formelle købsproces.</p>
        
        <h3>Købsaftale</h3>
        <ul>
          <li>Underskriv købsaftale</li>
          <li>Betal forhåndsbetaling (typisk 10%)</li>
          <li>Få advokat til at gennemgå kontrakten</li>
        </ul>

        <h3>Boliglån</h3>
        <ul>
          <li>Vælg lånetype</li>
          <li>Underskriv lånekontrakt</li>
          <li>Arranger tinglysning</li>
        </ul>

        <h2>Fase 4: Overdragelse</h2>
        <p>Den sidste fase før du får nøglen.</p>
        
        <h3>Før overdragelse</h3>
        <ul>
          <li>Få boligforsikring</li>
          <li>Arranger flytning</li>
          <li>Opret forbindelser (el, vand, varme)</li>
        </ul>

        <h3>Ved overdragelse</h3>
        <ul>
          <li>Mød op hos advokaten</li>
          <li>Underskriv overdragelsesdokumenter</li>
          <li>Få nøglerne</li>
          <li>Gennemfør boliggennemgang</li>
        </ul>

        <h2>Almindelige fejl at undgå</h2>
        <ul>
          <li>Ikke at få lånebevis først</li>
          <li>At overskride dit budget</li>
          <li>Ikke at undersøge boligen grundigt</li>
          <li>At glemme omkostninger ved køb</li>
          <li>Ikke at få professionel hjælp</li>
        </ul>
      `,
      category: 'Bolig & Hus',
      readTime: '12 min',
      date: '2024-01-05',
      isOriginal: true
    }
  ];

  const tabs = [
    { id: 'artikler', label: 'Artikler', icon: BookOpen },
    { id: 'beregner', label: 'Boliglånsberegner', icon: Calculator },
    { id: 'sammenligning', label: 'Ejendomssammenligning', icon: BarChart3 },
    { id: 'quiz', label: 'Boligkøbs Quiz', icon: Brain }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'artikler':
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Bolig Guide
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Alt du skal vide om boligkøb i Danmark - fra første opsparing til nøgle i hånden. 
                Uanset om du er førstegangskøber eller erfaren boligejer, finder du her den viden du skal bruge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {originalArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
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
                      <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                        Læs artikel →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-4">
                Kom i gang med din boligjagt
              </h3>
              <p className="text-green-700 mb-6 max-w-2xl mx-auto">
                Brug vores interaktive værktøjer til at planlægge dit boligkøb, 
                beregne dit boliglån og sammenligne forskellige ejendomme.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={() => setActiveTab('beregner')}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Calculator className="w-5 h-5" />
                  Prøv beregneren
                </button>
                <button 
                  onClick={() => setActiveTab('sammenligning')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-5 h-5" />
                  Sammenlign ejendomme
                </button>
                <button 
                  onClick={() => setActiveTab('quiz')}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Brain className="w-5 h-5" />
                  Tag quiz'en
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'beregner':
        return <MortgageCalculator />;
      
      case 'sammenligning':
        return <PropertyComparison />;
      
      case 'quiz':
        return <HousingQuiz />;
      
      default:
        return null;
    }
  };

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
                { label: 'Bolig & Hus Guide', href: '/bolig-hus-guide' }
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
              Bolig & Hus Guide
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Alt du skal vide om boligkøb i Danmark - fra første opsparing til nøgle i hånden
            </p>
          </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-2 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          {renderContent()}
        </div>

        {/* Footer CTA */}
        {activeTab === 'artikler' && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Har du spørgsmål om boligkøb?
            </h3>
            <p className="text-gray-600 mb-6">
              Vores guides og værktøjer hjælper dig med at tage informerede beslutninger om dit boligkøb.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
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
        )}
        </div>
      </div>
    </>
  );
};

export default BoligHusGuide; 