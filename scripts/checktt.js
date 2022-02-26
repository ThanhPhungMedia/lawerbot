"use strict";
module.exports.config = {
    name: 'checktt',
    role: 0,
    version: '1.0.0',
    author: 'D-Jukie',
    description: 'Kiểm tra lượng tương tác của bạn hoặc các thành vien trong nhóm',
    timestamps: 0
};

module.exports.onMessage = async function({ api, event, Threads, Users, args, Config, getText }) {
     const { threadID, senderID, messageID, type, mentions } = event;
    var mention = Object.keys(mentions);
    if (args[0] == "all") {
        var msg = "", exp = [], i = 1, count = 0
        var get = (await Threads.getData(threadID)).members
        for(const user of event.participantIDs) {
            if(get[user].inGroup == true) {
                exp.push({ name: get[user].name, exp: get[user].exp, id: get[user].id });
            }
        }
        exp.sort(function (a, b) { return b.exp - a.exp });
        for (const user of exp) { 
            count += user.exp
            msg += `[${i++}]: ${user.name} với ${user.exp} tin nhắn.\n`
        }
        return api.sendMessage(`[====KIỂM TRA TƯƠNG TÁC===]\n\n` + msg + `\nTổng số tin nhắn của nhóm là ${count}`, threadID, messageID);
    }
    else 
        if(type == "message_reply") { mention[0] = event.messageReply.senderID }
        if (mention[0]) {
            var exp = [], count = 0
            var get = (await Threads.getData(threadID)).members
            for(const user of event.participantIDs) {
                if(get[user].inGroup == true) {
                    count += get[user].exp
                    exp.push({ name: get[user].name, exp: get[user].exp, id: get[user].id });
                }
            }
            exp.sort(function (a, b) { return b.exp - a.exp });
            const rank = exp.findIndex(i => i.id == mention[0])
            console.log(exp[rank])
            return api.sendMessage(`👤Tên: ${exp[rank].name}\n🏆Rank: ${rank + 1}\n💬Tin nhắn: ${exp[rank].exp}\n💹Tỉ lệ tương tác: ${(exp[rank].exp/count*100).toFixed(0)}%`, threadID, messageID);
        }
    else {
        var exp = [], count = 0
        var get = (await Threads.getData(threadID)).members
        for(const user of event.participantIDs) {
            if(get[user].inGroup == true) {
                count += get[user].exp
                exp.push({ name: get[user].name, exp: get[user].exp, id: get[user].id });
            }
        }
        exp.sort(function (a, b) { return b.exp - a.exp });
        const rank = exp.findIndex(i => i.id == senderID);
        return api.sendMessage(`👤Tên: ${exp[rank].name}\n🏆Rank: ${rank + 1}\n💬Tin nhắn: ${exp[rank].exp}\n💹Tỉ lệ tương tác: ${(exp[rank].exp/count*100).toFixed(0)}%`, threadID, messageID);
    }
}