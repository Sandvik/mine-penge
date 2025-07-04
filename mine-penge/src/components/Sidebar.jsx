import React from 'react';
import { Bookmark, TrendingUp, Clock, Star } from 'lucide-react';

function Sidebar() {
  return (
    <aside className="hidden lg:block w-80 bg-white border-r border-nordic-200 p-6">
      <div className="sticky top-20">
        {/* Quick Stats */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-nordic-900 mb-4">I dag</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-700">Nye artikler</span>
              <span className="text-lg font-semibold text-blue-900">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">Gemte</span>
              <span className="text-lg font-semibold text-green-900">3</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-nordic-900 mb-4">Hurtig navigation</h3>
          <nav className="space-y-2">
            <a href="#" className="flex items-center p-3 text-nordic-700 hover:bg-nordic-100 rounded-lg transition-colors">
              <Clock className="h-5 w-5 mr-3" />
              Seneste
            </a>
            <a href="#" className="flex items-center p-3 text-nordic-700 hover:bg-nordic-100 rounded-lg transition-colors">
              <TrendingUp className="h-5 w-5 mr-3" />
              Populære
            </a>
            <a href="#" className="flex items-center p-3 text-nordic-700 hover:bg-nordic-100 rounded-lg transition-colors">
              <Star className="h-5 w-5 mr-3" />
              Anbefalede
            </a>
            <a href="#" className="flex items-center p-3 text-nordic-700 hover:bg-nordic-100 rounded-lg transition-colors">
              <Bookmark className="h-5 w-5 mr-3" />
              Gemte artikler
            </a>
          </nav>
        </div>

        {/* Topics */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-nordic-900 mb-4">Emner</h3>
          <div className="space-y-2">
            {['Osparing', 'SU', 'Bolig', 'Investering', 'Gæld', 'Pension'].map((topic) => (
              <button
                key={topic}
                className="w-full text-left p-3 text-nordic-700 hover:bg-nordic-100 rounded-lg transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div>
          <h3 className="text-lg font-semibold text-nordic-900 mb-4">Målgruppe</h3>
          <div className="space-y-2">
            {[
              { name: 'Studerende', icon: '🎓' },
              { name: 'Børnefamilie', icon: '👨‍👩‍👧‍👦' },
              { name: 'Pensionist', icon: '👴' },
              { name: 'Bred målgruppe', icon: '👤' }
            ].map((audience) => (
              <button
                key={audience.name}
                className="w-full text-left p-3 text-nordic-700 hover:bg-nordic-100 rounded-lg transition-colors"
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