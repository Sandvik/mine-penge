import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  HelpCircle, 
  Network, 
  FileText,
  ExternalLink,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-nordic-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-teal-400 mb-2">MinePenge</h3>
              <p className="text-nordic-300 mb-4">
                Din guide til smart privatøkonomi. Vi hjælper dig med at spare penge, 
                investere klogt og bygge en sund økonomisk fremtid.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-nordic-300">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@minepenge.dk</span>
              </div>
              <div className="flex items-center text-sm text-nordic-300">
                <Phone className="h-4 w-4 mr-2" />
                <span>+45 70 12 34 56</span>
              </div>
              <div className="flex items-center text-sm text-nordic-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span>København, Danmark</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hurtige links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-nordic-300 hover:text-white transition-colors">
                  Forside
                </Link>
              </li>
              <li>
                <Link to="/embed-widget" className="text-nordic-300 hover:text-white transition-colors">
                  Embed Widget
                </Link>
              </li>
              <li>
                <a href="#" className="text-nordic-300 hover:text-white transition-colors">
                  Om os
                </a>
              </li>
              <li>
                <a href="#" className="text-nordic-300 hover:text-white transition-colors">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          {/* SEO Tools */}
          <div>
            <h4 className="text-lg font-semibold mb-4">SEO Værktøjer</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/seo-dashboard" 
                  className="flex items-center text-nordic-300 hover:text-white transition-colors"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>SEO Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/landing-pages" 
                  className="flex items-center text-nordic-300 hover:text-white transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Landing Pages</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/qa-feed" 
                  className="flex items-center text-nordic-300 hover:text-white transition-colors"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>Q&A Feed</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/internal-links" 
                  className="flex items-center text-nordic-300 hover:text-white transition-colors"
                >
                  <Network className="h-4 w-4 mr-2" />
                  <span>Intern Linking</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-nordic-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-nordic-400 mb-4 md:mb-0">
              © 2025 MinePenge.dk. Alle rettigheder forbeholdes.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-nordic-400 hover:text-white transition-colors">
                Privatlivspolitik
              </a>
              <a href="#" className="text-nordic-400 hover:text-white transition-colors">
                Vilkår og betingelser
              </a>
              <a href="#" className="text-nordic-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 