const request = require("request");
const fs = require("fs");

module.exports.config = {
  name: "google",
  version: "2.0.0",
  hasPermission: 0,
  credits: "Táo mod Hoàng Ngọc Từ",
  description: "Tìm kiếm kết quả trên Google",
  usePrefix: true,
  commandCategory: "Công cụ",
  usages: "google [Text/Image URL]",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs": ""
  }
};

module.exports.run = function({ api, event, args }) {
  const textNeedSearch = args.join(" ");

  if (textNeedSearch.startsWith("http")) {
    const imageUrl = textNeedSearch;

    // Download the image
    const downloadImage = (url, path) => {
      request.head(url, (err, res, body) => {
        request(url)
          .pipe(fs.createWriteStream(path))
          .on("close", () => {
            // Perform Google reverse image search
            const apiUrl = `https://www.google.com/searchbyimage/upload`;
            const formData = {
              image_url: fs.createReadStream(path),
              hl: "en"
            };

            request.post({ url: apiUrl, formData }, (err, httpResponse, body) => {
              if (err) {
                api.sendMessage("Đã xảy ra lỗi khi tìm kiếm!", event.threadID, event.messageID);
              } else {
                const searchUrl = body.match(/HREF="([^"]+)/)[1];
                api.sendMessage(`[⚜️]➜ Link của bạn đây: ${searchUrl}`, event.threadID, event.messageID);
              }
            });
          });
      });
    };

    
    const randomFileName = `image_${Math.floor(Math.random() * 100000)}.jpg`;
    const filePath = `./${randomFileName}`;

    downloadImage(imageUrl, filePath);
  } else {
    const searchUrl = `https://www.google.com.vn/search?q=${encodeURIComponent(textNeedSearch)}`;
    api.sendMessage(`[⚜️]➜ Link của bạn đây: ${searchUrl}`, event.threadID, event.messageID);
  }
};