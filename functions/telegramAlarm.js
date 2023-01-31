

const TelegramBot = require('node-telegram-bot-api');

const telegram = () => {    
    const token = 'YOUR_TELEGRAM_BOT_TOKEN';
    const bot = new TelegramBot(token, {polling: true});

    bot.sendMessage("Hello, this is a test")
}

module.exports = { telegramAlarm }