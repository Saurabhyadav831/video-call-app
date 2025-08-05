// Configuration for the WebRTC video call app
module.exports = {
  // Server configuration
  server: {
    http: {
      port: process.env.HTTP_PORT || 8080,
      host: process.env.HTTP_HOST || '0.0.0.0'
    },
    https: {
      port: process.env.HTTPS_PORT || 8443,
      host: process.env.HTTPS_HOST || '0.0.0.0'
    },
    websocket: {
      port: process.env.WS_PORT || 3000,
      host: process.env.WS_HOST || '0.0.0.0'
    },
    wss: {
      port: process.env.WSS_PORT || 8444,
      host: process.env.WSS_HOST || '0.0.0.0'
    }
  },

  // WebRTC configuration
  webrtc: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' }
    ],
    iceCandidatePoolSize: 10
  },

  // Media settings
  media: {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 }
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  },

  // Security settings
  security: {
    maxClientsPerRoom: 10,
    maxRooms: 100,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },

  // Development settings
  development: {
    enableLogging: process.env.NODE_ENV !== 'production',
    showNetworkInfo: true,
    debugMode: process.env.DEBUG === 'true'
  },

  // Logging settings
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.NODE_ENV === 'production' ? 'json' : 'simple'
  },

  // SSL certificate paths
  ssl: {
    keyPath: process.env.SSL_KEY_PATH || './certs/key.pem',
    certPath: process.env.SSL_CERT_PATH || './certs/cert.pem'
  }
}; 