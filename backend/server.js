const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Import Express app
const { app, logNetworkInfo, logHttpsInfo } = require('./src/app');

// Import signaling service
const SignalingService = require('./src/services/signaling');

// Import config
const config = require('./src/config');

// Create HTTP server
const httpServer = http.createServer(app);

// Create HTTPS server with SSL certificates
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, config.ssl.keyPath)),
  cert: fs.readFileSync(path.join(__dirname, config.ssl.certPath))
};
const httpsServer = https.createServer(httpsOptions, app);

// Initialize signaling service
const signalingService = new SignalingService();

// Start servers
const HTTP_PORT = config.server.http.port;
const HTTPS_PORT = config.server.https.port;
const HOST = config.server.http.host;

httpServer.listen(HTTP_PORT, HOST, () => {
  logNetworkInfo();
});

httpsServer.listen(HTTPS_PORT, HOST, () => {
  logHttpsInfo();
});

// Start signaling service
signalingService.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  signalingService.shutdown();
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
  httpsServer.close(() => {
    console.log('HTTPS server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  signalingService.shutdown();
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
  httpsServer.close(() => {
    console.log('HTTPS server closed');
  });
}); 