import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hej! Jeg er MinePenge assistenten. Hvordan kan jeg hjælpe dig med din økonomi i dag? 💰',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // FAQ data - vi importerer senere fra FAQ komponenten
  const faqData = [
    {
      id: 'investering-1',
      question: 'Hvordan starter jeg med at investere som begynder?',
      answer: `Som begynder er det vigtigt at starte simpelt:

1️⃣ Start med månedsopsparing - 100-500 kr/måned
2️⃣ Vælg brede fonde - Sparindex INDEX Globale Aktier
3️⃣ Brug Nordnet eller Saxo - Gratis månedsopsparing
4️⃣ Tålmodighed - Investering er langsigtet

💡 Tip: Du behøver ikke være ekspert for at starte. Månedsopsparing er perfekt til begyndere!`,
      tags: ['starte', 'begynde', 'komme i gang', 'første gang', 'nybegynder', 'investering']
    },
    {
      id: 'investering-4',
      question: 'Hvad er ASK (Aktiesparekonto)?',
      answer: `ASK (Aktiesparekonto) er en skattebegunstiget konto til investering i aktiebaserede værdipapirer.

✅ Fordele:
- Maksimalt indskud i 2024: 106.600 kr
- Beskattes med 17% i lagerbeskatning (årlig værdistigning)
- Gælder kun for aktier og aktiebaserede fonde

📋 Sådan gør du:
1. Opret konto hos Nordnet/Saxo
2. Indsæt penge
3. Køb fonde/aktier
4. Betal kun 17% skat

🎯 Velegnet til langsigtet investering i f.eks. Sparindex Globale Aktier.`,
      tags: ['ASK', 'aktiesparekonto', 'skat', 'skattefordel', '17%']
    },
    {
      id: 'investering-5',
      question: 'Hvilke fonde skal jeg vælge som begynder?',
      answer: `Top 3 fonde til begyndere:

1️⃣ Sparindex INDEX Globale Aktier
   - Verdens største virksomheder
   - Billig (0,5% omkostninger)
   - Automatisk diversificering

2️⃣ Sparindex INDEX Emerging Markets
   - Vækstmarkeder (Kina, Indien, etc.)
   - Højere risiko, højere potentielt afkast
   - 10-20% af din portefølje

3️⃣ Sparindex INDEX Danmark
   - Danske virksomheder
   - Skattefordel (realisationsbeskatning)
   - 10-20% af din portefølje

💡 Start med: 100% Sparindex INDEX Globale Aktier, og tilføj andre senere.`,
      tags: ['fonde', 'sparindex', 'begynder', 'vælg', 'hvilke']
    }
  ];

  // Simple keyword matching function
  const findBestMatch = (userQuestion) => {
    const normalizedQuestion = userQuestion.toLowerCase();
    
    // Find matches based on tags
    const matches = faqData.filter(faq => 
      faq.tags.some(tag => normalizedQuestion.includes(tag))
    );
    
    if (matches.length > 0) {
      // Return the first match (we can improve this later)
      return matches[0];
    }
    
    return null;
  };

  // Handle user input
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const match = findBestMatch(inputValue);
      
      let botResponse;
      if (match) {
        botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: match.answer,
          timestamp: new Date(),
          relatedQuestion: match.question
        };
      } else {
        botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: `Jeg forstår ikke helt dit spørgsmål. Kan du prøve at spørge om:

• Hvordan starter jeg med at investere?
• Hvad er ASK?
• Hvilke fonde skal jeg vælge?

Eller besøg vores FAQ side for flere spørgsmål og svar! 📚`,
          timestamp: new Date()
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">💰</span>
            </div>
            <div>
              <h3 className="font-semibold">MinePenge Assistent</h3>
              <p className="text-xs opacity-90">Spørg om økonomi</p>
            </div>
          </div>
          <button className="text-white hover:text-gray-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{message.text}</div>
              {message.relatedQuestion && (
                <div className="mt-2 text-xs opacity-75">
                  Relateret: {message.relatedQuestion}
                </div>
              )}
              <div className="text-xs opacity-50 mt-1">
                {message.timestamp.toLocaleTimeString('da-DK', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Skriv dit spørgsmål..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget; 