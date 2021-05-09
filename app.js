const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000",
      },
});

const sessions = {};
io.on("connection", (socket) => {
  socket.on('join-room', (roomToken, user) => {
            if(!sessions[roomToken]){
                sessions[roomToken] = [];
            }
            socket.join(roomToken);
            sessions[roomToken].push(user)
            socket.to(roomToken).emit('user-connected', sessions[roomToken])
            socket.emit('user-connected', sessions[roomToken])
            
      socket.on('disconnect', () => {   
        if(sessions[roomToken]){
         users = sessions[roomToken].filter(usr=> usr?.userId !== user?.userId);
         sessions[roomToken] = [...users]
        }
        socket.to(roomToken).emit('user-disconnected', sessions[roomToken]);
      });
      socket.on('start-share-screen', (fullName, user, shareScreenStateId) => {
        socket.to(roomToken).emit('user-shared-screen', fullName, user, shareScreenStateId);
      });
      socket.on('end-share-screen', (shareScreenStateId) => {
        socket.to(roomToken).emit('user-ended-shared-screen', shareScreenStateId);
      });
      socket.on('raise-hand', (user) => {
        socket.to(roomToken).emit('user-raised-hand', user);
      });
      socket.on('switch-cam-off', (user) => {
        socket.to(roomToken).emit('user-camera-off', user);
      });
      socket.on('switch-cam-on', (user) => {
        socket.to(roomToken).emit('user-camera-on', user);
      });
      socket.on('switch-mic-off', (user) => {
        socket.to(roomToken).emit('user-mic-off', user);
      });
      socket.on('switch-mic-on', (user) => {
        socket.to(roomToken).emit('user-mic-on', user);
      });
      socket.on('messages', (roomToken, fullName, message) => {
        socket.to(roomToken).emit('recive-message', fullName, message);
      });
    });
});

httpServer.listen(3000, (err)=>{
  console.log('websocket intialized!')
});