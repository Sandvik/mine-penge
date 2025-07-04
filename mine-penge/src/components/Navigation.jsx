import React, { useState } from 'react';
import { Search, Filter, User, Heart, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navigation({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <nav className="bg-primary-50 border-b border-primary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-primary-500 hover:text-primary-600 transition-colors">
                MinePenge
              </Link>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form
              onSubmit={e => {
                e.preventDefault();
                onSearch(searchValue);
              }}
              className="relative w-full"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={e => {
                  console.log('onKeyDown event:', e.key);
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSearch(searchValue);
                  }
                }}
                placeholder="Søg efter økonomi-råd..."
                className="block w-full pl-10 pr-3 py-2 border border-primary-300 rounded-xl text-sm placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button type="submit" style={{ display: 'none' }}>Søg</button>
            </form>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden flex-1 mx-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                onSearch(searchValue);
              }}
              className="relative w-full"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-primary-400" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={e => {
                  console.log('onKeyDown event:', e.key);
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSearch(searchValue);
                  }
                }}
                placeholder="Søg..."
                className="block w-full pl-10 pr-3 py-2 border border-primary-300 rounded-xl text-sm placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button type="submit" style={{ display: 'none' }}>Søg</button>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Filter button */}
            <button className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-lg transition-colors">
              <Filter className="h-5 w-5" />
            </button>

            {/* Favorites */}
            <button className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-lg transition-colors">
              <Heart className="h-5 w-5" />
            </button>

            {/* User menu */}
            <button className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-colors">
              <User className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-100 rounded-lg transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 