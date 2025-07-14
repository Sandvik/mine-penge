import React, { useState, useRef, useEffect } from 'react';
import articlesData from '../data/articles.json';
import faqData from '../data/faqData';
import Fuse from 'fuse.js';

// Synonym-ordbog
const synonymMap = {
  'andelslån': ['boliglån til andelsbolig', 'lån til andelsbolig', 'andelsboliglån'],
  'boliglån': ['lån til bolig', 'ejerboliglån'],
  'lån': ['kredit', 'finansiering'],
  'opsparing': ['spare op', 'sparekonto'],
  'pension': ['folkepension', 'ratepension', 'livrente'],
  'andel': ['andelsbolig', 'andelshaver', 'andel'],
  'ejer': ['ejerbolig', 'ejerlejlighed', 'ejer'],
  'forskel': ['hvad er forskellen', 'sammenligning', 'vs', 'kontra', 'eller', 'forskellen på'],
  'bolig': ['hus', 'lejlighed', 'bopæl', 'boligtype'],
  'andelsbolig': ['andelsbolig', 'andelslejlighed', 'andelsbolig'],
  'ejerbolig': ['ejerbolig', 'ejerlejlighed', 'ejerbolig'],
  // Tilføj flere synonymer efter behov
};

// Simpel dansk stemming (fjerner almindelige endelser)
const stemText = (text) => {
  return text
    .split(/\s+/)
    .map(word => {
      // Fjern almindelige danske endelser
      if (word.endsWith('et') && word.length > 4) return word.slice(0, -2);
      if (word.endsWith('en') && word.length > 4) return word.slice(0, -2);
      if (word.endsWith('er') && word.length > 4) return word.slice(0, -2);
      if (word.endsWith('e') && word.length > 3) return word.slice(0, -1);
      return word;
    })
    .join(' ');
};

// Udvid brugerens spørgsmål med synonymer og stemming
const expandQuestion = (question) => {
  let expanded = question.toLowerCase();
  Object.entries(synonymMap).forEach(([key, syns]) => {
    syns.forEach(syn => {
      if (expanded.includes(syn)) expanded += ' ' + key;
      if (expanded.includes(key)) expanded += ' ' + syn;
    });
  });
  expanded = stemText(expanded);
  return expanded;
};

// Opsæt Fuse.js
const fuseOptions = {
  includeScore: true,
  threshold: 0.6, // Øget fra 0.5 til 0.6 for mere fleksibel matching
  keys: [
    { name: 'question', weight: 0.6 },
    { name: 'answer', weight: 0.2 },
    { name: 'tags', weight: 0.2 }
  ]
};
const fuse = new Fuse(faqData, fuseOptions);

// Forbedret matching med Fuse, stemming, synonymer og fallback substring-søgning
const findBestMatch = (userQuestion) => {
  const expanded = expandQuestion(userQuestion);
  const results = fuse.search(expanded);
  if (results.length > 0) {
    return results[0].item;
  }
  
  // Forbedret fallback: søg efter nøgleord i spørgsmål og tags
  const q = userQuestion.toLowerCase();
  
  // Søg efter specifikke nøgleord kombinationer
  const hasEjer = q.includes('ejer');
  const hasAndel = q.includes('andel');
  const hasForskel = q.includes('forskel') || q.includes('eller') || q.includes('vs');
  
  // Hvis brugeren spørger om ejer vs andel
  if ((hasEjer && hasAndel) || (hasEjer && hasForskel) || (hasAndel && hasForskel)) {
    const ejerAndelMatch = faqData.find(faq => 
      faq.question.toLowerCase().includes('andelsbolig') && 
      faq.question.toLowerCase().includes('ejerbolig')
    );
    if (ejerAndelMatch) return ejerAndelMatch;
  }
  
  // Generel fallback: simpel substring-søgning i spørgsmål og tags
  const fallback = faqData.find(faq =>
    (faq.question && faq.question.toLowerCase().includes(q)) ||
    (faq.tags && faq.tags.some(tag => q.includes(tag)))
  );
  if (fallback) return fallback;
  
  return null;
};

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

  // Ref til alle bot-svar
  const botMessageRefs = useRef({});

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

  // Scroll til starten af det nyeste bot-svar
  useEffect(() => {
    if (messages.length === 0) return;
    // Find sidste bot-svar
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].type === 'bot') {
        const ref = botMessageRefs.current[messages[i].id];
        if (ref && ref.scrollIntoView) {
          ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        break;
      }
    }
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
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-20 lg:transform-none w-72 lg:w-80 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="bg-blue-600 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm lg:text-base">MinePenge Assistent</h3>
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
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-20 lg:transform-none w-80 lg:w-96 h-80 lg:h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">💰</span>
              </div>
              <div>
                <h3 className="font-semibold text-sm lg:text-base">MinePenge Assistent</h3>
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
              ref={message.type === 'bot' ? (el) => botMessageRefs.current[message.id] = el : null}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[200px] lg:max-w-md px-3 lg:px-4 py-2 rounded-lg ${
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
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 lg:p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Skriv dit spørgsmål..."
              className="flex-1 px-2 lg:px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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