// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoute = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', authRoute); // now available at /api/auth

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});