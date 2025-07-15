import React, { useEffect } from 'react';
import { getPublisherId } from '../config/adsense';

const AdSenseScript = () => {
  useEffect(() => {
    // Tjek om scriptet allerede er indsat
    if (document.querySelector('script[data-adsbygoogle]')) return;
    const publisherId = getPublisherId();
    if (!publisherId || publisherId.includes('YOUR_PUBLISHER_ID')) return;
    const script = document.createElement('script');
    script.setAttribute('data-adsbygoogle', 'true');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }, []);
  return null;
};

const AdSense = ({ 
  adClient, 
  adSlot, 
  adFormat = 'auto', 
  fullWidthResponsive = true,
  style = {},
  className = ''
}) => {
  useEffect(() => {
    // Load AdSense script if not already loaded
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense error:', error);
      }
    }
  }, []);

  // Don't render if no adClient or adSlot
  if (!adClient || !adSlot) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </div>
  );
};

export default AdSense; 