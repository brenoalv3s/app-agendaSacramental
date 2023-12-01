import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      // Este é um evento de carregamento da janela, indicando que a página e todos os recursos foram carregados
      setLoaded(true);
    };

    window.addEventListener('load', handleLoad);

    // Remove o ouvinte de evento ao desmontar o componente
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return (
    <div className={`loading-screen ${loaded ? 'loaded' : ''}`}>
      <img className='loading-logo' src='/logo.png' alt="Logo" />
    </div>
  );
};

export default LoadingScreen;
