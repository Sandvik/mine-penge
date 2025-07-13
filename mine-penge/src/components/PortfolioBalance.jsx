import React, { useState } from 'react';
import { PieChart, TrendingUp, Target, BarChart3, DollarSign, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const PortfolioBalance = () => {
  const [portfolio, setPortfolio] = useState({
    stocks: { amount: 100000, percentage: 60, target: 60 },
    bonds: { amount: 40000, percentage: 24, target: 25 },
    realEstate: { amount: 20000, percentage: 12, target: 10 },
    cash: { amount: 8000, percentage: 4, target: 5 }
  });

  const [showRecommendations, setShowRecommendations] = useState(false);

  const assetClasses = [
    { 
      id: 'stocks', 
      name: 'Aktier', 
      icon: TrendingUp, 
      color: 'blue',
      description: 'Enkeltaktier, ETF\'er, aktiefonde',
      risk: 'Høj',
      expectedReturn: '6-10%'
    },
    { 
      id: 'bonds', 
      name: 'Obligationer', 
      icon: Target, 
      color: 'green',
      description: 'Statsobligationer, virksomhedsobligationer',
      risk: 'Lav',
      expectedReturn: '2-4%'
    },
    { 
      id: 'realEstate', 
      name: 'Fast ejendom', 
      icon: BarChart3, 
      color: 'purple',
      description: 'REIT\'er, ejendomsfonde, direkte investeringer',
      risk: 'Medium',
      expectedReturn: '4-7%'
    },
    { 
      id: 'cash', 
      name: 'Kontanter', 
      icon: DollarSign, 
      color: 'gray',
      description: 'Bankindlån, pengemarkedsfonde',
      risk: 'Meget lav',
      expectedReturn: '0-2%'
    }
  ];

  const handleAmountChange = (assetId, amount) => {
    const newPortfolio = { ...portfolio };
    newPortfolio[assetId].amount = parseInt(amount) || 0;
    
    // Beregn total værdi
    const totalValue = Object.values(newPortfolio).reduce((sum, asset) => sum + asset.amount, 0);
    
    // Opdater procentdele
    Object.keys(newPortfolio).forEach(id => {
      newPortfolio[id].percentage = totalValue > 0 ? Math.round((newPortfolio[id].amount / totalValue) * 100) : 0;
    });
    
    setPortfolio(newPortfolio);
  };

  const handleTargetChange = (assetId, target) => {
    const newPortfolio = { ...portfolio };
    newPortfolio[assetId].target = parseInt(target) || 0;
    setPortfolio(newPortfolio);
  };

  const rebalancePortfolio = () => {
    const totalValue = Object.values(portfolio).reduce((sum, asset) => sum + asset.amount, 0);
    const newPortfolio = { ...portfolio };
    
    Object.keys(newPortfolio).forEach(id => {
      const targetAmount = Math.round((newPortfolio[id].target / 100) * totalValue);
      newPortfolio[id].amount = targetAmount;
      newPortfolio[id].percentage = newPortfolio[id].target;
    });
    
    setPortfolio(newPortfolio);
  };

  const getTotalValue = () => {
    return Object.values(portfolio).reduce((sum, asset) => sum + asset.amount, 0);
  };

  const getRebalancingNeeds = () => {
    const needs = [];
    Object.entries(portfolio).forEach(([id, asset]) => {
      const difference = asset.percentage - asset.target;
      if (Math.abs(difference) > 5) {
        needs.push({
          asset: assetClasses.find(ac => ac.id === id),
          current: asset.percentage,
          target: asset.target,
          difference,
          action: difference > 0 ? 'sælg' : 'køb'
        });
      }
    });
    return needs;
  };

  const getRiskScore = () => {
    const riskWeights = { stocks: 0.8, bonds: 0.2, realEstate: 0.6, cash: 0.1 };
    const weightedRisk = Object.entries(portfolio).reduce((score, [id, asset]) => {
      return score + (asset.percentage / 100) * riskWeights[id];
    }, 0);
    
    if (weightedRisk < 0.3) return { level: 'Konservativ', color: 'green', score: Math.round(weightedRisk * 100) };
    if (weightedRisk < 0.6) return { level: 'Moderat', color: 'yellow', score: Math.round(weightedRisk * 100) };
    return { level: 'Aggressiv', color: 'red', score: Math.round(weightedRisk * 100) };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalValue = getTotalValue();
  const rebalancingNeeds = getRebalancingNeeds();
  const riskScore = getRiskScore();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <PieChart className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Portefølje Balance
          </h2>
          <p className="text-gray-600">
            Analyser og balancer din investeringsportefølje for optimal risikospredning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Overview */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Portefølje Oversigt</h3>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {formatCurrency(totalValue)}
                </div>
                <div className="text-sm text-purple-600">Total porteføljeværdi</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {riskScore.score}/100
                  </div>
                  <div className="text-sm text-gray-600">Risikoscore</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold text-${riskScore.color}-600`}>
                    {riskScore.level}
                  </div>
                  <div className="text-sm text-gray-600">Risikoprofil</div>
                </div>
              </div>

              {rebalancingNeeds.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">
                      Rebalancering anbefales
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700">
                    {rebalancingNeeds.length} aktivklasse(r) afviger fra målallokering
                  </p>
                </div>
              )}
            </div>

            {/* Asset Classes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Aktivklasser</h3>
              
              {assetClasses.map((assetClass) => {
                const asset = portfolio[assetClass.id];
                const Icon = assetClass.icon;
                const difference = asset.percentage - asset.target;
                const needsRebalancing = Math.abs(difference) > 5;
                
                return (
                  <div key={assetClass.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 text-${assetClass.color}-600`} />
                        <div>
                          <div className="font-medium text-gray-800">{assetClass.name}</div>
                          <div className="text-xs text-gray-500">{assetClass.description}</div>
                        </div>
                      </div>
                      {needsRebalancing && (
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          difference > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {difference > 0 ? '+' : ''}{difference}%
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Beløb
                        </label>
                        <input
                          type="number"
                          value={asset.amount}
                          onChange={(e) => handleAmountChange(assetClass.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          step="1000"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Mål (%)
                        </label>
                        <input
                          type="number"
                          value={asset.target}
                          onChange={(e) => handleTargetChange(assetClass.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {asset.percentage}% af porteføljen
                      </span>
                      <span className="text-gray-600">
                        {formatCurrency(asset.amount)}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`bg-${assetClass.color}-500 h-2 rounded-full transition-all`}
                        style={{ width: `${asset.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={rebalancePortfolio}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Rebalancer portefølje
            </button>
          </div>

          {/* Analysis & Recommendations */}
          <div className="space-y-6">
            {/* Risk Analysis */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Risikoanalyse</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Risikoscore:</span>
                  <span className="font-semibold text-gray-800">{riskScore.score}/100</span>
                </div>
                
                <div className="bg-white rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Risikoprofil:</span>
                    <span className={`text-sm font-semibold text-${riskScore.color}-600`}>
                      {riskScore.level}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${riskScore.color}-500 h-2 rounded-full transition-all`}
                      style={{ width: `${riskScore.score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  {riskScore.level === 'Konservativ' && 
                    'Din portefølje har lav risiko og er egnet til kort til mellemlang tidshorisont.'}
                  {riskScore.level === 'Moderat' && 
                    'Din portefølje har balanceret risiko og er egnet til mellemlang til lang tidshorisont.'}
                  {riskScore.level === 'Aggressiv' && 
                    'Din portefølje har høj risiko og er egnet til lang tidshorisont (10+ år).'}
                </div>
              </div>
            </div>

            {/* Rebalancing Recommendations */}
            {rebalancingNeeds.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Rebalanceringsanbefalinger</h3>
                
                <div className="space-y-3">
                  {rebalancingNeeds.map((need, index) => (
                    <div key={index} className="bg-white rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <need.asset.icon className={`w-4 h-4 text-${need.asset.color}-600`} />
                          <span className="font-medium text-gray-800">{need.asset.name}</span>
                        </div>
                        <span className={`text-sm font-semibold ${
                          need.action === 'sælg' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {need.action === 'sælg' ? 'Sælg' : 'Køb'}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Juster fra {need.current}% til {need.target}% 
                        ({Math.abs(need.difference)}% {need.action === 'sælg' ? 'mindre' : 'mere'})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Asset Class Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivklasse Information</h3>
              
              <div className="space-y-3">
                {assetClasses.map((assetClass) => (
                  <div key={assetClass.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <assetClass.icon className={`w-4 h-4 text-${assetClass.color}-600`} />
                      <div>
                        <div className="font-medium text-gray-800">{assetClass.name}</div>
                        <div className="text-xs text-gray-500">
                          Risiko: {assetClass.risk} | Afkast: {assetClass.expectedReturn}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-800 mb-3">💡 Portefølje tips</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Rebalancer 1-2 gange årligt</li>
                <li>• Hold dig til din risikoprofil</li>
                <li>• Diversificer på tværs af aktivklasser</li>
                <li>• Overvej din tidshorisont</li>
                <li>• Gennemgå porteføljen regelmæssigt</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioBalance; 