const WebSocket = require('ws');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const config = require('../config');

class SignalingService {
  constructor() {
    this.clients = new Map();
    this.rooms = new Map();
    this.wss = null;
    this.wssSecure = null;
    this.httpsServer = null;
  }

  // Initialize HTTPS server for WSS
  initHttpsServer() {
    const httpsOptions = {
      key: fs.readFileSync(path.join(__dirname, '../../', config.ssl.keyPath)),
      cert: fs.readFileSync(path.join(__dirname, '../../', config.ssl.certPath))
    };

    this.httpsServer = https.createServer(httpsOptions);
  }

  // Initialize WebSocket servers
  initWebSocketServers() {
    this.wss = new WebSocket.Server({ 
      port: config.server.websocket.port,
      host: config.server.websocket.host,
      clientTracking: true
    });

    this.wssSecure = new WebSocket.Server({ 
      server: this.httpsServer,
      host: config.server.websocket.host,
      clientTracking: true
    });

    this.setupWebSocketHandlers();
  }

  // Setup WebSocket event handlers
  setupWebSocketHandlers() {
    this.wss.on('connection', (ws) => {
      this.handleConnection(ws, false);
    });

    this.wssSecure.on('connection', (ws) => {
      this.handleConnection(ws, true);
    });
  }

  // Handle new WebSocket connections
  handleConnection(ws, isSecure = false) {
    const clientId = Date.now().toString() + (isSecure ? '-secure' : '');
    const clientInfo = {
      id: clientId,
      ws: ws,
      isSecure: isSecure,
      connectedAt: new Date(),
      room: null
    };
    
    this.clients.set(clientId, clientInfo);
    
    console.log(`Client ${clientId} connected via ${isSecure ? 'WSS' : 'WS'}. Total clients: ${this.clients.size}`);

    // Send client their ID
    ws.send(JSON.stringify({ type: 'client-id', id: clientId }));

    ws.on('message', (message) => {
      this.handleMessage(clientId, message);
    });

    ws.on('close', (code, reason) => {
      this.handleDisconnection(clientId, code, reason);
    });

    ws.on('error', (error) => {
      this.handleError(clientId, error);
    });

    // Send welcome message
    ws.send(JSON.stringify({ 
      type: 'welcome', 
      message: 'Connected to signaling server',
      timestamp: new Date().toISOString()
    }));
  }

  // Handle incoming messages
  handleMessage(clientId, message) {
    try {
      const messageString = message.toString();
      const data = JSON.parse(messageString);
      console.log(`Received ${data.type} from ${clientId}`);
      
      switch (data.type) {
        case 'join-room':
          this.handleJoinRoom(clientId, data.room);
          break;
        case 'leave-room':
          this.handleLeaveRoom(clientId);
          break;
        default:
          this.broadcastToRoom(clientId, messageString);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
      const client = this.clients.get(clientId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({ 
          type: 'error', 
          message: 'Invalid message format' 
        }));
      }
    }
  }

  // Handle client disconnection
  handleDisconnection(clientId, code, reason) {
    console.log(`Client ${clientId} disconnected. Code: ${code}, Reason: ${reason}`);
    this.handleLeaveRoom(clientId);
    this.clients.delete(clientId);
    
    // Notify other clients about disconnection
    const client = this.clients.get(clientId);
    if (client && client.room) {
      this.broadcastToRoom(clientId, JSON.stringify({ 
        type: 'peer-disconnected', 
        clientId: clientId 
      }));
    }
  }

  // Handle WebSocket errors
  handleError(clientId, error) {
    console.error(`WebSocket error for client ${clientId}:`, error);
    this.handleLeaveRoom(clientId);
    this.clients.delete(clientId);
  }

  // Handle room joining
  handleJoinRoom(clientId, roomName) {
    const client = this.clients.get(clientId);
    if (!client) return;

    // Leave current room if any
    this.handleLeaveRoom(clientId);

    // Join new room
    client.room = roomName;
    
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    this.rooms.get(roomName).add(clientId);

    console.log(`Client ${clientId} joined room: ${roomName}`);
    
    // Notify other clients in the room
    this.broadcastToRoom(clientId, JSON.stringify({ 
      type: 'peer-joined', 
      clientId: clientId,
      room: roomName
    }));

    // Send room info to the client
    client.ws.send(JSON.stringify({ 
      type: 'room-joined', 
      room: roomName,
      peers: Array.from(this.rooms.get(roomName)).filter(id => id !== clientId)
    }));
  }

  // Handle room leaving
  handleLeaveRoom(clientId) {
    const client = this.clients.get(clientId);
    if (!client || !client.room) return;

    const roomName = client.room;
    const room = this.rooms.get(roomName);
    
    if (room) {
      room.delete(clientId);
      if (room.size === 0) {
        this.rooms.delete(roomName);
        console.log(`Room ${roomName} deleted (empty)`);
      }
    }

    client.room = null;
    console.log(`Client ${clientId} left room: ${roomName}`);

    // Notify other clients in the room
    this.broadcastToRoom(clientId, JSON.stringify({ 
      type: 'peer-left', 
      clientId: clientId,
      room: roomName
    }));
  }

  // Broadcast message to all clients in the same room
  broadcastToRoom(clientId, message) {
    const client = this.clients.get(clientId);
    if (client && client.room) {
      this.clients.forEach((otherClient, id) => {
        if (id !== clientId && 
            otherClient.room === client.room && 
            otherClient.ws.readyState === WebSocket.OPEN) {
          console.log(`Forwarding message to client ${id}`);
          otherClient.ws.send(message);
        }
      });
    }
  }

  // Start the signaling service
  start() {
    this.initHttpsServer();
    this.initWebSocketServers();
    
    // Start HTTPS server
    this.httpsServer.listen(config.server.wss.port, config.server.websocket.host, () => {
      console.log(`🔒 WSS server running on port ${config.server.wss.port}`);
    });

    this.logNetworkInfo();
    this.startCleanupTimer();
  }

  // Log network information
  logNetworkInfo() {
    const networkInterfaces = os.networkInterfaces();
    const localIPs = [];

    Object.keys(networkInterfaces).forEach((interfaceName) => {
      networkInterfaces[interfaceName].forEach((interface) => {
        if (interface.family === 'IPv4' && !interface.internal) {
          localIPs.push(interface.address);
        }
      });
    });

    console.log('🔌 WebSocket signaling servers running on:');
    console.log(`  📱 Local WS: ws://localhost:${config.server.websocket.port}`);
    console.log(`  📱 Local WSS: wss://localhost:${config.server.wss.port}`);
    if (localIPs.length > 0) {
      console.log(`  🌐 Network WS: ws://${localIPs[0]}:${config.server.websocket.port}`);
      console.log(`  🌐 Network WSS: wss://${localIPs[0]}:${config.server.wss.port}`);
      console.log('\n📋 Available network addresses:');
      localIPs.forEach(ip => {
        console.log(`  🔗 WS: ws://${ip}:${config.server.websocket.port}`);
        console.log(`  🔗 WSS: wss://${ip}:${config.server.wss.port}`);
      });
    }
  }

  // Start cleanup timer
  startCleanupTimer() {
    setInterval(() => {
      this.clients.forEach((client, id) => {
        if (client.ws.readyState === WebSocket.CLOSED) {
          console.log(`Cleaning up disconnected client: ${id}`);
          this.handleLeaveRoom(id);
          this.clients.delete(id);
        }
      });
    }, 30000); // Clean up every 30 seconds
  }

  // Graceful shutdown
  shutdown() {
    console.log('Shutting down signaling servers gracefully');
    if (this.wss) {
      this.wss.close(() => {
        console.log('WS server closed');
      });
    }
    if (this.wssSecure) {
      this.wssSecure.close(() => {
        console.log('WSS server closed');
      });
    }
    if (this.httpsServer) {
      this.httpsServer.close(() => {
        console.log('HTTPS server closed');
      });
    }
  }
}

module.exports = SignalingService; 