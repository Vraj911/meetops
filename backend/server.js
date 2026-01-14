require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { startServer } = require('./src/config/dbconfig');

// Import routes
const userRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.routes');
const meetingRoutes = require('./src/routes/meeting.routes');
const workspaceRoutes = require('./src/routes/workspace.routes');
const reviewRoutes = require('./src/routes/review.routes');
const aiRoutes = require('./src/routes/ai.routes');
const inviteRoutes = require('./src/routes/invite.routes');
const docsRoutes = require('./src/routes/docs.routes');
const syncRoutes = require('./src/routes/sync.routes');
const oauthRoutes = require('./src/routes/oauth.routes');
const devRoutes = require('./src/routes/dev.routes');

// ==================== EXPRESS APP SETUP ====================

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configure CORS to allow common local dev origins to make requests
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];
const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
};
app.use(cors(corsOptions));
// Ensure preflight requests are handled for all routes
app.options('*', cors(corsOptions));

// ==================== ROUTES ====================

// Health check endpoint
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({ 
    status: 'ok', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' 
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/invites', inviteRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/oauth', oauthRoutes);

// Dev utilities (disable in production)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRoutes);
}

// ==================== EXPORT ====================

module.exports = app;

// ==================== SERVER START ====================

if (require.main === module) {
  startServer(app);
}
