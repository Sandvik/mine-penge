import React from 'react';
import SEOHead from '../components/SEOHead';
import { Mail, ExternalLink } from 'lucide-react';

function Kontakt() {

  return (
    <>
      <SEOHead 
        title="Kontakt"
        description="Kontakt MinePenge.nu for spørgsmål, feedback eller samarbejde. Vi er her for at hjælpe dig med din privatøkonomi."
        keywords="kontakt minepenge, privatøkonomi hjælp, økonomisk rådgivning, feedback"
      />
      
      <div className="min-h-screen bg-nordic-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-nordic-900 mb-4">
              Kontakt os
            </h1>
            <p className="text-xl text-nordic-600 max-w-3xl mx-auto">
              Har du spørgsmål eller feedback? Vi er her for at hjælpe dig 
              med din privatøkonomi og gøre MinePenge.nu endnu bedre.
            </p>
          </div>

          {/* Contact Information */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-soft mb-8">
              <h2 className="text-2xl font-bold text-nordic-900 mb-6">
                Kontaktoplysninger
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-semibold text-nordic-900 mb-1">Email</h3>
                    <a 
                      href="mailto:info@minepenge.nu?subject=Henvendelse fra MinePenge.nu"
                      className="text-primary-600 hover:text-primary-700 transition-colors flex items-center"
                    >
                      <span className="text-lg">info@minepenge.nu</span>
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                    <p className="text-sm text-nordic-500 mt-1">Klik for at åbne din email klient</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl p-8 shadow-soft">
              <h2 className="text-2xl font-bold text-nordic-900 mb-6">
                Ofte stillede spørgsmål
              </h2>
              
              <div className="space-y-4">
                                  <div>
                    <h3 className="font-semibold text-nordic-900 mb-2">
                      Hvor ofte opdateres indholdet?
                    </h3>
                    <p className="text-nordic-700 text-sm">
                      Vi opdaterer vores indhold ugentligt med nye artikler fra vores partnere.
                    </p>
                  </div>
                
                <div>
                  <h3 className="font-semibold text-nordic-900 mb-2">
                    Kan jeg foreslå nye kilder?
                  </h3>
                  <p className="text-nordic-700 text-sm">
                    Ja, vi er altid åbne for forslag til nye pålidelige kilder.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-nordic-900 mb-2">
                    Hvordan kan jeg samarbejde med jer?
                  </h3>
                  <p className="text-nordic-700 text-sm">
                    Send os en email, så vender vi tilbage med muligheder for samarbejde.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="mt-12 bg-primary-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-semibold text-nordic-900 mb-2">
              Hurtig respons
            </h3>
            <p className="text-nordic-700">
              Vi svarer normalt inden for 24 timer på hverdage.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Kontakt; 