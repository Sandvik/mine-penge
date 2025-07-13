import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const InvestmentCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [years, setYears] = useState(5);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [results, setResults] = useState(null);

  const calculateInvestment = () => {
    const monthlyRate = annualReturn / 100 / 12;
    const totalMonths = years * 12;
    
    // Future Value of Regular Payments formula
    const futureValue = monthlyInvestment * 
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    
    const totalInvested = monthlyInvestment * totalMonths;
    const totalInterest = futureValue - totalInvested;
    
    setResults({
      totalInvested: Math.round(totalInvested),
      totalInterest: Math.round(totalInterest),
      futureValue: Math.round(futureValue),
      monthlyRate,
      totalMonths
    });
  };

  useEffect(() => {
    calculateInvestment();
  }, [monthlyInvestment, years, annualReturn]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">Investeringsberegner for Studerende</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Monthly Investment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Månedlig investering
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="100"
              max="10000"
              step="100"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">100 - 10.000 kr/måned</p>
        </div>

        {/* Years */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tidsperiode
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="30"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">1 - 30 år</p>
        </div>

        {/* Annual Return */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Årlig afkast
          </label>
          <div className="relative">
            <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
              max="15"
              step="0.5"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">1 - 15% årligt</p>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Dit investeringsresultat</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(results.futureValue)}
              </div>
              <div className="text-sm text-gray-600">Slutbeløb</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(results.totalInvested)}
              </div>
              <div className="text-sm text-gray-600">Du har investeret</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(results.totalInterest)}
              </div>
              <div className="text-sm text-gray-600">Renter tjent</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-2">Fordeling:</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ 
                    width: `${(results.totalInvested / results.futureValue) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {Math.round((results.totalInvested / results.futureValue) * 100)}% investeret
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ 
                    width: `${(results.totalInterest / results.futureValue) * 100}%` 
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {Math.round((results.totalInterest / results.futureValue) * 100)}% renter
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-sm text-yellow-800">
          <strong>Vigtigt:</strong> Dette er kun en beregner til illustration. 
          Historiske afkast garanterer ikke fremtidige resultater. 
          Investering indebærer risiko for tab af kapital.
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator; 