import React from 'react';
import { Helmet } from 'react-helmet-async';
import ChatWidget from '../components/ChatWidget';
import Breadcrumbs from '../components/Breadcrumbs';

const ChatTest = () => {
  return (
    <>
      <Helmet>
        <title>Test Chat Widget - MinePenge.nu</title>
        <meta name="description" content="Test vores nye chat widget for økonomiske spørgsmål" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Breadcrumbs 
            items={[
              { label: 'Hjem', href: '/' },
              { label: 'Chat Test', href: '/chat-test' }
            ]} 
          />
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                🤖 Chat Widget Test
              </h1>
              
              <p className="text-gray-600 mb-6">
                Test vores nye chat widget! Prøv at stille spørgsmål om økonomi og investering.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Test disse spørgsmål:</h3>
                <ul className="text-blue-800 space-y-1">
                  <li>• "Hvordan starter jeg med at investere?"</li>
                  <li>• "Hvad er ASK?"</li>
                  <li>• "Hvilke fonde skal jeg vælge?"</li>
                  <li>• "Jeg vil gerne begynde at investere"</li>
                  <li>• "Kan du hjælpe mig med at starte?"</li>
                </ul>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Chat widget vises i nederste højre hjørne</h3>
                <p className="text-yellow-800">
                  Scroll ned og kig i nederste højre hjørne af siden for at se chat widget'en.
                </p>
              </div>
            </div>
            
            {/* Dummy content to make page scrollable */}
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Om Chat Widget'en
              </h2>
              <p className="text-gray-600 mb-4">
                Dette er vores første version af chat widget'en. Den bruger en simpel nøgleord matching 
                til at finde relevante svar fra vores FAQ database.
              </p>
              <p className="text-gray-600 mb-4">
                I fremtiden vil vi tilføje:
              </p>
              <ul className="text-gray-600 list-disc list-inside space-y-2">
                <li>Bedre matching algoritmer</li>
                <li>Kontekst bevarelse</li>
                <li>Integration med beregnere</li>
                <li>AI-genererede svar</li>
                <li>Personlig tilpasning</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Teknisk Implementation
              </h2>
              <p className="text-gray-600 mb-4">
                Chat widget'en er bygget med React hooks og bruger:
              </p>
              <ul className="text-gray-600 list-disc list-inside space-y-2">
                <li>useState for message state management</li>
                <li>useRef for auto-scroll funktionalitet</li>
                <li>useEffect for side effects</li>
                <li>Tailwind CSS for styling</li>
                <li>Simple keyword matching algoritme</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Næste Skridt
              </h2>
              <p className="text-gray-600 mb-4">
                Efter denne test vil vi:
              </p>
              <ol className="text-gray-600 list-decimal list-inside space-y-2">
                <li>Integrere med den fulde FAQ database</li>
                <li>Tilføje fuzzy string matching</li>
                <li>Implementere kontekst bevarelse</li>
                <li>Tilføje links til beregnere og artikler</li>
                <li>Forbedre UI/UX</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Widget */}
      <ChatWidget />
    </>
  );
};

export default ChatTest; 