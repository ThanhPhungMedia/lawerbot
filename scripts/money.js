    "use strict";
    module.exports.config = {
        name: 'money',
        role: 0,
        version: '1.0.0',
        author: 'D-Jukie',
        description: 'Kiểm tra tiền của bạn!',
        HDSD: '[set/reset/top/pay/null]',
        timestamps: 0
    };

    module.exports.onMessage = async function({ api, event, Users, args, global }) {
        const { threadID, senderID, messageID, mentions } = event;
        const { resolve } = require("path");
        const { writeFileSync } = require('fs-extra');
        const user = require('../app/database/users.json');
        const path = resolve(__dirname, '../', 'app', 'database', 'users.json');
        var mention = Object.keys(mentions);
        var type = args.join(" ");
        var set = args[0]
        var moneySet = type.slice(type.lastIndexOf(" ") + 1)
        switch(set.toLowerCase()) {
            case 'set':
            case 's':
            case '-s': {
                if(global.config.ADMIN.includes(senderID) == false) return api.sendMessage('Bạn không đủ quyền hạn để thực hiện lệnh!', threadID, messageID);
                if(moneySet == 'set' || moneySet == 's' || moneySet == '-s') return api.sendMessage('Bạn chưa nhập số tiền cần chuyển', threadID, messageID)
                if (event.type == "message_reply") {
                    var uid = event.messageReply.senderID;
                    user[uid].money = user[uid].money + parseInt(moneySet)
                }
                if(mention.length !== 0) {
                    var uid = mention[0]
                    user[mention[0]].money = user[mention[0]].money + parseInt(moneySet)
                }
                if(!uid) return api.sendMessage('Bạn phải tag hoặc reply tin nhắn của người cần reset tiền!', threadID, messageID);
                await writeFileSync(path, JSON.stringify(user, null, 2));
                return api.sendMessage(`Đã cộng vào tài khoản của ${(await Users.getData(uid)).name} số tiền ${moneySet}$`, threadID, messageID);
            }
            case 'reset':
            case 'r':
            case '-r': {
                if(global.config.ADMIN.includes(senderID) == false) return api.sendMessage('Bạn không đủ quyền hạn để thực hiện lệnh!', threadID, messageID);
                if (event.type == "message_reply") {
                    var uid = event.messageReply.senderID;
                    user[uid].money = 0
                }
                if(mention.length !== 0) {
                    var uid = mention[0]
                    user[mention[0]].money = 0
                }
                if(!uid) return api.sendMessage('Bạn phải tag hoặc reply tin nhắn của người cần reset tiền!', threadID, messageID);
                await writeFileSync(path, JSON.stringify(user, null, 2));
                return api.sendMessage(`Đã đặt số tiền của ${(await Users.getData(uid)).name} về 0$`, threadID, messageID);
            }
            case 'top':
            case 't':
            case '-t': {
                var money = [];
                for( let i of global.allUserID) {
                    var U = await Users.getData(i)
                    money.push({ name: U.name, money: U.money, id: U.id });
                }
                money.sort(function (a, b) { return b.money - a.money });
                var msg = '[====TOP MONEY SERVER====]\n'
                for (var i = 0; i < 15; i++) {
                    msg += `${i+1}. ${money[i].name} - ${money[i].money}$\n`
                }
                return api.sendMessage(msg, threadID, messageID);          
            }
            case 'pay':
            case 'p':
            case '-p': {
                var getData = (await Users.getData(senderID)).money
                if(moneySet == 'pay' || moneySet == 'p' || moneySet == '-p') return api.sendMessage('Bạn chưa nhập số tiền cần chuyển', threadID, messageID)
                if(getData < parseInt(moneySet)) return api.sendMessage('Tài khoản của bạn không đủ tiền để chuyển!', threadID, messageID);
                if (event.type == "message_reply") {
                    var uid = event.messageReply.senderID;
                        user[uid].money = user[uid].money + parseInt(moneySet)
                        user[senderID].money = user[senderID].money - parseInt(moneySet)
                }
                if(mention.length !== 0) {
                    var uid = mention[0]
                        user[uid].money = user[uid].money + parseInt(moneySet)
                        user[senderID].money = user[senderID].money - parseInt(moneySet)
                }
                if(!uid) return api.sendMessage('Bạn phải tag hoặc reply tin nhắn của người cần nhận tiền!', threadID, messageID);
                await writeFileSync(path, JSON.stringify(user, null, 2));
                return api.sendMessage(`Đã chuyển vào tài khoản của ${(await Users.getData(uid)).name} số tiền ${moneySet}$`, threadID, messageID);
            }
            default: {
                var money = [], count = 0
                for(const user of global.allUserID) {
                    var get = await Users.getData(user)
                        count += get.money
                        money.push({ name: get.name, money: get.money, id: get.id });
                }
                money.sort(function (a, b) { return b.money - a.money });
                const rank = money.findIndex(i => i.id == senderID);
                return api.sendMessage(`👤Tên: ${money[rank].name}\n🏆Rank Money: ${rank + 1}\n💰Số tiền hiện có: ${money[rank].money}\n💹Tỉ lệ tiền trên server: ${(money[rank].money/count*100).toFixed(0)}%`, threadID, messageID);
            }
        }
    }