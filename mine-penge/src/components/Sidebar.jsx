import React from 'react';
import { Bookmark, TrendingUp, Clock, Star } from 'lucide-react';

function Sidebar({
  onNavigate,
  onFilterTopic,
  onFilterAudience,
  onShowNew,
  onShowSaved
}) {
  return (
    <aside className="hidden lg:block w-80 bg-primary-50 border-r border-primary-200 p-6">
      <div className="sticky top-20">
        {/* Quick Stats */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">I dag</h3>
          <div className="space-y-3">
            <button
              className="flex items-center justify-between w-full p-3 bg-primary-50 rounded-lg text-left"
              onClick={onShowNew}
            >
              <span className="text-sm text-primary-700">Nye artikler</span>
              <span className="text-lg font-semibold text-primary-900">12</span>
            </button>
            <button
              className="flex items-center justify-between w-full p-3 bg-success-50 rounded-lg text-left"
              onClick={onShowSaved}
            >
              <span className="text-sm text-success-700">Gemte</span>
              <span className="text-lg font-semibold text-success-900">3</span>
            </button>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Hurtig navigation</h3>
          <nav className="space-y-2">
            <button type="button" onClick={() => onNavigate('seneste')} className="flex items-center w-full p-3 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors">
              <Clock className="h-5 w-5 mr-3" />
              Seneste
            </button>
            <button type="button" onClick={() => onNavigate('populaere')} className="flex items-center w-full p-3 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors">
              <TrendingUp className="h-5 w-5 mr-3" />
              Populære
            </button>
            <button type="button" onClick={() => onNavigate('anbefalede')} className="flex items-center w-full p-3 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors">
              <Star className="h-5 w-5 mr-3" />
              Anbefalede
            </button>
            <button type="button" onClick={() => onNavigate('gemte')} className="flex items-center w-full p-3 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors">
              <Bookmark className="h-5 w-5 mr-3" />
              Gemte artikler
            </button>
          </nav>
        </div>

        {/* Topics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Emner</h3>
          <div className="space-y-2">
            {['Osparing', 'SU', 'Bolig', 'Investering', 'Gæld', 'Pension'].map((topic) => (
              <button
                key={topic}
                className="w-full text-left p-3 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
                onClick={() => onFilterTopic(topic)}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div>
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Målgruppe</h3>
          <div className="space-y-2">
            {[
              { name: 'Studerende', icon: '🎓' },
              { name: 'Børnefamilie', icon: '👨‍👩‍👧‍👦' },
              { name: 'Pensionist', icon: '👴' },
              { name: 'Bred målgruppe', icon: '👤' }
            ].map((audience) => (
              <button
                key={audience.name}
                className="w-full text-left p-3 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
                onClick={() => onFilterAudience(audience.name)}
              >
                <span className="mr-2">{audience.icon}</span>
                {audience.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar; 