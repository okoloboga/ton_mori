import React, { useState, useEffect, useCallback } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import rhinoApi from '../services/rhinoApi';
import './RhinoWidget.css';

const RhinoWidget = ({ onClose }) => {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  
  // Состояния формы
  const [amount, setAmount] = useState('');
  const [solanaWallet, setSolanaWallet] = useState('');
  
  // Состояния процесса
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionReady, setIsTransactionReady] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // Получаем API ключ через Vite
  const apiKey = import.meta.env.VITE_RHINO_API_KEY;

  // Проверяем наличие API ключа при монтировании
  useEffect(() => {
    console.log('VITE_RHINO_API_KEY from import.meta.env:', apiKey);
    if (!apiKey) {
      setError('Rhino API key is missing');
      setIsLoading(false);
    } else {
      // Устанавливаем API ключ в rhinoApi
      rhinoApi.setApiKey(apiKey);
      setIsLoading(false);
    }
  }, [apiKey]);

  // Валидация формы
  const isFormValid = amount && parseFloat(amount) > 0 && solanaWallet && wallet?.account?.address;

  // Создание quote при наличии всех данных
  const createQuote = useCallback(async () => {
    if (!isFormValid || !apiKey) return;

    setIsLoading(true);
    setError('');
    setStatus('Создание котировки...');

    try {
      const result = await rhinoApi.createBridge(
        parseFloat(amount),
        solanaWallet,
        wallet.account.address
      );

      if (result.success) {
        setQuote(result);
        setIsTransactionReady(true);
        setStatus('Котировка создана. Готов к отправке транзакции.');
      } else {
        setError(result.error || 'Ошибка создания котировки');
        setStatus('');
      }
    } catch (err) {
      setError(err.message || 'Ошибка создания котировки');
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  }, [amount, solanaWallet, wallet?.account?.address, isFormValid, apiKey]);

  // Автоматическое создание quote при изменении данных
  useEffect(() => {
    if (isFormValid && !isTransactionReady && apiKey) {
      const timeoutId = setTimeout(() => {
        createQuote();
      }, 1000); // Дебаунс 1 секунда

      return () => clearTimeout(timeoutId);
    }
  }, [createQuote, isFormValid, isTransactionReady, apiKey]);

  // Сброс состояния при изменении данных формы
  useEffect(() => {
    setQuote(null);
    setIsTransactionReady(false);
    setError('');
    setStatus('');
  }, [amount, solanaWallet, wallet?.account?.address]);

  // Подключение кошелька
  const connectWallet = async () => {
    try {
      await tonConnectUI.openModal();
    } catch (err) {
      setError('Ошибка подключения кошелька');
    }
  };

  // Отправка транзакции
  const sendTransaction = async () => {
    if (!quote || !wallet) {
      setError('Нет данных для транзакции');
      return;
    }

    setIsLoading(true);
    setStatus('Отправка транзакции...');

    try {
      // Конвертируем сумму в нанотоны (для USDT jetton)
      const jettonAmount = quote.jettonAmount || amount;
      const nanoAmount = Math.floor(parseFloat(jettonAmount) * 1_000_000).toString(); // USDT имеет 6 десятичных знаков

      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 минут
        messages: [
          {
            address: quote.quote.payAddress || quote.quote.depositor, // Адрес для отправки
            amount: nanoAmount,
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      
      if (result) {
        setStatus('Транзакция отправлена! Отслеживание статуса...');
        
        // Начинаем отслеживание статуса
        setTimeout(() => {
          trackBridgeStatus(quote.transactionId);
        }, 5000);
      }
    } catch (err) {
      console.error('Transaction error:', err);
      setError(err.message || 'Ошибка отправки транзакции');
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  // Отслеживание статуса бриджа
  const trackBridgeStatus = async (quoteId) => {
    try {
      const statusData = await rhinoApi.checkBridgeStatus(quoteId);
      setStatus(`Статус: ${statusData.status}`);
      
      if (statusData.status === 'completed') {
        setStatus(`Бридж завершен! Получено: ${statusData.amountOut} USDT`);
      } else if (statusData.status === 'failed') {
        setError('Бридж не удался');
      } else {
        // Продолжаем отслеживание
        setTimeout(() => trackBridgeStatus(quoteId), 10000);
      }
    } catch (err) {
      console.error('Status check error:', err);
      setError('Ошибка проверки статуса');
    }
  };

  // Если нет API ключа, показываем ошибку
  if (!apiKey) {
    return (
      <div className="rhino-widget">
        <div className="rhino-widget__header">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>USDT Bridge: TON → Solana</h2>
        </div>
        <div className="error-message">
          Rhino API key is missing. Please check your environment variables.
        </div>
      </div>
    );
  }

  return (
    <div className="rhino-widget">
      <div className="rhino-widget__header">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>USDT Bridge: TON → Solana</h2>
      </div>

      <div className="rhino-widget__form">
        {/* Поле ввода суммы */}
        <div className="form-group">
          <label htmlFor="amount">Сумма USDT:</label>
          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму"
            disabled={isLoading}
          />
        </div>

        {/* Поле ввода Solana кошелька */}
        <div className="form-group">
          <label htmlFor="solana-wallet">Solana кошелек:</label>
          <input
            id="solana-wallet"
            type="text"
            value={solanaWallet}
            onChange={(e) => setSolanaWallet(e.target.value)}
            placeholder="Введите адрес Solana кошелька"
            disabled={isLoading}
          />
        </div>

        {/* Кнопка подключения TON кошелька */}
        <div className="form-group">
          <label>TON кошелек:</label>
          {wallet ? (
            <div className="wallet-info">
              <span>Подключен: {wallet.account.address.slice(0, 6)}...{wallet.account.address.slice(-4)}</span>
              <button 
                onClick={() => tonConnectUI.disconnect()}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Отключить
              </button>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="btn btn-primary"
              disabled={isLoading}
            >
              Подключить TON кошелек
            </button>
          )}
        </div>

        {/* Информация о котировке */}
        {quote && (
          <div className="quote-info">
            <h3>Информация о бридже:</h3>
            <p>К отправке: {quote.jettonAmount} USDT</p>
            <p>К получению: ~{quote.quote.receiveAmount} USDT</p>
            <p>Quote ID: {quote.transactionId}</p>
          </div>
        )}

        {/* Кнопка транзакции */}
        <button
          onClick={sendTransaction}
          disabled={!isTransactionReady || isLoading}
          className={`btn btn-transaction ${isTransactionReady ? 'btn-success' : 'btn-disabled'}`}
        >
          {isLoading ? 'Обработка...' : 'Отправить транзакцию'}
        </button>

        {/* Статус и ошибки */}
        {status && (
          <div className="status-message">
            {status}
          </div>
        )}

        {error && (
          <div className="error-message">
            Ошибка: {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RhinoWidget;
