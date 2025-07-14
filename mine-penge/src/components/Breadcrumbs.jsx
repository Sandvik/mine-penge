import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ currentPage, currentTag, items }) => {
  const location = useLocation();
  
  let breadcrumbs = [];

  // If items are provided, use the new structure
  if (items && items.length > 0) {
    breadcrumbs = items.map((item, index) => ({
      name: item.label,
      href: item.href,
      current: index === items.length - 1,
      icon: index === 0 ? <Home className="h-4 w-4" /> : null
    }));
  } else {
    // Use the old structure
    breadcrumbs = [
      {
        name: 'Forside',
        href: '/',
        icon: <Home className="h-4 w-4" />
      }
    ];

    // Add current page or tag
    if (currentPage) {
      breadcrumbs.push({
        name: currentPage,
        href: location.pathname,
        current: true
      });
    } else if (currentTag) {
      breadcrumbs.push({
        name: currentTag,
        href: location.pathname,
        current: true
      });
    }
  }

  return (
    <nav className="hidden lg:flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.name} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-nordic-400 mx-2" />
            )}
            
            {breadcrumb.current ? (
              <span 
                className="text-nordic-600 font-medium"
                aria-current="page"
              >
                {breadcrumb.icon && (
                  <span className="inline-flex items-center mr-1">
                    {breadcrumb.icon}
                  </span>
                )}
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                to={breadcrumb.href}
                className="text-nordic-500 hover:text-nordic-700 transition-colors flex items-center"
              >
                {breadcrumb.icon && (
                  <span className="inline-flex items-center mr-1">
                    {breadcrumb.icon}
                  </span>
                )}
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 