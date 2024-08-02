<p align="center"><a href="https://www.facebook.com/profile.php?id=100029043375434&mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
  <img src="https://i.postimg.cc/Ssn7nDLJ/AKI-GPT-3.png" width="50" style="margin-right: 10px;"></a>
</p>
<h5 align="center">
🔹BotPack v1.1.5
</h5>

> 🔹Sửa đổi bởi HNT còn được gọi là HNTBOT<br>
> 🔹File từ [Disme-Project](https://github.com/D-Jukie/Disme-Bot.git) của Phạm Văn Điển hay còn gọi là 𝗗-𝗝𝘂𝗸𝗶𝗲<br>
> 🔹Appstate được mã hóa khi REPL bắt đầu chạy.<br>
> 🔹Bạn có tùy chọn tạo các lệnh tùy chỉnh của riêng mình hoặc sao chép một tệp từ bot Mirai và dán tệp đó vào phần thay thế này.<br>
> 🔹Repl được sắp xếp gọn gàng!<br>
> 🔹Xin lưu ý rằng một số mã từ Mirai có thể không hoạt động ở đây. Nếu không, chúng có thể cần phải được khắc phục.<br>
> 🔹Bản thay thế này được trang bị các lệnh thân thiện với người mới bắt đầu, hoàn hảo cho những người mới bắt đầu.<br>
> 🔹Nếu bạn tình cờ gặp phải bất kỳ sự cố nào hoặc gặp phải bất kỳ lệnh không mong muốn nào, bạn có thể dễ dàng khắc phục chúng bằng cách chuyển đổi bản thay thế mới từ bản gốc.
<p align="center">
    <img align="center" alt="PNG" src="https://i.postimg.cc/MHvWvhmj/ezgif-com-crop.gif"/>
<h1 align='center'>
🚀 Có gì trong Repl này?
</h1></p>

- [x] usePrefix - là một cấu hình lệnh mới đã được Yan Maglinte sửa đổi để cung cấp cho người dùng tùy chọn tốt hơn để tắt hoặc bật việc sử dụng tiền tố.
- [x] REPL này có các lệnh thân thiện với người dùng được thiết kế cho mục đích giáo dục. Ngoài ra, người dùng có tùy chọn để tạo các lệnh tùy chỉnh của riêng họ nếu muốn. Xin lưu ý rằng bất kỳ lệnh nào được thêm vào bản thay thế này đều thuộc trách nhiệm của người dùng.
- [x] Tất cả các lệnh có sẵn ở đây đã được cải tiến và sửa đổi để tăng khả năng của chúng.

<h1 align="center">
Repl main
</h1>

> Bấm vào hình ảnh Replit này để truy cập trực tiếp Repl gốc và kiểm tra các bản cập nhật mới nhất!
<p align="center">
  <a href="https://replit.com/@Kenjiakira/BOT-ver-2?v=1" target="_blank" rel="noopener noreferrer"><img src="https://i.postimg.cc/RVjfM18D/Media-230515-183502.gif" width="100" /></a>
  
  <h1 align="center">
  About this repl!
  </h1>
  
>Đây là một tệp bot nhắn tin đơn giản đã được sửa đổi bởi Yan Maglinte từ kho lưu trữ MiraiV2. Mục đích của việc thay thế này là để duy trì một môi trường thân thiện và chỉ cung cấp các mục đích giáo dục. Bất kỳ lệnh sai nào được thêm vào tệp này sẽ hoàn toàn do bạn chịu trách nhiệm.

<p align="center">
    <img align="center" src="https://i.postimg.cc/Ssn7nDLJ/AKI-GPT-3.png" width="100"/>
<h1 align="center"> Starter Guide: </h1>
<details>
  <summary align="center"> 🇺🇲 [EN-US] Setup your REPL... </summary>
  
> <h6 align='center'>Here's how you can setup this Repl:<br><br>
> Please navigate to the 'config.json' file and add a name for your BOTNAME. Additionally, set a PREFIX for the bot and provide your FB_UID in the ADMINBOT. Adding your FB_UID will determine that you are the Bot Owner.<br><br>
> Here's an example on how to setup:<br></h6>
```bash
"BOTNAME": "BOT_NAME",
"PREFIX": "/",
"ADMINBOT": [
    "PASTE_YOUR_UID_HERE"
],
```
> <h6 align='center'>After configuring your settings, please paste your Facebook AppState into the appstate.json file within this REPL. Once you have done that, run the REPL immediately.</h6>
> <h5 align='center'>I have added new commands to this REPL. What should I do next?</h5>
> <h6 align='center'>As you review your command, you will notice the following:</h6>
```javascript
module.exports.config = {
	name: "admin",
	version: "1.0.5",
	hasPermssion: 2,
	credits: "Mirai Team",
	description: "Admin Settings",
	commandCategory: "Admin",
	usages: "[list/add/remove] [userID]",
  cooldowns: 5,
  dependencies: {
        "fs-extra": ""
    }
};
```
> <h6 align='center'>If you notice that the command does not have a "usePrefix" property, the code might not work. In such cases, you need to add a "usePrefix" property and set it to true if you want the command to require a PREFIX at the beginning, or false if you want to activate the command without using a PREFIX. Once you've done this, you'll be ready to go. By following this method, you can avoid errors effectively.</h6>
> <h5 align='center'>Now, take a look at the code below and observe the differences compared to the previous code I provided:</h5>
```javascript
module.exports.config = {
	name: "admin",
	version: "1.0.5",
	hasPermssion: 2,
	credits: "Mirai Team",
	description: "Admin Setting",
  usePrefix: false,
	commandCategory: "Admin",
	usages: "[list/add/remove] [userID]",
  cooldowns: 5,
  dependencies: {
        "fs-extra": ""
    }
};
```
> <h6 align='center'>In this code, a new property called "usePrefix" has been added to the "config" object and set to "false". This addition signifies that the command can now be activated without requiring the use of a prefix.</h6>
</details>




<details>
 <summary align="center">  🇻🇳 [VI] thiết lập REPL của bạn... </summary>

 > <h6 align='center'>Dưới đây là cách bạn có thể thiết lập Repl này:<br><br>
> Vui lòng điều hướng đến tệp 'config.json' và thêm tên cho BOTNAME của bạn. Ngoài ra, hãy đặt PREFIX cho bot và cung cấp fb_uid của bạn. Việc thêm FB_UID của bạn sẽ xác định rằng bạn là Chủ sở hữu Bot.<br><br>
> Sau đây là ví dụ về cách thiết lập:<br></h6>
```bash
"BOTNAME": "BOT_NAME",
"PREFIX": "/",
"ADMINBOT": [
     "PASTE_YOUR_UID_HERE"
],
```
> <h6 align='center'>Sau khi định cấu hình cài đặt của bạn, vui lòng dán Facebook AppState của bạn vào tệp appstate.json trong REPL này. Khi bạn đã hoàn thành việc đó, hãy chạy REPL ngay lập tức.</h6>
> <h5 align='center'>Tôi đã thêm các lệnh mới vào REPL này. Tôi nên làm gì tiếp theo?</h5>
> <h6 align='center'>Khi xem lại lệnh của mình, bạn sẽ nhận thấy những điều sau:</h6>
```javascript
module.exports.config = {
	name: "admin",
	version: "1.0.5",
	hasPermssion: 2,
	credits: "Mirai Team",
	description: "Admin Settings",
	commandCategory: "Admin",
	usages: "[list/add/remove] [userID]",
  cooldowns: 5,
  dependencies: {
        "fs-extra": ""
    }
};
```
> <h6 align='center'>Nếu bạn nhận thấy rằng lệnh không có thuộc tính "usePrefix", mã có thể không hoạt động. Trong những trường hợp như vậy, bạn cần thêm thuộc tính "usePrefix" và đặt thành true nếu bạn muốn lệnh yêu cầu PREFIX ngay từ đầu hoặc false nếu bạn muốn kích hoạt lệnh mà không sử dụng PREFIX. Một khi bạn đã làm điều này, bạn sẽ sẵn sàng để đi. Bằng cách làm theo phương pháp này, bạn có thể tránh lỗi một cách hiệu quả.</h6>
> <h5 align='center'>Bây giờ, hãy xem mã bên dưới và quan sát sự khác biệt so với mã trước đây tôi đã cung cấp:</h5>
```javascript
module.exports.config = {
	name: "admin",
	version: "1.0.5",
	hasPermssion: 2,
	credits: "Mirai Team",
	description: "Admin Setting",
  usePrefix: false,
	commandCategory: "Admin",
	usages: "[list/add/remove] [userID]",
  cooldowns: 5,
  dependencies: {
        "fs-extra": ""
    }
};
```
> <h6 align='center'>Trong mã này, một thuộc tính mới gọi là "usePrefix" đã được thêm vào đối tượng "config" và được đặt thành "false". Phần bổ sung này biểu thị rằng lệnh hiện có thể được kích hoạt mà không yêu cầu sử dụng tiền tố.</h6>
</details>


> <h6>Updated on: Jun 15, 2023<br>Creation Date: June 11, 2023</h6>