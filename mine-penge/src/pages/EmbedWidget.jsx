import React from 'react';
import EmbedScriptGenerator from '../components/EmbedScriptGenerator';
import EmbeddableWidget from '../components/EmbeddableWidget';

function EmbedWidget() {
  return (
    <div className="min-h-screen bg-nordic-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-nordic-900 mb-4">
              MinePenge.dk Widget
            </h1>
            <p className="text-lg text-nordic-600">
              Del relevante artikler om personlig økonomi på din hjemmeside
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Widget Generator */}
            <div>
              <EmbedScriptGenerator />
            </div>

            {/* Widget Preview */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <h2 className="text-xl font-semibold text-nordic-900 mb-4">
                  Widget Preview
                </h2>
                <p className="text-sm text-nordic-600 mb-4">
                  Sådan vil widget'en se ud på din hjemmeside:
                </p>
                
                <div className="border border-nordic-200 rounded-lg p-4 bg-nordic-50">
                  <EmbeddableWidget theme="su" limit={3} showSource={true} />
                </div>
              </div>

              {/* Features */}
              <div className="mt-6 bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <h3 className="text-lg font-semibold text-nordic-900 mb-4">
                  Funktioner
                </h3>
                <ul className="space-y-2 text-sm text-nordic-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Automatisk opdatering med de seneste artikler
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Filtrering efter emne (SU, Opsparing, Bolig, etc.)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Responsivt design der tilpasser sig din hjemmeside
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Gratis at bruge - ingen registrering nødvendig
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Direkte links til MinePenge.dk for at læse mere
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* How to use */}
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
            <h2 className="text-xl font-semibold text-nordic-900 mb-4">
              Sådan bruger du widget'en
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-nordic-900 mb-2">Generer Script</h3>
                <p className="text-sm text-nordic-600">
                  Vælg emne og antal artikler, og generer embed scriptet
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-nordic-900 mb-2">Indsæt på Side</h3>
                <p className="text-sm text-nordic-600">
                  Kopier scriptet og indsæt det på din hjemmeside
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-nordic-900 mb-2">Færdig!</h3>
                <p className="text-sm text-nordic-600">
                  Widget'en viser automatisk de seneste relevante artikler
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmbedWidget; 