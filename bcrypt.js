const bcrypt = require('bcrypt');

const saltRounds = 10; // Number of salt rounds for hashing
const password = 'bob123'; // Replace with the actual password

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  
  console.log('Hashed password:', hashedPassword);
});

const crypto = require('crypto');

// Generate a random string of 64 bytes (512 bits)
const secretKey = crypto.randomBytes(64).toString('hex');

console.log('Generated secret key:', secretKey);

