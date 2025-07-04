import React from 'react';
import { Filter, X } from 'lucide-react';

function FilterBar({ filters, onFilterChange, onClearFilters }) {
  return (
    <div className="bg-primary-50 border-b border-primary-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-medium text-primary-700">Filtrer artikler</span>
          </div>
          
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 lg:pb-0">
            <select 
              value={filters.topic}
              onChange={(e) => onFilterChange('topic', e.target.value)}
              className="px-3 py-2 border border-nordic-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white whitespace-nowrap"
            >
              <option value="">Alle emner</option>
              <option value="Osparing">Osparing</option>
              <option value="SU">SU</option>
              <option value="Bolig">Bolig</option>
              <option value="Investering">Investering</option>
              <option value="Gæld">Gæld</option>
              <option value="Pension">Pension</option>
            </select>
            
            <select 
              value={filters.audience}
              onChange={(e) => onFilterChange('audience', e.target.value)}
              className="px-3 py-2 border border-nordic-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white whitespace-nowrap"
            >
              <option value="">Alle målgrupper</option>
              <option value="Studerende">Studerende</option>
              <option value="Børnefamilie">Børnefamilie</option>
              <option value="Pensionist">Pensionist</option>
              <option value="Bred målgruppe">Bred målgruppe</option>
            </select>
            
            <select 
              value={filters.difficulty}
              onChange={(e) => onFilterChange('difficulty', e.target.value)}
              className="px-3 py-2 border border-nordic-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white whitespace-nowrap"
            >
              <option value="">Alle niveauer</option>
              <option value="begynder">Begynder</option>
              <option value="øvet">Øvet</option>
              <option value="avanceret">Avanceret</option>
            </select>
            
            <button 
              onClick={onClearFilters}
              className="p-2 text-nordic-400 hover:text-nordic-600 hover:bg-nordic-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterBar; 