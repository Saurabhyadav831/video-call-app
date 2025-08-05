# Camera Access Guide for Local Network

## 🔍 **Problem Description**

Your video call app works perfectly on `localhost` but fails to access the camera when accessed via network IP address (e.g., `192.168.1.100:8080`).

## 🚨 **Root Cause**

Modern browsers have strict security policies for camera/microphone access:

- **✅ Localhost (127.0.0.1)** - Camera access allowed over HTTP
- **❌ Network IP addresses** - Camera access requires HTTPS in most browsers

## 🛠️ **Solutions**

### **Solution 1: Use HTTPS (Recommended)**

The app now supports both HTTP and HTTPS with **automatic redirection**:

1. **Start the servers:**
   ```bash
   npm run dev
   ```

2. **Access via HTTPS (automatic redirection):**
   - Simply visit the HTTP URL: `http://192.168.1.100:8080`
   - You'll be automatically redirected to: `https://192.168.1.100:8443`
   - You'll see a security warning - click "Advanced" → "Proceed"

3. **Benefits:**
   - Camera access works from any device on the network
   - Secure WebSocket connections
   - Better browser compatibility

### **Solution 2: Browser-Specific Workarounds**

#### **Chrome/Edge:**
1. Open `chrome://flags/`
2. Search for "insecure origins"
3. Add your network IP to "Insecure origins treated as secure"
4. Restart browser

#### **Firefox:**
1. Open `about:config`
2. Search for `media.devices.insecure.enabled`
3. Set to `true`
4. Search for `media.devices.insecure.origin.enabled`
5. Set to `true`

#### **Safari:**
- HTTPS is required for camera access
- No workaround available

## 📱 **Access Methods**

### **For Local Development:**
```
http://localhost:8080          # HTTP (camera works)
https://localhost:8443         # HTTPS (camera works)
```

### **For Network Access:**
```
http://192.168.1.100:8080     # HTTP (auto-redirects to HTTPS)
https://192.168.1.100:8443    # HTTPS (camera works)
wss://192.168.1.100:8444      # Secure WebSocket
```

## 🔧 **Testing Steps**

1. **Start servers:**
   ```bash
   npm run dev
   ```

2. **Check console output** for available URLs

3. **Test from different devices:**
   - Computer on same network
   - Mobile phone on same WiFi
   - Tablet on same network

4. **Use HTTPS URLs** for camera access

## 🚨 **Security Warning**

When accessing via HTTPS, you'll see a security warning because we're using a self-signed certificate. This is normal for development:

1. Click "Advanced" or "Show Details"
2. Click "Proceed to [IP] (unsafe)" or similar
3. Allow camera/microphone access when prompted

## 🔍 **Troubleshooting**

### **Camera Still Not Working?**

1. **Check browser console** for errors
2. **Verify HTTPS URL** is being used
3. **Check browser permissions** for camera/microphone
4. **Try different browser** (Chrome works best)
5. **Ensure no other app** is using the camera

### **WebSocket Connection Issues?**

1. **Check if both servers are running**
2. **Verify ports are not blocked** by firewall
3. **Use HTTPS URLs** for both HTTP and WebSocket

### **Network Access Issues?**

1. **Check firewall settings**
2. **Verify devices are on same network**
3. **Try different network interface** (WiFi vs Ethernet)

## 📋 **Quick Reference**

| Access Method | Camera Access | Use Case |
|---------------|---------------|----------|
| `http://localhost:8080` | ✅ Works | Local development |
| `https://localhost:8443` | ✅ Works | Local development |
| `http://192.168.1.100:8080` | 🔄 Auto-redirects | Network access |
| `https://192.168.1.100:8443` | ✅ Works | Network access |
| `wss://192.168.1.100:8444` | ✅ Works | Secure WebSocket |

## 🎯 **Best Practices**

1. **Always use HTTPS** for network access
2. **Test on multiple browsers** and devices
3. **Check browser console** for errors
4. **Use Chrome** for best WebRTC support
5. **Keep both HTTP and HTTPS** running for flexibility 