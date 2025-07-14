import React, { useState } from 'react';
import { TrendingUp, DollarSign, Shield, Smartphone, Star, Check, X } from 'lucide-react';

const PlatformComparison = () => {
  const [selectedFeatures, setSelectedFeatures] = useState(['low-fees', 'easy-to-use']);

  const platforms = [
    {
      name: 'Nordnet',
      logo: '🏦',
      description: 'Danmarks største online børsmægler',
      pros: [
        'Gratis månedsopsparing',
        'Lav minimumsindbetaling (100 kr)',
        'God app og kundeservice',
        'Bredt udvalg af ETF\'er',
        'Dansk kundeservice'
      ],
      cons: [
        'Højere gebyrer for enkeltaktier',
        'Begrænset international tilgang'
      ],
      fees: {
        monthly: 'Gratis',
        trading: '29 kr',
        etf: 'Gratis månedsopsparing'
      },
      features: {
        'low-fees': true,
        'easy-to-use': true,
        'mobile-app': true,
        'danish-support': true,
        'etf-selection': true,
        'fractional-shares': false,
        'crypto': false,
        'automated-investing': true
      },
      rating: 4.5,
      bestFor: 'Begyndere der vil starte med ETF\'er'
    },
    {
      name: 'Saxo Bank',
      logo: '🌍',
      description: 'International platform med lave gebyrer',
      pros: [
        'Meget lave gebyrer',
        'Avanceret handelsplatform',
        'Global tilgang til markeder',
        'God research og analyse',
        'Professionelle værktøjer'
      ],
      cons: [
        'Mere kompleks for begyndere',
        'Højere minimumsindbetaling',
        'Engelsk kundeservice'
      ],
      fees: {
        monthly: 'Gratis',
        trading: '14 kr',
        etf: '14 kr'
      },
      features: {
        'low-fees': true,
        'easy-to-use': false,
        'mobile-app': true,
        'danish-support': false,
        'etf-selection': true,
        'fractional-shares': true,
        'crypto': true,
        'automated-investing': true
      },
      rating: 4.3,
      bestFor: 'Øvede investorer der vil have global tilgang'
    },
    {
      name: 'Lunar',
      logo: '📱',
      description: 'Digital bank med indbyggede investeringer',
      pros: [
        'Nem integration med bank',
        'Automatisk investering',
        'Moderne app',
        'Lav minimumsindbetaling',
        'Round-up funktionalitet'
      ],
      cons: [
        'Begrænset udvalg af aktier',
        'Højere gebyrer',
        'Kun danske aktier'
      ],
      fees: {
        monthly: 'Gratis',
        trading: '29 kr',
        etf: 'Ikke tilgængeligt'
      },
      features: {
        'low-fees': false,
        'easy-to-use': true,
        'mobile-app': true,
        'danish-support': true,
        'etf-selection': false,
        'fractional-shares': true,
        'crypto': false,
        'automated-investing': true
      },
      rating: 4.0,
      bestFor: 'Studerende der vil have alt samlet ét sted'
    },
    {
      name: 'Danske Bank',
      logo: '🏛️',
      description: 'Traditionel bank med online investering',
      pros: [
        'Hvis du allerede er kunde',
        'Personlig rådgivning',
        'Sikker og pålidelig',
        'Integreret med din bank'
      ],
      cons: [
        'Højere gebyrer',
        'Begrænset udvalg',
        'Mindre fleksibilitet'
      ],
      fees: {
        monthly: 'Gratis',
        trading: '49 kr',
        etf: '49 kr'
      },
      features: {
        'low-fees': false,
        'easy-to-use': true,
        'mobile-app': true,
        'danish-support': true,
        'etf-selection': false,
        'fractional-shares': false,
        'crypto': false,
        'automated-investing': false
      },
      rating: 3.5,
      bestFor: 'Eksisterende kunder der vil have personlig rådgivning'
    }
  ];

  const features = [
    { id: 'low-fees', label: 'Lave gebyrer', icon: DollarSign },
    { id: 'easy-to-use', label: 'Nem at bruge', icon: TrendingUp },
    { id: 'mobile-app', label: 'God mobil app', icon: Smartphone },
    { id: 'danish-support', label: 'Dansk kundeservice', icon: Shield },
    { id: 'etf-selection', label: 'Stort ETF udvalg', icon: Star },
    { id: 'fractional-shares', label: 'Brøkaktier', icon: TrendingUp },
    { id: 'crypto', label: 'Kryptovaluta', icon: TrendingUp },
    { id: 'automated-investing', label: 'Automatisk investering', icon: TrendingUp }
  ];

  const toggleFeature = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const getFilteredPlatforms = () => {
    if (selectedFeatures.length === 0) return platforms;
    
    return platforms.filter(platform => 
      selectedFeatures.every(feature => platform.features[feature])
    );
  };

  const filteredPlatforms = getFilteredPlatforms();

  return (
    <div className="bg-nordic-50 rounded-lg shadow-lg p-6 border border-nordic-200">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-800">Platform Sammenligning</h3>
      </div>

      {/* Feature Filter */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Vælg dine prioriteter:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isSelected = selectedFeatures.includes(feature.id);
            return (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{feature.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-800">
            {filteredPlatforms.length} platform{filteredPlatforms.length !== 1 ? 'e' : ''} matcher dine kriterier
          </h4>
          {selectedFeatures.length > 0 && (
            <button
              onClick={() => setSelectedFeatures([])}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Vis alle platforms
            </button>
          )}
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPlatforms.map((platform) => (
          <div key={platform.name} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{platform.logo}</div>
                <div>
                  <h5 className="text-lg font-semibold text-gray-800">{platform.name}</h5>
                  <p className="text-sm text-gray-600">{platform.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{platform.rating}</span>
                </div>
                <div className="text-xs text-gray-500">rating</div>
              </div>
            </div>

            {/* Fees */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <h6 className="font-medium text-gray-800 mb-2">Gebyrer:</h6>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="text-gray-600">Månedlig:</div>
                  <div className="font-medium">{platform.fees.monthly}</div>
                </div>
                <div>
                  <div className="text-gray-600">Handel:</div>
                  <div className="font-medium">{platform.fees.trading}</div>
                </div>
                <div>
                  <div className="text-gray-600">ETF:</div>
                  <div className="font-medium">{platform.fees.etf}</div>
                </div>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h6 className="font-medium text-green-700 mb-2 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Fordele
                </h6>
                <ul className="text-sm text-gray-600 space-y-1">
                  {platform.pros.slice(0, 3).map((pro, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h6 className="font-medium text-red-700 mb-2 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  Ulemper
                </h6>
                <ul className="text-sm text-gray-600 space-y-1">
                  {platform.cons.slice(0, 2).map((con, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Best For */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h6 className="font-medium text-blue-800 mb-1">Bedst til:</h6>
              <p className="text-sm text-blue-700">{platform.bestFor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredPlatforms.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">Ingen platforms matcher dine kriterier</h4>
          <p className="text-gray-600 mb-4">
            Prøv at fjerne nogle af dine valgte kriterier for at se flere muligheder.
          </p>
          <button
            onClick={() => setSelectedFeatures([])}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Vis alle platforms
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-sm text-yellow-800">
          <strong>Vigtigt:</strong> Dette er kun en sammenligning baseret på offentligt tilgængelige oplysninger. 
          Gebyrer og funktioner kan ændre sig. Kontakt altid platformen direkte for de mest opdaterede oplysninger.
        </div>
      </div>
    </div>
  );
};

export default PlatformComparison; 