'use strict';
module.exports = {
  config: {
    name: 'zing',
    ver: '1.0.0',
    role: 0,
    author: ['Lawer Team'],
    description: 'Phát nhạc thông qua tìm kiếm zing.',
    location: __filename,
    timestamps: 5
  },
  onMessage: out
};

async function out({ event, api, global, Config, logger, Threads, Users, args, body, is }) {
  const axios = require('axios')
  const fs = require("fs-extra");
  const request = require("request");
  if (!args[0]) return api.sendMessage('» Phần tìm kiếm không được để trống!', event.threadID, event.messageID);
  const keywordSearch = args.join(" ");
  try {
    var res = (await axios.get(`https://api.leanhtruong.net/v2/zingmp3.php?get=true&search=${encodeURIComponent(keywordSearch)}`)).data;
    var dataMusic = res, msg = '', num = 0, id = [], namee = [];
    for (var i = 0; i < 6; i++) {
      if (decodeURIComponent(dataMusic.search_result[i].name) != 'null') {
        msg += `${num += 1}. » Tên Bài hát : ${decodeURIComponent(dataMusic.search_result[i].name)}\n» Ca Sĩ : ${dataMusic.search_result[i].artist}\n`;
        id.push((dataMusic.search_result[i].id).id)
        namee.push(decodeURIComponent(dataMusic.search_result[i].name))
      }
    }
    return api.sendMessage(`🔎Có ${id.length} kết quả trùng với từ khoá tìm kiếm của bạn:\n\n${msg}\n» Hãy reply(phản hồi) chọn một trong những tìm kiếm trên`, event.threadID,
      (error, info) =>
        global.reply.push({
          name: is.config.name,
          messageID: info.messageID,
          author: event.senderID,
          id,
          namee
        }),
      event.messageID);
  }
  catch{
    api.sendMessage(`» Không tìm thấy từ khoá, xin thử lại với kết quả khác!`, event.threadID, event.messageID);
  }
}
async function reply({ event, api, global, Config, logger, Threads, Users, reply, is }) {
  const { id, messageID, namee } = reply;
  const axios = require('axios')
  const fs = require("fs-extra");
  const request = require("request");
  return;
  try {
    const downloadLink = (await axios.get(`http://api.mp3.zing.vn/api/streaming/audio/${id[event.body - 1]}/320`, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/cache/${id[event.body - 1]}.m4a`, Buffer.from(downloadLink, "utf-8"));
    api.unsendMessage(messageID)
    if (fs.statSync(__dirname + `/cache/${id[event.body - 1]}.m4a`).size > 26000000) return api.sendMessage('» Không thể gửi file vì dung lượng lớn hơn 25MB.', event.threadID, () => unlinkSync(__dirname + `/cache/${id[event.body - 1]}.m4a`), event.messageID);
    else return api.sendMessage({
      body: `${namee[event.body - 1]}`,
      attachment: fs.createReadStream(__dirname + `/cache/${id[event.body - 1]}.m4a`)
    }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${id[event.body - 1]}.m4a`), event.messageID)
  } catch {
    return api.sendMessage('» Không thể xử lý yêu cầu của bạn!', event.threadID, event.messageID);
  }
  return api.unsendMessage(messageID);
}