const express = require('express');
const compression = require('compression');
const path = require('path');
const os = require('os');

// Import middleware
const corsMiddleware = require('./middleware/cors');
const securityMiddleware = require('./middleware/security');
const redirectMiddleware = require('./middleware/redirect');

// Import routes
const routes = require('./routes');

// Import config
const config = require('./config');

// Create Express app
const app = express();

// Compression middleware
app.use(compression());

// Security middleware
app.use(securityMiddleware);

// CORS middleware
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect HTTP to HTTPS for network access
app.use(redirectMiddleware);

// Routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Log network information
function logNetworkInfo() {
  const networkInterfaces = os.networkInterfaces();
  const localIPs = [];
  
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((interface) => {
      if (interface.family === 'IPv4' && !interface.internal) {
        localIPs.push(interface.address);
      }
    });
  });
  
  console.log(`🚀 HTTP server running on:`);
  console.log(`  📱 Local: http://localhost:${config.server.http.port}`);
  if (localIPs.length > 0) {
    console.log(`  🌐 Network: http://${localIPs[0]}:${config.server.http.port}`);
    console.log(`\n📋 Available network addresses:`);
    localIPs.forEach(ip => {
      console.log(`  🔗 http://${ip}:${config.server.http.port}`);
    });
  }
  console.log(`\n🧪 Test page: http://${localIPs[0] || 'your-ip'}:${config.server.http.port}/test`);
  console.log(`📞 Video call: http://${localIPs[0] || 'your-ip'}:${config.server.http.port}/call`);
  console.log(`🔧 Debug page: http://${localIPs[0] || 'your-ip'}:${config.server.http.port}/debug`);
}

function logHttpsInfo() {
  const networkInterfaces = os.networkInterfaces();
  const localIPs = [];
  
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((interface) => {
      if (interface.family === 'IPv4' && !interface.internal) {
        localIPs.push(interface.address);
      }
    });
  });
  
  console.log(`🔒 HTTPS server running on:`);
  console.log(`  📱 Local: https://localhost:${config.server.https.port}`);
  if (localIPs.length > 0) {
    console.log(`  🌐 Network: https://${localIPs[0]}:${config.server.https.port}`);
    console.log(`\n📋 Available HTTPS network addresses:`);
    localIPs.forEach(ip => {
      console.log(`  🔗 https://${ip}:${config.server.https.port}`);
    });
  }
  console.log(`\n🧪 Test page: https://${localIPs[0] || 'your-ip'}:${config.server.https.port}/test`);
  console.log(`📞 Video call: https://${localIPs[0] || 'your-ip'}:${config.server.https.port}/call`);
  console.log(`🔧 Debug page: https://${localIPs[0] || 'your-ip'}:${config.server.https.port}/debug`);
  console.log(`\n⚠️  Note: You may see a security warning. Click "Advanced" and "Proceed" to continue.`);
}

module.exports = { app, logNetworkInfo, logHttpsInfo }; 