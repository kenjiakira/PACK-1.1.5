const fs = require('fs');
const path = require('path');
const taxRecipientUID = "100029043375434";

module.exports.config = {
  name: "tx",
  version: "0.1.6",
  hasPermission: 0,
  credits: "Akira",
  description: "Chơi tài xỉu",
  commandCategory: "Mini Game",
  usePrefix: true,
  usages: "Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]",
  cooldowns: 10
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const diceImagesPath = path.join(__dirname, 'dice_images');

const sendResultWithImages = async (api, threadID, message, diceNumbers) => {
  try {

    const imageAttachments = diceNumbers.map(diceNumber => {
      const diceImagePath = path.join(diceImagesPath, `dice${diceNumber}.png`);
      return fs.createReadStream(diceImagePath);
    });

    await api.sendMessage({
      body: message,
      attachment: imageAttachments
    }, threadID);
  } catch (error) {
    console.error("Lỗi khi gửi hình ảnh xúc xắc và văn bản:", error);
  }
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
  const { threadID, messageID, senderID } = event;

  try {
    if (!args[0]) return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);

    const dataMoney = await Currencies.getData(senderID);
    const userData = await Users.getData(senderID);

    if (!dataMoney || !dataMoney.hasOwnProperty('money')) {
      return api.sendMessage("Bạn không có tiền.", threadID, messageID);
    }

    const moneyUser = dataMoney.money;
    const choose = args[0].toLowerCase();

    if (choose !== 'tài' && choose !== 'xỉu')
      return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);

    if (!args[1])
      return api.sendMessage("Bạn chưa nhập đúng cú pháp. Hãy sử dụng: tx [tài/xỉu] [số xu hoặc Allin]", threadID, messageID);

    let money = 0;
    const maxBet = 10000000;

    if (args[1].toLowerCase() === 'allin') {
      money = moneyUser;
    } else {
      money = parseInt(args[1]);
      if (money < 10 || isNaN(money) || money > maxBet)
        return api.sendMessage("Mức đặt cược không hợp lệ hoặc cao hơn 100K xu!!!", threadID, messageID);
      if (moneyUser < money)
        return api.sendMessage(`Số dư của bạn không đủ ${money} xu để chơi`, threadID, messageID);
    }

    const dices = [];
    let totalDice = 0;

    const rollDice = async () => {
      const dice = Math.floor(Math.random() * 6) + 1;
      dices.push(dice);
      totalDice += dice;
      return dice;
    };

  
    await api.sendMessage("❄️ 🎲 Đang lắc xúc xắc, vui lòng đợi  giây...", threadID);
    await sleep(2000); 

  
    const dice1 = await rollDice();
    const dice2 = await rollDice();
    const dice3 = await rollDice();

    let result = '';
    let winnings = 0;
    let taxRate = 0.01;

    if (money >= 100 && money < 100000) {
      taxRate = 0.01;
    }

    if (choose === 'xỉu' && totalDice >= 4 && totalDice <= 10) {
      result = 'thắng';
      const tax = Math.floor(money * taxRate);
      const totalMoney = money - tax;
      winnings = totalMoney * 1;
    } else if (choose === 'tài' && totalDice >= 11 && totalDice <= 17) {
      result = 'thắng';
      const tax = Math.floor(money * taxRate);
      const totalMoney = money - tax;
      winnings = totalMoney * 1;
    } else if (totalDice === 3 || totalDice === 18) {
      result = 'hoàn tiền';
    } else {
      result = 'thua';
    }

    let winnerName = userData.name;
    if (result !== 'thắng') {
      winnerName = "Bot";
    }

    if (result === 'thắng') {
      const tax = Math.floor(money * taxRate);
      await Currencies.decreaseMoney(senderID, tax);
      await Currencies.increaseMoney(taxRecipientUID, tax);
      await Currencies.increaseMoney(senderID, winnings);

      await sendResultWithImages(
        api,
        threadID,
        `🎲 ❄️ Kết quả: ${dices.join(' + ')} = ${totalDice}\n${winnerName} đã ${result}! 💰💰💰\nSố tiền đặt cược: ${money} xu\nTiền thắng: ${winnings} xu\nThuế (-${taxRate * 100}%): ${tax} xu\nTiền thuế đã được chuyển tới ADMIN để Phát Lộc`,
        dices
      );
    } else if (result === 'hoàn tiền') {
      await Currencies.increaseMoney(senderID, parseInt(money));
      await sendResultWithImages(
        api,
        threadID,
        `🎲 ❄️ Kết quả: ${dices.join(' + ')} = ${totalDice}\n${winnerName} đã ${result}! Không có tiền thắng hoặc tiền thua.\nSố tiền đặt cược: ${money} xu\nChúc bạn may mắn lần sau! 🍀🍀🍀`,
        dices
      );
    } else {
      await Currencies.decreaseMoney(senderID, parseInt(money));
      await sendResultWithImages(
        api,
        threadID,
        `🎲 ❄️ Kết quả: ${dices.join(' + ')} = ${totalDice}\n${winnerName} đã ${result}! 😢😢😢\nSố tiền đặt cược: ${money} xu\nChúc bạn may mắn lần sau! 🍀🍀🍀`,
        dices
      );
    }
  } catch (error) {
    console.error("Lỗi trong quá trình thực hiện lệnh:", error);
    api.sendMessage("Đã xảy ra lỗi trong quá trình thực hiện lệnh. Vui lòng thử lại sau.", threadID, messageID);
  }
};
