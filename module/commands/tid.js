const fs = require('fs');
const path = require('path');
const groupsPath = path.join(__dirname, '../../includes/handle/groups.json');

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

module.exports.config = {
  name: "tid",
  version: "1.0.1",
  hasPermission: 0,
  credits: "Akira",
  description: "Lấy TID và thông tin nhóm",
  commandCategory: "Công Cụ",
  usePrefix: true,
  usages: [".tid", ".tid creator"],
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const args = event.body.trim().split(" ");
  const threadID = event.threadID;
  const threadInfo = await api.getThreadInfo(threadID);
  const groupName = threadInfo.name;
  const threadType = threadInfo.threadType;

  // Kiểm tra nếu lệnh có sử dụng cú pháp chính xác
  if (args.length < 1 || !["", "creator"].includes(args[1].toLowerCase())) {
    return api.sendMessage("Không có chức năng tuỳ chọn hợp lệ. Vui lòng sử dụng `.tid` hoặc `.tid creator`", event.threadID);
  }

  // Lưu threadID vào danh sách các nhóm chỉ khi lệnh có cú pháp đúng
  const groups = readOrCreateGroupsData();
  if (!groups.includes(threadID)) {
      groups.push(threadID);
      saveGroupsData(groups);
  }

  if (args.length === 1) {
    const message = `Thông tin nhóm:\n- Tên nhóm: ${groupName}\n- TID: ${threadID}\n- Loại nhóm: ${threadType}`;
    return api.sendMessage(message, event.threadID);
  }

  const option = args[1].toLowerCase();
  switch (option) {
    case "creator":
      const creatorID = threadInfo.creatorID;
      const creator = await api.getUserInfo(creatorID);
      if (creator && creator[creatorID]) {
        const creatorName = creator[creatorID].name;
        api.sendMessage(`Người tạo nhóm: ${creatorName}`, event.threadID);
      } else {
        api.sendMessage(`Không thể lấy thông tin người tạo nhóm.`, event.threadID);
      }
      break;
    default:
      api.sendMessage("Không có chức năng tuỳ chọn hợp lệ. Vui lòng sử dụng `.tid` hoặc `.tid creator`", event.threadID);
      break;
  }
};
