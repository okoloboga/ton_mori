import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App.jsx';
   import './index.css';

   // Инициализация Telegram WebApp
   if (window.Telegram?.WebApp) {
     window.Telegram.WebApp.ready();
     window.Telegram.WebApp.expand();
     console.log('Telegram WebApp initialized:', window.Telegram.WebApp.initData);
   } else {
     console.log('Telegram WebApp not available');
   }

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>
   );
