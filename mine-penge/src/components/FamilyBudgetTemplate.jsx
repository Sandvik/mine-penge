import React, { useState } from 'react';
import { FileSpreadsheet, Download, Plus, Minus, DollarSign, Users, Baby, School, Home, Car, Heart } from 'lucide-react';

const FamilyBudgetTemplate = () => {
  const [budgetData, setBudgetData] = useState({
    familySize: 4,
    children: 2,
    monthlyIncome: 45000,
    expenses: {
      housing: 12000,
      utilities: 2000,
      food: 4000,
      transport: 3000,
      insurance: 1500,
      childcare: 3000,
      education: 1000,
      healthcare: 800,
      entertainment: 1500,
      savings: 2000,
      other: 1000
    }
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const expenseCategories = [
    { id: 'housing', label: 'Bolig', icon: Home, description: 'Husleje/boliglån, vedligeholdelse' },
    { id: 'utilities', label: 'Forbrug', icon: Home, description: 'El, vand, varme, internet' },
    { id: 'food', label: 'Mad & husholdning', icon: Heart, description: 'Dagligvarer, takeaway' },
    { id: 'transport', label: 'Transport', icon: Car, description: 'Bil, offentlig transport' },
    { id: 'insurance', label: 'Forsikringer', icon: Heart, description: 'Hus, bil, sundhed' },
    { id: 'childcare', label: 'Børnepasning', icon: Baby, description: 'Dagpleje, vuggestue, SFO' },
    { id: 'education', label: 'Uddannelse', icon: School, description: 'Skole, aktiviteter, materialer' },
    { id: 'healthcare', label: 'Sundhed', icon: Heart, description: 'Læge, tandlæge, medicin' },
    { id: 'entertainment', label: 'Underholdning', icon: Heart, description: 'Fritidsaktiviteter, ferier' },
    { id: 'savings', label: 'Opsparing', icon: DollarSign, description: 'Børneopsparing, pension' },
    { id: 'other', label: 'Andet', icon: Plus, description: 'Diverse udgifter' }
  ];

  const handleExpenseChange = (category, value) => {
    setBudgetData(prev => ({
      ...prev,
      expenses: {
        ...prev.expenses,
        [category]: parseInt(value) || 0
      }
    }));
  };

  const handleIncomeChange = (value) => {
    setBudgetData(prev => ({
      ...prev,
      monthlyIncome: parseInt(value) || 0
    }));
  };

  const calculateTotalExpenses = () => {
    return Object.values(budgetData.expenses).reduce((sum, expense) => sum + expense, 0);
  };

  const calculateBalance = () => {
    return budgetData.monthlyIncome - calculateTotalExpenses();
  };

  const calculateSavingsRate = () => {
    return ((budgetData.expenses.savings / budgetData.monthlyIncome) * 100).toFixed(1);
  };

  const generateCSV = () => {
    const headers = ['Kategori', 'Beløb (DKK)', 'Procent af indkomst'];
    const rows = expenseCategories.map(category => {
      const amount = budgetData.expenses[category.id];
      const percentage = ((amount / budgetData.monthlyIncome) * 100).toFixed(1);
      return [category.label, amount, `${percentage}%`];
    });
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'familie-budget.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalExpenses = calculateTotalExpenses();
  const balance = calculateBalance();
  const savingsRate = calculateSavingsRate();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-nordic-50 rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <FileSpreadsheet className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Familie Budget Template
          </h2>
          <p className="text-gray-600">
            Planlæg dit familiens budget og få overblik over indtægter og udgifter
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Family Info & Income */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Familie Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Antal familiemedlemmer
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBudgetData(prev => ({ ...prev, familySize: Math.max(2, prev.familySize - 1) }))}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
                      {budgetData.familySize}
                    </span>
                    <button
                      onClick={() => setBudgetData(prev => ({ ...prev, familySize: prev.familySize + 1 }))}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Antal børn
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBudgetData(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
                      {budgetData.children}
                    </span>
                    <button
                      onClick={() => setBudgetData(prev => ({ ...prev, children: prev.children + 1 }))}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Månedlig Indkomst
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total månedlig indkomst
                </label>
                <input
                  type="number"
                  value={budgetData.monthlyIncome}
                  onChange={(e) => handleIncomeChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  step="1000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(budgetData.monthlyIncome)} per måned
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Oversigt</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total indkomst:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(budgetData.monthlyIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total udgifter:</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(totalExpenses)}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span className="text-gray-800 font-medium">Balance:</span>
                  <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(balance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Opsparingsrate:</span>
                  <span className="font-semibold text-blue-600">
                    {savingsRate}%
                  </span>
                </div>
              </div>

              {balance < 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">
                    ⚠️ Dit budget er i minus. Overvej at reducere udgifter eller øge indtægter.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Expenses */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Månedlige Udgifter</h3>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showAdvanced ? 'Skjul' : 'Vis'} avancerede kategorier
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expenseCategories.map((category) => {
                  const amount = budgetData.expenses[category.id];
                  const percentage = ((amount / budgetData.monthlyIncome) * 100).toFixed(1);
                  
                  return (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <category.icon className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium text-gray-800">{category.label}</div>
                            <div className="text-xs text-gray-500">{category.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-800">
                            {formatCurrency(amount)}
                          </div>
                          <div className="text-xs text-gray-500">{percentage}%</div>
                        </div>
                      </div>
                      
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => handleExpenseChange(category.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        min="0"
                        step="100"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-800 mb-3">💡 Tips til familie budget</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
                <ul className="space-y-1">
                  <li>• Børnepasning er ofte den største udgift</li>
                  <li>• Husk ferie og fritidsaktiviteter</li>
                  <li>• Planlæg for uventede udgifter</li>
                </ul>
                <ul className="space-y-1">
                  <li>• Børneopsparing bør være 10-15% af indkomst</li>
                  <li>• Brug 50/30/20 reglen som udgangspunkt</li>
                  <li>• Gennemgå budgettet månedligt</li>
                </ul>
              </div>
            </div>

            {/* Download */}
            <div className="mt-6 text-center">
              <button
                onClick={generateCSV}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mx-auto"
              >
                <Download className="w-5 h-5" />
                Download Budget som CSV
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Gem dit budget og del det med din partner
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyBudgetTemplate; 