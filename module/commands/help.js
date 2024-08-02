const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const commandUsage = {};

module.exports.config = {
  name: "help",
  version: "1.2.0",
  hasPermission: 0,
  credits: "Hoàng Ngọc Từ",
  description: "Xem danh sách lệnh và thông tin chi tiết.",
  commandCategory: "System",
  usePrefix: true,
  usages: ".help [số trang] hoặc .help [tên lệnh]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const cmds = global.client.commands;
  const tid = event.threadID;
  const mid = event.messageID;
  const commandsPerPage = 20;
  const totalPages = Math.ceil(cmds.size / commandsPerPage);
  const page = args[0] && !isNaN(args[0]) ? parseInt(args[0]) : 1;
  const commandName = args[0] && isNaN(args[0]) ? args[0].toLowerCase() : null;
  let count = 0;

  if (commandName === "all") {
    // Hiển thị toàn bộ lệnh có trong hệ thống
    let allCommands = Array.from(cmds.values());
    let allCommandsList = "Danh sách toàn bộ lệnh có trong hệ thống:\n";

    for (const cmd of allCommands) {
      const config = cmd.config;
      const usage = config.usages ? config.usages : "Không có cách sử dụng được cung cấp.";
      allCommandsList += `>${++count}. 》 ${cmd.config.name}: ${cmd.config.description}\n`;
    }

    return api.sendMessage(allCommandsList, tid);
  }

  if (commandName) {
    if (!cmds.has(commandName)) {
      return api.sendMessage(`❗ Không tìm thấy lệnh '${commandName}' trong hệ thống.`, tid, mid);
    }
    const cmd = cmds.get(commandName);
    const config = cmd.config;
    const usage = config.usages ? config.usages : "Không có cách sử dụng được cung cấp.";
    const message = `》 ${config.name} 《\n➢ Cách sử dụng:\n ${usage}\n➢ Mô tả:\n ${config.description}\n➢ Tác giả: ${config.credits}\n➢ Phiên bản: ${config.version}\n`;
    return api.sendMessage(message, tid);
  }

  if (page < 1 || page > totalPages) {
    return api.sendMessage(`❗ Trang không hợp lệ. Vui lòng nhập từ 1 đến ${totalPages}.`, tid, mid);
  }

  const startIndex = (page - 1) * commandsPerPage;
  const endIndex = startIndex + commandsPerPage;
  const commandList = Array.from(cmds.values()).slice(startIndex, endIndex);

  let msg = `==𝐃𝐀𝐍𝐇 𝐒𝐀́𝐂𝐇 𝐋Ệ𝐍𝐇==\n\n`;
  let i = startIndex;

  for (const cmd of commandList) {
    msg += `\n>${++i}. ${cmd.config.name}: ${cmd.config.description}`;
  }

  msg += `\n» Tổng số trang: ${totalPages}`;
  msg += `\n\n»✅ Gõ help [số trang] để xem các lệnh ở trang khác.\nGõ help [tên lệnh] để xem thông tin chi tiết về lệnh.\nGõ help all để xem toàn bộ lệnh.`;
  msg += `\n\n BẢN QUYỀN THUỘC ©𝐇𝐍𝐓|2024`;

  const img = [
    "https://i.postimg.cc/KzsW3Wzr/images-86.jpg",
    "https://i.postimg.cc/fLXHkRGZ/c113eb0f980f3e8ee44c1421159dd71cfa6a0950.jpg",
    "https://i.postimg.cc/d0Z6S0td/create-fast-and-awesome-ai-art-with-midjourney-based-on-your-words.jpg",
    "https://imgur.com/eBiUv73.png",
    "https://imgur.com/D2lHK38.png",
    "https://imgur.com/9NRUAPx.png",
    "https://imgur.com/3e7pJk0.png",
    "https://imgur.com/noBYWeB.png",
    "https://imgur.com/SmCKYQs.png",
    "https://imgur.com/thARmPa.png",
    "https://imgur.com/o7TfNOi.png",
    "https://imgur.com/nCTAglM.png"
  ];
  const pathToSave = path.join(__dirname, "cache", "menu.png");
  const rdimg = img[Math.floor(Math.random() * img.length)];

  const downloadIMG = (await axios.get(rdimg, {
    responseType: "arraybuffer"
  })).data;
  fs.writeFileSync(pathToSave, Buffer.from(downloadIMG, "utf-8"));

  const messageObject = {
    body: msg,
    attachment: fs.createReadStream(pathToSave)
  };

  return api.sendMessage(messageObject, tid);
};
