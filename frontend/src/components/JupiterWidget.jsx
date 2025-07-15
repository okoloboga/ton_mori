import React, { useEffect, useMemo } from 'react';
import { WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';

const JupiterWidget = ({ onClose }) => {
  const { wallet, connect } = useWallet();

  useEffect(() => {
    console.log('Checking Jupiter Terminal availability...');
    if (typeof window !== 'undefined' && window.Jupiter) {
      console.log('Initializing Jupiter Terminal in Modal mode');
      window.Jupiter.init({
        displayMode: 'modal',
        containerStyles: {
          width: '100%',
          height: '500px',
          borderRadius: '12px',
          overflow: 'hidden',
        },
        endpoint: 'https://api.mainnet-beta.solana.com',
        formProps: {
          initialAmount: '10000000',
          initialInputMint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
          initialOutputMint: '8ZHE4ow1a2jjxuoMfyExuNamQNALv5ekZhsBn5nMDf5e', // MORI
          fixedOutputMint: true,
        },
        onSuccess: ({ txid }) => {
          console.log('✅ Jupiter swap success:', txid);
        },
        onError: (error) => {
          console.error('❌ Jupiter swap error:', error);
        },
      });
    } else {
      console.error('Jupiter Terminal not loaded');
    }
  }, []);

  useEffect(() => {
    console.log('Checking Phantom wallet availability...');
    if (!wallet && window.solana && window.solana.isPhantom) {
      console.log('Attempting to connect Phantom wallet...');
      connect().catch((err) => {
        console.error('Failed to connect Phantom:', err);
      });
    } else if (wallet) {
      console.log('Wallet connected:', wallet.adapter.name);
    }
  }, [wallet, connect]);

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
        <div id="jupiter-terminal" className="terminal"></div>
      </div>
    </div>
  );
};

const JupiterWidgetWithWallet = ({ onClose }) => {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <JupiterWidget onClose={onClose} />
      </WalletModalProvider>
    </WalletProvider>
  );
};

export default JupiterWidgetWithWallet;
