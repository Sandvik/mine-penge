import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, RefreshCw, Eye } from 'lucide-react';
import { fetchArticles } from '../services/articleService';

function Navigation({ onOpenCuration, onOpenMobileSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const isDebugMode = import.meta.env.DEV || import.meta.env.MODE === 'development';

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchArticles();
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing articles:', error);
      alert('Fejl ved opdatering af artikler. Prøv igen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-nordic-50 shadow-sm border-b border-nordic-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold text-nordic-900">MinePenge</span>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Debug Mode Buttons */}
            {isDebugMode && (
              <button
                onClick={onOpenCuration}
                className="flex items-center px-3 py-2 bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200 transition-colors text-sm"
                title="Kurateringspanel"
              >
                <Eye className="h-4 w-4 mr-1" />
                Kuratering
              </button>
            )}
            
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm disabled:opacity-50"
              title="Opdater artikler"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Opdaterer...' : 'Opdater'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onOpenMobileSidebar}
              className="p-2 rounded-md text-nordic-600 hover:text-nordic-900 hover:bg-nordic-50"
              title="Åbn menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-nordic-600 hover:text-nordic-900 hover:bg-nordic-50"
              title="Opdater artikler"
            >
              <RefreshCw className={`h-6 w-6 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-nordic-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Action Buttons */}
            <div className="flex flex-col space-y-2">
              {/* Debug Mode Buttons */}
              {isDebugMode && (
                <button
                  onClick={() => {
                    onOpenCuration();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center px-3 py-2 bg-warning-100 text-warning-700 rounded-lg hover:bg-warning-200 transition-colors text-sm"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Kurateringspanel
                </button>
              )}
              
              <button
                onClick={() => {
                  handleRefresh();
                  setIsMenuOpen(false);
                }}
                disabled={isLoading}
                className="flex items-center px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Opdaterer...' : 'Opdater artikler'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navigation; 