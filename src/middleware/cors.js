const cors = require('cors');
const os = require('os');

// Get network interfaces for CORS
function getNetworkIPs() {
  const networkInterfaces = os.networkInterfaces();
  const localIPs = [];
  
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((interface) => {
      if (interface.family === 'IPv4' && !interface.internal) {
        localIPs.push(interface.address);
      }
    });
  });
  
  return localIPs;
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost and network IPs
    const allowedOrigins = [
      'http://localhost:8080',
      'https://localhost:8443',
      'http://127.0.0.1:8080',
      'https://127.0.0.1:8443'
    ];
    
    // Add network IPs dynamically
    const networkIPs = getNetworkIPs();
    networkIPs.forEach(ip => {
      allowedOrigins.push(`http://${ip}:8080`);
      allowedOrigins.push(`https://${ip}:8443`);
    });
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
};

module.exports = cors(corsOptions); 