const express = require('express');
const path = require('path');
const router = express.Router();

// Serve static files
router.use(express.static(path.join(__dirname, '../../public')));
router.use(express.static(path.join(__dirname, '../../views')));

// Main routes
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/landing.html'));
});

router.get('/call', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/call.html'));
});

router.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/test.html'));
});

router.get('/debug', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/debug.html'));
});

router.get('/test-camera-access', (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/test-camera-access.html'));
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: require('../../package.json').version
  });
});

// API endpoints
router.get('/api/status', (req, res) => {
  const config = require('../config');
  res.json({
    status: 'running',
    servers: {
      http: config.server.http.port,
      https: config.server.https.port,
      websocket: config.server.websocket.port,
      wss: config.server.wss.port
    }
  });
});

module.exports = router; 