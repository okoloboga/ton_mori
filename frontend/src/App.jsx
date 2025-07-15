import { useState } from 'react';
import JupiterWidget from './components/JupiterWidget';
import RhinoWidget from './components/RhinoWidget';
import './styles.css';
import './index.css';

function App() {
  const [activeWidget, setActiveWidget] = useState(null);

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
          {activeWidget === 'rhino' && <RhinoWidget onClose={closeWidget} />}
          {activeWidget === 'jupiter' && <JupiterWidget onClose={closeWidget} />}
        </main>
      </div>
    </div>
  );
}

export default App;
