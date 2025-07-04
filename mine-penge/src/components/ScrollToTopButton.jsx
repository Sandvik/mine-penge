import React, { useState, useEffect } from 'react';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        background: '#00a7b7',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '3rem',
        height: '3rem',
        fontSize: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        transition: 'opacity 0.3s',
        opacity: visible ? 1 : 0,
      }}
      aria-label="Scroll til top"
      title="Scroll til top"
    >
      ↑
    </button>
  ) : null;
};

export default ScrollToTopButton; 