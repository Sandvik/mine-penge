import { useEffect } from 'react';
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

export default AdSenseScript; 