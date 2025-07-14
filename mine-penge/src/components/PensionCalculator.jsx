import React, { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Calendar, User } from 'lucide-react';

function PensionCalculator() {
  const [formData, setFormData] = useState({
    // Personlige oplysninger
    age: 65,
    maritalStatus: 'single',
    yearsInDenmark: 40,
    
    // Private pensioner
    ratepension: 0,
    aldersopsparing: 0,
    livrente: 0,
    
    // Andre indkomster
    arbejdsindkomst: 0,
    kapitalindkomst: 0,
    
    // Bolig
    boligtype: 'ejer',
    boligværdi: 0,
    gæld: 0
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'yearsInDenmark' || name === 'boligværdi' || name === 'gæld' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const calculatePension = () => {
    const {
      age, maritalStatus, yearsInDenmark, ratepension, aldersopsparing, 
      livrente, arbejdsindkomst, kapitalindkomst, boligtype, boligværdi, gæld
    } = formData;

    // Folkepension beregning (2024 satser)
    const folkepensionSats = maritalStatus === 'single' ? 6667 : 4445;
    const tillægSats = maritalStatus === 'single' ? 3334 : 2223;
    
    // Beregn tillæg baseret på andre indkomster
    const totalIndkomst = arbejdsindkomst + kapitalindkomst + ratepension + aldersopsparing + livrente;
    const tillæg = Math.max(0, tillægSats - (totalIndkomst * 0.3));
    
    const folkepension = folkepensionSats + tillæg;

    // Ratepension (skattepligtig)
    const ratepensionMånedlig = ratepension / 12;

    // Aldersopsparing (skattefri)
    const aldersopsparingMånedlig = aldersopsparing / 12;

    // Livrente (skattepligtig)
    const livrenteMånedlig = livrente / 12;

    // Total månedlig indkomst
    const totalMånedlig = folkepension + ratepensionMånedlig + aldersopsparingMånedlig + 
                         livrenteMånedlig + arbejdsindkomst + kapitalindkomst;

    // Skatteberegning (forenklet)
    const skattepligtigIndkomst = folkepension + ratepensionMånedlig + livrenteMånedlig + 
                                 arbejdsindkomst + kapitalindkomst;
    const skat = skattepligtigIndkomst * 0.37; // Forenklet skatteberegning
    const nettoIndkomst = totalMånedlig - skat;

    // Boligudgifter
    const boligudgifter = boligtype === 'ejer' ? 
      (gæld > 0 ? gæld * 0.04 / 12 : 0) + 2000 : // Ejendomsskat + vedligeholdelse
      8000; // Leje

    // Disponibel indkomst
    const disponibelIndkomst = nettoIndkomst - boligudgifter;

    setResults({
      folkepension: Math.round(folkepension),
      ratepensionMånedlig: Math.round(ratepensionMånedlig),
      aldersopsparingMånedlig: Math.round(aldersopsparingMånedlig),
      livrenteMånedlig: Math.round(livrenteMånedlig),
      totalMånedlig: Math.round(totalMånedlig),
      skat: Math.round(skat),
      nettoIndkomst: Math.round(nettoIndkomst),
      boligudgifter: Math.round(boligudgifter),
      disponibelIndkomst: Math.round(disponibelIndkomst)
    });
  };

  return (
            <div className="bg-nordic-50 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-8 w-8 text-primary-600" />
        <h2 className="text-2xl font-bold text-nordic-800">Pensionberegner for Pensionister</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input sektion */}
        <div className="space-y-6">
          <div className="bg-nordic-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-nordic-800 mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personlige oplysninger
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-nordic-700 mb-1">
                  Alder
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="60"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nordic-700 mb-1">
                  Civilstand
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="single">Enkelt</option>
                  <option value="married">Gift/samboende</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-nordic-700 mb-1">
                  År i Danmark
                </label>
                <input
                  type="number"
                  name="yearsInDenmark"
                  value={formData.yearsInDenmark}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="0"
                  max="50"
                />
              </div>
            </div>
          </div>

          <div className="bg-nordic-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-nordic-800 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Private pensioner (årligt)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-nordic-700 mb-1">
                  Ratepension
                </label>
                <input
                  type="number"
                  name="ratepension"
                  value={formData.ratepension}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nordic-700 mb-1">
                  Aldersopsparing
                </label>
                <input
                  type="number"
                  name="aldersopsparing"
                  value={formData.aldersopsparing}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nordic-700 mb-1">
                  Livrente
                </label>
                <input
                  type="number"
                  name="livrente"
                  value={formData.livrente}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-nordic-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-nordic-800 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Andre indkomster (månedligt)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-nordic-700 mb-1">
                  Arbejdsindkomst
                </label>
                <input
                  type="number"
                  name="arbejdsindkomst"
                  value={formData.arbejdsindkomst}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-nordic-700 mb-1">
                  Kapitalindkomst
                </label>
                <input
                  type="number"
                  name="kapitalindkomst"
                  value={formData.kapitalindkomst}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <button
            onClick={calculatePension}
            className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Beregn pension
          </button>
        </div>

        {/* Resultat sektion */}
        <div className="space-y-6">
          {results ? (
            <>
              <div className="bg-success-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-success-800 mb-4 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Din månedlige indkomst
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-success-700">Folkepension:</span>
                    <span className="font-semibold text-success-800">{results.folkepension.toLocaleString()} kr</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-success-700">Ratepension:</span>
                    <span className="font-semibold text-success-800">{results.ratepensionMånedlig.toLocaleString()} kr</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-success-700">Aldersopsparing:</span>
                    <span className="font-semibold text-success-800">{results.aldersopsparingMånedlig.toLocaleString()} kr</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-success-700">Livrente:</span>
                    <span className="font-semibold text-success-800">{results.livrenteMånedlig.toLocaleString()} kr</span>
                  </div>
                  
                  <hr className="border-success-200" />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-success-800">Total brutto:</span>
                    <span className="font-bold text-success-800">{results.totalMånedlig.toLocaleString()} kr</span>
                  </div>
                </div>
              </div>

              <div className="bg-warning-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-warning-800 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Skat og udgifter
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-warning-700">Skat:</span>
                    <span className="font-semibold text-warning-800">-{results.skat.toLocaleString()} kr</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-warning-700">Boligudgifter:</span>
                    <span className="font-semibold text-warning-800">-{results.boligudgifter.toLocaleString()} kr</span>
                  </div>
                  
                  <hr className="border-warning-200" />
                  
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold text-warning-800">Netto indkomst:</span>
                    <span className="font-bold text-warning-800">{results.nettoIndkomst.toLocaleString()} kr</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold text-warning-800">Disponibel indkomst:</span>
                    <span className="font-bold text-warning-800">{results.disponibelIndkomst.toLocaleString()} kr</span>
                  </div>
                </div>
              </div>

              <div className="bg-nordic-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-nordic-800 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Årlig oversigt
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Årlig brutto indkomst:</span>
                    <span className="font-semibold">{(results.totalMånedlig * 12).toLocaleString()} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Årlig skat:</span>
                    <span className="font-semibold">{(results.skat * 12).toLocaleString()} kr</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Årlig disponibel indkomst:</span>
                    <span className="font-semibold">{(results.disponibelIndkomst * 12).toLocaleString()} kr</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-nordic-50 p-8 rounded-lg text-center">
              <Calculator className="h-12 w-12 text-nordic-400 mx-auto mb-4" />
              <p className="text-nordic-600">
                Udfyld dine oplysninger og klik "Beregn pension" for at se dit resultat
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Tips til pensionister</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Folkepension udbetales automatisk når du fylder 67 år</li>
          <li>• Aldersopsparing er skattefri og kan udbetales fra 60 år</li>
          <li>• Ratepension skal udbetales over minimum 10 år</li>
          <li>• Overvej at arbejde deltid for at øge din indkomst</li>
          <li>• Tjek om du har ret til pensionstillæg</li>
        </ul>
      </div>
    </div>
  );
}

export default PensionCalculator; 