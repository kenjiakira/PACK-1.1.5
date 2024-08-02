const axios = require('axios');

async function getExchangeRate(fromCurrency, toCurrency) {
  const apiKey = '91a90429dc63abfcf63e50a0'; 
  const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;

  try {
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data && data.rates && data.rates[toCurrency]) {
      return data.rates[toCurrency];
    } else {
      throw new Error(`Exchange rate not available for ${fromCurrency} to ${toCurrency}`);
    }
  } catch (error) {
    throw new Error(`Error fetching exchange rate data: ${error.message}`);
  }
}

function formatCurrency(amount, currency) {
  return amount.toLocaleString('en-US', { style: 'currency', currency });
}

module.exports.config = {
  name: "currency",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hoàng Ngọc Từ",
  description: "Quy đổi tiền tệ",
  commandCategory: "general",
  usePrefix: true,
  usages: "currency <số_tiền> <tiền_tệ_cần_đổi> <tiền_tệ_đích>",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  if (args.length < 3) {
    api.sendMessage(`Sử dụng: ${global.config.PREFIX}${module.exports.config.usages}`, event.threadID);
    return;
  }

  const [amountStr, fromCurrency, toCurrency] = args;
  const amount = parseFloat(amountStr.replace(/\./g, '').replace(',', '.'));

  if (!amount || isNaN(amount) || !fromCurrency || !toCurrency) {
    api.sendMessage(`Sử dụng: ${global.config.PREFIX}${module.exports.config.usages}`, event.threadID);
    return;
  }

  try {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const convertedAmount = amount * exchangeRate;
    const formattedAmount = formatCurrency(amount, fromCurrency);
    const formattedConvertedAmount = formatCurrency(convertedAmount, toCurrency);
    api.sendMessage(`${formattedAmount} quy ra bằng ${formattedConvertedAmount}`, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage('Đã xảy ra lỗi khi thực hiện quy đổi tiền tệ.', event.threadID);
  }
};
