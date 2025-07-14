import React, { useState } from 'react';
import { BookOpen, Calculator, Download, Home, TrendingUp, Shield, Users } from 'lucide-react';
import PensionCalculator from '../components/PensionCalculator';
import SEOHead from '../components/SEOHead';
import Breadcrumbs from '../components/Breadcrumbs';

function PensionistGuide() {
  const [activeTab, setActiveTab] = useState('guide');

  const tabs = [
    { id: 'guide', label: 'Guide', icon: BookOpen },
    { id: 'calculator', label: 'Beregner', icon: Calculator },
    { id: 'template', label: 'Budget Template', icon: Download }
  ];

  const downloadBudgetTemplate = () => {
    const template = `Pensionist Budget Template

Månedlig indkomst:
- Folkepension: kr.
- Ratepension: kr.
- Aldersopsparing: kr.
- Livrente: kr.
- Arbejdsindkomst: kr.
- Kapitalindkomst: kr.
- Andre indkomster: kr.
Total indkomst: kr.

Månedlige udgifter:
Bolig:
- Husleje/boligudgifter: kr.
- El: kr.
- Varme: kr.
- Vand: kr.
- Internet/TV: kr.
- Husforsikring: kr.

Transport:
- Offentlig transport: kr.
- Bil (brændstof): kr.
- Bilforsikring: kr.
- Vedligeholdelse: kr.

Mad og husholdning:
- Dagligvarer: kr.
- Restaurant: kr.
- Husholdningsartikler: kr.

Sundhed og pleje:
- Medicin: kr.
- Tandlæge: kr.
- Frisør: kr.
- Sundhedsforsikring: kr.

Fritid og underholdning:
- Hobby: kr.
- Rejser: kr.
- Gave: kr.
- Aviser/bøger: kr.

Andre udgifter:
- Tøj: kr.
- Telefon: kr.
- Diverse: kr.

Total udgifter: kr.
Disponibel indkomst: kr.

Tips:
- Overvej at arbejde deltid for at øge indkomsten
- Tjek om du har ret til pensionstillæg
- Aldersopsparing er skattefri
- Ratepension skal udbetales over minimum 10 år
- Overvej at downsizing hvis boligudgifterne er høje`;

    const blob = new Blob([template], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pensionist-budget-template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <SEOHead 
        title="Pensionist Guide - Din økonomi som ny pensionist | MinePenge.dk"
        description="Komplet guide til økonomi som pensionist. Lær om folkepension, private pensioner, skatteoptimering og budgetplanlægning for pensionister i Danmark."
        keywords="pensionist økonomi, folkepension, ratepension, aldersopsparing, pension danmark, budget pensionist"
        canonical="/pensionist-guide"
      />
      
      <div className="min-h-screen bg-nordic-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Breadcrumbs 
              items={[
                { label: 'Hjem', href: '/' },
                { label: 'Pensionist Guide', href: '/pensionist-guide' }
              ]} 
            />
            
            <div className="mt-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Din økonomi som ny pensionist
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Alt du skal vide om folkepension, private pensioner, skatteoptimering og budgetplanlægning som pensionist i Danmark
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
                        ? 'border-primary-500 text-primary-600'
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
          {activeTab === 'guide' && (
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-nordic-800 mb-6">
                  Komplet guide til økonomi som pensionist
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="bg-primary-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Home className="h-8 w-8 text-primary-600" />
                      <h3 className="text-xl font-semibold text-primary-800">Folkepension</h3>
                    </div>
                    <p className="text-primary-700">
                      Folkepension udbetales automatisk når du fylder 67 år. Beløbet afhænger af din civilstand og andre indkomster.
                    </p>
                  </div>

                  <div className="bg-success-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="h-8 w-8 text-success-600" />
                      <h3 className="text-xl font-semibold text-success-800">Private Pensioner</h3>
                    </div>
                    <p className="text-success-700">
                      Ratepension, aldersopsparing og livrente kan supplere din folkepension og give dig en bedre økonomi.
                    </p>
                  </div>

                  <div className="bg-warning-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-8 w-8 text-warning-600" />
                      <h3 className="text-xl font-semibold text-warning-800">Skatteoptimering</h3>
                    </div>
                    <p className="text-warning-700">
                      Aldersopsparing er skattefri, mens ratepension og livrente er skattepligtige. Planlæg din skat omhyggeligt.
                    </p>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-nordic-800 mb-4">
                  Folkepension - Grundlaget for din økonomi
                </h3>
                
                <p className="text-nordic-700 mb-4">
                  Folkepension er grundlaget for de fleste pensionisters økonomi i Danmark. Du får automatisk folkepension når du fylder 67 år, uanset om du har arbejdet eller ej.
                </p>

                <div className="bg-nordic-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-nordic-800 mb-3">Folkepension satser 2024:</h4>
                  <ul className="space-y-2 text-nordic-700">
                    <li><strong>Enkelt:</strong> 6.667 kr. om måneden</li>
                    <li><strong>Gift/samboende:</strong> 4.445 kr. om måneden</li>
                    <li><strong>Pensionstillæg (enke):</strong> 3.334 kr. om måneden</li>
                    <li><strong>Pensionstillæg (gift):</strong> 2.223 kr. om måneden</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold text-nordic-800 mb-4">
                  Private pensioner - Suppler din folkepension
                </h3>

                <div className="space-y-6 mb-6">
                  <div>
                    <h4 className="text-xl font-semibold text-nordic-800 mb-2">Ratepension</h4>
                    <p className="text-nordic-700 mb-2">
                      Ratepension er en skattepligtig pension, der udbetales over minimum 10 år. Du kan vælge at få den udbetalt over op til 15 år.
                    </p>
                    <ul className="list-disc list-inside text-nordic-700 space-y-1">
                      <li>Skattepligtig indkomst</li>
                      <li>Udbetales over 10-15 år</li>
                      <li>Kan kombineres med arbejde</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-nordic-800 mb-2">Aldersopsparing</h4>
                    <p className="text-nordic-700 mb-2">
                      Aldersopsparing er en skattefri pension, der kan udbetales fra 60 år. Den er særligt attraktiv på grund af skattefordelen.
                    </p>
                    <ul className="list-disc list-inside text-nordic-700 space-y-1">
                      <li>Skattefri udbetaling</li>
                      <li>Kan udbetales fra 60 år</li>
                      <li>Fleksibel udbetaling</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-nordic-800 mb-2">Livrente</h4>
                    <p className="text-nordic-700 mb-2">
                      Livrente udbetales resten af dit liv og giver dig sikkerhed for, at du altid har en indkomst.
                    </p>
                    <ul className="list-disc list-inside text-nordic-700 space-y-1">
                      <li>Udbetales resten af livet</li>
                      <li>Skattepligtig indkomst</li>
                      <li>Giver økonomisk sikkerhed</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-nordic-800 mb-4">
                  Skatteoptimering som pensionist
                </h3>

                <p className="text-nordic-700 mb-4">
                  Som pensionist er det vigtigt at optimere din skat. Her er nogle tips:
                </p>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h4 className="font-semibold text-blue-800 mb-3">Skatteoptimering tips:</h4>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Aldersopsparing er skattefri - brug den først</li>
                    <li>• Ratepension og livrente er skattepligtige</li>
                    <li>• Overvej at arbejde deltid for at sprede skatten</li>
                    <li>• Tjek om du har ret til pensionstillæg</li>
                    <li>• Overvej at give gaver til familie (skattefrit op til 69.500 kr. årligt)</li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold text-nordic-800 mb-4">
                  Budgetplanlægning for pensionister
                </h3>

                <p className="text-nordic-700 mb-4">
                  Som pensionist er det vigtigt at have et realistisk budget. Her er nogle overvejelser:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Indkomster:</h4>
                    <ul className="text-green-700 space-y-1 text-sm">
                      <li>• Folkepension</li>
                      <li>• Ratepension</li>
                      <li>• Aldersopsparing</li>
                      <li>• Livrente</li>
                      <li>• Arbejdsindkomst (deltid)</li>
                      <li>• Kapitalindkomst</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Udgifter:</h4>
                    <ul className="text-red-700 space-y-1 text-sm">
                      <li>• Boligudgifter</li>
                      <li>• Mad og husholdning</li>
                      <li>• Transport</li>
                      <li>• Sundhed og pleje</li>
                      <li>• Fritid og underholdning</li>
                      <li>• Forsikringer</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-nordic-800 mb-4">
                  Praktiske råd til pensionister
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-nordic-800">Kontakt din pensionskasse</h4>
                      <p className="text-nordic-700">
                        Få et overblik over dine private pensioner og hvornår de udbetales.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-success-100 p-2 rounded-full">
                      <Calculator className="h-5 w-5 text-success-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-nordic-800">Brug vores pensionberegner</h4>
                      <p className="text-nordic-700">
                        Beregn din forventede månedlige indkomst som pensionist.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-warning-100 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-warning-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-nordic-800">Tjek dine forsikringer</h4>
                      <p className="text-nordic-700">
                        Sørg for at have de rette forsikringer som pensionist.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-nordic-100 p-6 rounded-lg">
                  <h4 className="font-semibold text-nordic-800 mb-3">💡 Husk:</h4>
                  <p className="text-nordic-700">
                    Som pensionist har du ret til en værdig tilværelse. Brug dine rettigheder og søg hjælp hvis du har brug for det. 
                    Der findes mange tilbud og støtteordninger specifikt for pensionister.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div>
              <PensionCalculator />
            </div>
          )}

          {activeTab === 'template' && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <Download className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-nordic-800 mb-4">
                  Budget Template for Pensionister
                </h2>
                <p className="text-nordic-600 max-w-2xl mx-auto">
                  Download vores gratis budget template til pensionister. Template'et hjælper dig med at få overblik over din økonomi og planlægge dine udgifter.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-nordic-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-nordic-800 mb-4">Hvad indeholder template'et?</h3>
                  <ul className="space-y-2 text-nordic-700">
                    <li>• Månedlig indkomst oversigt</li>
                    <li>• Detaljerede udgiftskategorier</li>
                    <li>• Boligudgifter</li>
                    <li>• Transport og sundhed</li>
                    <li>• Fritid og underholdning</li>
                    <li>• Tips til pensionister</li>
                  </ul>
                </div>

                <div className="bg-primary-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-primary-800 mb-4">Hvorfor bruge et budget?</h3>
                  <ul className="space-y-2 text-primary-700">
                    <li>• Få overblik over din økonomi</li>
                    <li>• Identificer sparemuligheder</li>
                    <li>• Planlæg fremtidige udgifter</li>
                    <li>• Undgå økonomisk stress</li>
                    <li>• Sikre en god pensionisttilværelse</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={downloadBudgetTemplate}
                  className="bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Download className="h-5 w-5" />
                  Download Budget Template
                </button>
                <p className="text-sm text-nordic-500 mt-2">
                  Gratis download - Ingen registrering påkrævet
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PensionistGuide; 