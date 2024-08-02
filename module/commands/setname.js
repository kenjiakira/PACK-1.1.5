module.exports.config = {
  name: "setname",
  version: "1.0",
  hasPermssion: 0,
  credits: "HNT",
  description: "Đặt biệt danh cho người dùng trong nhóm",
  commandCategory: "System",
  usePrefix: true,
  usages: "setname [biệt danh]",
  cooldowns: 5,
};

module.exports.run = async function ({ event, args, api }) {
  const newName = args.join(" ");
  
  if (!newName) {
    api.sendMessage("Vui lòng nhập biệt danh mới để đặt.", event.threadID);
    return;
  }
  
  const targetUserID = event.type == 'message_reply' ? event.messageReply.senderID : Object.keys(event.mentions)[0];
  
  if (!targetUserID) {
    api.sendMessage("Vui lòng đề cập hoặc reply người dùng để đặt biệt danh.", event.threadID);
    return;
  }
  
  api.changeNickname(newName, event.threadID, targetUserID, (error) => {
    if (!error) {
      api.sendMessage(`Thay đổi biệt danh thành công!`, event.threadID);
    } else {
      api.sendMessage(`Có lỗi xảy ra khi thay đổi biệt danh.`, event.threadID);
    }
  });
};
