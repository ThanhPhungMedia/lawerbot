"use strict";

const config = {
  name: 'script',
  role: 3,
  version: '1.0.0',
  author: ['DuyVuongUwU']
};

function loading(moduleList) {

}
function onMessage({ api, event, args, Threads, Users, global }) {
  const { readdirSync } = require('fs-extra');
  const { threadID, messageID } = event;
  var error = [];
  var success = [];
}

module.exports = {
  config,
  onMessage
}