const TelegramBot = require('node-telegram-bot-api');


const token = process.env.BOT_TOKEN;
const miniAppUrl = process.env.MINI_APP_URL;

if (!token || !miniAppUrl) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const options = {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🔄 Open Bridge',
          web_app: {
            url: miniAppUrl
          }
        }
      ]]
    }
  };

  bot.sendMessage(chatId, '🌉 TON ↔ SOL Bridge\n\nSwap USDT between TON and Solana networks securely.', options);
});

console.log('Bridge bot is running...');
