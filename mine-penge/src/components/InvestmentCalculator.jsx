import React, { useState } from 'react';
import { Calculator, TrendingUp, Calendar, DollarSign, Target, PieChart, BarChart3, ArrowRight } from 'lucide-react';

const InvestmentCalculator = () => {
  const [formData, setFormData] = useState({
    initialAmount: 10000,
    monthlyAmount: 1000,
    yearsToInvest: 10,
    expectedReturn: 6,
    riskLevel: 'moderate',
    investmentType: 'mixed'
  });

  const [results, setResults] = useState(null);

  const riskLevels = [
    { id: 'conservative', label: 'Konservativ', return: 3, color: 'blue', description: 'Lav risiko, stabilt afkast' },
    { id: 'moderate', label: 'Moderat', return: 6, color: 'green', description: 'Balanceret risiko/afkast' },
    { id: 'aggressive', label: 'Aggressiv', return: 9, color: 'purple', description: 'Høj risiko, højt potentiale' }
  ];

  const investmentTypes = [
    { id: 'stocks', label: 'Aktier', icon: TrendingUp, description: 'Enkeltaktier og ETF\'er' },
    { id: 'bonds', label: 'Obligationer', icon: Target, description: 'Statsobligationer og virksomhedsobligationer' },
    { id: 'mixed', label: 'Blandet', icon: PieChart, description: 'Kombination af aktier og obligationer' },
    { id: 'realestate', label: 'Fast ejendom', icon: BarChart3, description: 'REIT\'er og ejendomsinvesteringer' }
  ];

  const calculateInvestment = () => {
    const { initialAmount, monthlyAmount, yearsToInvest, expectedReturn } = formData;
    
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = yearsToInvest * 12;
    
    // Beregn fremtidig værdi med compound interest
    let futureValue = initialAmount * Math.pow(1 + monthlyRate, totalMonths);
    futureValue += monthlyAmount * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;

    // Beregn total indbetaling
    const totalContribution = initialAmount + (monthlyAmount * totalMonths);
    
    // Beregn gevinst
    const totalGain = futureValue - totalContribution;
    
    // Beregn årlige scenarier
    const yearlyBreakdown = [];
    for (let year = 1; year <= yearsToInvest; year++) {
      const yearMonths = year * 12;
      const yearValue = initialAmount * Math.pow(1 + monthlyRate, yearMonths);
      const yearValueWithMonthly = yearValue + monthlyAmount * (Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate;
      yearlyBreakdown.push({
        year,
        value: Math.round(yearValueWithMonthly),
        contribution: initialAmount + (monthlyAmount * yearMonths),
        gain: Math.round(yearValueWithMonthly - (initialAmount + (monthlyAmount * yearMonths)))
      });
    }

    // Beregn forskellige scenarier
    const scenarios = riskLevels.map(level => {
      const rate = level.return / 100 / 12;
      const value = initialAmount * Math.pow(1 + rate, totalMonths);
      const valueWithMonthly = value + monthlyAmount * (Math.pow(1 + rate, totalMonths) - 1) / rate;
      return {
        ...level,
        value: Math.round(valueWithMonthly),
        totalContribution,
        gain: Math.round(valueWithMonthly - totalContribution)
      };
    });

    setResults({
      futureValue: Math.round(futureValue),
      totalContribution,
      totalGain: Math.round(totalGain),
      yearlyBreakdown,
      scenarios,
      monthlyRate: monthlyRate * 12 * 100
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRiskLevelChange = (level) => {
    setFormData(prev => ({ 
      ...prev, 
      riskLevel: level.id,
      expectedReturn: level.return 
    }));
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
    <div className="max-w-6xl mx-auto">
              <div className="bg-nordic-50 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calculator className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Investeringsberegner
          </h2>
          <p className="text-gray-600">
            Planlæg din investeringsrejse og se hvordan compound interest kan vokse dine penge
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Startbeløb
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.initialAmount}
                  onChange={(e) => handleInputChange('initialAmount', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="1000"
                />
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(formData.initialAmount)} startbeløb
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
                  min="0"
                  step="100"
                />
                <TrendingUp className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(formData.monthlyAmount)} per måned
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investeringsperiode (år)
              </label>
              <input
                type="number"
                value={formData.yearsToInvest}
                onChange={(e) => handleInputChange('yearsToInvest', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="50"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.yearsToInvest} år
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Risikoprofil
              </label>
              <div className="grid grid-cols-1 gap-3">
                {riskLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => handleRiskLevelChange(level)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      formData.riskLevel === level.id
                        ? `border-${level.color}-500 bg-${level.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{level.label}</div>
                        <div className="text-sm text-gray-500">{level.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">{level.return}%</div>
                        <div className="text-xs text-gray-500">årligt afkast</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investeringsform
              </label>
              <div className="grid grid-cols-2 gap-2">
                {investmentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('investmentType', type.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.investmentType === type.id
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
              onClick={calculateInvestment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Beregn investering
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4">Din investeringsplan</h3>
                  
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

                  <div className="bg-nordic-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        +{formatCurrency(results.totalGain)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total gevinst ({results.monthlyRate.toFixed(1)}% årligt)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Scenarios */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Forskellige risikoscenarier</h4>
                  {results.scenarios.map((scenario) => (
                    <div key={scenario.id} className="bg-nordic-50 border border-nordic-200 rounded-lg p-4">
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
                            +{formatCurrency(scenario.gain)} gevinst
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Yearly Breakdown */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Årlig udvikling</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {results.yearlyBreakdown.slice(-5).map((year) => (
                      <div key={year.year} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">År {year.year}:</span>
                        <span className="font-medium">{formatCurrency(year.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">💡 Investeringsråd</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Start tidligt - tid er din største fordel</li>
                    <li>• Diversificer dine investeringer</li>
                    <li>• Hold dig til din risikoprofil</li>
                    <li>• Geninvester afkast for compound effect</li>
                    <li>• Gennemgå din strategi årligt</li>
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
                  Udfyld felterne til venstre og klik "Beregn investering" for at se resultaterne
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator; 