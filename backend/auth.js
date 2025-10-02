const express = require('express');
const router = express.Router();

// Your original password logic, adapted to Express
const PASSWORD = 'p422w0rd'; // Set your password here

router.post('/auth', (req, res) => {
  const { password } = req.body || {};

  if (password === PASSWORD) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(403).json({ success: false });
  }
});

module.exports = router;
