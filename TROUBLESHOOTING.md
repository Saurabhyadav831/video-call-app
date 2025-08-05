# WebRTC Connection Troubleshooting Guide

## Common Issues and Solutions

### 1. Video Not Connecting on Other End

**Symptoms:**
- Local video works but remote video doesn't appear
- Connection status shows "connected" but no remote video
- ICE connection state is "checking" or "failed"

**Solutions:**

#### Check Browser Console
1. Open browser developer tools (F12)
2. Look for errors in the Console tab
3. Check for WebRTC-related errors

#### Verify Signaling Server
1. Ensure the signaling server is running:
   ```bash
   npm start
   ```
2. Check server logs for connection messages
3. Verify WebSocket connections are established

#### Test with Debug Page
1. Use the test page for detailed logging:
   ```
   http://localhost:8080/test.html
   ```
2. Open in two browser tabs
3. Check the log output for connection steps

### 2. Camera/Microphone Access Issues

**Symptoms:**
- "Camera/microphone access denied" error
- No local video appears

**Solutions:**
1. Check browser permissions for camera/microphone
2. Ensure no other app is using the camera
3. Try refreshing the page
4. Check browser settings for media permissions

### 3. ICE Connection Issues

**Symptoms:**
- ICE connection state stuck on "checking"
- Connection fails after offer/answer exchange

**Solutions:**
1. Check firewall settings
2. Try different STUN servers
3. Ensure both peers are on the same network or have public IPs
4. Check for NAT traversal issues

### 4. WebSocket Connection Issues

**Symptoms:**
- "Connection error" status
- No signaling messages exchanged

**Solutions:**
1. Verify signaling server is running on port 3000
2. Check if port 3000 is blocked by firewall
3. Try accessing `ws://localhost:3000` directly
4. Check browser console for WebSocket errors

## Testing Steps

### Step 1: Basic Setup
1. Start both servers:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:8080/test.html` in two browser tabs
3. Click "Start Test" in both tabs
4. Check the log output for each step

### Step 2: Check Connection Flow
1. **WebSocket Connection**: Should see "WebSocket connected"
2. **Media Access**: Should see "Got local media stream"
3. **Peer Connection**: Should see "Peer connection initialized"
4. **Offer Creation**: Should see "Creating offer" and "Offer sent"
5. **Answer Handling**: Should see "Handling offer" and "Answer sent"
6. **ICE Candidates**: Should see multiple "Sending ICE candidate" messages
7. **Connection State**: Should progress to "connected"

### Step 3: Debug Specific Issues

#### If WebSocket fails:
- Check if signaling server is running
- Verify port 3000 is not blocked

#### If media access fails:
- Check browser permissions
- Try different browser
- Check if camera is in use

#### If ICE connection fails:
- Check network configuration
- Try different STUN servers
- Check firewall settings

#### If remote video doesn't appear:
- Check `ontrack` event is firing
- Verify remote stream is received
- Check video element is properly set

## Browser Compatibility

### Chrome (Recommended)
- Best WebRTC support
- Detailed debugging in chrome://webrtc-internals/

### Firefox
- Good WebRTC support
- Check about:config for media settings

### Safari
- Limited WebRTC support
- May require HTTPS

### Edge
- Good WebRTC support
- Similar to Chrome

## Network Requirements

### Local Network Testing
- Works best on same network
- No firewall blocking required

### Internet Testing
- Requires public IP or STUN/TURN servers
- May need TURN server for NAT traversal
- Consider using services like Twilio TURN

## Advanced Debugging

### Chrome WebRTC Internals
1. Open `chrome://webrtc-internals/`
2. Start a call
3. Check detailed connection logs
4. Look for ICE candidate failures

### Firefox WebRTC Debugging
1. Open `about:config`
2. Search for "webrtc"
3. Enable logging options
4. Check browser console for detailed logs

### Network Analysis
1. Use Wireshark to capture WebRTC traffic
2. Check for blocked UDP ports
3. Verify STUN server responses
4. Analyze ICE candidate exchange

## Common Error Messages

### "getUserMedia() not supported"
- Browser doesn't support WebRTC
- Try different browser

### "Permission denied"
- Camera/microphone access denied
- Check browser permissions

### "ICE connection failed"
- Network connectivity issues
- Firewall blocking
- NAT traversal problems

### "Signaling server connection failed"
- Server not running
- Port blocked
- WebSocket not supported 