const WebSocket = require('ws');

let wss;

const init = (server, options = {}) => {
  wss = new WebSocket.Server({ server, ...options });

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message);
      if (data.type === 'login') {
        ws.userLogin = data.userLogin;
      }
      console.log('Received message:', message);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    ws.on('close', (code, reason) => {
      console.log(`Client disconnected with code: ${code}, reason: ${reason}`);
    });
  });

  console.log(`WebSocket listening on port ${process.env.PORT || 3001}`);
};

const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

const broadcastCoffee = (data, userLogin) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.userLogin === userLogin) {
      client.send(JSON.stringify(data));
    }
  });
};

module.exports = { init, broadcast, broadcastCoffee };
