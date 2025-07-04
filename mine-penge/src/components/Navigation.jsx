import React, { useState, useEffect } from 'react';
import { Menu, X, Search, User, Settings } from 'lucide-react';

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className={`${isScrolled ? 'bg-nordic-100/90 backdrop-blur-sm' : 'bg-nordic-100'} shadow-soft border-b border-nordic-200 sticky top-0 z-40 transition-all duration-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-serif font-medium text-primary-600">
                MinePenge.dk
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block max-w-xs ml-auto mr-1 sm:mr-2 lg:mr-3">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-nordic-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-nordic-300 rounded-lg leading-5 bg-white placeholder-nordic-500 focus:outline-none focus:placeholder-nordic-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                placeholder="Søg i artikler..."
              />
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-nordic-400 hover:text-nordic-500 hover:bg-nordic-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-nordic-200">
            
            {/* Mobile Search */}
            <div className="px-3 py-2">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-nordic-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-8 pr-2 py-1 border border-nordic-300 rounded-lg leading-5 bg-white placeholder-nordic-500 focus:outline-none focus:placeholder-nordic-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs"
                  placeholder="Søg i artikler..."
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation; 