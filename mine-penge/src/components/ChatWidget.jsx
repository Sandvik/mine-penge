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

  // FAQ data fra alle kategorier
  const faqData = [
    // 💰 Investering
    {
      id: 'investering-1',
      question: 'Hvordan starter jeg med at investere som begynder?',
      answer: `Som begynder er det vigtigt at starte simpelt:

1️⃣ Start med månedsopsparing - 100-500 kr/måned
2️⃣ Vælg brede fonde - Sparindex INDEX Globale Aktier
3️⃣ Brug Nordnet eller Saxo - Gratis månedsopsparing
4️⃣ Tålmodighed - Investering er langsigtet

💡 Tip: Du behøver ikke være ekspert for at starte. Månedsopsparing er perfekt til begyndere!`,
      tags: ['starte', 'begynde', 'komme i gang', 'første gang', 'nybegynder', 'investering'],
      category: 'investering'
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
      tags: ['ASK', 'aktiesparekonto', 'skat', 'skattefordel', '17%'],
      category: 'investering'
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
      tags: ['fonde', 'sparindex', 'begynder', 'vælg', 'hvilke'],
      category: 'investering'
    },
    // 🏠 Bolig & Hus
    {
      id: 'bolig-1',
      question: 'Hvordan får jeg boliglån?',
      answer: `Sådan får du boliglån:

1️⃣ Spar op til udbetaling
   - Minimum 20% af boligprisen
   - Jo mere, jo bedre lånevilkår

2️⃣ Få styr på din økonomi
   - Ingen højforrentet gæld
   - Stabil indkomst
   - God kreditvurdering

3️⃣ Få lånebevis
   - 6 måneder før køb
   - Sammenlign banker
   - Forhandl om renter

4️⃣ Find bolig og køb
   - Maksimum 4x din årsindkomst
   - Husk ejerudgifter

💡 Tip: Start med at spare op og få lånebevis, før du begynder at kigge på boliger.`,
      tags: ['boliglån', 'udbetaling', 'lånebevis', 'bolig', 'hus', 'køb'],
      category: 'bolig'
    },
    {
      id: 'bolig-2',
      question: 'Hvor meget skal jeg spare op til bolig?',
      answer: `Minimum 20% af boligprisen:

🏠 Eksempler:
- Bolig til 2 mio = 400.000 kr
- Bolig til 3 mio = 600.000 kr
- Bolig til 4 mio = 800.000 kr

💰 Hvor meget skal du spare op:
- 2 mio bolig: 16.700 kr/måned i 2 år
- 3 mio bolig: 25.000 kr/måned i 2 år
- 4 mio bolig: 33.300 kr/måned i 2 år

💡 Jo mere du sparer op, jo:
- Lavere månedlig ydelse
- Bedre lånevilkår
- Mindre risiko

🎯 Start tidligt - Jo før du begynder at spare, jo lettere bliver det!`,
      tags: ['spareop', 'udbetaling', 'bolig', 'hus', 'beløb'],
      category: 'bolig'
    },
    // 📊 Budget & Økonomi
    {
      id: 'budget-1',
      question: 'Hvordan laver jeg et budget?',
      answer: `Sådan laver du et budget:

1️⃣ Få overblik over indkomst
   - Løn, SU, andre indtægter
   - Skriv alt ned

2️⃣ Kategoriser udgifter
   - Faste udgifter (husleje, el, internet)
   - Variable udgifter (mad, transport, underholdning)
   - Uventede udgifter (forsikring, vedligeholdelse)

3️⃣ 50/30/20 reglen:
   - 50% til nødvendigheder
   - 30% til ønsker
   - 20% til opsparing

4️⃣ Brug en app eller Excel
   - Track dine udgifter
   - Juster løbende

💡 Start simpelt og bliv bedre over tid!`,
      tags: ['budget', 'økonomi', 'udgifter', 'indkomst', 'planlægning'],
      category: 'budget'
    },
    {
      id: 'budget-2',
      question: 'Hvor meget skal jeg spare op?',
      answer: `Generelle retningslinjer for opsparing:

💰 Nødopsparing: 3-6 måneders udgifter
- Hvis du bruger 10.000 kr/måned = 30.000-60.000 kr

🎯 Målbaseret opsparing:
- Bolig: 20% af boligprisen
- Pension: 10-15% af indkomst
- Ferie: 5-10% af indkomst
- Børn: 5-10% af indkomst

📊 50/30/20 reglen:
- 50% til nødvendigheder
- 30% til ønsker
- 20% til opsparing

💡 Start med nødopsparing, derefter målbaseret opsparing.`,
      tags: ['spareop', 'nødopsparing', 'mål', 'beløb', 'regler'],
      category: 'budget'
    },
    // 🎓 Studerende
    {
      id: 'studerende-1',
      question: 'Hvordan får jeg styr på min økonomi som studerende?',
      answer: `Økonomi for studerende:

💰 Indtægter:
- SU: 6.397 kr/måned (2024)
- Studiejob: 1.000-3.000 kr/måned
- Forældrebidrag: Varierer

📊 Typiske udgifter:
- Husleje: 3.000-6.000 kr/måned
- Mad: 1.500-2.500 kr/måned
- Transport: 300-800 kr/måned
- Underholdning: 500-1.000 kr/måned

💡 Tips:
- Lav et budget
- Brug SU-lån kun til nødvendigheder
- Find billige alternativer
- Del udgifter med roommates

🎯 Mål: Spar 500-1.000 kr/måned til nødopsparing.`,
      tags: ['studerende', 'SU', 'budget', 'økonomi', 'husleje'],
      category: 'studerende'
    },
    // 👴 Pension
    {
      id: 'pension-1',
      question: 'Hvor meget skal jeg spare op til pension?',
      answer: `Pensionsopsparing:

💰 Generel regel: 10-15% af din indkomst
- Hvis du tjener 30.000 kr/måned = 3.000-4.500 kr/måned

📊 Sådan fordeler du det:
- Arbejdsgiverpension: 8-12% (automatisk)
- Privat pension: 2-3% (frivilligt)
- Frie midler: 0-5% (fleksibelt)

🎯 Mål: 70% af din nuværende indkomst som pensionist
- Hvis du tjener 30.000 kr nu = 21.000 kr som pensionist

💡 Start tidligt - renters rente gør en kæmpe forskel!`,
      tags: ['pension', 'opsparing', 'arbejdsgiverpension', 'privat pension', 'beløb'],
      category: 'pension'
    },
    // 💳 Gæld & Lån
    {
      id: 'gæld-1',
      question: 'Hvordan kommer jeg ud af gæld?',
      answer: `Sådan kommer du ud af gæld:

1️⃣ Få overblik
   - Skriv alle gæld op
   - Noter renter og gebyrer
   - Prioriter efter rente (højest først)

2️⃣ Lav en plan
   - Sælg unødvendige ting
   - Find ekstra indtægter
   - Skær ned på udgifter

3️⃣ Vælg strategi
   - Snowball: Mindste gæld først (motivation)
   - Avalanche: Højeste rente først (sparer penge)

4️⃣ Hold fast
   - Betal altid minimum
   - Brug ekstra penge til gæld
   - Undgå ny gæld

💡 Fokuser på én gæld ad gangen - det giver resultater!`,
      tags: ['gæld', 'lån', 'afbetaling', 'strategi', 'plan'],
      category: 'gæld'
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

💰 Investering:
• Hvordan starter jeg med at investere?
• Hvad er ASK?
• Hvilke fonde skal jeg vælge?

🏠 Bolig & Hus:
• Hvordan får jeg boliglån?
• Hvor meget skal jeg spare op til bolig?

📊 Budget & Økonomi:
• Hvordan laver jeg et budget?
• Hvor meget skal jeg spare op?

🎓 Studerende:
• Hvordan får jeg styr på min økonomi som studerende?

👴 Pension:
• Hvor meget skal jeg spare op til pension?

💳 Gæld & Lån:
• Hvordan kommer jeg ud af gæld?

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