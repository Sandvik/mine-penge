import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Breadcrumbs from '../components/Breadcrumbs';
import faqData from '../data/faqData';

const groupedFaqData = faqData.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {});

const categoryMeta = {
  investering: { title: '💰 Investering', icon: '💰' },
  bolig: { title: '🏠 Bolig & Hus', icon: '🏠' },
  budget: { title: '📊 Budget & Økonomi', icon: '📊' },
  studerende: { title: '🎓 Studerende', icon: '🎓' },
  pension: { title: '👴 Pension', icon: '👴' },
  gæld: { title: '💳 Gæld & Lån', icon: '💳' },
};

const FAQ = () => {
  const [openCategory, setOpenCategory] = useState(null);
  const [search, setSearch] = useState('');

  // Filtrér spørgsmål baseret på søgning (inkl. kategori og tags)
  const filteredFaqData = Object.entries(groupedFaqData).reduce((acc, [catKey, questions]) => {
    const s = search.trim().toLowerCase();
    // Hvis søgning matcher kategoriens navn, vis alle spørgsmål i kategorien
    const catTitle = categoryMeta[catKey]?.title?.toLowerCase() || '';
    if (s && catTitle.includes(s)) {
      acc[catKey] = questions;
      return acc;
    }
    // Ellers filtrér på spørgsmål, svar og tags
    const filteredQuestions = questions.filter(q => {
      if (!s) return true;
      const tagMatch = (q.tags || []).some(tag => tag.toLowerCase().includes(s));
      return (
        q.question.toLowerCase().includes(s) ||
        q.answer.toLowerCase().includes(s) ||
        tagMatch
      );
    });
    if (filteredQuestions.length > 0) {
      acc[catKey] = filteredQuestions;
    }
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>Ofte Stillede Spørgsmål - MinePenge.nu</title>
        <meta name="description" content="Find svar på de mest almindelige spørgsmål om investering, bolig, budget og økonomi. Søgbar FAQ med praktiske råd og guides." />
        <meta property="og:title" content="Ofte Stillede Spørgsmål - MinePenge.nu" />
        <meta property="og:description" content="Find svar på de mest almindelige spørgsmål om investering, bolig, budget og økonomi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://minepenge.nu/faq" />
        <link rel="canonical" href="https://minepenge.nu/faq" />
      </Helmet>

      <div className="min-h-screen bg-nordic-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Breadcrumbs 
              items={[
                { label: 'Hjem', href: '/' },
                { label: 'FAQ', href: '/faq' }
              ]} 
            />
            <div className="mt-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ❓ Ofte Stillede Spørgsmål
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto">
                Find svar på de mest almindelige spørgsmål om investering, bolig, budget og økonomi. Klik på en kategori for at folde spørgsmålene ud.
              </p>
            </div>
            {/* Søgning */}
            <div className="mt-8 flex justify-center">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Søg i spørgsmål og svar..."
                className="w-full max-w-xl px-4 py-3 rounded-lg border border-nordic-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-lg"
              />
            </div>
          </div>
        </div>

        {/* Accordion UI for kategorier */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {Object.entries(filteredFaqData).length === 0 && (
            <div className="text-center text-gray-500 text-lg py-12">Ingen spørgsmål matcher din søgning.</div>
          )}
          {Object.entries(filteredFaqData).map(([catKey, questions]) => (
            <div key={catKey} className="mb-6 border rounded-lg bg-white shadow-sm">
              <button
                onClick={() => setOpenCategory(openCategory === catKey ? null : catKey)}
                className="w-full text-left px-6 py-4 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold text-gray-900 hover:bg-gray-100 rounded-t-lg"
                aria-expanded={openCategory === catKey}
              >
                <span>{categoryMeta[catKey]?.icon} {categoryMeta[catKey]?.title}</span>
                <span>{openCategory === catKey ? '▲' : '▼'}</span>
              </button>
              {openCategory === catKey && (
                <div className="px-6 pb-6 pt-2">
                  {questions.map((item) => (
                    <div key={item.id} className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.question}
                      </h3>
                      <div className="prose prose-gray max-w-none mb-2">
                        <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.tags && item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      {/* Related Links */}
                      {item.related && item.related.length > 0 && (
                        <div className="border-t border-gray-200 pt-2">
                          <h4 className="text-xs font-medium text-gray-900 mb-1">
                            📚 Relaterede links:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {item.related.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                              >
                                {link.includes('beregnere') ? '🧮 Beregner' : 
                                 link.includes('guide') ? '📖 Guide' : '🔗 Link'}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ; 