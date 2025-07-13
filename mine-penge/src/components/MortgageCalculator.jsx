import React, { useState } from 'react';
import { Calculator, Home, DollarSign, TrendingUp, Calendar, Percent, BarChart3, ArrowRight } from 'lucide-react';

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    propertyPrice: 3000000,
    downPayment: 600000,
    loanAmount: 2400000,
    interestRate: 4.5,
    loanTerm: 30,
    loanType: 'fastforrentet',
    extraPayment: 0,
    startDate: new Date().toISOString().split('T')[0]
  });

  const [results, setResults] = useState(null);

  const loanTypes = [
    { 
      id: 'fastforrentet', 
      label: 'Fastforrentet', 
      description: 'Fast rente i hele lånets løbetid',
      pros: 'Sikkerhed og forudsigelighed',
      cons: 'Højere rente end variabel'
    },
    { 
      id: 'variabel', 
      label: 'Variabel rente', 
      description: 'Rente der følger markedet',
      pros: 'Laveste rente lige nu',
      cons: 'Uforudsigelig fremtidig rente'
    },
    { 
      id: 'flexlån', 
      label: 'Flexlån', 
      description: 'Kombination af fast og variabel rente',
      pros: 'Fleksibilitet og sikkerhed',
      cons: 'Mere kompleks struktur'
    }
  ];

  const calculateMortgage = () => {
    const { propertyPrice, downPayment, loanAmount, interestRate, loanTerm, loanType, extraPayment } = formData;
    
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = loanTerm * 12;
    
    // Beregn månedlig ydelse (annuitetslån)
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    // Beregn total tilbagebetaling
    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - loanAmount;
    
    // Beregn med ekstra afdrag
    let actualMonthlyPayment = monthlyPayment;
    let actualTotalPayment = totalPayment;
    let actualTotalInterest = totalInterest;
    let actualLoanTerm = loanTerm;
    
    if (extraPayment > 0) {
      // Beregn hvor hurtigt lånet tilbagebetales med ekstra afdrag
      const monthlyExtra = extraPayment;
      let remainingLoan = loanAmount;
      let monthsToPayoff = 0;
      let totalInterestPaid = 0;
      
      while (remainingLoan > 0 && monthsToPayoff < totalMonths) {
        const interestPayment = remainingLoan * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment + monthlyExtra;
        
        remainingLoan -= principalPayment;
        totalInterestPaid += interestPayment;
        monthsToPayoff++;
      }
      
      actualLoanTerm = monthsToPayoff / 12;
      actualTotalPayment = (monthlyPayment + monthlyExtra) * monthsToPayoff;
      actualTotalInterest = totalInterestPaid;
    }
    
    // Beregn årlige scenarier
    const yearlyBreakdown = [];
    for (let year = 1; year <= Math.min(loanTerm, 10); year++) {
      const yearMonths = year * 12;
      const yearInterest = loanAmount * monthlyRate * 12 * (1 - (yearMonths / totalMonths));
      const yearPrincipal = monthlyPayment * 12 - yearInterest;
      
      yearlyBreakdown.push({
        year,
        interest: Math.round(yearInterest),
        principal: Math.round(yearPrincipal),
        remainingLoan: Math.round(loanAmount - (yearPrincipal * year))
      });
    }

    // Beregn forskellige rentescenarier
    const interestScenarios = [
      { rate: interestRate - 1, label: 'Rente -1%' },
      { rate: interestRate, label: 'Nuværende rente' },
      { rate: interestRate + 1, label: 'Rente +1%' },
      { rate: interestRate + 2, label: 'Rente +2%' }
    ].map(scenario => {
      const scenarioRate = scenario.rate / 100 / 12;
      const scenarioPayment = loanAmount * (scenarioRate * Math.pow(1 + scenarioRate, totalMonths)) / (Math.pow(1 + scenarioRate, totalMonths) - 1);
      return {
        ...scenario,
        monthlyPayment: Math.round(scenarioPayment),
        totalInterest: Math.round(scenarioPayment * totalMonths - loanAmount)
      };
    });

    setResults({
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      actualMonthlyPayment: Math.round(actualMonthlyPayment),
      actualTotalPayment: Math.round(actualTotalPayment),
      actualTotalInterest: Math.round(actualTotalInterest),
      actualLoanTerm: Math.round(actualLoanTerm * 10) / 10,
      yearlyBreakdown,
      interestScenarios,
      downPaymentPercentage: Math.round((downPayment / propertyPrice) * 100)
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePropertyPriceChange = (value) => {
    const newPropertyPrice = parseInt(value) || 0;
    const newDownPayment = Math.round(newPropertyPrice * 0.2); // 20% udbetaling
    const newLoanAmount = newPropertyPrice - newDownPayment;
    
    setFormData(prev => ({
      ...prev,
      propertyPrice: newPropertyPrice,
      downPayment: newDownPayment,
      loanAmount: newLoanAmount
    }));
  };

  const handleDownPaymentChange = (value) => {
    const newDownPayment = parseInt(value) || 0;
    const newLoanAmount = formData.propertyPrice - newDownPayment;
    
    setFormData(prev => ({
      ...prev,
      downPayment: newDownPayment,
      loanAmount: newLoanAmount
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
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Calculator className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Boliglånsberegner
          </h2>
          <p className="text-gray-600">
            Beregn dit boliglån og se hvordan forskellige scenarier påvirker dine månedlige udgifter
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Boligpris
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.propertyPrice}
                  onChange={(e) => handlePropertyPriceChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  step="10000"
                />
                <Home className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(formData.propertyPrice)} total boligpris
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Udbetaling
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.downPayment}
                  onChange={(e) => handleDownPaymentChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max={formData.propertyPrice}
                  step="10000"
                />
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(formData.downPayment)} ({Math.round((formData.downPayment / formData.propertyPrice) * 100)}% af boligprisen)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lånebeløb
              </label>
              <div className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-2">
                <div className="text-lg font-semibold text-gray-800">
                  {formatCurrency(formData.loanAmount)}
                </div>
                <div className="text-sm text-gray-500">
                  {Math.round((formData.loanAmount / formData.propertyPrice) * 100)}% af boligprisen
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Årlig rente (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.interestRate}
                  onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="20"
                  step="0.1"
                />
                <Percent className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formData.interestRate}% årlig rente
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lånets løbetid (år)
              </label>
              <input
                type="number"
                value={formData.loanTerm}
                onChange={(e) => handleInputChange('loanTerm', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
                max="40"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.loanTerm} år
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lånetype
              </label>
              <div className="space-y-2">
                {loanTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleInputChange('loanType', type.id)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      formData.loanType === type.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-800">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      ✓ {type.pros} • ✗ {type.cons}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ekstra månedligt afdrag (valgfrit)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.extraPayment}
                  onChange={(e) => handleInputChange('extraPayment', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  step="1000"
                />
                <TrendingUp className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatCurrency(formData.extraPayment)} ekstra per måned
              </p>
            </div>

            <button
              onClick={calculateMortgage}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Beregn boliglån
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Summary Card */}
                <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">Dit boliglån</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.monthlyPayment)}
                      </div>
                      <div className="text-sm text-green-600">Månedlig ydelse</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(results.totalInterest)}
                      </div>
                      <div className="text-sm text-blue-600">Total rente</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(results.totalPayment)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total tilbagebetaling over {formData.loanTerm} år
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extra Payment Impact */}
                {formData.extraPayment > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">Effekt af ekstra afdrag</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {results.actualLoanTerm} år
                        </div>
                        <div className="text-sm text-blue-600">Ny løbetid</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(results.totalInterest - results.actualTotalInterest)}
                        </div>
                        <div className="text-sm text-green-600">Rente sparet</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interest Scenarios */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Forskellige rentescenarier</h4>
                  {results.interestScenarios.map((scenario, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium text-gray-800">{scenario.label}</div>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(scenario.monthlyPayment)} per måned
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-800">
                            {formatCurrency(scenario.totalInterest)}
                          </div>
                          <div className="text-sm text-gray-500">Total rente</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Yearly Breakdown */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3">Årlig opdeling (første 10 år)</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {results.yearlyBreakdown.map((year) => (
                      <div key={year.year} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">År {year.year}:</span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(year.principal)} hovedstol</div>
                          <div className="text-gray-500">{formatCurrency(year.interest)} rente</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">💡 Boliglånsråd</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Spar op til mindst 20% udbetaling</li>
                    <li>• Overvej ekstra afdrag for at spare renter</li>
                    <li>• Sammenlign forskellige lånetyper</li>
                    <li>• Husk ejendomsskat og forsikring</li>
                    <li>• Gennemgå lånet årligt</li>
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
                  Udfyld felterne til venstre og klik "Beregn boliglån" for at se resultaterne
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator; 