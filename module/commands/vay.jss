const fs = require('fs');

module.exports.config = {
    name: "vay",
    version: "1.0.0",
    hasPermission: 0,
    credits: "AKIRA",
    description: "Vay tiền từ 100 đến 10,000 xu hoặc trả nợ",
    commandCategory: "Kiếm Tiền",
    usages:"\nCÂU HỎI THƯỜNG GẶP\n\nLỗi thông báo 'Số tiền bạn có không đủ để vay'\nSố dư tài khoản không đủ:\nĐiều này có nghĩa rằng người dùng đã tiêu hết số tiền của họ hoặc số dư hiện có không đủ để đảm bảo việc vay một khoản tiền mới.\n\nSố tiền vay lớn hơn giới hạn hoặc nhỏ hơn mức tối thiểu cho phép:\nNếu số tiền cần vay nằm ngoài khoảng từ mức tối thiểu đến mức tối đa mà hệ thống cho phép, thông báo này sẽ xuất hiện.",
    usePrefix: true,
    cooldowns: 0
};

module.exports.run = async ({ event, api, Currencies, args }) => {
    const { senderID, threadID } = event;
    const loanAmountMin = 100;
    const loanAmountMax = 10000;

    try {
        const userData = await Currencies.getData(senderID);

        if (!userData) {
            await Currencies.setData(senderID, { money: 0, loan: 0, lastLoanTime: 0, bills: [] });
        }

        const userMoney = userData.money;
        const userLoan = userData.loan || 0;
        const lastLoanTime = userData.lastLoanTime || 0;
        const currentTime = Date.now();
        const timeDiff = currentTime - lastLoanTime;

        if (args[0] === 'repay') {
            const loanAmount = parseInt(args[1]);

            if (isNaN(loanAmount) || loanAmount <= 0) {
                return api.sendMessage("Số tiền trả nợ không hợp lệ. Vui lòng nhập số tiền lớn hơn 0.", threadID);
            }

            if (loanAmount > userLoan) {
                return api.sendMessage("Số tiền bạn trả nợ không được lớn hơn số tiền bạn đang nợ.", threadID);
            }

            if (userMoney < loanAmount) {
                return api.sendMessage("Số dư của bạn không đủ để trả khoản nợ này.", threadID);
            }

            const totalMoney = userMoney - loanAmount;
            const newLoanAmount = userLoan - loanAmount;

            const billInfo = {
                debtorName: event.senderID,
                debtorID: event.senderID,
                date: new Date(currentTime + 7 * 60 * 60 * 1000).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }), 
                term: "7 ngày 📅" 
            };

            const updatedBills = [...(userData.bills || []), billInfo];

            await Currencies.setData(senderID, { money: totalMoney, loan: newLoanAmount, lastLoanTime: currentTime, bills: updatedBills });
            api.sendMessage(`🏦 Bạn đã trả ${loanAmount} xu nợ thành công.\nSố tiền nợ còn lại: ${newLoanAmount} xu.\n\nSố dư hiện tại của bạn là ${totalMoney} xu.`, threadID);
            api.sendMessage(`🧾 Hóa đơn nợ của bạn:\nID người nợ: ${billInfo.debtorID}\nNgày: ${billInfo.date}\nKỳ hạn trả nợ: ${billInfo.term}`, threadID);
        } else if (args[0] === 'vay') {
            if (userLoan > 0) {
                return api.sendMessage("Bạn phải trả hết khoản nợ cũ trước khi vay tiền tiếp theo.", threadID);
            }

            const requestedAmount = parseInt(args[1]);

            if (isNaN(requestedAmount) || requestedAmount < loanAmountMin || requestedAmount > loanAmountMax) {
                return api.sendMessage(`Số tiền cần vay không hợp lệ. Vui lòng nhập số tiền từ ${loanAmountMin} đến ${loanAmountMax} xu.`, threadID);
            }

            if (userMoney >= requestedAmount) {
                const totalMoney = userMoney - requestedAmount;

                const billInfo = {
                    debtorName: event.senderID,
                    debtorID: event.senderID,
                    date: new Date(currentTime + 7 * 60 * 60 * 1000).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }), // Múi giờ +7 VN
                    term: "7 ngày 📅" // Emoji cho kỳ hạn
                };

                const updatedBills = [...(userData.bills || []), billInfo];

                await Currencies.setData(senderID, { money: totalMoney, loan: requestedAmount, lastLoanTime: currentTime, bills: updatedBills });
                api.sendMessage(`🏦 Bạn đã được vay ${requestedAmount} xu và số dư hiện tại của bạn là ${totalMoney} xu.`, threadID);
                api.sendMessage(`🧾 Hóa đơn nợ của bạn:\nID người nợ: ${billInfo.debtorID}\nNgày: ${billInfo.date}\nKỳ hạn trả nợ: ${billInfo.term}`, threadID);
            } else {
                api.sendMessage("❌ bạn không đủ điều kiện để vay. Vui lòng kiếm đủ số tiền tương đương hoặc hơn số tiền cần vay.", threadID);
            }
        } else if (args[0] === 'check') {
            if (userLoan === 0) {
                api.sendMessage(`💰 Bạn không có khoản nợ nào.`, threadID);
            } else {
                api.sendMessage(`💰 Số tiền nợ của bạn hiện tại là: ${userLoan} xu.`, threadID);
            }
        } else {
            return api.sendMessage(`
🌟 *Chính sách vay tiền:*

1. Số tiền vay từ 100 đến 10,000 xu.
2. Thời hạn trả tiền là 7 ngày.
3. Không giới hạn số lần vay, nhưng cần trả nợ trước khi vay tiếp.

💡 *Hướng dẫn cách vay/trả/kiểm tra nợ:*
- Để vay tiền: ".vay vay [số tiền cần vay]"
- Để trả nợ: ".vay repay [số tiền trả nợ]"
- Để kiểm tra số tiền nợ: ".vay check"

🚫 *Yêu cầu có thể vay:*
- Số tiền vay ngoài khoảng cho phép (100 - 10,000 xu).
- Số tiền vay lớn hơn số tiền hiện có.

**Lưu ý**: Chính sách vay tiền có thể thay đổi theo thời gian mà không cần thông báo trước.
`, threadID);
        }
    } catch (e) {
        console.error(e);
        api.sendMessage("Có lỗi xảy ra khi thực hiện giao dịch. Vui lòng thử lại sau.", threadID);
    }
};
