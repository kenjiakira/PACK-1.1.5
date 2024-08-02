const axios = require('axios');

module.exports.config = {
  name: "country",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hoàng Ngọc Từ",
  description: "Lấy thông tin về một quốc gia",
  commandCategory: "other",
  usePrefix: true,
  usages: "[tên quốc gia]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

module.exports.run = async function({ api, event, args }) {
  const countryName = args.join(' ');
  if (!countryName) return api.sendMessage("[ 🌍COUNTRY🌍 ] Vui lòng nhập tên quốc gia!", event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`);
    const countryData = response.data[0];
    if (!countryData) throw new Error();
    const { name, capital, population, area, languages, currencies } = countryData;

    let languagesList = '';
    for (const lang in languages) {
      languagesList += languages[lang] + ', ';
    }
    languagesList = languagesList.slice(0, -2);

    let currenciesList = '';
    for (const currency in currencies) {
      currenciesList += currencies[currency].name + ' (' + currencies[currency].symbol + '), ';
    }
    currenciesList = currenciesList.slice(0, -2);

    const formattedPopulation = formatNumber(population);
    const formattedArea = formatNumber(area);

    const message = `==Thông tin về quốc gia== \n   ===[${name.common}]===
        \n- Thủ đô🗼: ${capital}
        \n- Dân số👥: ${formattedPopulation}
        \n- Diện tích📌: ${formattedArea} km²
        \n- Ngôn ngữ chính📖: ${languagesList}
        \n- Tiền tệ💴: ${currenciesList}`;

    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage("[ 🌍COUNTRY🌍 ] Không tìm thấy thông tin về quốc gia này!", event.threadID, event.messageID);
  }
}