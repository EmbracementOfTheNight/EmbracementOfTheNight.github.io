const fs = require('fs');
const crypto = require('crypto');

function toBase64(buf){ return buf.toString('base64'); }

if (process.argv.length < 4) {
  console.error('Usage: ENCRYPT_PASSWORD=pass node encrypt.js <input-file> <output-json>');
  process.exit(2);
}

const inputPath = process.argv[2];
const outputPath = process.argv[3];
const password = process.env.ENCRYPT_PASSWORD;

if (!password) {
  console.error('Set ENCRYPT_PASSWORD env var to the password to use.');
  process.exit(2);
}

// Parameters (adjust iterations for security/performance)
const SALT_BYTES = 16;
const IV_BYTES = 12;     // recommended for AES-GCM
const KEY_LEN = 32;      // 256-bit
const ITERATIONS = 200_000; // PBKDF2 iterations (tune to acceptable speed)
const DIGEST = 'sha256';

const salt = crypto.randomBytes(SALT_BYTES);
const iv = crypto.randomBytes(IV_BYTES);
const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST);

const inputData = fs.readFileSync(inputPath); // Buffer (binary safe)
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const ciphertext = Buffer.concat([cipher.update(inputData), cipher.final()]);
const tag = cipher.getAuthTag();

const out = {
  version: 1,
  algo: 'aes-256-gcm',
  kdf: 'pbkdf2',
  kdfParams: { iterations: ITERATIONS, digest: DIGEST },
  salt: toBase64(salt),
  iv: toBase64(iv),
  ciphertext: toBase64(ciphertext),
  tag: toBase64(tag),
  contentType: 'text/html' // set accordingly if encrypting images (image/png) etc.
};

fs.writeFileSync(outputPath, JSON.stringify(out, null, 2));
console.log('Encrypted', inputPath, '->', outputPath);