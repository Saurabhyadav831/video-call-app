# VideoCall App - Modern WebRTC Video Calling

A production-ready, secure video calling application built with WebRTC technology. Features a modern UI, room-based calling, and comprehensive error handling.

## ✨ Features

- **🎥 High-Quality Video Calls** - HD video with adaptive quality
- **🔒 Secure Communication** - HTTPS/WSS with automatic redirection
- **🏠 Room-Based Calling** - Join specific rooms for private calls
- **📱 Responsive Design** - Works on desktop, tablet, and mobile
- **🎨 Modern UI** - Dark theme with glassmorphism design
- **🔊 Audio Controls** - Mute/unmute with echo cancellation
- **📹 Video Controls** - Pause/resume video with quality settings
- **⛶ Fullscreen Support** - Fullscreen video for better experience
- **🔄 Auto-Reconnection** - Automatic reconnection on network issues
- **📊 Connection Monitoring** - Real-time connection status
- **🛡️ Security Features** - CORS, CSP, rate limiting

## 🚀 Quick Start

### Prerequisites
- **Node.js** 14+ 
- **Modern browser** with WebRTC support
- **Camera and microphone** access

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/videocall-app.git
   cd videocall-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

4. **Access the app:**
   - **Landing page:** `https://your-ip:8443/`
   - **Video call:** `https://your-ip:8443/call`
   - **Debug page:** `https://your-ip:8443/debug`

## 📱 Usage

### Basic Video Call
1. **Share the URL** with someone you want to call
2. **Allow camera/microphone** access when prompted
3. **Start talking!** The app automatically connects when both parties join

### Room-Based Calling
- **Default room:** All users join the same room
- **Private rooms:** Coming soon with room codes
- **Multiple participants:** Up to 10 users per room

### Controls
- **🎤 Mute/Unmute:** Toggle audio with the microphone button
- **📹 Pause/Resume Video:** Toggle video with the camera button
- **📞 End Call:** Hang up with the red phone button
- **⛶ Fullscreen:** Click the expand button on videos

## 🔧 Configuration

### Environment Variables
```bash
# Server ports
HTTP_PORT=8080
HTTPS_PORT=8443
WS_PORT=3000
WSS_PORT=8444

# Development settings
NODE_ENV=development
DEBUG=false
LOG_LEVEL=info
```

### Custom Configuration
Edit `config.js` to modify:
- **ICE servers** for better connectivity
- **Media settings** for video/audio quality
- **Security settings** for room limits
- **Logging settings** for debugging

## 🛠️ Development

### Project Structure
```
videocall-app/
├── client/                 # Frontend files
│   ├── index.html         # Main video call interface
│   └── script.js          # WebRTC logic
├── server/                # Backend files
│   └── signaling-server.js # WebSocket signaling
├── certs/                 # SSL certificates
├── landing.html           # Landing page
├── debug.html             # Debug page
├── server.js              # Express server
├── config.js              # Configuration
└── package.json           # Dependencies
```

### Available Scripts
- `npm run dev` - Start both servers (development)
- `npm start` - Start WebSocket server only
- `npm run serve` - Start HTTP/HTTPS server only
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Lint code

### Development Features
- **Hot reloading** with nodemon
- **Debug logging** with detailed console output
- **Error handling** with graceful fallbacks
- **Connection monitoring** with real-time status

## 🔒 Security

### Built-in Security Features
- **HTTPS/WSS** - Secure connections for camera access
- **CORS protection** - Cross-origin request handling
- **CSP headers** - Content Security Policy
- **Rate limiting** - Prevent abuse
- **Input validation** - Sanitize user inputs
- **Error handling** - Secure error messages

### Production Security
- **Environment variables** for sensitive data
- **SSL certificates** for HTTPS
- **Firewall configuration** for network access
- **Regular updates** for dependencies

## 🌐 Deployment

### Local Network
```bash
# Start the app
npm run dev

# Access from other devices
https://your-ip:8443/call
```

### Production Deployment
1. **Set environment variables:**
   ```bash
   NODE_ENV=production
   LOG_LEVEL=error
   ```

2. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name videocall
   ```

3. **Configure reverse proxy (nginx):**
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;
       
       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;
       
       location / {
           proxy_pass http://localhost:8443;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080 8443 3000 8444
CMD ["npm", "run", "dev"]
```

## 📊 Monitoring

### Health Checks
- **Health endpoint:** `GET /health`
- **Status API:** `GET /api/status`
- **WebSocket status:** Real-time connection monitoring

### Logging
- **Console logging** for development
- **JSON logging** for production
- **Error tracking** with stack traces
- **Performance monitoring** with connection metrics

## 🐛 Troubleshooting

### Common Issues

#### Camera Access Denied
- **Solution:** Use HTTPS URLs for network access
- **Check:** Browser permissions for camera/microphone
- **Try:** Different browser (Chrome recommended)

#### Connection Issues
- **Check:** Firewall settings for ports 8080, 8443, 3000, 8444
- **Verify:** Both servers are running (`npm run dev`)
- **Test:** Debug page for detailed logs

#### Video Not Streaming
- **Check:** Browser console for errors
- **Verify:** WebRTC is supported in browser
- **Try:** Refresh page and allow permissions

### Debug Tools
- **Debug page:** `https://your-ip:8443/debug`
- **Console logs:** Detailed WebRTC connection logs
- **Network tab:** Monitor WebSocket connections
- **WebRTC internals:** `chrome://webrtc-internals/`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature-name`
3. **Commit changes:** `git commit -am 'Add feature'`
4. **Push to branch:** `git push origin feature-name`
5. **Submit pull request**

### Development Guidelines
- **Code style:** Follow existing patterns
- **Testing:** Test on multiple browsers
- **Documentation:** Update README for new features
- **Security:** Review security implications

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **WebRTC** for peer-to-peer communication
- **Express.js** for the server framework
- **Modern browsers** for WebRTC support
- **Open source community** for inspiration

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/videocall-app/issues)
- **Documentation:** [Wiki](https://github.com/yourusername/videocall-app/wiki)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/videocall-app/discussions)

---

**Made with ❤️ for secure, private video calling** 