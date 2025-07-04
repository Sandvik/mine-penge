import React, { useState, useEffect } from 'react';
import { Network, Link, Map, ArrowRight } from 'lucide-react';

function InternalLinkStructure() {
  const [articles, setArticles] = useState([]);
  const [linkStructure, setLinkStructure] = useState({});
  const [loading, setLoading] = useState(false);

  // Define site structure hierarchy
  const siteStructure = {
    'hjem': {
      title: 'Hjem',
      url: '/',
      children: ['artikler', 'temaer', 'spørgsmål', 'værktøjer']
    },
    'artikler': {
      title: 'Artikler',
      url: '/artikler',
      children: ['nyeste', 'populære', 'favoritter']
    },
    'temaer': {
      title: 'Temaer',
      url: '/temaer',
      children: [
        'studerende-økonomi',
        'familieøkonomi', 
        'investering',
        'pension',
        'gæld',
        'budget',
        'spare-tips',
        'bolig',
        'transport',
        'mad-og-dagligvarer'
      ]
    },
    'spørgsmål': {
      title: 'Spørgsmål & Svar',
      url: '/spørgsmål',
      children: [
        'hvordan-sparer-jeg',
        'hvordan-starter-jeg',
        'hvordan-planlægger-jeg',
        'hvordan-investerer-jeg',
        'hvordan-budgetterer-jeg'
      ]
    },
    'værktøjer': {
      title: 'Værktøjer',
      url: '/værktøjer',
      children: ['budget-beregner', 'spare-plan', 'investerings-kalkulator']
    }
  };

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

  const generateInternalLinks = async () => {
    setLoading(true);
    
    try {
      const structure = {};
      
      // Generate links for each section
      for (const [key, section] of Object.entries(siteStructure)) {
        structure[key] = {
          ...section,
          internalLinks: await generateSectionLinks(section, articles),
          breadcrumbs: generateBreadcrumbs(key),
          relatedPages: findRelatedPages(key, siteStructure)
        };
      }
      
      setLinkStructure(structure);
      
    } catch (error) {
      console.error('Error generating internal links:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSectionLinks = async (section, articles) => {
    const links = [];
    
    // Add parent links
    if (section.children) {
      section.children.forEach(child => {
        const childSection = siteStructure[child];
        if (childSection) {
          links.push({
            type: 'parent',
            title: childSection.title,
            url: childSection.url,
            description: `Se alle ${childSection.title.toLowerCase()}`
          });
        }
      });
    }
    
    // Add related article links
    const relevantArticles = articles.filter(article => {
      const articleText = `${article.title} ${article.summary} ${article.tags.join(' ')}`.toLowerCase();
      const sectionText = section.title.toLowerCase();
      return articleText.includes(sectionText) || article.tags.some(tag => tag.toLowerCase().includes(sectionText));
    });
    
    relevantArticles.slice(0, 5).forEach(article => {
      links.push({
        type: 'article',
        title: article.title,
        url: `/artikler/${article.id}`,
        description: article.summary,
        relevance: article.relevance_score
      });
    });
    
    return links;
  };

  const generateBreadcrumbs = (sectionKey) => {
    const breadcrumbs = [];
    let currentKey = sectionKey;
    
    while (currentKey) {
      const section = siteStructure[currentKey];
      if (section) {
        breadcrumbs.unshift({
          title: section.title,
          url: section.url
        });
      }
      
      // Find parent
      for (const [key, parentSection] of Object.entries(siteStructure)) {
        if (parentSection.children && parentSection.children.includes(currentKey)) {
          currentKey = key;
          break;
        }
        currentKey = null;
      }
    }
    
    return breadcrumbs;
  };

  const findRelatedPages = (sectionKey, structure) => {
    const related = [];
    const currentSection = structure[sectionKey];
    
    if (!currentSection) return related;
    
    // Find siblings
    for (const [key, section] of Object.entries(structure)) {
      if (key !== sectionKey && section.children && currentSection.children) {
        const commonChildren = section.children.filter(child => 
          currentSection.children.includes(child)
        );
        if (commonChildren.length > 0) {
          related.push({
            type: 'sibling',
            title: section.title,
            url: section.url,
            commonTopics: commonChildren.length
          });
        }
      }
    }
    
    return related;
  };

  const generateSitemap = () => {
    const sitemap = [];
    
    for (const [key, section] of Object.entries(linkStructure)) {
      sitemap.push({
        url: section.url,
        title: section.title,
        priority: key === 'hjem' ? 1.0 : 0.8,
        changefreq: 'weekly'
      });
      
      if (section.children) {
        section.children.forEach(child => {
          const childSection = siteStructure[child];
          if (childSection) {
            sitemap.push({
              url: childSection.url,
              title: childSection.title,
              priority: 0.6,
              changefreq: 'weekly'
            });
          }
        });
      }
    }
    
    return sitemap;
  };

  return (
    <div className="min-h-screen bg-nordic-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-nordic-900 mb-4">
              Intern Linkstruktur
            </h1>
            <p className="text-lg text-nordic-600">
              Automatisk generering af intern linking og hierarkisk navigation
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <div className="flex items-center">
                <Network className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-nordic-900">{Object.keys(siteStructure).length}</p>
                  <p className="text-sm text-nordic-600">Hovedsider</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <div className="flex items-center">
                <Link className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-nordic-900">
                    {Object.values(siteStructure).reduce((sum, section) => 
                      sum + (section.children ? section.children.length : 0), 0
                    )}
                  </p>
                  <p className="text-sm text-nordic-600">Undersider</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <div className="flex items-center">
                <Map className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-nordic-900">{articles.length}</p>
                  <p className="text-sm text-nordic-600">Artikler</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <div className="flex items-center">
                <ArrowRight className="h-8 w-8 text-orange-600 mr-3" />
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
                onClick={generateInternalLinks}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Genererer links...' : 'Generer intern linkstruktur'}
              </button>
              <button
                onClick={() => setLinkStructure({})}
                className="px-6 py-3 border border-nordic-300 rounded-lg hover:bg-nordic-50 transition-colors"
              >
                Ryd alle
              </button>
            </div>
          </div>

          {/* Site Structure */}
          {Object.keys(linkStructure).length > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold text-nordic-900">
                Site Struktur med Intern Linking
              </h2>
              
              {Object.entries(linkStructure).map(([key, section]) => (
                <div key={key} className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-nordic-900 mb-2">
                        {section.title}
                      </h3>
                      <p className="text-sm text-nordic-600 mb-2">
                        URL: <code className="bg-nordic-100 px-2 py-1 rounded">{section.url}</code>
                      </p>
                      
                      {/* Breadcrumbs */}
                      {section.breadcrumbs && section.breadcrumbs.length > 0 && (
                        <div className="flex items-center text-sm text-nordic-500 mb-3">
                          {section.breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                              <a href={crumb.url} className="hover:text-blue-600 transition-colors">
                                {crumb.title}
                              </a>
                              {index < section.breadcrumbs.length - 1 && (
                                <span className="mx-2">/</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Internal Links */}
                  {section.internalLinks && section.internalLinks.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-nordic-700 mb-3">
                        Intern links ({section.internalLinks.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {section.internalLinks.map((link, index) => (
                          <div key={index} className="p-3 bg-nordic-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <a 
                                  href={link.url}
                                  className="text-sm font-medium text-nordic-900 hover:text-blue-600 transition-colors"
                                >
                                  {link.title}
                                </a>
                                {link.description && (
                                  <p className="text-xs text-nordic-600 mt-1">
                                    {link.description}
                                  </p>
                                )}
                              </div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                link.type === 'parent' 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'bg-green-100 text-green-600'
                              }`}>
                                {link.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Related Pages */}
                  {section.relatedPages && section.relatedPages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-nordic-700 mb-3">
                        Relaterede sider ({section.relatedPages.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {section.relatedPages.map((page, index) => (
                          <a
                            key={index}
                            href={page.url}
                            className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs hover:bg-purple-200 transition-colors"
                          >
                            {page.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Sitemap Preview */}
          {Object.keys(linkStructure).length > 0 && (
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
              <h3 className="text-lg font-semibold text-nordic-900 mb-4">
                Sitemap Preview
              </h3>
              <div className="space-y-2">
                {generateSitemap().map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-nordic-50 rounded">
                    <div className="flex-1">
                      <a href={item.url} className="text-sm text-nordic-900 hover:text-blue-600 transition-colors">
                        {item.title}
                      </a>
                      <p className="text-xs text-nordic-500">{item.url}</p>
                    </div>
                    <div className="text-xs text-nordic-400">
                      Priority: {item.priority} | Freq: {item.changefreq}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Site Structure Overview */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
            <h3 className="text-lg font-semibold text-nordic-900 mb-4">
              Site Struktur Oversigt
            </h3>
            <div className="space-y-4">
              {Object.entries(siteStructure).map(([key, section]) => (
                <div key={key} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium text-nordic-900 mb-2">
                    {section.title}
                  </h4>
                  <p className="text-sm text-nordic-600 mb-2">{section.url}</p>
                  {section.children && (
                    <div className="flex flex-wrap gap-2">
                      {section.children.map((child, index) => (
                        <span key={index} className="text-xs bg-nordic-100 text-nordic-600 px-2 py-1 rounded">
                          {child}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InternalLinkStructure; 