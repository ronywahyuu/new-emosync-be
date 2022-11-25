const io = require('./socketio')

const socket = io()

socket.on('connection', function (socket) {
  socket.on('join', function (room) {
    socket.join(room)
  })
})

module.exports = socket
