const fs = require('fs');
const path = require('path');
const axios = require('axios');
const groupsPath = path.join(__dirname, '../../includes/handle/groups.json');
const notiPath = path.join(__dirname, 'cache', 'noti');

function readOrCreateGroupsData() {
    if (!fs.existsSync(groupsPath)) {
        fs.writeFileSync(groupsPath, JSON.stringify([]), 'utf8');
    }
    const rawData = fs.readFileSync(groupsPath);
    return JSON.parse(rawData);
}

function saveGroupsData(data) {
    fs.writeFileSync(groupsPath, JSON.stringify(data, null, 4), 'utf8');
}

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
}

module.exports.config = {
    name: "noti",
    version: "2.0.0",
    hasPermission: 2,
    credits: "HNT",
    description: "Gửi tin nhắn đến tất cả các nhóm",
    commandCategory: "admin",
    usePrefix: true,
    usages: "noti [nội dung]",
    cooldowns: 0
};

module.exports.run = async function({ event, api, args }) {
    const { threadID, messageID, senderID, messageReply } = event;

    if (!global.config.ADMINBOT.includes(senderID)) {
        return api.sendMessage("Bạn không có quyền sử dụng lệnh này.", threadID, messageID);
    }


    const messageContent = args.join(" ");
    const groups = readOrCreateGroupsData();

    if (!messageContent && !messageReply) {
        return api.sendMessage("Vui lòng nhập nội dung tin nhắn hoặc trả lời một ảnh hoặc video để gửi.", threadID, messageID);
    }

 
    const notificationMessage = `THÔNG BÁO TỪ ADMIN:\n\n${messageContent || ""}`;

    if (messageReply) {
        const { type, url } = messageReply.attachments[0];


        if (type === 'video') {
            const tempVideoPath = path.join(notiPath, 'temp_video.mp4');
            ensureDirectoryExistence(tempVideoPath);

            try {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                fs.writeFileSync(tempVideoPath, response.data);


                let sentCount = 0;
                for (const groupID of groups) {
                    try {
                        await api.sendMessage({ body: notificationMessage, attachment: fs.createReadStream(tempVideoPath) }, groupID);
                        sentCount++;
                    } catch (error) {
                        console.error(`Lỗi khi gửi video đến nhóm ${groupID}:`, error);
                    }
                }

      
                fs.unlinkSync(tempVideoPath);

                return api.sendMessage(`Đã gửi video đến ${sentCount} nhóm.`, threadID, messageID);
            } catch (error) {
                return api.sendMessage("Đã xảy ra lỗi khi tải video.", threadID, messageID);
            }
        }

        if (type === 'photo') {
            const tempImagePath = path.join(notiPath, 'temp_image.jpg');
            ensureDirectoryExistence(tempImagePath);

            try {
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                fs.writeFileSync(tempImagePath, response.data);

      
                let sentCount = 0;
                for (const groupID of groups) {
                    try {
                        await api.sendMessage({ body: notificationMessage, attachment: fs.createReadStream(tempImagePath) }, groupID);
                        sentCount++;
                    } catch (error) {
                        console.error(`Lỗi khi gửi ảnh đến nhóm ${groupID}:`, error);
                    }
                }

         
                fs.unlinkSync(tempImagePath);

                return api.sendMessage(`Đã gửi ảnh đến ${sentCount} nhóm.`, threadID, messageID);
            } catch (error) {
                return api.sendMessage("Đã xảy ra lỗi khi tải ảnh.", threadID, messageID);
            }
        }
    } else {

        if (groups.length === 0) {
            return api.sendMessage("Hiện tại bot không tham gia nhóm nào.", threadID, messageID);
        }

        let sentCount = 0;
        for (const groupID of groups) {
            try {
                await api.sendMessage(notificationMessage, groupID);
                sentCount++;
            } catch (error) {
                console.error(`Lỗi khi gửi tin nhắn đến nhóm ${groupID}:`, error);
            }
        }

        return api.sendMessage(`Đã gửi tin nhắn đến ${sentCount} nhóm.`, threadID, messageID);
    }
};

module.exports.handleEvent = function({ event }) {
    const { threadID } = event;
    const groups = readOrCreateGroupsData();

    if (!groups.includes(threadID)) {
        groups.push(threadID);
        saveGroupsData(groups);
    }
    return;
};
