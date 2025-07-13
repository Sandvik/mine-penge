import React, { useState, useMemo } from 'react';
import { Tag, Search, ChevronDown, ChevronUp, TrendingUp, Star, Zap, BookOpen, Filter } from 'lucide-react';

function Sidebar({ selectedTopics, onTopicChange, availableTags = [], articles = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'Alle tags': true,
    'Økonomi': false,
    'Livsstil': false,
    'Niveau': false,
    'Andre': false
  });


  // Kategoriser tags automatisk baseret på tag-navne
  const categorizedTags = useMemo(() => {
    const categories = {
      'Alle tags': ['Alle tags'],
      'Økonomi': [],
      'Livsstil': [],
      'Niveau': [],
      'Andre': []
    };

    // Automatisk kategorisering baseret på tag-navne
    availableTags.forEach(tag => {
      const tagLower = tag.toLowerCase();
      
      // Økonomi-relaterede tags
      if (tagLower.includes('opspar') || tagLower.includes('invester') || 
          tagLower.includes('gæld') || tagLower.includes('budget') || 
          tagLower.includes('pension') || tagLower.includes('forsikr') ||
          tagLower.includes('bolig') || tagLower.includes('skat') ||
          tagLower.includes('lån') || tagLower.includes('rente') ||
          tagLower.includes('økonomi') || tagLower.includes('penge')) {
        categories['Økonomi'].push(tag);
      }
      // Livsstil-relaterede tags
      else if (tagLower.includes('børn') || tagLower.includes('familie') || 
               tagLower.includes('studerende') || tagLower.includes('livsstil')) {
        categories['Livsstil'].push(tag);
      }
      // Niveau-relaterede tags
      else if (tagLower.includes('begynder') || tagLower.includes('øvet') || 
               tagLower.includes('avanceret') || tagLower.includes('niveau') ||
               tagLower.includes('kompleksitet')) {
        categories['Niveau'].push(tag);
      }
      // Alt andet
      else {
        categories['Andre'].push(tag);
      }
    });

    // Fjern tomme kategorier
    Object.keys(categories).forEach(category => {
      if (categories[category].length === 0) {
        delete categories[category];
      }
    });

    return categories;
  }, [availableTags]);

  // Filtrer tags baseret på søgning
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categorizedTags;

    const filtered = {};
    Object.entries(categorizedTags).forEach(([category, tags]) => {
      const filteredTags = tags.filter(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredTags.length > 0) {
        filtered[category] = filteredTags;
      }
    });
    return filtered;
  }, [categorizedTags, searchTerm]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Helper function to check if a tag is selected
  const isTagSelected = (tag) => {
    if (tag === 'Alle tags') {
      return selectedTopics.includes('Alle tags') || selectedTopics.length === 0;
    }
    return selectedTopics.includes(tag);
  };

  return (
    <aside className="w-full lg:w-64 bg-nordic-100 shadow-soft lg:border-r border-nordic-200 p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
        {/* MinePenge Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <span className="text-xl font-bold">MinePenge</span>
            <span className="ml-1 text-sm opacity-90">.nu</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-orange-50 to-nordic-50 rounded-lg p-4 mb-4 shadow-sm border border-orange-100 mt-[50px]">
          <div className="flex items-center mb-3">
            <Zap className="h-4 w-4 text-orange-600 mr-2" />
            <h3 className="text-base lg:text-lg font-semibold text-nordic-900">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <a 
              href="/"
              className="bg-white rounded-md p-2 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
            >
              <BookOpen className="h-4 w-4 text-orange-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-nordic-700 group-hover:text-orange-600 transition-colors">Alle artikler</span>
            </a>
            
            <a 
              href="/student-investment-guide"
              className="bg-white rounded-md p-2 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
            >
              <TrendingUp className="h-4 w-4 text-orange-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-nordic-700 group-hover:text-orange-600 transition-colors">Student Guide</span>
            </a>
            
            <a 
              href="/family-finance-guide"
              className="bg-white rounded-md p-2 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
            >
              <Star className="h-4 w-4 text-orange-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-nordic-700 group-hover:text-orange-600 transition-colors">
                Børne familie Guide
              </span>
            </a>
            
            <a 
              href="/investering-guide"
              className="bg-white rounded-md p-2 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
            >
              <Filter className="h-4 w-4 text-orange-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-nordic-700 group-hover:text-orange-600 transition-colors">Inves–tering Guide</span>
            </a>
            
            <a 
              href="/bolig-hus-guide"
              className="bg-white rounded-md p-2 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
            >
              <Star className="h-4 w-4 text-orange-600 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-nordic-700 group-hover:text-orange-600 transition-colors">
                Bolig Guide
              </span>
            </a>
          </div>
        </div>



        <h2 className="text-base lg:text-lg font-semibold text-nordic-900 mb-3 lg:mb-4 flex items-center">
          <Tag className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-primary-600" />
          Tags
        </h2>
        
        {/* Søgning */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Søg i tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Kategorier */}
        <div className="space-y-3">
          {Object.entries(filteredCategories).map(([category, tags]) => (
            <div key={category} className="border border-gray-200 rounded-lg bg-white">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
              >
                <span>{category}</span>
                {expandedCategories[category] ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              
              {expandedCategories[category] && (
                <div className="px-3 pb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          console.log('=== Sidebar tag clicked ===');
                          console.log('Tag clicked:', tag);
                          console.log('isTagSelected:', isTagSelected(tag));
                          console.log('Calling onTopicChange with:', tag);
                          onTopicChange(tag);
                        }}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          isTagSelected(tag)
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Vis antal tags */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          {availableTags.length} tags tilgængelige
        </div>
      </div>
    </aside>
  );
}

export default Sidebar; 