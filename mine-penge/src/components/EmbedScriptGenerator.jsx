import React, { useState } from 'react';

function EmbedScriptGenerator() {
  const [theme, setTheme] = useState('su');
  const [limit, setLimit] = useState(3);
  const [showSource, setShowSource] = useState(true);
  const [generatedScript, setGeneratedScript] = useState('');

  const themes = [
    { value: 'su', label: 'SU og Studerende' },
    { value: 'opsparing', label: 'Opsparing' },
    { value: 'bolig', label: 'Bolig og Huskøb' },
    { value: 'investering', label: 'Investering' },
    { value: 'gæld', label: 'Gæld og Lån' },
    { value: 'pension', label: 'Pension' },
    { value: 'budget', label: 'Budget' },
    { value: 'all', label: 'Alle emner' }
  ];

  const generateScript = () => {
    const script = `<!-- MinePenge.dk Widget -->
<div id="minepenge-widget-${theme}"></div>
<script>
(function() {
  var script = document.createElement('script');
  script.src = 'https://minepenge.dk/widget.js';
  script.async = true;
  script.onload = function() {
    window.MinePengeWidget.init({
      container: 'minepenge-widget-${theme}',
      theme: '${theme}',
      limit: ${limit},
      showSource: ${showSource}
    });
  };
  document.head.appendChild(script);
})();
</script>`;
    
    setGeneratedScript(script);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    alert('Script kopieret til udklipsholder!');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
      <h2 className="text-xl font-semibold text-nordic-900 mb-4">
        Embed Widget Generator
      </h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-nordic-700 mb-2">
            Vælg emne:
          </label>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {themes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-nordic-700 mb-2">
            Antal artikler:
          </label>
          <input 
            type="number" 
            min="1" 
            max="10" 
            value={limit} 
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-nordic-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="showSource" 
            checked={showSource} 
            onChange={(e) => setShowSource(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-nordic-300 rounded"
          />
          <label htmlFor="showSource" className="ml-2 block text-sm text-nordic-700">
            Vis kilde
          </label>
        </div>
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={generateScript}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generer Embed Script
        </button>
        
        {generatedScript && (
          <div>
            <label className="block text-sm font-medium text-nordic-700 mb-2">
              Embed Script:
            </label>
            <div className="relative">
              <textarea 
                value={generatedScript}
                readOnly
                rows={8}
                className="w-full px-3 py-2 border border-nordic-300 rounded-lg bg-nordic-50 font-mono text-sm"
              />
              <button 
                onClick={copyToClipboard}
                className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Kopier
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-nordic-50 rounded-lg">
        <h3 className="text-sm font-medium text-nordic-700 mb-2">Sådan bruger du det:</h3>
        <ol className="text-sm text-nordic-600 space-y-1">
          <li>1. Kopier scriptet ovenfor</li>
          <li>2. Indsæt det på din hjemmeside</li>
          <li>3. Widget'en vil automatisk indlæse de seneste artikler</li>
          <li>4. Besøgende kan klikke på artiklerne for at læse mere</li>
        </ol>
      </div>
    </div>
  );
}

export default EmbedScriptGenerator; 