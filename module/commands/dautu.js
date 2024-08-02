const fs = require('fs');
const path = require('path');


const investmentOpportunities = [
  { id: 1, name: "Cổ Phiếu Công Nghệ", risk: 0.7, return: 3, description: "Đầu tư vào các cổ phiếu của công ty công nghệ hàng đầu." },
  { id: 2, name: "Bất Động Sản", risk: 0.5, return: 2, description: "Đầu tư vào bất động sản với khả năng tăng giá ổn định." },
  { id: 3, name: "Khởi Nghiệp", risk: 0.9, return: 5, description: "Đầu tư vào các dự án khởi nghiệp với nguy cơ cao nhưng lợi nhuận tiềm năng lớn." },
  { id: 4, name: "Vàng", risk: 0.3, return: 1.5, description: "Đầu tư vào vàng, tài sản an toàn với sự ổn định cao." },
  { id: 5, name: "Trái Phiếu Chính Phủ", risk: 0.2, return: 1.2, description: "Đầu tư vào trái phiếu chính phủ với lợi nhuận ổn định và ít rủi ro." },
  { id: 6, name: "Trái Phiếu Doanh Nghiệp", risk: 0.4, return: 1.8, description: "Đầu tư vào trái phiếu doanh nghiệp với lợi nhuận cao hơn nhưng rủi ro cũng lớn hơn." },
  { id: 7, name: "Quỹ Đầu Tư", risk: 0.6, return: 2.5, description: "Đầu tư vào quỹ đầu tư với đa dạng tài sản và quản lý chuyên nghiệp." }
];

const apiPath = path.join(__dirname, '../../includes/handle/cccd.json');

function readOrCreateData() {
    if (!fs.existsSync(apiPath)) {
        fs.writeFileSync(apiPath, JSON.stringify({}), 'utf8');
    }
    const rawData = fs.readFileSync(apiPath);
    return JSON.parse(rawData);
}

module.exports.config = {
  name: "dautu",
  version: "1.1.1",
  hasPermission: 0,
  credits: "Hoàng Ngọc Từ",
  description: "Đầu tư cổ phiếu.",
  commandCategory: "Finance",
  usePrefix: true,
  usages: ".dautu [số tiền]",
  cooldowns: 120
};

module.exports.run = async ({ event, api, Currencies }) => {
  const { senderID, threadID } = event;
  const args = event.body.trim().split(' ');

  
  const cccdData = readOrCreateData();


  if (!cccdData[senderID]) {
    return api.sendMessage("Bạn chưa có căn cước công dân. Vui lòng tạo căn cước công dân bằng lệnh .id trước khi đầu tư.", threadID);
  }

  if (cccdData[senderID].status === 'BAN') {
    return api.sendMessage("🔒 Bạn đã bị BAN và không thể thực hiện các lệnh đầu tư.", threadID);
  }


  if (args.length < 2) {
    return api.sendMessage("Vui lòng sử dụng đúng cú pháp: .dautu [số tiền]", threadID);
  }

  const amount = parseInt(args[1]);

  if (isNaN(amount) || amount <= 0) {
    return api.sendMessage("Số tiền không hợp lệ. Vui lòng nhập số tiền dương.", threadID);
  }

 
  const data = await Currencies.getData(senderID);
  const currentMoney = data.money || 0;

  if (currentMoney < amount) {
    return api.sendMessage("Bạn không đủ tiền để đầu tư.", threadID);
  }

  
  const randomIndex = Math.floor(Math.random() * investmentOpportunities.length);
  const opportunity = investmentOpportunities[randomIndex];


  const investmentOutcome = Math.random() < opportunity.risk ? 'thua lỗ' : 'lợi nhuận';
  const result = investmentOutcome === 'lợi nhuận' ? amount * opportunity.return : 0;

  await Currencies.decreaseMoney(senderID, amount);
  await Currencies.increaseMoney(senderID, result);

  return api.sendMessage(`📈 Đầu tư vào "${opportunity.name}" ${investmentOutcome.toUpperCase()}!\n` +
    `- Mô tả: ${opportunity.description}\n` +
    `- Rủi ro: ${opportunity.risk * 100}%\n` +
    `- Lợi nhuận: ${opportunity.return}x\n` +
    `- Bạn ${investmentOutcome === 'lợi nhuận' ? 'đã kiếm được' : 'đã mất'} ${result - amount} xu.\n` +
    `- Tiền đầu tư: ${amount} xu\n` +
    `- Tiền nhận được: ${result} xu`, threadID);
};
