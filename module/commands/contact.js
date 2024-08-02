const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "contact",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Hoàng Ngọc Từ",
  description: "Xem thông tin liên lạc với ADMIN.",
  commandCategory: "Tiện ích",
  usePrefix: true,
  usages: "contact",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  const adminContactInfo = `
    📞 **Thông tin liên lạc với ADMIN:**

    -Tên ADMIN: Hoàng Ngọc Từ 👤
    -Email: kenjiakira2006@gmail.com 📧
    -Facebook: https://www.facebook.com/hoangngoctucdbk12345vippro 🌐

    Nếu bạn cần hỗ trợ thêm, hãy liên hệ với ADMIN qua thông tin trên. 🤝
  `;

  const gifPath = path.join(__dirname, 'cache', 'contact', 'contact.gif');

  api.sendMessage({
    body: adminContactInfo,
    attachment: fs.createReadStream(gifPath)
  }, threadID, messageID);
};
