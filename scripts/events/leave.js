'use strict';
module.exports.config = {
    name: 'leave',
    version: '1.0.0',
    author: 'D-Jukie'
};

module.exports.onMessage = async function({ api, event, Threads, Users, args, Config, getText }) {
  const { threadID } = event;
  if (event.logMessageType == 'log:unsubscribe') {
      const name = (await Users.getData(event.logMessageData.leftParticipantFbId)).name;
      const type = (event.author == event.logMessageData.leftParticipantFbId) ? "tàng hình" : "bị quản trị sút khỏi nhóm";
      var msg = "{name} đã {type} khỏi nhóm"
      msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type);
      await Threads.refreshInfo(threadID)
      return api.sendMessage(msg, threadID);
  }
  else return;
}