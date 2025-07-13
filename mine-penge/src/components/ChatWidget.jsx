import React, { useState, useRef, useEffect } from 'react';
import articlesData from '../data/articles.json';

const ChatWidget = () => {
  const [messages, setMessages] = useState(() => {
    // Load messages from localStorage on component mount
    const savedMessages = localStorage.getItem('chatWidgetMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        return parsed.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
    // Default initial message
    return [
      {
        id: 1,
        type: 'bot',
        text: 'Hej! Jeg er MinePenge assistenten. Hvordan kan jeg hjælpe dig med din økonomi i dag? 💰',
        timestamp: new Date()
      }
    ];
  });
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    // Check localStorage for saved state, default to true (minimized)
    const saved = localStorage.getItem('chatWidgetMinimized');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showInfoModal, setShowInfoModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Get articles from imported data
  const articles = articlesData.articles || [];

  // Find related articles based on user question
  const findRelatedArticles = (userQuestion, limit = 2) => {
    const normalizedQuestion = userQuestion.toLowerCase();
    
    // Score articles based on multiple factors
    const scoredArticles = articles.map(article => {
      let score = 0;
      
      // Check minepenge_tags (highest weight)
      if (article.minepenge_tags && Array.isArray(article.minepenge_tags)) {
        const tagMatches = article.minepenge_tags.filter(tag => 
          normalizedQuestion.includes(tag.toLowerCase())
        );
        score += tagMatches.length * 10;
      }
      
      // Check title (medium weight)
      if (article.title) {
        const titleWords = article.title.toLowerCase().split(' ');
        const questionWords = normalizedQuestion.split(' ');
        const titleMatches = titleWords.filter(word => 
          questionWords.some(qWord => qWord.length > 2 && word.includes(qWord))
        );
        score += titleMatches.length * 5;
      }
      
      // Check summary (lower weight)
      if (article.summary) {
        const summaryWords = article.summary.toLowerCase().split(' ');
        const questionWords = normalizedQuestion.split(' ');
        const summaryMatches = summaryWords.filter(word => 
          questionWords.some(qWord => qWord.length > 3 && word.includes(qWord))
        );
        score += summaryMatches.length * 2;
      }
      
      // Bonus for recent articles
      if (article.date_published) {
        const articleDate = new Date(article.date_published);
        const now = new Date();
        const daysDiff = (now - articleDate) / (1000 * 60 * 60 * 24);
        if (daysDiff < 365) score += 1; // Bonus for articles less than 1 year old
      }
      
      return { ...article, score };
    });
    
    // Filter articles with score > 0 and sort by score
    const relevantArticles = scoredArticles
      .filter(article => article.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return relevantArticles;
  };

  // FAQ data fra alle kategorier
  const faqData = [
    // 💰 Investering
    {
      id: 'investering-1',
      question: 'Hvordan starter jeg med at investere som begynder?',
      answer: `Hej! Det er super at du vil komme i gang med at investere! 🎉

Som begynder er det vigtigt at starte simpelt:

1️⃣ Start med månedsopsparing - 100-500 kr/måned
2️⃣ Vælg brede fonde - Sparindex INDEX Globale Aktier
3️⃣ Brug Nordnet eller Saxo - Gratis månedsopsparing
4️⃣ Tålmodighed - Investering er langsigtet

💡 Tip: Du behøver ikke være ekspert for at starte. Månedsopsparing er perfekt til begyndere!

Du er på rette spor ved at spørge - det er første skridt til økonomisk frihed! 🚀

🏠 Vil du se vores investeringsberegner?
[📊 Åbn investeringsberegner](/investering-guide#beregner)

📚 Læs mere i vores investering guide:
[📖 Investering guide](/investering-guide)`,
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

🎯 Velegnet til langsigtet investering i f.eks. Sparindex Globale Aktier.

Ah, skat - det kedelige emne vi alle skal forholde os til! 😅 Men hey, 17% er meget bedre end normale 27-42% skat.

Du gør det rigtigt ved at spørge! 👍`,
      tags: ['ASK', 'aktiesparekonto', 'skat', 'skattefordel', '17%'],
      category: 'investering'
    },
    {
      id: 'investering-5',
      question: 'Hvilke fonde skal jeg vælge som begynder?',
      answer: `Fantastisk spørgsmål! Som begynder er det vigtigt at starte simpelt. Du er på rette spor! 🎯

Top 3 fonde til begyndere:

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

💡 Start med: 100% Sparindex INDEX Globale Aktier, og tilføj andre senere.

Det kan være svært at komme i gang, men du har taget det vigtigste skridt - at spørge! Du klarer det! 🚀

💰 Vil du se vores investeringsberegner?
[📊 Åbn investeringsberegner](/investering-guide#beregner)`,
      tags: ['fonde', 'sparindex', 'begynder', 'vælg', 'hvilke'],
      category: 'investering'
    },
    // 🏠 Bolig & Hus
    {
      id: 'bolig-1',
      question: 'Hvordan får jeg boliglån?',
      answer: `God planlægning! 🏠 Her er din vej til boliglån:

Sådan får du boliglån:

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

💡 Tip: Start med at spare op og få lånebevis, før du begynder at kigge på boliger.

Du er på rette spor ved at spørge! Boligkøb er en stor beslutning, og det er smart at forberede sig. 🎯

🏠 Vil du se vores boligberegner?
[📊 Åbn boligberegner](/bolig-hus-guide#beregner)

📚 Læs mere i vores bolig guide:
[📖 Bolig & Hus guide](/bolig-hus-guide)`,
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

🎯 Start tidligt - Jo før du begynder at spare, jo lettere bliver det!

Ja, det kan virke som et stort beløb, men husk - mange har gjort det før dig! Du klarer det! 💪

🏠 Vil du se vores boligberegner?
[📊 Åbn boligberegner](/bolig-hus-guide#beregner)`,
      tags: ['spareop', 'udbetaling', 'bolig', 'hus', 'beløb'],
      category: 'bolig'
    },
    // 📊 Budget & Økonomi
    {
      id: 'budget-1',
      question: 'Hvordan laver jeg et budget?',
      answer: `Fantastisk spørgsmål! At lave et budget er første skridt til økonomisk kontrol. Du er på rette spor! 🎯

Sådan laver du et budget:

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

💡 Det kan være svært at komme i gang, men du har taget det vigtigste skridt - at spørge!

Du klarer det! Start småt og bliv bedre over tid. 🚀

📊 Vil du se vores budgetberegner?
[📊 Åbn budgetberegner](/family-finance-guide#beregner)

📚 Læs mere i vores familieøkonomi guide:
[📖 Familieøkonomi guide](/family-finance-guide)`,
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

💡 Start med nødopsparing, derefter målbaseret opsparing.

Det kan virke som meget, men husk - alle starter et sted! Du er på rette spor ved at spørge. 🌟

📊 Vil du se vores budgetberegner?
[📊 Åbn budgetberegner](/family-finance-guide#beregner)`,
      tags: ['spareop', 'nødopsparing', 'mål', 'beløb', 'regler'],
      category: 'budget'
    },
    // 🎓 Studerende
    {
      id: 'studerende-1',
      question: 'Hvordan får jeg styr på min økonomi som studerende?',
      answer: `Økonomi for studerende - det kan være en udfordring, men du er ikke alene! 🎓

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

🎯 Mål: Spar 500-1.000 kr/måned til nødopsparing.

Det kan være svært at komme i gang, men du har taget det vigtigste skridt - at spørge! Du klarer det! 💪

📚 Læs mere i vores studerende guide:
[📖 Studerende investering guide](/student-investment-guide)`,
      tags: ['studerende', 'SU', 'budget', 'økonomi', 'husleje'],
      category: 'studerende'
    },
    // 👴 Pension
    {
      id: 'pension-1',
      question: 'Hvor meget skal jeg spare op til pension?',
      answer: `Pensionsopsparing - det emne vi alle tænker på, men ikke altid gør noget ved! 😅

💰 Generel regel: 10-15% af din indkomst
- Hvis du tjener 30.000 kr/måned = 3.000-4.500 kr/måned

📊 Sådan fordeler du det:
- Arbejdsgiverpension: 8-12% (automatisk)
- Privat pension: 2-3% (frivilligt)
- Frie midler: 0-5% (fleksibelt)

🎯 Mål: 70% af din nuværende indkomst som pensionist
- Hvis du tjener 30.000 kr nu = 21.000 kr som pensionist

💡 Start tidligt - renters rente gør en kæmpe forskel!

Ja, pension kan virke langt væk, men jo tidligere du starter, jo lettere bliver det! Du er på rette spor! 🚀`,
      tags: ['pension', 'opsparing', 'arbejdsgiverpension', 'privat pension', 'beløb'],
      category: 'pension'
    },
    // 💳 Gæld & Lån
    {
      id: 'gæld-1',
      question: 'Hvordan kommer jeg ud af gæld?',
      answer: `Det kan være svært at komme ud af gæld, men du er ikke alene! Du har taget det vigtigste skridt - at spørge. 💪

Sådan kommer du ud af gæld:

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

💡 Fokuser på én gæld ad gangen - det giver resultater!

Det kan være en hård vej, men du klarer det! Fokuser på én dag ad gangen. 🌟`,
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

  // Parse links in text and convert to clickable elements
  const parseLinks = (text) => {
    // Match markdown-style links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      // Add the link
      parts.push({
        type: 'link',
        text: match[1],
        url: match[2]
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
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
      const relatedArticles = findRelatedArticles(inputValue, 2);
      
      let botResponse;
      if (match) {
        botResponse = {
          id: Date.now() + 1,
          type: 'bot',
          text: match.answer,
          timestamp: new Date(),
          relatedQuestion: match.question,
          relatedArticles: relatedArticles
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
          timestamp: new Date(),
          relatedArticles: relatedArticles
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Clear chat history
  const clearChatHistory = () => {
    const initialMessage = {
      id: Date.now(),
      type: 'bot',
      text: 'Hej! Jeg er MinePenge assistenten. Hvordan kan jeg hjælpe dig med din økonomi i dag? 💰',
      timestamp: new Date()
    };
    setMessages([initialMessage]);
    localStorage.setItem('chatWidgetMessages', JSON.stringify([initialMessage]));
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    // Limit to last 50 messages to prevent localStorage from getting too large
    const messagesToSave = messages.slice(-50);
    localStorage.setItem('chatWidgetMessages', JSON.stringify(messagesToSave));
  }, [messages]);

  // Info Modal Component
  const InfoModal = () => {
    if (!showInfoModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">💡 Sådan bruger du MinePenge Assistenten</h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Jeg kan hjælpe dig med spørgsmål om alle aspekter af din økonomi. Her er nogle eksempler på spørgsmål du kan stille:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">💰 Investering:</h3>
                  <ul className="text-blue-800 space-y-1 text-sm">
                    <li>• "Hvordan starter jeg med at investere?"</li>
                    <li>• "Hvad er ASK?"</li>
                    <li>• "Hvilke fonde skal jeg vælge?"</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">🏠 Bolig & Hus:</h3>
                  <ul className="text-green-800 space-y-1 text-sm">
                    <li>• "Hvordan får jeg boliglån?"</li>
                    <li>• "Hvor meget skal jeg spare op til bolig?"</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">📊 Budget & Økonomi:</h3>
                  <ul className="text-purple-800 space-y-1 text-sm">
                    <li>• "Hvordan laver jeg et budget?"</li>
                    <li>• "Hvor meget skal jeg spare op?"</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-900 mb-2">🎓 Studerende:</h3>
                  <ul className="text-yellow-800 space-y-1 text-sm">
                    <li>• "Hvordan får jeg styr på min økonomi som studerende?"</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">👴 Pension:</h3>
                  <ul className="text-orange-800 space-y-1 text-sm">
                    <li>• "Hvor meget skal jeg spare op til pension?"</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2">💳 Gæld & Lån:</h3>
                  <ul className="text-red-800 space-y-1 text-sm">
                    <li>• "Hvordan kommer jeg ud af gæld?"</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Tips:</h3>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Du kan spørge på mange måder - jeg forstår forskellige formuleringer</li>
                  <li>• Hvis jeg ikke forstår dit spørgsmål, vil jeg foreslå relevante emner</li>
                  <li>• Besøg vores FAQ side for endnu flere spørgsmål og svar</li>
                </ul>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={clearChatHistory}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  🗑️ Ryd chat historik
                </button>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Luk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If minimized, show only header
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-20 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">💰</span>
              </div>
              <div>
                <h3 className="font-semibold">MinePenge Assistent</h3>
                <p className="text-xs opacity-90">Klik for at åbne chat</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setIsMinimized(false);
                localStorage.setItem('chatWidgetMinimized', 'false');
              }}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-20 w-96 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">💰</span>
              </div>
              <div>
                <h3 className="font-semibold">MinePenge Assistent</h3>
                <p className="text-xs opacity-90">
                  {messages.length > 1 ? `${messages.length - 1} beskeder` : 'Spørg om økonomi'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowInfoModal(true)}
                className="text-white hover:text-gray-200 transition-colors p-1"
                title="Hvordan bruger jeg assistenten?"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button 
                onClick={() => {
                  setIsMinimized(true);
                  localStorage.setItem('chatWidgetMinimized', 'true');
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
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
                {message.text.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {parseLinks(line).map((part, partIndex) => (
                      <React.Fragment key={partIndex}>
                        {part.type === 'text' ? (
                          <span>{part.content}</span>
                        ) : (
                          <a
                            href={part.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 hover:text-blue-900 underline"
                            onClick={(e) => e.stopPropagation()} // Prevent parent click
                          >
                            {part.text}
                          </a>
                        )}
                      </React.Fragment>
                    ))}
                    <br />
                  </React.Fragment>
                ))}
                
                {message.relatedQuestion && (
                  <div className="mt-2 text-xs opacity-75">
                    Relateret: {message.relatedQuestion}
                  </div>
                )}
                
                {/* Related Articles */}
                {message.relatedArticles && message.relatedArticles.length > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 text-xs">📖 Relaterede artikler:</h4>
                    {message.relatedArticles.map(article => (
                      <a 
                        key={article.article_id}
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-700 hover:text-blue-900 text-xs mb-1 truncate"
                        title={article.title}
                      >
                        • {article.title}
                      </a>
                    ))}
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
      
      {/* Info Modal */}
      <InfoModal />
    </>
  );
};

export default ChatWidget; 