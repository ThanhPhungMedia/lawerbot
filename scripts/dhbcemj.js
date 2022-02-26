'use strict';
const timeout = 120
module.exports = {
    config: {
        name: 'dhbcemj',
        verion: '1.0.0',
        role: 0,
        author: ['Lawer-team'],
        description: '',
        location: __filename,
        timestamps: 0
    },
    onMessage: out,
    onReply: reply
};
async function out({
    event,
    api,
    global,
    Config,
    logger,
    Threads,
    Users,
    args,
    body,
    is
}) 

{
  const axios = require("axios");
    const fs = require("fs-extra");
    const { threadID, messageID } = event;
    const datagame = (await axios.get("https://goatbot.tk/api/duoihinhbatchuemoji")).data;
    const random = datagame.data;
     var msg = {body: `Hãy reply tin nhắn này với câu trả lời\n${random.emoji1}${random.emoji2}\n${random.wordcomplete.replace(/\S/g, "█ ")}`}
        return api.sendMessage(msg, event.threadID, (error, info) => {
        return global.reply.push({
            type: "reply",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            
           wordcomplete: random.wordcomplete
        })
setTimeout(function(){ 
        api.unsendMessage(info.messageID)
        }, timeout*1000);
    }) 
}
async function reply({
    event,
    api,
    global,
    Config,
    reply,
    is
}) {
    const axios = require("axios"); 
    let { author, wordcomplete, messageID } = reply;
   
    if (event.senderID != author) return api.sendMessage("Bạn không phải là người chơi của câu hỏi này", event.threadID, event.messageID); 
    switch (reply.type) {
        case "reply": {
          function formatText (text) {
      return text.normalize("NFD")
      .toLowerCase()
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
    }
    
    (formatText(event.body) == formatText(wordcomplete)) ? api.sendMessage(`Chúc mừng bạn đã trả lời đúng đáp án là : ${wordcomplete} `, event.threadID, event.messageID) : api.sendMessage(`Opps, Sai rồi đáp án chính xác là : ${wordcomplete}`,event.threadID, event.messageID),
    api.unsendMessage(reply.messageID);
        }
    }
}