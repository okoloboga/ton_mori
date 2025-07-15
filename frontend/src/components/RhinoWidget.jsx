import { useEffect, useState } from 'react';

const RhinoWidget = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Правильное обращение к переменным в Vite
  const apiKey = import.meta.env.VITE_RHINO_API_KEY;

  useEffect(() => {
    console.log('VITE_RHINO_API_KEY from import.meta.env:', apiKey);
    if (!apiKey) {
      setError('Rhino API key is missing');
      setIsLoading(false);
      return;
    }

    const iframe = document.getElementById('rhino-terminal');
    if (iframe) {
      iframe.onload = () => {
        console.log('Rhino iframe loaded successfully');
        setIsLoading(false);
        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
      };
      iframe.onerror = () => {
        console.error('Rhino iframe failed to load');
        setError('Failed to load Rhino Widget (Error 422)');
        setIsLoading(false);
      };
    } else {
      setError('Rhino Widget iframe not found');
      setIsLoading(false);
    }
  }, [apiKey]);

  return (
    <div className="widget-container">
      {/* ... остальной JSX остается без изменений ... */}
      {!error && !isLoading && (
        <iframe
          id="rhino-terminal"
          className="terminal"
          src={`https://widget.rhino.fi/?apiKey=${apiKey}&mode=dark&theme=%7B%22colors%22%3A%7B%22primary%22%3A%22rgba%28243%2C+230%2C+0%2C+1%29%22%7D%2C%22radius%22%3A%7B%22actionElements%22%3A%2232px%22%2C%22tokenSelect%22%3A%2216px%22%7D%2C%22tokenInputStroke%22%3Atrue%7D&exclude=%7B%22ABSTRACT%22%3Atrue%2C%22ARBITRUM%22%3Atrue%2C%22AVALANCHE%22%3Atrue%2C%22BASE%22%3Atrue%2C%22BERACHAIN%22%3Atrue%2C%22BINANCE%22%3Atrue%2C%22BLAST%22%3Atrue%2C%22CELO%22%3Atrue%2C%22ETHEREUM%22%3Atrue%2C%22INK%22%3Atrue%2C%22KATANA%22%3Atrue%2C%22LINEA%22%3Atrue%2C%22MANTA%22%3Atrue%2C%22MANTLE%22%3Atrue%2C%22MATIC_POS%22%3Atrue%2C%22MODE%22%3Atrue%2C%22OPBNB%22%3Atrue%2C%22OPTIMISM%22%3Atrue%2C%22PARADEX%22%3Atrue%2C%22PLUME2%22%3Atrue%2C%22SCROLL%22%3Atrue%2C%22SONEIUM%22%3Atrue%2C%22SONIC%22%3Atrue%2C%22STARKNET%22%3Atrue%2C%22STORY%22%3Atrue%2C%22TAIKO%22%3Atrue%2C%22TRON%22%3Atrue%2C%22UNICHAIN%22%3Atrue%2C%22ZIRCUIT%22%3Atrue%2C%22ZKEVM%22%3Atrue%2C%22ZKSYNC%22%3Atrue%7D&chainIn=TON&chainOut=SOLANA`}
          scrolling="no"
          frameBorder="0"
        />
      )}
    </div>
  );
};

export default RhinoWidget;
