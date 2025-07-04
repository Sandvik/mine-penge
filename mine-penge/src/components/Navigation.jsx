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
    <nav className="bg-white border-b border-nordic-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
                MinePenge
              </Link>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-nordic-400" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Søg efter økonomi-råd..."
                className="block w-full pl-10 pr-3 py-2 border border-nordic-300 rounded-xl text-sm placeholder-nordic-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden flex-1 mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-nordic-400" />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Søg..."
                className="block w-full pl-10 pr-3 py-2 border border-nordic-300 rounded-xl text-sm placeholder-nordic-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Filter button */}
            <button className="p-2 text-nordic-600 hover:text-nordic-900 hover:bg-nordic-100 rounded-lg transition-colors">
              <Filter className="h-5 w-5" />
            </button>

            {/* Favorites */}
            <button className="p-2 text-nordic-600 hover:text-nordic-900 hover:bg-nordic-100 rounded-lg transition-colors">
              <Heart className="h-5 w-5" />
            </button>

            {/* User menu */}
            <button className="p-2 text-nordic-600 hover:text-nordic-900 hover:bg-nordic-100 rounded-lg transition-colors">
              <User className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-nordic-600 hover:text-nordic-900 hover:bg-nordic-100 rounded-lg transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation; 