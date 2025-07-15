import React from 'react';
import { Link } from 'react-router-dom';
import { 
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
                <span>info@minepenge.nu</span>
              </div>
              <div className="flex items-center text-sm text-nordic-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Hellerup, Danmark</span>
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
                <a href="/om-os" className="text-nordic-300 hover:text-white transition-colors">
                  Om os
                </a>
              </li>
              <li>
                <a href="/kontakt" className="text-nordic-300 hover:text-white transition-colors">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          {/* Admin */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Admin</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/seo-dashboard" className="text-nordic-300 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-nordic-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-nordic-400 mb-4 md:mb-0">
              © 2025 MinePenge.nu - Indhold fra egne kilder og eksterne kilder
            </div>
            

          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 