const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Jimp = require('jimp');
const Tesseract = require('tesseract.js');

const IMAGE_PATH = path.join(__dirname, 'cache', 'image.png');

// Hàm xử lý ảnh và nhận diện văn bản
async function readTextFromImage(imagePath) {
  try {
    // Tải ảnh và xử lý
    const image = await Jimp.read(imagePath);

    // Chuyển ảnh sang đen trắng và tăng độ tương phản
    image
      .greyscale()
      .contrast(1)
      .normalize();

    // Lưu ảnh đã xử lý
    const processedImagePath = path.join(__dirname, 'cache', 'processed_image.png');
    await image.writeAsync(processedImagePath);

    // Sử dụng Tesseract.js để nhận diện văn bản
    const result = await Tesseract.recognize(processedImagePath, 'vie+eng', { // Sử dụng mô hình tiếng Việt và tiếng Anh
      logger: info => console.log(info)
    });

    // Trả kết quả văn bản nhận diện
    return result.data.text;
  } catch (error) {
    console.error('Error while reading text from image:', error);
    throw error;
  }
}

module.exports.config = {
  name: "readtext",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Akira",
  description: "Đọc văn bản từ hình ảnh",
  commandCategory: "Công Cụ",
  usePrefix: true,
  usages: ".readtext | reply ảnh",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID, type, messageReply } = event;

  if (type === 'message_reply' && messageReply.attachments && messageReply.attachments.length > 0) {
    if (messageReply.attachments[0].type !== 'photo') {
      return api.sendMessage("» Bạn chỉ có thể quét văn bản từ ảnh!", threadID, messageID);
    }

    try {
      const imageUrl = messageReply.attachments[0].url;

      // Tải ảnh về để xử lý
      const response = await axios({
        url: imageUrl,
        responseType: 'arraybuffer'
      });
      const imageBuffer = response.data;

      // Lưu ảnh tạm thời
      const imagePath = path.join(__dirname, 'cache', 'image.png');
      fs.writeFileSync(imagePath, imageBuffer);

      // Đọc văn bản từ ảnh
      const text = await readTextFromImage(imagePath);

      // Gửi kết quả
      return api.sendMessage(`Văn bản từ ảnh là: ${text}`, threadID, messageID);
    } catch (error) {
      console.error('Error:', error);
      return api.sendMessage("» Đã xảy ra lỗi khi đọc văn bản từ ảnh.", threadID, messageID);
    }
  } else {
    return api.sendMessage("» Vui lòng trả lời một tin nhắn chứa ảnh để đọc văn bản.", threadID, messageID);
  }
};
