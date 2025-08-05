// Redirect HTTP to HTTPS for network access
const redirectMiddleware = (req, res, next) => {
  if (req.headers.host && 
      !req.headers.host.includes('localhost') && 
      req.headers.host.includes(':8080')) {
    const httpsUrl = `https://${req.headers.host.replace(':8080', ':8443')}${req.url}`;
    res.redirect(301, httpsUrl);
    return;
  }
  next();
};

module.exports = redirectMiddleware; 