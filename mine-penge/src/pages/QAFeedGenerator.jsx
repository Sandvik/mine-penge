import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, TrendingUp, Zap } from 'lucide-react';

function QAFeedGenerator() {
  const [articles, setArticles] = useState([]);
  const [generatedQAs, setGeneratedQAs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Common "how to" question patterns
  const questionPatterns = [
    'hvordan sparer jeg penge på',
    'hvordan starter jeg med',
    'hvordan bliver jeg bedre til',
    'hvordan planlægger jeg',
    'hvordan investerer jeg i',
    'hvordan budgetterer jeg for',
    'hvordan undgår jeg',
    'hvordan optimerer jeg',
    'hvordan sikrer jeg',
    'hvordan forbedrer jeg'
  ];

  const topics = [
    'mad og dagligvarer',
    'transport og rejser',
    'bolig og husleje',
    'investering og opsparing',
    'pension og fremtid',
    'gæld og lån',
    'forsikring og sikkerhed',
    'skat og afgifter',
    'børn og familie',
    'studie og uddannelse'
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/articles');
      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const generateQA = async (question, topic) => {
    setLoading(true);
    
    try {
      // Find relevant articles for this topic
      const relevantArticles = articles.filter(article => {
        const articleText = `${article.title} ${article.summary} ${article.tags.join(' ')}`.toLowerCase();
        return articleText.includes(topic.toLowerCase());
      });

      // Generate answer based on articles
      const answer = await generateAnswer(question, topic, relevantArticles);
      
      const qa = {
        id: Date.now() + Math.random(),
        question,
        answer,
        topic,
        url: `/spørgsmål/${question.replace(/\s+/g, '-').toLowerCase()}`,
        relevantArticles: relevantArticles.slice(0, 3),
        generatedAt: new Date().toISOString()
      };

      setGeneratedQAs(prev => [...prev, qa]);
      
    } catch (error) {
      console.error('Error generating QA:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAnswer = async (question, topic, relevantArticles) => {
    let answer = `## Svar på: ${question}\n\n`;
    
    answer += `### Kort svar\n\n`;
    answer += `For at ${question.toLowerCase().replace('hvordan ', '')} skal du følge disse trin:\n\n`;
    
    answer += `### Detaljeret guide\n\n`;
    
    if (relevantArticles.length > 0) {
      answer += `#### Baseret på ekspertartikler\n\n`;
      relevantArticles.forEach((article, index) => {
        answer += `**${index + 1}. ${article.title}**\n\n`;
        answer += `${article.summary}\n\n`;
        answer += `*Kilde: ${article.source}*\n\n`;
      });
    }
    
    answer += `#### Praktiske tips\n\n`;
    answer += `1. **Start med research** - Få overblik over mulighederne\n`;
    answer += `2. **Sæt realistiske mål** - Definer hvad du vil opnå\n`;
    answer += `3. **Lav en plan** - Strukturer din tilgang\n`;
    answer += `4. **Følg op** - Hold øje med resultaterne\n`;
    answer += `5. **Juster løbende** - Tilpas efter behov\n\n`;
    
    answer += `#### Ofte stillede spørgsmål\n\n`;
    answer += `**Q: Hvor lang tid tager det?**\n`;
    answer += `A: Det afhænger af din situation, men de fleste ser resultater inden for 3-6 måneder.\n\n`;
    
    answer += `**Q: Hvad koster det?**\n`;
    answer += `A: Du kan starte med små beløb og øge gradvist efter behov.\n\n`;
    
    answer += `**Q: Er det sikkert?**\n`;
    answer += `A: Ja, når du følger de anbefalede strategier og tager det i dit eget tempo.\n\n`;
    
    answer += `### Konklusion\n\n`;
    answer += `Med den rigtige tilgang og lidt tålmodighed kan du opnå dine mål. Husk at starte småt og bygge videre på succeser.\n\n`;
    
    answer += `*Opdateret: ${new Date().toLocaleDateString('da-DK')}*\n`;
    
    return answer;
  };

  const generateAllQAs = async () => {
    setLoading(true);
    const allQAs = [];
    
    for (const pattern of questionPatterns) {
      for (const topic of topics) {
        const question = `${pattern} ${topic}?`;
        allQAs.push({ question, topic });
      }
    }
    
    // Generate QAs in batches to avoid overwhelming
    for (let i = 0; i < allQAs.length; i += 5) {
      const batch = allQAs.slice(i, i + 5);
      await Promise.all(batch.map(qa => generateQA(qa.question, qa.topic)));
      await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between batches
    }
    
    setLoading(false);
  };

  const getQAsByTopic = (topic) => {
    return generatedQAs.filter(qa => qa.topic === topic);
  };

  return (
    <div className="min-h-screen bg-nordic-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-nordic-900 mb-4">
              Q&A Feed Generator
            </h1>
            <p className="text-lg text-nordic-600">
              Automatisk generering af "Hvordan..." spørgsmål og svar for SEO
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <div className="flex items-center">
                <HelpCircle className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-nordic-900">{questionPatterns.length * topics.length}</p>
                  <p className="text-sm text-nordic-600">Mulige Q&As</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-nordic-900">{generatedQAs.length}</p>
                  <p className="text-sm text-nordic-600">Genererede Q&As</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-nordic-900">{topics.length}</p>
                  <p className="text-sm text-nordic-600">Emner</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-nordic-900">SEO</p>
                  <p className="text-sm text-nordic-600">Optimeret</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={generateAllQAs}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Genererer Q&As...' : 'Generer alle Q&As'}
              </button>
              <button
                onClick={() => setGeneratedQAs([])}
                className="px-6 py-3 border border-nordic-300 rounded-lg hover:bg-nordic-50 transition-colors"
              >
                Ryd alle
              </button>
            </div>
          </div>

          {/* Generated Q&As by Topic */}
          {generatedQAs.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-nordic-900">
                Genererede Q&As efter emne
              </h2>
              
              {topics.map(topic => {
                const topicQAs = getQAsByTopic(topic);
                if (topicQAs.length === 0) return null;
                
                return (
                  <div key={topic} className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                    <h3 className="text-lg font-semibold text-nordic-900 mb-4 capitalize">
                      {topic}
                    </h3>
                    <div className="space-y-4">
                      {topicQAs.map((qa) => (
                        <div key={qa.id} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-nordic-900 mb-2">
                            {qa.question}
                          </h4>
                          <p className="text-sm text-nordic-600 mb-2">
                            URL: <code className="bg-nordic-100 px-2 py-1 rounded">{qa.url}</code>
                          </p>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors">
                              Se svar
                            </button>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors">
                              Kopier URL
                            </button>
                            <span className="text-xs text-nordic-400">
                              {qa.relevantArticles.length} relaterede artikler
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Question Patterns */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
            <h3 className="text-lg font-semibold text-nordic-900 mb-4">
              Spørgsmålsmønstre
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questionPatterns.map((pattern, index) => (
                <div key={index} className="p-3 bg-nordic-50 rounded-lg">
                  <span className="text-sm text-nordic-700">{pattern}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
            <h3 className="text-lg font-semibold text-nordic-900 mb-4">
              Emner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic, index) => (
                <div key={index} className="p-3 bg-nordic-50 rounded-lg">
                  <span className="text-sm text-nordic-700 capitalize">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QAFeedGenerator; 