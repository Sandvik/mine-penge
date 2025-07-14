import React, { useState } from 'react';
import { Download, FileSpreadsheet, Calculator, TrendingUp } from 'lucide-react';

const StudentBudgetTemplate = () => {
  const [showPreview, setShowPreview] = useState(false);

  const downloadTemplate = () => {
    // Create a simple CSV template that can be opened in Excel
    const csvContent = `Kategori,Månedlig indkomst,Månedlig udgift,Noter
SU (efter skat),,,
Deltidsjob,,,
Andre indkomster,,,
SUMME INDTÆGTER,,,

Bolig,,,
Mad og husholdning,,,
Transport,,,
Forsikringer,,,
Telefon/Internet,,,
Underholdning,,,
Studiematerialer,,,
Andre udgifter,,,
SUMME UDGIFTER,,,

OVERSKUD (Indtægter - Udgifter),,,

INVESTERINGER
Månedlig investering,,,
Emergency fund,,,
Andre opsparinger,,,

BUDGET TIPS:
- Brug 50/30/20 reglen: 50% nødvendige udgifter, 30% ønsker, 20% opsparing/investering
- Start med at spare 3-6 måneders udgifter som emergency fund
- Invester kun penge du kan undvære i 5+ år
- Overvej at bruge apps som Lunar eller Nordnet for at automatisere investeringer`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_budget_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <FileSpreadsheet className="w-6 h-6 text-green-600" />
        <h3 className="text-xl font-semibold text-gray-800">Student Budget Template</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-3">Hvad får du?</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Komplet budget skabelon i Excel format
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              SU og deltidsjob kategorier
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Investerings- og opsparingssektion
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Praktiske budget tips
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-800 mb-3">Hvordan bruger du det?</h4>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">1</span>
              Download skabelonen
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">2</span>
              Åbn i Excel eller Google Sheets
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">3</span>
              Udfyld dine faktiske tal
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">4</span>
              Se hvor meget du kan investere
            </li>
          </ol>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200 mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">50/30/20 Budget Regel for Studerende</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">50%</div>
            <div className="text-sm text-gray-600">Nødvendige udgifter</div>
            <div className="text-xs text-gray-500 mt-1">
              Bolig, mad, transport, forsikringer
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">30%</div>
            <div className="text-sm text-gray-600">Ønsker og underholdning</div>
            <div className="text-xs text-gray-500 mt-1">
              Byen, streaming, shopping, ferier
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">20%</div>
            <div className="text-sm text-gray-600">Opsparing og investering</div>
            <div className="text-xs text-gray-500 mt-1">
              Emergency fund, aktier, pension
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={downloadTemplate}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Budget Template
        </button>
        
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
        >
          <Calculator className="w-5 h-5" />
          {showPreview ? 'Skjul' : 'Vis'} Preview
        </button>
      </div>

      {showPreview && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h5 className="font-medium text-gray-800 mb-3">Template Preview:</h5>
          <div className="text-xs font-mono text-gray-600 bg-white p-3 rounded border overflow-x-auto">
            <div>Kategori,Månedlig indkomst,Månedlig udgift,Noter</div>
            <div>SU (efter skat),,</div>
            <div>Deltidsjob,,</div>
            <div>Bolig,,</div>
            <div>Mad og husholdning,,</div>
            <div>Transport,,</div>
            <div>...</div>
            <div>Månedlig investering,,</div>
            <div>Emergency fund,,</div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-sm text-blue-800">
          <strong>Tip:</strong> Brug denne skabelon sammen med vores 
          <a href="#calculator" className="text-blue-600 hover:underline ml-1">
            investeringsberegner
          </a> 
          for at se hvor meget du kan spare op over tid!
        </div>
      </div>
    </div>
  );
};

export default StudentBudgetTemplate; 