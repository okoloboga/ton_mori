import { useEffect, useState } from 'react';

const JupiterWidget = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initJupiter = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (typeof window.Jupiter !== 'undefined') {
          window.Jupiter.init({
            displayMode: 'integrated',
            integratedTargetId: 'integrated-terminal',
            endpoint: 'https://api.mainnet-beta.solana.com',
            formProps: {
              initialAmount: '10000000', // 10 USDT
              initialInputMint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
              initialOutputMint: '8ZHE4ow1a2jjxuoMfyExuNamQNALv5ekZhsBn5nMDf5e', // MORI
              fixedOutputMint: true,
            },
            onSuccess: ({ txid }) => {
              console.log('✅ Jupiter swap success:', txid);
              if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
              }
            },
            onError: (error) => {
              console.error('❌ Jupiter swap error:', error);
              setError(error.message);
            },
          });

          setIsLoading(false);
        } else {
          throw new Error('Jupiter script not loaded');
        }
      } catch (err) {
        console.error('❌ Jupiter initialization error:', err);
        setError('Failed to load Jupiter Terminal');
        setIsLoading(false);
      }
    };

    initJupiter();
  }, []);

  return (
    <div className="widget-container">
      <svg
        onClick={onClose}
        className="close-btn"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 6L6 18" />
        <path d="M6 6L18 18" />
      </svg>
      <div className="widget-content">
        <h3>Buy $MORI Token</h3>
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading Jupiter Terminal...</p>
          </div>
        )}
        {error && (
          <div className="error">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        )}
        <div id="integrated-terminal" className="terminal"></div>
      </div>
    </div>
  );
};

export default JupiterWidget;
