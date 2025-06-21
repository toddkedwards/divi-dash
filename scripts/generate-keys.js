#!/usr/bin/env node

const crypto = require('crypto');

console.log('🔐 Generating security keys for Divi Dash...\n');

// Generate 32-character encryption key
const encryptionKey = crypto.randomBytes(32).toString('hex');
console.log('ENCRYPTION_KEY=' + encryptionKey);

// Generate 64-character JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');
console.log('JWT_SECRET=' + jwtSecret);

console.log('\n✅ Copy these keys to your .env.local file');
console.log('💡 Keep these keys secure and never commit them to git!'); 