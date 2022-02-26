"use strict";
module.exports.config = {
    name: 'setting',
    role: 2,
    version: '1.0.0',
    author: 'D-Jukie',
    description: 'Quản lí chế độ only!',
    timestamps: 0
};

module.exports.onMessage = async function({ api, event, Threads, args, Config, getText, global }) {
    const { threadID, messageID, senderID } = event;
    const { ADMIN , EXCEPTION, adminOnly } = Config;
    const mode = args[0]

    const { writeFileSync } = require('fs-extra');
    const { resolve } = require("path");
    const thread = require('../app/database/threads.json');
    const path = resolve(__dirname, '../', 'app', 'database', 'threads.json');
    const config = require('../configMain.json');;

    switch(mode) {
        case 'box': {
            if(thread[threadID].data.onlyQTV == true) {
                thread[threadID].data.onlyQTV = false
            } else {
                thread[threadID].data.onlyQTV = true
            }
            await writeFileSync(path, JSON.stringify(thread, null, 2));
            return api.sendMessage(`${thread[threadID].data.onlyQTV ? 'Bật' : 'Tắt'} thành công chế độ quản trị viên mới có thể sử dụng bot!`, threadID, messageID)
        }
        case 'bot': {
            if (Config.adminOnly == false) {
                Config.adminOnly = true;
            } else {
                Config.adminOnly = false;
            }
            await writeFileSync(global.dirConfig, JSON.stringify(Config, null, 4), 'utf8');       
            return api.sendMessage(`${Config.adminOnly ? 'Bật' : 'Tắt'} thành công chế độ chỉ admin bot mới có thể sử dụng bot!`, threadID, messageID)
        }
        case 'pheduyet':
        case 'approve': 
        case 'pd': {
            if(global.config.ADMIN.includes(senderID) == false) return api.sendMessage('Bạn không đủ quyền hạn để thực hiện lệnh!', threadID, messageID);
            var data = await Threads.getAll()
            var msg = 'Danh sách các box chưa được phê duyệt\n'
            var num = 1, threadData = [];
            for(let i of global.allThreadID) {
                if(data[i].data.approve == false) {
                    threadData.push(i)
                    var name = (await Threads.getData(i)).name
                    msg += `${num++}. ${name}\n`
                }
            }
            msg += 'Vui lòng reply tin nhắn tương ứng với box bạn muốn duyệt!'
            return api.sendMessage(msg, threadID, (error, info) => {
                global.reply.push({
                    name: 'setting',
                    messageID: info.messageID,
                    author: event.senderID,
                    threadData: threadData
                })
            },
            messageID);
        }
        default: {
            return api.sendMessage('[====ADMIN BOT====]\nBot: Chế độ admin bot only\nPHEDUYET: Phê duyệt các nhóm (chỉ phê duyệt bot mới hoạt động ở nhóm đó!)\n[====NHÓM====]\nBOX: Ché độ chỉ admin nhóm (qtv) mới có thể sử dụng bot', threadID, messageID);
        }
    }
}
module.exports.onReply = async function({ event, api, reply, global, Threads, Config }) {
    const { threadID, senderID, messageID, body } = event;
    const { threadData, author } = reply;
    if(author != senderID) return;
    api.unsendMessage(reply.messageID);

    const { resolve } = require("path");
    const { writeFileSync } = require('fs-extra');
    const thread = require('../app/database/threads.json');
    const path = resolve(__dirname, '../', 'app', 'database', 'threads.json');

    thread[threadData[parseInt(body)-1]].data.approve = true
    await writeFileSync(path, JSON.stringify(thread, null, 2));
    api.sendMessage('[BOT ON] - Box của bạn đã được admin phê duyệt', threadData[parseInt(body)-1]);
    api.changeNickname(Config.NAME, threadData[parseInt(body)-1], api.getCurrentUserID());
    return api.sendMessage(`Phê duyệt thành công box ${(await Threads.getData(threadData[parseInt(body)-1])).name}!`, threadID, messageID)
}