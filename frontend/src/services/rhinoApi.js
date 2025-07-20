const RHINO_API_BASE = 'https://api.rhino.fi';

class RhinoAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.jwt = null;
  }

  // Метод для установки API ключа
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    this.jwt = null; // Сбрасываем кэшированный JWT при смене ключа
  }

  async getJwtToken() {
    if (!this.apiKey) {
      throw new Error('API key is not set');
    }

    if (this.jwt) return this.jwt; // Кэшируем токен

    const url = `${RHINO_API_BASE}/authentication/auth/apiKey`;
    const payload = { apiKey: this.apiKey };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to get JWT: ${response.status}`);
      }

      const data = await response.json();
      if (!data.jwt) {
        throw new Error('No JWT in auth response');
      }

      this.jwt = data.jwt;
      return this.jwt;
    } catch (error) {
      console.error('JWT auth error:', error);
      throw error;
    }
  }

  async getBridgeQuote(amount, tonWallet, solanaWallet) {
    const jwt = await this.getJwtToken();
    const url = `${RHINO_API_BASE}/bridge/quote/bridge-swap/user`;
    
    const payload = {
      chainIn: "TON",
      chainOut: "SOLANA",
      tokenIn: "USDT",
      tokenOut: "USDT",
      amount: amount.toString(),
      amountNative: "0.05",
      mode: "pay",
      depositor: tonWallet,
      recipient: solanaWallet
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'authorization': jwt,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to get bridge quote: ${response.status}`);
      }

      const data = await response.json();
      console.log('Bridge quote received:', { quoteId: data.quoteId, receiveAmount: data.receiveAmount });
      return data;
    } catch (error) {
      console.error('Bridge quote error:', error);
      throw error;
    }
  }

  async commitQuote(quoteId) {
    const jwt = await this.getJwtToken();
    const url = `${RHINO_API_BASE}/bridge/quote/commit/${quoteId}`;
    
    const payload = { quoteId };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'authorization': jwt,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to commit quote: ${response.status}`);
      }

      console.log('Quote committed:', quoteId);
      return true;
    } catch (error) {
      console.error('Commit quote error:', error);
      throw error;
    }
  }

  async checkBridgeStatus(quoteId) {
    const jwt = await this.getJwtToken();
    const url = `${RHINO_API_BASE}/bridge/history/bridge/${quoteId}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'authorization': jwt,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to check bridge status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Bridge status:', { quoteId, status: data.state });
      
      return {
        status: data.state?.toLowerCase() || 'pending',
        amountOut: data.amountOut || '0',
        solanaTxHash: data.withdrawTxHash || ''
      };
    } catch (error) {
      console.error('Check bridge status error:', error);
      throw error;
    }
  }

  async createBridge(amount, solanaWallet, tonWallet) {
    try {
      const quote = await this.getBridgeQuote(amount, tonWallet, solanaWallet);
      const quoteId = quote.quoteId;
      
      if (!quoteId) {
        throw new Error('No quoteId in bridge quote response');
      }

      await this.commitQuote(quoteId);
      const jettonAmount = quote.payAmount;
      
      console.log('Bridge created:', { quoteId, jettonAmount });
      
      return {
        success: true,
        transactionId: quoteId,
        jettonAmount: jettonAmount,
        quote: quote
      };
    } catch (error) {
      console.error('Create bridge error:', error);
      return { success: false, error: error.message };
    }
  }
}

// Создаем экземпляр API без ключа (будет установлен позже)
const rhinoApi = new RhinoAPI();

export default rhinoApi;
