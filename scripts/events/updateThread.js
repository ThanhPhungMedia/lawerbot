'use strict';
module.exports.config = {
    name: 'updateAdmin',
    version: '1.0.0',
    author: 'D-Jukie'
};

module.exports.onMessage = async function({ api, event, Threads, Users, args, Config, getText }) {
const { threadID, logMessageType, logMessageData } = event;
  try {
    switch (logMessageType) {
      case "log:thread-admins":
      case "log:thread-name":
      case "log:thread-name": {
        await Threads.refreshInfo(threadID);
        break;
      }
    }
  } catch (e) { return };
}