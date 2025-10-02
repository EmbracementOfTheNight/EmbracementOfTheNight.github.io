// encrypt.js
const crypto = require('crypto');

const password = 'p422w0rd';

const hash = crypto.createHash('sha256').update(password).digest('hex');

console.log('Hashed password:', hash);