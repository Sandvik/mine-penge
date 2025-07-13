import React, { useState } from 'react';
import { Home, Calculator, TrendingUp, MapPin, DollarSign, BarChart3, ArrowRight, Plus, X } from 'lucide-react';

const PropertyComparison = () => {
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'Ejendom 1',
      address: 'København K',
      price: 2500000,
      size: 85,
      rooms: 3,
      yearBuilt: 2010,
      monthlyExpenses: 8000,
      propertyTax: 12000,
      utilities: 3000,
      maintenance: 2000,
      isActive: true
    },
    {
      id: 2,
      name: 'Ejendom 2',
      address: 'Aarhus C',
      price: 2200000,
      size: 75,
      rooms: 2,
      yearBuilt: 2015,
      monthlyExpenses: 7000,
      propertyTax: 10000,
      utilities: 2500,
      maintenance: 1500,
      isActive: true
    }
  ]);

  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    price: 0,
    size: 0,
    rooms: 0,
    yearBuilt: new Date().getFullYear(),
    monthlyExpenses: 0,
    propertyTax: 0,
    utilities: 0,
    maintenance: 0
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const addProperty = () => {
    if (newProperty.name && newProperty.price > 0) {
      const property = {
        ...newProperty,
        id: Date.now(),
        isActive: true
      };
      setProperties([...properties, property]);
      setNewProperty({
        name: '',
        address: '',
        price: 0,
        size: 0,
        rooms: 0,
        yearBuilt: new Date().getFullYear(),
        monthlyExpenses: 0,
        propertyTax: 0,
        utilities: 0,
        maintenance: 0
      });
      setShowAddForm(false);
    }
  };

  const removeProperty = (id) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  const toggleProperty = (id) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const updateProperty = (id, field, value) => {
    setProperties(properties.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const calculateTotalCost = (property) => {
    const annualExpenses = property.monthlyExpenses * 12 + property.propertyTax + 
                          property.utilities * 12 + property.maintenance * 12;
    return {
      annual: annualExpenses,
      monthly: annualExpenses / 12,
      pricePerM2: property.price / property.size,
      costPerM2: annualExpenses / property.size
    };
  };

  const getBestValue = () => {
    const activeProperties = properties.filter(p => p.isActive);
    if (activeProperties.length === 0) return null;

    return activeProperties.reduce((best, current) => {
      const bestCost = calculateTotalCost(best);
      const currentCost = calculateTotalCost(current);
      
      // Beregn værdi baseret på pris per m² og årlige omkostninger
      const bestValue = best.price / best.size + bestCost.annual / 1000;
      const currentValue = current.price / current.size + currentCost.annual / 1000;
      
      return currentValue < bestValue ? current : best;
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('da-DK', {
      style: 'currency',
      currency: 'DKK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const activeProperties = properties.filter(p => p.isActive);
  const bestValue = getBestValue();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Ejendomssammenligning
          </h2>
          <p className="text-gray-600">
            Sammenlign forskellige ejendomme og find den bedste værdi for dine penge
          </p>
        </div>

        {/* Add Property Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Tilføj ejendom
          </button>
        </div>

        {/* Add Property Form */}
        {showAddForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Tilføj ny ejendom</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Navn</label>
                <input
                  type="text"
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ejendom 3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="København N"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pris</label>
                <input
                  type="number"
                  value={newProperty.price}
                  onChange={(e) => setNewProperty({...newProperty, price: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2500000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Størrelse (m²)</label>
                <input
                  type="number"
                  value={newProperty.size}
                  onChange={(e) => setNewProperty({...newProperty, size: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="85"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Værelser</label>
                <input
                  type="number"
                  value={newProperty.rooms}
                  onChange={(e) => setNewProperty({...newProperty, rooms: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Byggeår</label>
                <input
                  type="number"
                  value={newProperty.yearBuilt}
                  onChange={(e) => setNewProperty({...newProperty, yearBuilt: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2010"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Månedlige udgifter</label>
                <input
                  type="number"
                  value={newProperty.monthlyExpenses}
                  onChange={(e) => setNewProperty({...newProperty, monthlyExpenses: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="8000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ejendomsskat (årlig)</label>
                <input
                  type="number"
                  value={newProperty.propertyTax}
                  onChange={(e) => setNewProperty({...newProperty, propertyTax: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forbrug (månedlig)</label>
                <input
                  type="number"
                  value={newProperty.utilities}
                  onChange={(e) => setNewProperty({...newProperty, utilities: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3000"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={addProperty}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Tilføj ejendom
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Annuller
              </button>
            </div>
          </div>
        )}

        {/* Best Value Recommendation */}
        {bestValue && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">🏆 Bedste værdi</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-green-800">{bestValue.name}</div>
                <div className="text-sm text-green-600">{bestValue.address}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-800">
                  {formatCurrency(bestValue.price)}
                </div>
                <div className="text-sm text-green-600">
                  {bestValue.size} m² • {bestValue.rooms} værelser
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Comparison */}
        <div className="space-y-6">
          {properties.map((property) => {
            const costs = calculateTotalCost(property);
            return (
              <div key={property.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={property.isActive}
                      onChange={() => toggleProperty(property.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <h3 className="text-lg font-semibold text-gray-800">{property.name}</h3>
                  </div>
                  <button
                    onClick={() => removeProperty(property.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {property.address}
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {formatCurrency(property.price)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.size} m² • {property.rooms} værelser • {property.yearBuilt}
                    </div>
                  </div>

                  {/* Costs */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Årlige omkostninger</h4>
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(costs.annual)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(costs.monthly)} per måned
                    </div>
                  </div>

                  {/* Price per m² */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Pris per m²</h4>
                    <div className="text-lg font-bold text-green-600">
                      {formatCurrency(costs.pricePerM2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Omkostninger: {formatCurrency(costs.costPerM2)}/m²/år
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800">Opdeling</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Boligudgifter:</span>
                        <span>{formatCurrency(property.monthlyExpenses * 12)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ejendomsskat:</span>
                        <span>{formatCurrency(property.propertyTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Forbrug:</span>
                        <span>{formatCurrency(property.utilities * 12)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vedligeholdelse:</span>
                        <span>{formatCurrency(property.maintenance * 12)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {activeProperties.length > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Sammenligning</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(Math.min(...activeProperties.map(p => p.price)))}
                </div>
                <div className="text-sm text-blue-600">Laveste pris</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(Math.min(...activeProperties.map(p => calculateTotalCost(p).annual)))}
                </div>
                <div className="text-sm text-green-600">Laveste omkostninger</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.min(...activeProperties.map(p => p.price / p.size)).toFixed(0)} kr/m²
                </div>
                <div className="text-sm text-purple-600">Laveste pris per m²</div>
              </div>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 Ejendomssammenligningsråd</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Overvej både købspris og løbende omkostninger</li>
            <li>• Tjek ejendomsskat og ejendomsværdiskat</li>
            <li>• Undersøg energimærke og vedligeholdelsesomkostninger</li>
            <li>• Sammenlign lokation og transportmuligheder</li>
            <li>• Husk at regne med advokatomkostninger og tinglysning</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PropertyComparison; 