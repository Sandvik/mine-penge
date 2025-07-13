import React, { useState } from 'react';
import { Shield, Heart, Home, Car, Users, Check, X, Info, Star } from 'lucide-react';

const InsuranceComparison = () => {
  const [selectedFamily, setSelectedFamily] = useState('family4');
  const [selectedInsurances, setSelectedInsurances] = useState({
    health: true,
    home: true,
    car: true,
    life: true,
    accident: false,
    travel: false
  });

  const familyTypes = [
    { id: 'family2', label: '2 personer', size: 2, children: 0 },
    { id: 'family3', label: '3 personer', size: 3, children: 1 },
    { id: 'family4', label: '4 personer', size: 4, children: 2 },
    { id: 'family5', label: '5+ personer', size: 5, children: 3 }
  ];

  const insuranceTypes = [
    {
      id: 'health',
      name: 'Sundhedsforsikring',
      icon: Heart,
      description: 'Dækker lægebesøg, tandlæge, fysioterapi',
      essential: true,
      providers: [
        { name: 'Danmark', price: 250, rating: 4.5, features: ['Hurtig behandling', 'Bred dækning', 'God kundeservice'] },
        { name: 'Topdanmark', price: 280, rating: 4.3, features: ['Fleksibel dækning', 'Online booking', '24/7 support'] },
        { name: 'Tryg', price: 220, rating: 4.1, features: ['Lav pris', 'Grundlæggende dækning', 'Nem tilmelding'] }
      ]
    },
    {
      id: 'home',
      name: 'Husforsikring',
      icon: Home,
      description: 'Dækker bolig, indbo, ansvar',
      essential: true,
      providers: [
        { name: 'Tryg', price: 180, rating: 4.4, features: ['Komplet dækning', 'Hurtig skadebehandling', 'God app'] },
        { name: 'Topdanmark', price: 200, rating: 4.2, features: ['Personlig rådgivning', 'Fleksible løsninger', 'Bred dækning'] },
        { name: 'Alm. Brand', price: 160, rating: 4.0, features: ['Lav pris', 'Grundlæggende dækning', 'Nem administration'] }
      ]
    },
    {
      id: 'car',
      name: 'Bilforsikring',
      icon: Car,
      description: 'Dækker bil, ansvar, kasko',
      essential: true,
      providers: [
        { name: 'Tryg', price: 350, rating: 4.3, features: ['Komplet dækning', 'Hurtig skadebehandling', 'God app'] },
        { name: 'Topdanmark', price: 380, rating: 4.1, features: ['Personlig rådgivning', 'Fleksible løsninger', 'Bred dækning'] },
        { name: 'Alm. Brand', price: 320, rating: 4.0, features: ['Lav pris', 'Grundlæggende dækning', 'Nem administration'] }
      ]
    },
    {
      id: 'life',
      name: 'Livsforsikring',
      icon: Users,
      description: 'Økonomisk sikkerhed for familien',
      essential: true,
      providers: [
        { name: 'Danica', price: 150, rating: 4.6, features: ['Fleksibel dækning', 'God afkast', 'Nem administration'] },
        { name: 'PFA', price: 170, rating: 4.4, features: ['Bred dækning', 'Personlig rådgivning', 'God kundeservice'] },
        { name: 'Velliv', price: 140, rating: 4.2, features: ['Lav pris', 'Grundlæggende dækning', 'Nem tilmelding'] }
      ]
    },
    {
      id: 'accident',
      name: 'Ulykkesforsikring',
      icon: Shield,
      description: 'Dækker ulykker og invaliditet',
      essential: false,
      providers: [
        { name: 'Tryg', price: 80, rating: 4.2, features: ['Bred dækning', 'Hurtig udbetaling', 'God kundeservice'] },
        { name: 'Topdanmark', price: 90, rating: 4.0, features: ['Fleksibel dækning', 'Personlig rådgivning', '24/7 support'] },
        { name: 'Alm. Brand', price: 70, rating: 3.8, features: ['Lav pris', 'Grundlæggende dækning', 'Nem administration'] }
      ]
    },
    {
      id: 'travel',
      name: 'Rejseforsikring',
      icon: Shield,
      description: 'Dækker rejser og ferier',
      essential: false,
      providers: [
        { name: 'Europæiske', price: 60, rating: 4.3, features: ['Global dækning', 'Hurtig hjælp', 'God app'] },
        { name: 'Tryg', price: 70, rating: 4.1, features: ['Bred dækning', '24/7 support', 'Nem booking'] },
        { name: 'Topdanmark', price: 65, rating: 4.0, features: ['Fleksibel dækning', 'Personlig rådgivning', 'God kundeservice'] }
      ]
    }
  ];

  const handleInsuranceToggle = (insuranceId) => {
    setSelectedInsurances(prev => ({
      ...prev,
      [insuranceId]: !prev[insuranceId]
    }));
  };

  const calculateTotalCost = () => {
    let total = 0;
    insuranceTypes.forEach(insurance => {
      if (selectedInsurances[insurance.id]) {
        const familyMultiplier = selectedFamily === 'family2' ? 1 : selectedFamily === 'family3' ? 1.3 : selectedFamily === 'family4' ? 1.6 : 1.9;
        const cheapestProvider = insurance.providers.reduce((min, provider) => 
          provider.price < min.price ? provider : min
        );
        total += cheapestProvider.price * familyMultiplier;
      }
    });
    return Math.round(total);
  };

  const getFamilyMultiplier = () => {
    switch (selectedFamily) {
      case 'family2': return 1;
      case 'family3': return 1.3;
      case 'family4': return 1.6;
      case 'family5': return 1.9;
      default: return 1;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalCost = calculateTotalCost();
  const familyMultiplier = getFamilyMultiplier();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Forsikringssammenligning for Familier
          </h2>
          <p className="text-gray-600">
            Find de bedste forsikringer til din familie og sammenlign priser og dækning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Family Selection & Summary */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Vælg Familie Type
              </h3>
              
              <div className="space-y-3">
                {familyTypes.map((family) => (
                  <button
                    key={family.id}
                    onClick={() => setSelectedFamily(family.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      selectedFamily === family.id
                        ? 'border-blue-500 bg-blue-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{family.label}</div>
                    <div className="text-sm text-gray-500">
                      {family.size} personer, {family.children} børn
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Månedlig Total</h3>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(totalCost)}
                </div>
                <div className="text-sm text-green-600">per måned</div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Familie multiplikator:</span>
                  <span className="font-medium">{familyMultiplier}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valgte forsikringer:</span>
                  <span className="font-medium">
                    {Object.values(selectedInsurances).filter(Boolean).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-800 mb-3">💡 Tips til familie forsikringer</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Sundhedsforsikring er essentiel med børn</li>
                <li>• Husforsikring dækker også indbo</li>
                <li>• Livsforsikring sikrer familiens fremtid</li>
                <li>• Ulykkesforsikring er værdifuld med aktive børn</li>
                <li>• Rejseforsikring til ferier og udlandsrejser</li>
              </ul>
            </div>
          </div>

          {/* Insurance Selection */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {insuranceTypes.map((insurance) => (
                <div key={insurance.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedInsurances[insurance.id]}
                          onChange={() => handleInsuranceToggle(insurance.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <insurance.icon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {insurance.name}
                          </h3>
                          {insurance.essential && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                              Essentiel
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{insurance.description}</p>
                      </div>
                    </div>
                  </div>

                  {selectedInsurances[insurance.id] && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {insurance.providers.map((provider, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">{provider.name}</h4>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{provider.rating}</span>
                              </div>
                            </div>
                            
                            <div className="text-2xl font-bold text-gray-800 mb-2">
                              {formatCurrency(Math.round(provider.price * familyMultiplier))}
                            </div>
                            <div className="text-sm text-gray-500 mb-3">per måned</div>
                            
                            <ul className="space-y-1">
                              {provider.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                                  <Check className="w-3 h-3 text-green-500" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Anbefalinger til din familie</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">Essentielle forsikringer:</h4>
                  <ul className="text-sm text-blue-600 space-y-1">
                    <li>• Sundhedsforsikring - hurtig behandling</li>
                    <li>• Husforsikring - bolig og indbo</li>
                    <li>• Bilforsikring - hvis du har bil</li>
                    <li>• Livsforsikring - økonomisk sikkerhed</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-purple-700 mb-2">Valgfrie forsikringer:</h4>
                  <ul className="text-sm text-purple-600 space-y-1">
                    <li>• Ulykkesforsikring - med aktive børn</li>
                    <li>• Rejseforsikring - til ferier</li>
                    <li>• Dyreforsikring - hvis du har kæledyr</li>
                    <li>• Cykelforsikring - til daglig transport</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceComparison; 