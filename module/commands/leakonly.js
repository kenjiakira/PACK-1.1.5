const fs = require('fs');
const axios = require('axios');
const path = require('path');

const cost = 100000;
const imagePath = path.join(__dirname, 'cache', 'imgur_urls.json');

function readOrCreateData() {
    if (!fs.existsSync(imagePath)) {
        fs.writeFileSync(imagePath, JSON.stringify([]), 'utf8');
    }
    const rawData = fs.readFileSync(imagePath);
    return JSON.parse(rawData);
}

module.exports.config = {
    name: "leakonly",
    version: "1.0.0",
    hasPermission: 0,
    credits: "Hoàng Ngọc Từ",
    description: "chỉ bán quạt",
    commandCategory: "Tài Chính",
    usePrefix: true,
    usages: "[]",
    cooldowns: 0
};

async function downloadImage(url, outputPath) {
    const response = await axios({
        url: url,
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

module.exports.run = async ({ api, event, Currencies }) => {
    const { senderID, threadID, messageID } = event;

  
    const userData = await Currencies.getData(senderID);
    const userMoney = userData.money || 0;

    if (userMoney < cost) {
        return api.sendMessage("Bạn không đủ tiền để nhận ảnh. Bạn cần ít nhất 100k xu.", threadID, messageID);
    }


    await Currencies.decreaseMoney(senderID, cost);


    const imgurImageUrls = readOrCreateData();

 
    const selectedUrls = [];
    while (selectedUrls.length < 15 && imgurImageUrls.length > 0) {
        const randomIndex = Math.floor(Math.random() * imgurImageUrls.length);
        const url = imgurImageUrls.splice(randomIndex, 1)[0];
        selectedUrls.push(url);
    }

 
    const imagePaths = [];
    try {
        for (const url of selectedUrls) {
            const outputPath = path.join(__dirname, 'cache', `temp_image_${Date.now()}.png`);
            await downloadImage(url, outputPath);
            imagePaths.push(outputPath);
        }

        
        api.sendMessage({
            body: "Ảnh của bạn đây \n-100.000 xu",
            attachment: imagePaths.map(filePath => fs.createReadStream(filePath))
        }, threadID, () => {
            
            imagePaths.forEach(filePath => fs.unlinkSync(filePath));
        }, messageID);
    } catch (error) {
        console.error('Lỗi khi tải ảnh:', error);
        return api.sendMessage("Có lỗi xảy ra khi tải ảnh. Vui lòng thử lại sau.", threadID, messageID);
    }
};
