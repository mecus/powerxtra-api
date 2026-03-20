/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import express from 'express';
// import * as path from 'path';

// const app = express();

// app.use('/assets', express.static(path.join(__dirname, 'assets')));

// app.get('/api', (req, res) => {
//   res.send({ message: 'Welcome to radio!' });
// });

// const port = process.env.PORT || 3001;
// const server = app.listen(port, () => {
//   console.log(`Listening at http://localhost:${port}/api`);
// });
// server.on('error', console.error);

import express from 'express';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io with CORS for your Angular frontend
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200", // Update to your Angular URL
    methods: ["GET", "POST"]
  }
});

interface ServerToClientEvents {
  streamAudio: (buffer: ArrayBuffer) => void;
  listenerCount: (count: number) => void;
}

interface ClientToServerEvents {
  liveAudioChunk: (buffer: ArrayBuffer) => void;
}

io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
  console.log(`User connected: ${socket.id}`);

  // Emit current listener count to everyone
  io.emit('listenerCount', io.engine.clientsCount);

  // 1. Listen for audio chunks from the Presenter
  socket.on('liveAudioChunk', (buffer: ArrayBuffer) => {
    // 2. Broadcast the binary buffer to all connected listeners
    // .broadcast ensures the presenter doesn't hear their own echo
    console.log("Voice received...")
    socket.broadcast.emit('streamAudio', buffer);
  });
  // socket.on('mendMessage', (buffer: ArrayBuffer) => {
  //   // 2. Broadcast the binary buffer to all connected listeners
  //   // .broadcast ensures the presenter doesn't hear their own echo
  //   console.log("Voice received...")
  //   socket.broadcast.emit('streamAudio', buffer);
  // });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    io.emit('listenerCount', io.engine.clientsCount);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Radio Backend Live on http://localhost:${PORT}`);
});
