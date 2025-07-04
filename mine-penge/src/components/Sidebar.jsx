import React from 'react';
import { Tag } from 'lucide-react';

function Sidebar({ selectedTopics, onTopicChange }) {
  const tags = [
    'Alle tags',
    'Opsparing',
    'Investering', 
    'Gæld',
    'Budget',
    'Pension',
    'Forsikring',
    'Bolig',
    'Skatter',
    'Børn & Familie',
    'Studerende',
    'Begynder',
    'Øvet',
    'Avanceret'
  ];

  return (
    <aside className="w-full lg:w-64 bg-nordic-100 shadow-soft lg:border-r border-nordic-200 p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
        <h2 className="text-base lg:text-lg font-semibold text-nordic-900 mb-3 lg:mb-4 flex items-center">
          <Tag className="h-4 w-4 lg:h-5 lg:w-5 mr-2 text-primary-600" />
          Tags
        </h2>
        
        <div className="flex flex-wrap gap-1.5 lg:gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onTopicChange(tag)}
              className={`px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedTopics.includes(tag)
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-nordic-700 hover:bg-nordic-200 hover:text-nordic-900 border border-nordic-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar; 