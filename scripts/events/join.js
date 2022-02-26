'use strict';
module.exports.config = {
    name: 'join',
    version: '1.0.0',
    author: 'D-Jukie'
};

module.exports.onMessage = async function({ api, event, Threads, args, Config, getText }) {
  const { threadID } = event;
  var getPrefix = Config.PREFIX
  var getNameBot = Config.NAME
  if (event.logMessageType == 'log:subscribe') {    
    let { name } = await Threads.getData(threadID);
    let participantIDs = event.participantIDs
    var nameArray = [], memLength = [], i = 0;
    var memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId)
    for (let idUser of memJoin) {
      var namee1 = await api.getUserInfo(idUser)
      var userName = namee1[idUser].name
          nameArray.push(userName);
          memLength.push(participantIDs.length - i++);
    } 
    memLength.sort((a, b) => a - b);
    var msg = `👋Welcome {name}.\nChào mừng đã đến với {threadName}.\n{type} là thành viên thứ {soThanhVien} của nhóm 🥳`
    msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{type}/g, (memLength.length > 1) ?  'các bạn' : 'bạn')
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, name);
    return api.sendMessage(msg, threadID);
  }
}