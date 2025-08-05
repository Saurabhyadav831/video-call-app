# Network Setup Guide

This guide helps you set up the WebRTC video call app to work across your local network.

## 🚀 Quick Start

1. **Start the servers:**
   ```bash
   npm run dev
   ```

2. **Find your network IP:**
   The server will display available network addresses when it starts.

3. **Access from other devices:**
   Use the network IP address shown in the console output.

## 📱 Accessing from Different Devices

### From Another Computer
- Open browser and go to: `http://YOUR_IP:8080`
- Example: `http://192.168.1.100:8080`

### From Mobile Device
- Connect to the same WiFi network
- Open browser and go to: `http://YOUR_IP:8080`
- Allow camera/microphone access when prompted

### From Tablet
- Same as mobile device
- Works best with landscape orientation

## 🔧 Configuration

### Port Settings
Edit `config.js` to change ports:
```javascript
module.exports = {
  http: {
    port: 8080,  // Change this if needed
    host: '0.0.0.0'
  },
  websocket: {
    port: 3000,  // Change this if needed
    host: '0.0.0.0'
  }
};
```

### Firewall Settings
If you can't access from other devices:

#### Windows
1. Open Windows Defender Firewall
2. Allow Node.js through firewall
3. Or temporarily disable firewall for testing

#### macOS
1. System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Add Node.js to allowed applications

#### Linux
```bash
# Allow ports through firewall
sudo ufw allow 8080
sudo ufw allow 3000
```

## 🌐 Network Troubleshooting

### Can't Access from Other Devices?

1. **Check if servers are running:**
   ```bash
   npm run dev
   ```

2. **Verify network IP:**
   - Look for network addresses in console output
   - Make sure you're using the correct IP

3. **Test connectivity:**
   ```bash
   # From another device, test if port is reachable
   telnet YOUR_IP 8080
   ```

4. **Check firewall settings:**
   - Ensure ports 8080 and 3000 are open
   - Allow Node.js through firewall

### Common Issues

#### "Connection Refused"
- Server not running
- Wrong IP address
- Firewall blocking connection

#### "WebSocket Connection Failed"
- Signaling server not running
- Port 3000 blocked by firewall
- Wrong WebSocket URL

#### "Camera Access Denied"
- Browser permissions
- HTTPS required (in production)
- Camera in use by another app

## 📋 Network Commands

### Find Your IP Address

#### macOS/Linux
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

#### Windows
```cmd
ipconfig | findstr "IPv4"
```

### Test Network Connectivity
```bash
# Test HTTP server
curl http://YOUR_IP:8080

# Test WebSocket server
nc -zv YOUR_IP 3000
```

## 🔒 Security Notes

### Development Only
- This setup is for development/testing only
- Not suitable for production use
- No authentication or encryption

### Production Considerations
- Use HTTPS/WSS for production
- Implement proper authentication
- Use TURN servers for NAT traversal
- Consider using a reverse proxy

## 📞 Testing Video Calls

### Local Network Testing
1. Start servers on main computer
2. Open app on two different devices
3. Allow camera/microphone access
4. Test video call functionality

### Cross-Network Testing
- Requires public IP or VPN
- May need TURN servers
- Consider using services like ngrok for testing

## 🛠️ Advanced Configuration

### Custom Ports
Edit `config.js`:
```javascript
module.exports = {
  http: { port: 9000, host: '0.0.0.0' },
  websocket: { port: 9001, host: '0.0.0.0' }
};
```

### Multiple Network Interfaces
The server automatically detects and displays all available network interfaces.

### Docker Support
```dockerfile
EXPOSE 8080 3000
CMD ["npm", "run", "dev"]
``` 