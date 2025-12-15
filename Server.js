
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const wss = new WebSocket.Server({ port: PORT });

const players = {};

wss.on('connection', ws => {
  const id = Math.random().toString(36).substr(2, 9);

  players[id] = {
    pos: [0, 0.5, 0],
    color: Math.random() * 0xffffff
  };

  ws.send(JSON.stringify({ type: 'init', id }));

  ws.on('message', msg => {
    const data = JSON.parse(msg);
    if (data.type === 'move') {
      players[id].pos = data.pos;
    }
  });

  ws.on('close', () => delete players[id]);
});

setInterval(() => {
  const state = JSON.stringify({ type: 'state', players });
  wss.clients.forEach(c => {
    if (c.readyState === 1) c.send(state);
  });
}, 50);
