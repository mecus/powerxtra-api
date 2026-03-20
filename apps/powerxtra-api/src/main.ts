import http from 'http';
import app from './app/server';
import { Database } from "./app/configurations";

const host = process.env.HOST ?? 'localhost';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

let server: http.Server;

// app.listen(PORT, host, () => {
//   console.log(`[ ready ] http://${host}:${port}`);
//   Database.start();
// });


// Create server
function createServer() {
  server = http.createServer(app);
}

// Start server safely
function startServer() {
  try {
    createServer();

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`[ ready ] http://${host}:${PORT}`);
      Database.start();
    });

    // Handle server-level errors
    server.on('error', (error: any) => {
      console.error('❌ Server error:', error);

      if (error.code === 'EADDRINUSE') {
        console.error('⚠️ Port already in use. Retrying in 3 seconds...');
        setTimeout(() => {
          server.close();
          startServer();
        }, 3000);
      } else {
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    setTimeout(startServer, 3000);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  shutdownAndRestart();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('🔥 Unhandled Rejection:', reason);
  shutdownAndRestart();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('⚡ Shutting down gracefully...');
  process.exit(0);
});

// Graceful shutdown + restart trigger
function shutdownAndRestart() {
  console.log('♻️ Restarting server...');

  if (server) {
    server.close(() => {
      process.exit(1); // Let external tool restart it
    });
  } else {
    process.exit(1);
  }

  // Force exit if hanging
  setTimeout(() => process.exit(1), 5000);
}

// Start app
startServer();
