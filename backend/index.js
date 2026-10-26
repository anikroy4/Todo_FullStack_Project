// Ensure DNS resolves MongoDB Atlas SRV records correctly on Windows
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (err) {
  // Ignore in restricted environments
}

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const databaseConfig = require('./config/databaseConfig');
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const { sanitizeInputs } = require('./middleware/sanitizationMiddleware');
const { generalLimiter, authLimiter, passwordResetLimiter } = require('./middleware/rateLimitMiddleware');

const app = express();

// Initialize database
databaseConfig();

// Security: Helmet middleware - set various HTTP headers
app.use(helmet());

// CORS configuration - restrict to frontend URL in production
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000', // Alternative dev port
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Security: Sanitize all inputs to prevent XSS attacks
app.use(sanitizeInputs);

// Rate limiting: Apply general limiter to all requests
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ error: `Not Found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please terminate existing process or set another PORT in .env`);
  } else {
    console.error('Server error:', err);
  }
});
