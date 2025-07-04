import React, { useState, useEffect } from 'react';
import { Search, FileText, Link, TrendingUp } from 'lucide-react';
import Footer from '../components/Footer';

function LandingPageGenerator() {
  const [searchTerms, setSearchTerms] = useState([]);
  const [articles, setArticles] = useState([]);
  const [generatedPages, setGeneratedPages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Popular long-tail search terms
  const popularSearchTerms = [
    'sådan sparer en studerende i københavn penge på mad 2025',
    'familieøkonomi med 3 børn og su realistisk opsparing',
    'hvordan sparer jeg 10000 kr om året på su',
    'billig ferie med børn danmark 2025',
    'opsparing til huskøb som studerende',
    'hvordan bliver jeg gældfri hurtigst muligt',
    'budget for familie med 2 børn og su',
    'investering for begyndere danmark 2025',
    'pension som studerende hvordan starter jeg',
    'spare penge på el og varme som studerende'
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

  const generateLandingPage = async (searchTerm) => {
    setLoading(true);
    
    try {
      // Find relevant articles for this search term
      const relevantArticles = articles.filter(article => {
        const term = searchTerm.toLowerCase();
        const title = article.title.toLowerCase();
        const summary = article.summary.toLowerCase();
        const tags = article.tags.join(' ').toLowerCase();
        
        return title.includes(term) || summary.includes(term) || tags.includes(term);
      });

      // Generate SEO-optimized content
      const pageContent = await generatePageContent(searchTerm, relevantArticles);
      
      const landingPage = {
        id: Date.now(),
        searchTerm,
        url: `/temaer/${searchTerm.replace(/\s+/g, '-').toLowerCase()}`,
        title: generatePageTitle(searchTerm),
        content: pageContent,
        relevantArticles: relevantArticles.slice(0, 5),
        generatedAt: new Date().toISOString()
      };

      setGeneratedPages(prev => [...prev, landingPage]);
      
    } catch (error) {
      console.error('Error generating landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePageTitle = (searchTerm) => {
    const titles = {
      'sådan sparer en studerende i københavn penge på mad 2025': 'Sådan sparer en studerende i København penge på mad 2025 - Komplet guide',
      'familieøkonomi med 3 børn og su realistisk opsparing': 'Familieøkonomi med 3 børn og SU: Realistisk opsparing i 2025',
      'hvordan sparer jeg 10000 kr om året på su': 'Hvordan sparer jeg 10.000 kr om året på SU? - 15 praktiske tips',
      'billig ferie med børn danmark 2025': 'Billig ferie med børn i Danmark 2025 - Komplet guide',
      'opsparing til huskøb som studerende': 'Opsparing til huskøb som studerende - Sådan starter du',
      'hvordan bliver jeg gældfri hurtigst muligt': 'Hvordan bliver jeg gældfri hurtigst muligt? - 7-trins plan',
      'budget for familie med 2 børn og su': 'Budget for familie med 2 børn og SU - Realistisk planlægning',
      'investering for begyndere danmark 2025': 'Investering for begyndere i Danmark 2025 - Komplet guide',
      'pension som studerende hvordan starter jeg': 'Pension som studerende: Hvordan starter jeg? - Komplet guide',
      'spare penge på el og varme som studerende': 'Sådan sparer du penge på el og varme som studerende'
    };
    
    return titles[searchTerm] || `${searchTerm} - MinePenge.dk`;
  };

  const generatePageContent = async (searchTerm, relevantArticles) => {
    // Create comprehensive content based on search term and articles
    let content = `# ${generatePageTitle(searchTerm)}\n\n`;
    
    content += `## Introduktion\n\n`;
    content += `Denne guide hjælper dig med at forstå og implementere strategier for ${searchTerm.toLowerCase()}. Vi har samlet de bedste råd og tips fra eksperter og erfaringer.\n\n`;
    
    content += `## Hvorfor er dette vigtigt?\n\n`;
    content += `At have styr på din økonomi er afgørende for din fremtid. Uanset om du er studerende, har børn eller planlægger store køb, kan de rigtige strategier spare dig for tusindvis af kroner årligt.\n\n`;
    
    if (relevantArticles.length > 0) {
      content += `## Relaterede artikler\n\n`;
      relevantArticles.forEach((article, index) => {
        content += `### ${index + 1}. [${article.title}](${article.url})\n\n`;
        content += `${article.summary}\n\n`;
        content += `**Kilde:** ${article.source} | **Relevans:** ${article.relevance_score}\n\n`;
      });
    }
    
    content += `## Praktiske tips\n\n`;
    content += `1. **Start med et budget** - Få overblik over din økonomi\n`;
    content += `2. **Sæt mål** - Definer hvad du vil opnå\n`;
    content += `3. **Følg op** - Hold øje med dine fremskridt\n`;
    content += `4. **Juster løbende** - Tilpas strategier efter behov\n\n`;
    
    content += `## Konklusion\n\n`;
    content += `Med de rigtige strategier og lidt disciplin kan du opnå dine økonomiske mål. Husk at starte småt og bygge videre på succeser.\n\n`;
    
    content += `*Opdateret: ${new Date().toLocaleDateString('da-DK')}*\n`;
    
    return content;
  };

  const generateAllPages = async () => {
    setLoading(true);
    for (const term of popularSearchTerms) {
      await generateLandingPage(term);
      // Small delay to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-nordic-50 flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-nordic-900 mb-4">
                Landing Page Generator
              </h1>
              <p className="text-lg text-nordic-600">
                Automatisk generering af SEO-optimerede landing pages baseret på søgeord
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <div className="flex items-center">
                  <Search className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-nordic-900">{popularSearchTerms.length}</p>
                    <p className="text-sm text-nordic-600">Søgeord</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-nordic-900">{generatedPages.length}</p>
                    <p className="text-sm text-nordic-600">Genererede sider</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <div className="flex items-center">
                  <Link className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-nordic-900">{articles.length}</p>
                    <p className="text-sm text-nordic-600">Artikler</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
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
                  onClick={generateAllPages}
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Genererer sider...' : 'Generer alle landing pages'}
                </button>
                <button
                  onClick={() => setGeneratedPages([])}
                  className="px-6 py-3 border border-nordic-300 rounded-lg hover:bg-nordic-50 transition-colors"
                >
                  Ryd alle
                </button>
              </div>
            </div>

            {/* Generated Pages */}
            {generatedPages.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-nordic-900">
                  Genererede Landing Pages
                </h2>
                {generatedPages.map((page) => (
                  <div key={page.id} className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-nordic-900 mb-2">
                          {page.title}
                        </h3>
                        <p className="text-sm text-nordic-600 mb-2">
                          URL: <code className="bg-nordic-100 px-2 py-1 rounded">{page.url}</code>
                        </p>
                        <p className="text-sm text-nordic-500">
                          Søgeord: "{page.searchTerm}"
                        </p>
                      </div>
                      <span className="text-xs text-nordic-400">
                        {new Date(page.generatedAt).toLocaleDateString('da-DK')}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-nordic-700 mb-2">
                        Relaterede artikler ({page.relevantArticles.length})
                      </h4>
                      <div className="space-y-2">
                        {page.relevantArticles.map((article, index) => (
                          <div key={article.id} className="flex items-center text-sm">
                            <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                              {index + 1}
                            </span>
                            <span className="flex-1">{article.title}</span>
                            <span className="text-nordic-400 text-xs">Relevans: {article.relevance_score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                        Se side
                      </button>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Kopier URL
                      </button>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        SEO Analyse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Search Terms List */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <h3 className="text-lg font-semibold text-nordic-900 mb-4">
                Populære søgeord til landing pages
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularSearchTerms.map((term, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-nordic-50 rounded-lg">
                    <span className="text-sm text-nordic-700 flex-1">{term}</span>
                    <button
                      onClick={() => generateLandingPage(term)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Generer
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default LandingPageGenerator; 