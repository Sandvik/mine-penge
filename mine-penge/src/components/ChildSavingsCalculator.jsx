import React, { useState } from 'react';
import { Calculator, TrendingUp, Calendar, DollarSign, BookOpen, Home, Car, Heart } from 'lucide-react';

const ChildSavingsCalculator = () => {
  const [formData, setFormData] = useState({
    childAge: 0,
    monthlyAmount: 500,
    yearsToSave: 18,
    expectedReturn: 4,
    goalAmount: 100000,
    goalType: 'education'
  });

  const [results, setResults] = useState(null);

  const goalTypes = [
    { id: 'education', label: 'Uddannelse', icon: BookOpen, description: 'Universitet, erhvervsuddannelse' },
    { id: 'house', label: 'Bolig', icon: Home, description: 'Udbetaling til bolig' },
    { id: 'car', label: 'Bil', icon: Car, description: 'Første bil' },
    { id: 'general', label: 'Generelt', icon: Heart, description: 'Fri brug' }
  ];

  const calculateSavings = () => {
    const { monthlyAmount, yearsToSave, expectedReturn, goalAmount } = formData;
    
    // Beregn månedlig indbetaling nødvendig for at nå målet
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = yearsToSave * 12;
    
    let requiredMonthly = 0;
    if (expectedReturn > 0) {
      requiredMonthly = (goalAmount * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else {
      requiredMonthly = goalAmount / totalMonths;
    }

    // Beregn total indbetaling og forventet værdi
    const totalContribution = monthlyAmount * totalMonths;
    let futureValue = 0;
    
    if (expectedReturn > 0) {
      futureValue = monthlyAmount * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    } else {
      futureValue = totalContribution;
    }

    // Beregn forskellige scenarier
    const scenarios = [
      { return: 2, label: 'Konservativ (2%)', color: 'blue' },
      { return: 4, label: 'Moderat (4%)', color: 'green' },
      { return: 6, label: 'Aggressiv (6%)', color: 'purple' }
    ];

    const scenarioResults = scenarios.map(scenario => {
      const rate = scenario.return / 100 / 12;
      const value = monthlyAmount * (Math.pow(1 + rate, totalMonths) - 1) / rate;
      return {
        ...scenario,
        value: Math.round(value),
        totalContribution
      };
    });

    setResults({
      requiredMonthly: Math.round(requiredMonthly),
      totalContribution,
      futureValue: Math.round(futureValue),
      scenarios: scenarioResults,
      surplus: Math.round(futureValue - goalAmount)
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Børneopsparing Beregner
          </h2>
          <p className="text-gray-600">
            Planlæg din børneopsparing og se hvordan små beløb kan vokse til betydelige summer
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Barnets alder
              </label>
              <input
                type="number"
                value={formData.childAge}
                onChange={(e) => handleInputChange('childAge', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="17"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.childAge} år gammel
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Månedlig indbetaling
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.monthlyAmount}
                  onChange={(e) => handleInputChange('monthlyAmount', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="100"
                  step="100"
                />
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(formData.monthlyAmount)} per måned
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Antal år at spare
              </label>
              <input
                type="number"
                value={formData.yearsToSave}
                onChange={(e) => handleInputChange('yearsToSave', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="25"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.yearsToSave} år ({formData.childAge + formData.yearsToSave} år gammel)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forventet årligt afkast (%)
              </label>
              <input
                type="number"
                value={formData.expectedReturn}
                onChange={(e) => handleInputChange('expectedReturn', parseFloat(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="10"
                step="0.1"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.expectedReturn}% årligt
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Målbeløb
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.goalAmount}
                  onChange={(e) => handleInputChange('goalAmount', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="10000"
                  step="10000"
                />
                <TrendingUp className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Mål: {formatCurrency(formData.goalAmount)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Formål med opsparingen
              </label>
              <div className="grid grid-cols-2 gap-2">
                {goalTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('goalType', type.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.goalType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <type.icon className="w-4 h-4" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={calculateSavings}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Beregn opsparing
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Din opsparingsplan</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(results.totalContribution)}
                      </div>
                      <div className="text-sm text-blue-600">Total indbetaling</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.futureValue)}
                      </div>
                      <div className="text-sm text-green-600">Forventet værdi</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        {results.surplus >= 0 ? '+' : ''}{formatCurrency(results.surplus)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {results.surplus >= 0 ? 'Overskud' : 'Underskud'} i forhold til mål
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Monthly */}
                {results.requiredMonthly > formData.monthlyAmount && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Mål kræver højere indbetaling</h4>
                    <p className="text-yellow-700 text-sm">
                      For at nå dit mål på {formatCurrency(formData.goalAmount)} skal du indbetale{' '}
                      <strong>{formatCurrency(results.requiredMonthly)}</strong> per måned i stedet for{' '}
                      {formatCurrency(formData.monthlyAmount)}.
                    </p>
                  </div>
                )}

                {/* Scenarios */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Forskellige afkastscenarier</h4>
                  {results.scenarios.map((scenario) => (
                    <div key={scenario.return} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-800">{scenario.label}</div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(scenario.totalContribution)} indbetalt
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">
                            {formatCurrency(scenario.value)}
                          </div>
                          <div className="text-sm text-gray-500">
                            +{formatCurrency(scenario.value - scenario.totalContribution)} gevinst
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">💡 Tips til børneopsparing</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Start tidligt - tid er din største fordel</li>
                    <li>• Brug børneopsparing med skattefordel</li>
                    <li>• Øg beløbet årligt med inflation</li>
                    <li>• Overvej forskellige investeringsprodukter</li>
                    <li>• Inkluder barnet i planlægningen</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Indtast dine oplysninger
                </h3>
                <p className="text-gray-500">
                  Udfyld felterne til venstre og klik "Beregn opsparing" for at se resultaterne
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildSavingsCalculator; 