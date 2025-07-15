import { useState, useEffect } from 'react';
import JupiterWidget from './components/JupiterWidget';
import './styles.css';
import './index.css';

function App() {
  const [activeWidget, setActiveWidget] = useState(null);
  const apiKey = import.meta.env.VITE_RHINO_API_KEY;

  useEffect(() => {
    console.log('Checking Rhino iframe in App.jsx...');
    const iframe = document.getElementById('rhino-terminal');
    if (iframe) {
      console.log('Rhino iframe found in DOM');
      iframe.onload = () => {
        console.log('Rhino iframe loaded successfully');
      };
      iframe.onerror = () => {
        console.error('Rhino iframe failed to load');
      };
    } else {
      console.error('Rhino iframe not found in DOM');
    }
  }, []);

  const openWidget = (widgetType) => {
    setActiveWidget(widgetType);
  };

  const closeWidget = () => {
    setActiveWidget(null);
  };

  return (
    <div className="app">
      <video autoPlay loop muted className="background-video">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="container">
        <header className="header">
          <h1>TON - $MORI Bridge</h1>
          <p>Decentralized cross-chain bridge</p>
        </header>

        <main className="main">
          <div className="widget-container">
            <h3>Bridge to $MORI</h3>
            <iframe
              id="rhino-terminal"
              className="terminal"
              src={`https://widget.rhino.fi/?apiKey=${apiKey}&mode=dark&theme=%7B%22colors%22%3A%7B%22primary%22%3A%22rgba%28243%2C+230%2C+0%2C+1%29%22%7D%2C%22radius%22%3A%7B%22actionElements%22%3A%2232px%22%2C%22tokenSelect%22%3A%2216px%22%7D%2C%22tokenInputStroke%22%3Atrue%7D&exclude=%7B%22ABSTRACT%22%3Atrue%2C%22ARBITRUM%22%3Atrue%2C%22AVALANCHE%22%3Atrue%2C%22BASE%22%3Atrue%2C%22BERACHAIN%22%3Atrue%2C%22BINANCE%22%3Atrue%2C%22BLAST%22%3Atrue%2C%22CELO%22%3Atrue%2C%22ETHEREUM%22%3Atrue%2C%22INK%22%3Atrue%2C%22KATANA%22%3Atrue%2C%22LINEA%22%3Atrue%2C%22MANTA%22%3Atrue%2C%22MANTLE%22%3Atrue%2C%22MATIC_POS%22%3Atrue%2C%22MODE%22%3Atrue%2C%22OPBNB%22%3Atrue%2C%22OPTIMISM%22%3Atrue%2C%22PARADEX%22%3Atrue%2C%22PLUME2%22%3Atrue%2C%22SCROLL%22%3Atrue%2C%22SONEIUM%22%3Atrue%2C%22SONIC%22%3Atrue%2C%22STARKNET%22%3Atrue%2C%22STORY%22%3Atrue%2C%22TAIKO%22%3Atrue%2C%22TRON%22%3Atrue%2C%22UNICHAIN%22%3Atrue%2C%22ZIRCUIT%22%3Atrue%2C%22ZKEVM%22%3Atrue%2C%22ZKSYNC%22%3Atrue%7D&chainIn=TON&chainOut=SOLANA`}
              scrolling="no"
              frameBorder="0"
              style={{ width: '400px', height: '581px', border: 'none' }}
            />
          </div>

          {!activeWidget && (
            <div className="bridge-preview">
              {/* TON to SOL Bridge Card */}
              <div className="bridge-card">
                <div className="bridge-route">
                  <div className="chain">
                    <div className="chain-info">
                      <div className="chain-name">TON</div>
                      <div className="token-name">USDT</div>
                    </div>
                  </div>
                  <div className="arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="chain">
                    <div className="chain-info">
                      <div className="chain-name">SOL</div>
                      <div className="token-name">USDT</div>
                    </div>
                  </div>
                </div>
                <button
                  className="open-bridge-btn"
                  onClick={() => openWidget('rhino')}
                >
                  🌐 GET SOL USDT
                </button>
                <p className="bridge-hint">Cross-chain bridge</p>
              </div>

              {/* SOL USDT to MORI Card */}
              <div className="bridge-card meme-card">
                <div className="bridge-route">
                  <div className="chain">
                    <div className="chain-info">
                      <div className="chain-name">USDT</div>
                      <div className="token-name">SOL</div>
                    </div>
                  </div>
                  <div className="arrow">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="chain">
                    <div className="chain-info">
                      <div className="chain-name">SOL</div>
                      <div className="token-name">$MORI</div>
                    </div>
                  </div>
                </div>
                <button
                  className="open-bridge-btn meme-btn"
                  onClick={() => openWidget('jupiter')}
                >
                  ⚡ GET $MORI
                </button>
                <p className="bridge-hint">DEX swap</p>
              </div>
            </div>
          )}

          {/* Widgets */}
          {activeWidget === 'jupiter' && <JupiterWidget onClose={closeWidget} />}
        </main>
      </div>
    </div>
  );
}

export default App;
