"use strict";

const config = {
  name: 'helper',
  role: 0,
  version: '1.0.0',
  author: ['DuyVuongUwU']
};

function onMessage({ api, event, global, args, Threads, Users, Config }) {
  const { scripts } = global;
  const { threadID, messageID } = event;
  const findCommand = scripts.findIndex(i => i.config.name == args.join(" "));
  const thread = Threads.getData(threadID) || {};
  const prefix = thread.prefix || Config['PREFIX'];
  if (findCommand < 0 || isNaN(args[0]) == false) { 
    var q, w, e, r, y, u, o;
    q = [];
    o = [];
    for (var i of scripts) { 
      if (i.config.description) { 
        q.push({ name: i.config.name, description: i.config.description });
      }
      else {
        q.push({ name: i.config.name });
      }
    }
    w = 1;
    w = parseInt(args[0]) || 1;
    w < -1 ? w = 1 : "";
    e = 15;
    r = Math.ceil(q.length/e);
    y = '[ Danh sách lệnh hiện tại đang hoạt động trên bot ]\n\n';
    for (u = e * (w - 1); u < e * (w - 1) + e; u++) { 
      if (u >= q.length) break;
      o.push(q[u].name);
      if (q[u].description) {
        y += '[ ' + (u + 1) + ' ]' + '. ' + prefix + q[u].name + ' (' + q[u].description + ')\n';
      }
      else { 
        y += '[ ' + (u + 1) + ' ]' + '. ' + prefix + q[u].name + '\n';
      }
    }
    y += '\nTrang (<' + w + '/' + r + '>)\n';
    y += '[ CẶC ]';
    return api.sendMessage(y, threadID, (err, data) => {
      return global.reply.push({
        name: this.config.name,
        messageID: data.messageID,
        o
      })
    }, messageID);
  }
  else { 
    var y, u, o;
    y = scripts[findCommand];
    u = '》           ' + y.config.name.toUpperCase() + '              《\n\n';
    if (y.config.role == 0) o = 'Người dùng';
    else if (y.config.role == 1) o = 'Quản trị viên';
    else if (y.config.role == 2) o = 'Admin Bot';
    else if (y.config.role == 3) o = 'Hỗ trợ Admin Bot';
    else o = 'role không được xác định';
    u += '» Role: ' + o + '\n';
    u += '» Phiên bản: ' + y.config.version + '\n';
    u += '» Người code: ' + y.config.author.join(", ") + '\n';
    u += '» Miêu tả lệnh: ' + (y.config.description || "");
    return api.sendMessage(u, threadID, messageID);
  }
}
function onReply({ global, api, event, reply }) { 
  api.unsendMessage(reply.messageID);
  const { o } = reply;
  const { threadID, messageID, body } = event;
  if (!body || isNaN(body) == true) return api.sendMessage('Nội dung bạn nhập không phải là 1 chữ số hợp lệ!', threadID, messageID);
  else { 
    var q, w, e, r, f, g, h;
    q = body.split(' ');
    if (q.length > 1) return api.sendMessage('Vui lòng chỉ chọn 1 lựa chọn!', threadID, messageID);
    else { 
      w = q[0];
      e = parseInt(w);
      r = o[e - 1];
      const findCommand = global.scripts.findIndex(i => i.config.name == r);
      f = global.scripts[findCommand];
      g = '》           ' + f.config.name.toUpperCase() + '              《\n\n';
      if (f.config.role == 0) h = 'Người dùng';
      else if (f.config.role == 1) h = 'Quản trị viên';
      else if (f.config.role == 2) h = 'Admin Bot';
      else if (f.config.role == 3) h = 'Hỗ trợ Admin Bot';
      else h = 'role không được xác định';
      g += '» Role: ' + h + '\n';
      g += '» Phiên bản: ' + f.config.version + '\n';
      g += '» Người code: ' + f.config.author.join(", ") + '\n';
      u += '» Miêu tả lệnh: ' + (y.config.description || "");
      return api.sendMessage(g, threadID, messageID);
    }
  }
}

module.exports = {
  config,
  onMessage,
  onReply
}