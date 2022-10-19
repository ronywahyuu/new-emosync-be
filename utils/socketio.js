const { Server } = require('socket.io')

let io

module.exports = function (server) {
  if (server) {
    io = new Server(server, {
      cors: { origin: '*' },
    })
  }
  return io
}
