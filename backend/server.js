// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Configure these via Render environment variables:
// - NETLIFY_URL: the URL of your Netlify frontend (e.g. "https://your-site.netlify.app")
// - PASSWORD: the password string (e.g. "right")
const NETLIFY_URL = process.env.NETLIFY_URL || 'kurayami.netlify.app'; // set this on Render
const PASSWORD = process.env.PASSWORD || '2554';   // set this on Render for production

// CORS options: allow only your Netlify frontend origin in production.
// If NETLIFY_URL is not set (development), allow all origins for convenience.
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) {
      // server-to-server or curl (no origin) -> allow
      return callback(null, true);
    }
    if (!NETLIFY_URL || origin === NETLIFY_URL) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());

// If you want to serve static files from this server (optional):
// app.use(express.static(path.join(__dirname, 'public')));

// Simple auth endpoint
app.post('/auth', (req, res) => {
  const { password } = req.body;
  if (typeof password !== 'string') {
    return res.status(400).json({ success: false, message: 'Bad request' });
  }

  if (password === PASSWORD) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});

// Optional health check
app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
  console.log('NETLIFY_URL:', NETLIFY_URL ? NETLIFY_URL : '(not set; dev mode allowing all origins)');
});