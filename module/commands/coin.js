const fs = require('fs');
const path = require('path');
const cooldowns = new Map();
let coinValue = 100;
let previousCoinValue = coinValue;
let minCoinValue = 50; 

function updateCoinValue() {
    const changePercentage = Math.floor(Math.random() * (10 - (-10) + 1)) - 10;
    coinValue = Math.max(minCoinValue, previousCoinValue + Math.floor((previousCoinValue * changePercentage) / 100));
    previousCoinValue = coinValue;
}

setInterval(updateCoinValue, 60000);

function isTradingAllowed() {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 18 && hours < 19; 
}

module.exports.config = {
    name: "coin",
    version: "1.0.7",
    hasPermission: 2,
    credits: "Hoàng Ngọc Từ",
    description: "Đào coin để kiếm xu",
    commandCategory: "Kiếm Tiền",
    usePrefix: true,
    usages: ".coin | .coin check | .coin buy <số lượng> | .coin sell <số lượng>",
    cooldowns: 0
};

module.exports.run = async ({ event, api, Currencies }) => {
    const { senderID, threadID } = event;
    const args = event.body.trim().split(' ');

    try {
        if (args[1] === 'check') {
            const data = await Currencies.getData(senderID);
            const currentCoins = data.coins || 0;
            const changePercentage = ((coinValue - previousCoinValue) / previousCoinValue) * 100;
            const changeDirection = changePercentage > 0 ? "tăng" : "giảm";
            return api.sendMessage(`🪙 Giá trị của 1 coin hiện tại là: ${coinValue} xu.\nSố coin hiện tại của bạn: ${currentCoins} coin.\nTỉ giá thay đổi: ${changePercentage.toFixed(2)}% (${changeDirection}).`, threadID);
        } else if (args[1] === 'buy') {
            if (!isTradingAllowed()) {
                return api.sendMessage("🕒 Bạn chỉ có thể mua coin từ 6 giờ đến 7 giờ tối hàng ngày", threadID);
            }

            const quantity = parseInt(args[2]);

            if (!quantity || isNaN(quantity) || quantity <= 0) {
                return api.sendMessage("Vui lòng nhập số lượng coin hợp lệ để mua.", threadID);
            }

            const data = await Currencies.getData(senderID);
            const currentMoney = data.money || 0;
            const totalCost = quantity * coinValue;

            if (totalCost > currentMoney) {
                return api.sendMessage("Bạn không có đủ xu để mua số lượng coin này.", threadID);
            }

            const newMoney = currentMoney - totalCost;
            await Currencies.setData(senderID, { money: newMoney });

            const currentCoins = data.coins || 0;
            const newCoins = currentCoins + quantity;
            await Currencies.setData(senderID, { coins: newCoins });

            return api.sendMessage(`🪙 Bạn đã mua thành công ${quantity} coin với giá ${totalCost} xu.\nSố coin hiện tại của bạn: ${newCoins} coin.`, threadID);
        } else if (args[1] === 'sell') {
            if (!isTradingAllowed()) {
                return api.sendMessage("🕒 Bạn chỉ có thể bán coin từ 6 giờ đến 7 giờ tối hàng ngày", threadID);
            }

            const quantity = parseInt(args[2]);

            if (!quantity || isNaN(quantity) || quantity <= 0) {
                return api.sendMessage("Vui lòng nhập số lượng coin hợp lệ để bán.", threadID);
            }

            const data = await Currencies.getData(senderID);
            const currentCoins = data.coins || 0;

            if (quantity > currentCoins) {
                return api.sendMessage("Bạn không có đủ coin để bán số lượng coin này.", threadID);
            }

            const newCoins = currentCoins - quantity;
            await Currencies.setData(senderID, { coins: newCoins });

            const totalEarnings = quantity * coinValue;
            const currentMoney = data.money || 0;
            const newMoney = currentMoney + totalEarnings;
            await Currencies.setData(senderID, { money: newMoney });

            return api.sendMessage(`🪙 Bạn đã bán thành công ${quantity} coin với giá ${totalEarnings} xu.\nSố coin hiện tại của bạn: ${newCoins} coin.`, threadID);
        }

        if (cooldowns.has(senderID)) {
            const currentTime = Date.now();
            const cooldownTime = cooldowns.get(senderID);

            if (currentTime < cooldownTime) {
                const remainingCooldown = Math.ceil((cooldownTime - currentTime) / 1000);
                return api.sendMessage(`⏳ Bạn cần đợi thêm ${remainingCooldown} giây trước khi có thể đào coin tiếp.`, threadID);
            }
        }

        const success = Math.random() < 0.8;
        if (success) {
            const coinAmount = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
            const moneyEarned = coinAmount * coinValue;

            const data = await Currencies.getData(senderID);
            const currentMoney = data.money || 0;
            const newMoney = currentMoney + moneyEarned;

            await Currencies.setData(senderID, { money: newMoney });

            const currentTime = Date.now();
            const cooldownTime = currentTime + 900000;
            cooldowns.set(senderID, cooldownTime);

            return api.sendMessage(`🪙 Bạn đã đào được ${coinAmount} coin với giá ${coinValue} xu/coin.\nTổng số xu kiếm được: ${moneyEarned} xu`, threadID);
        } else {
            const penalty = Math.random() < 0.5 ? 0 : -20;
            const data = await Currencies.getData(senderID);
            const currentMoney = data.money || 0;
            const newMoney = currentMoney + penalty;

            await Currencies.setData(senderID, { money: newMoney });

            const currentTime = Date.now();
            const cooldownTime = currentTime + 300000;
            cooldowns.set(senderID, cooldownTime);

            if (penalty === 0) {
                return api.sendMessage(`Bạn đã đào một lượng nhỏ coin, nhưng không có gì xảy ra.\nSố xu hiện tại của bạn không thay đổi.`, threadID);
            } else {
                return api.sendMessage(`💣 Đào coin thất bại, bạn bị phạt -20 xu do bị Cảnh sát phát hiện.`, threadID);
            }
        }
    } catch (e) {
        console.error(e);
        return api.sendMessage("Có lỗi xảy ra trong quá trình đào coin hoặc giao dịch. Vui lòng thử lại sau.", threadID);
    }
};
