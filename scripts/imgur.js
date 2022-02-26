module.exports = {
    config: {
        name: 'imgur',
        verion: '1.0.0',
        role: 0,
        author: ['chinhle'],
        description: '',
        location: __filename,
        timestamps: 0
    },
    onMessage: out,
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
}) {
  const axios = require("axios");  
var linkanh = event.messageReply.attachments[0].url || args.join(" ");
	if(!linkanh) return api.sendMessage('Vui lòng reply hoặc nhập link 1 hình ảnh!!!', event.threadID, event.messageID)
const res = await axios.get(`https://www.phamvandienofficial.xyz/imgur?link=${encodeURIComponent(linkanh)}`);    
var img = res.data.uploaded.image;
    return api.sendMessage(`${img}`, event.threadID, event.messageID);
	
}
