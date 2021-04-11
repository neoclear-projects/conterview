"use strict";

module.exports.listen = server => {
  /**
   * Just for simplicity
   */
  const io = require("socket.io")(server, {
    cors: {
      methods: ["GET", "POST"]
    }
  });

  /**
   * Get room size of a room
   * 
   * @param {string} roomId 
   * @returns The number of participants in this room
   */
  function roomSize(roomId) {
    return io.of("/").adapter.rooms.get(roomId).size;
  }

  function genMessagePasser(roomId, socket, passerName) {
    socket.on(passerName, dat => {
      socket.join(roomId);
      socket.to(roomId).emit(passerName, dat);
    });
  }

  function genSignalPasser(roomId, socket, passerName) {
    socket.on(passerName, () => {
      socket.join(roomId);
      socket.to(roomId).emit(passerName);
    });
  }

  io.on('connection', socket => {
    console.log('Socket IO Connection Established');

    socket.on('join', (userId, interviewId) => {
      console.log('Someone Joined: ' + interviewId);
      
      // Tell other users that a new user had joined
      socket.join(interviewId);
      socket.to(interviewId).emit('user-conn', userId);

      if (roomSize(interviewId) === 1) socket.emit('first-joined');

      // Tell other users to update info
      genSignalPasser(interviewId, socket, 'refresh');

      // Tell others to apply edit changes
      genMessagePasser(interviewId, socket, 'code');

      // Tell stream open and closure
      genMessagePasser(interviewId, socket, 'stream-close');
      genMessagePasser(interviewId, socket, 'stream-open');

      // Tests passed
      genMessagePasser(interviewId, socket, 'pass');
      // Tests failed
      genMessagePasser(interviewId, socket, 'fail');
      // Test compiler error
      genMessagePasser(interviewId, socket, 'cperror');

      // Program output
      genMessagePasser(interviewId, socket, 'output');

      // Socket behavior on closure
      socket.on("disconnect", () => {
        socket.join(interviewId);
        socket.to(interviewId).emit('user-disconn', userId);
        socket.leave(interviewId);
        console.log("Client disconnected");
      });
    });
  });
};
