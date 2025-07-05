import React, { useState, useMemo } from 'react';
import { Tag, Search, ChevronDown, ChevronUp } from 'lucide-react';

function Sidebar({ selectedTopics, onTopicChange, availableTags = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'Alle tags': true,
    'Økonomi': true,
    'Livsstil': true,
    'Niveau': true,
    'Andre': true
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

  return (
    <aside className="w-full lg:w-64 bg-nordic-100 shadow-soft lg:border-r border-nordic-200 p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
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
                        onClick={() => onTopicChange(tag)}
                        className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                          (tag === 'Alle tags' && selectedTopics.length === 0) || selectedTopics.includes(tag)
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