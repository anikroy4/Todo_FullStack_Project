const xss = require('xss');

// Middleware to sanitize and validate request body to prevent XSS attacks
const sanitizeInputs = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object') {
    return next();
  }

  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove XSS attack vectors while preserving legitimate content
      return xss(obj, {
        whiteList: {}, // No HTML tags allowed
        stripIgnoredTag: true,
      });
    } else if (Array.isArray(obj)) {
      return obj.map(sanitize);
    } else if (obj !== null && typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  req.body = sanitize(req.body);
  next();
};

module.exports = { sanitizeInputs };
