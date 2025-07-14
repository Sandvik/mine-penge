import React, { useState, useEffect } from 'react';
import { X, Menu, Tag, Search, ChevronDown, ChevronUp, TrendingUp, Star, Zap, BookOpen, Filter, HelpCircle } from 'lucide-react';

function MobileSidebar({ 
  selectedTopics, 
  onTopicChange, 
  availableTags = [], 
  articles = [],
  isOpen,
  onClose 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'Alle tags': true,
    'Økonomi': false,
    'Livsstil': false,
    'Niveau': false,
    'Andre': false
  });

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.mobile-sidebar')) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Kategoriser tags automatisk baseret på tag-navne
  const categorizedTags = React.useMemo(() => {
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
      
      // Livsstil-relaterede tags (tjek først for at undgå konflikter)
      if ((tagLower.includes('børn') && !tagLower.includes('opspar')) || 
          tagLower.includes('familie') || 
          tagLower.includes('studerende') || 
          tagLower.includes('livsstil') ||
          tagLower.includes('pensionist')) {
        categories['Livsstil'].push(tag);
      }
      // Økonomi-relaterede tags
      else if (tagLower.includes('opspar') || tagLower.includes('invester') || 
          tagLower.includes('gæld') || tagLower.includes('budget') || 
          tagLower.includes('pension') || tagLower.includes('forsikr') ||
          tagLower.includes('bolig') || tagLower.includes('skat') ||
          tagLower.includes('lån') || tagLower.includes('rente') ||
          tagLower.includes('økonomi') || tagLower.includes('penge')) {
        categories['Økonomi'].push(tag);
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
  const filteredCategories = React.useMemo(() => {
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

  const handleTagClick = (tag) => {
    onTopicChange(tag);
    onClose(); // Close sidebar after selection
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        className={`mobile-sidebar fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-nordic-200 bg-gradient-to-r from-primary-600 to-blue-600 text-white">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold">MinePenge</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto">
          <div className="p-4">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-orange-50 to-nordic-50 rounded-lg p-4 mb-6 shadow-sm border border-orange-100">
              <div className="flex items-center mb-3">
                <Zap className="h-4 w-4 text-orange-600 mr-2" />
                <h3 className="text-lg font-semibold text-nordic-900">Quick Actions</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="/"
                  onClick={onClose}
                  className="bg-white rounded-lg p-3 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
                >
                  <BookOpen className="h-5 w-5 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-nordic-700 group-hover:text-orange-600 transition-colors">Alle artikler</span>
                </a>
                
                <a 
                  href="/faq"
                  onClick={onClose}
                  className="bg-white rounded-lg p-3 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
                >
                  <HelpCircle className="h-5 w-5 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-nordic-700 group-hover:text-orange-600 transition-colors">FAQ</span>
                </a>
                
                <a 
                  href="/student-investment-guide"
                  onClick={onClose}
                  className="bg-white rounded-lg p-3 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
                >
                  <TrendingUp className="h-5 w-5 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-nordic-700 group-hover:text-orange-600 transition-colors">Student Guide</span>
                </a>
                
                <a 
                  href="/family-finance-guide"
                  onClick={onClose}
                  className="bg-white rounded-lg p-3 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
                >
                  <Star className="h-5 w-5 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-nordic-700 group-hover:text-orange-600 transition-colors">Familie Guide</span>
                </a>
                
                <a 
                  href="/investering-guide"
                  onClick={onClose}
                  className="bg-white rounded-lg p-3 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
                >
                  <Filter className="h-5 w-5 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-nordic-700 group-hover:text-orange-600 transition-colors">Investering</span>
                </a>
                
                <a 
                  href="/bolig-hus-guide"
                  onClick={onClose}
                  className="bg-white rounded-lg p-3 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
                >
                  <Star className="h-5 w-5 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-nordic-700 group-hover:text-orange-600 transition-colors">Bolig Guide</span>
                </a>
                
                <a 
                  href="/pensionist-guide"
                  onClick={onClose}
                  className="bg-white rounded-lg p-3 border border-orange-100 hover:border-orange-200 transition-colors text-center group"
                >
                  <Star className="h-5 w-5 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm text-nordic-700 group-hover:text-orange-600 transition-colors">Pensionist Guide</span>
                </a>
              </div>
            </div>

            {/* Tags Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-nordic-900 mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-primary-600" />
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
                  className="w-full pl-10 pr-3 py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Kategorier */}
              <div className="space-y-3">
                {Object.entries(filteredCategories).map(([category, tags]) => (
                  <div key={category} className="border border-gray-200 rounded-lg bg-white">
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>{category}</span>
                      {expandedCategories[category] ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    
                    {expandedCategories[category] && (
                      <div className="border-t border-gray-100">
                        {tags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
                              isTagSelected(tag) 
                                ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500' 
                                : 'text-gray-600'
                            }`}
                          >
                            <span>{tag}</span>
                            {isTagSelected(tag) && (
                              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                            )}
                          </button>
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
    </>
  );
}

export default MobileSidebar; 