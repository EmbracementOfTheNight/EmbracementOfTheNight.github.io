const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Change this password to your desired value
const PASSWORD = 'Correct';

app.use(cors());
app.use(express.json());

app.post('/auth', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server running on http://localhost:${PORT}`);
});
