import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  HelpCircle, 
  Network, 
  FileText, 
  Search, 
  Zap,
  ArrowRight,
  Lock,
  User,
  Eye,
  EyeOff
} from 'lucide-react';
import Footer from '../components/Footer';

function SEODashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple login check - in real app this would be proper authentication
    if (credentials.username && credentials.password) {
      setIsLoggedIn(true);
    }
  };

  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-nordic-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-soft border border-nordic-200">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-nordic-900 mb-2">
                SEO Dashboard
              </h1>
              <p className="text-nordic-600">
                Log ind for at få adgang til SEO-værktøjerne
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-nordic-700 mb-2">
                  Brugernavn
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-nordic-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-nordic-300 rounded-lg text-sm placeholder-nordic-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Indtast brugernavn"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-nordic-700 mb-2">
                  Adgangskode
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-nordic-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-12 py-3 border border-nordic-300 rounded-lg text-sm placeholder-nordic-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Indtast adgangskode"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-nordic-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-nordic-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Log ind
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-nordic-50 rounded-lg">
              <p className="text-xs text-nordic-600 mb-2">
                <strong>Demo credentials:</strong>
              </p>
              <p className="text-xs text-nordic-500">
                Brugernavn: <code className="bg-white px-1 rounded">admin</code>
              </p>
              <p className="text-xs text-nordic-500">
                Adgangskode: <code className="bg-white px-1 rounded">password</code>
              </p>
            </div>

            {/* Back to home */}
            <div className="mt-6 text-center">
              <Link 
                to="/"
                className="text-sm text-nordic-600 hover:text-nordic-900 transition-colors"
              >
                ← Tilbage til forsiden
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If logged in, show the original dashboard
  return (
    <div className="min-h-screen bg-nordic-50 flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-nordic-900 mb-4">
                SEO Dashboard
              </h1>
              <p className="text-lg text-nordic-600">
                Dominer søgemaskinerne med automatiske SEO-værktøjer
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-nordic-900">10</p>
                    <p className="text-sm text-nordic-600">Landing Pages</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <div className="flex items-center">
                  <HelpCircle className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-nordic-900">50</p>
                    <p className="text-sm text-nordic-600">Q&A Feeds</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <div className="flex items-center">
                  <Network className="h-8 w-8 text-purple-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-nordic-900">25</p>
                    <p className="text-sm text-nordic-600">Interne Links</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-orange-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-nordic-900">150</p>
                    <p className="text-sm text-nordic-600">Artikler</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200">
                <div className="flex items-center">
                  <Search className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <p className="text-2xl font-bold text-nordic-900">200</p>
                    <p className="text-sm text-nordic-600">Søgeord</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEO Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Link
                to="/landing-pages"
                className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nordic-900 mb-1">
                        Landing Page Generator
                      </h3>
                      <p className="text-sm text-nordic-600">
                        Automatisk generering af langhalede landing pages baseret på søgeord
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-nordic-400" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-medium">
                    10 sider genereret
                  </span>
                  <span className="text-xs text-nordic-400">
                    Klik for at åbne
                  </span>
                </div>
              </Link>

              <Link
                to="/qa-feed"
                className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <HelpCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nordic-900 mb-1">
                        Q&A Feed Generator
                      </h3>
                      <p className="text-sm text-nordic-600">
                        AI-genereret "Hvordan..." spørgsmål og svar for SEO
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-nordic-400" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600 font-medium">
                    50 Q&As genereret
                  </span>
                  <span className="text-xs text-nordic-400">
                    Klik for at åbne
                  </span>
                </div>
              </Link>

              <Link
                to="/internal-links"
                className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Network className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nordic-900 mb-1">
                        Intern Linkstruktur
                      </h3>
                      <p className="text-sm text-nordic-600">
                        Automatisk generering af intern linking og hierarkisk navigation
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-nordic-400" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600 font-medium">
                    25 interne links
                  </span>
                  <span className="text-xs text-nordic-400">
                    Klik for at åbne
                  </span>
                </div>
              </Link>

              <Link
                to="/embed-widget"
                className="bg-white rounded-2xl p-6 shadow-soft border border-nordic-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-nordic-900 mb-1">
                        Embed Widget
                      </h3>
                      <p className="text-sm text-nordic-600">
                        Generer embeddable widgets til ekstern integration
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-nordic-400" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600 font-medium">
                    Widget generator
                  </span>
                  <span className="text-xs text-nordic-400">
                    Klik for at åbne
                  </span>
                </div>
              </Link>
            </div>

            {/* Logout button */}
            <div className="text-center">
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-6 py-2 text-nordic-600 hover:text-nordic-900 transition-colors"
              >
                Log ud
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default SEODashboard; 