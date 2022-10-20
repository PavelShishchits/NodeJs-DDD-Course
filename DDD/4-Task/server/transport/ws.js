'use strict';
const { WebSocketServer } = require('ws');

module.exports = ({ logger, port }) => (routing) => {
  const ws = new WebSocketServer({ port });

  ws.on('connection', (connection, req) => {
    const ip = req.socket.remoteAddress;
    connection.on('message', async (message) => {
      const obj = JSON.parse(message);
      const { name, method, args = [] } = obj;
      const entity = routing[name];
      if (!entity) return connection.send('"Not found"', { binary: false });
      const handler = entity[method];
      if (!handler) return connection.send('"Not found"', { binary: false });
      const json = JSON.stringify(args);
      const parameters = json.substring(1, json.length - 1);

      logger.dir({
        ip,
        method,
        args: parameters,
      });

      try {
        const result = await handler(...args);
        connection.send(JSON.stringify(result.rows), { binary: false });
      } catch (err) {
        logger.error(err);
        connection.send('"Server error"', { binary: false });
      }
    });
  });

  logger.log(`Api Server running on PORT ${port}`);
}