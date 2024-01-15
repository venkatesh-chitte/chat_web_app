function configureSocket(io) {
    io.on('connection', (socket) => {
      console.log('A user connected');

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }

  module.exports = { configureSocket };