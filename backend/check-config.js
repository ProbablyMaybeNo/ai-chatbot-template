/**
 * Configuration Checker
 * Run this to verify your setup before starting the server
 */

require('dotenv').config();

console.log('\n' + '='.repeat(60));
console.log('CHATBOT CONFIGURATION CHECK');
console.log('='.repeat(60) + '\n');

let allGood = true;

// Check Node version
const nodeVersion = process.version;
console.log(`✓ Node.js Version: ${nodeVersion}`);
if (parseInt(nodeVersion.slice(1)) < 18) {
  console.log('  ⚠️  Warning: Node 18+ recommended');
}

// Check Claude API Key
const apiKey = process.env.ANTHROPIC_API_KEY;
if (apiKey && apiKey.startsWith('sk-ant-api03-')) {
  console.log('✓ Claude API Key: Configured');
  console.log(`  Key: ${apiKey.substring(0, 20)}...`);
} else if (apiKey && apiKey !== 'your_claude_api_key_here') {
  console.log('✗ Claude API Key: Invalid format');
  console.log('  Should start with: sk-ant-api03-');
  allGood = false;
} else {
  console.log('✗ Claude API Key: Not configured');
  console.log('  Add to .env: ANTHROPIC_API_KEY=sk-ant-api03-...');
  allGood = false;
}

// Check Port
const port = process.env.PORT || 5000;
console.log(`✓ Server Port: ${port}`);

// Check Company Name
const company = process.env.COMPANY_NAME;
if (company && company !== 'Your Company Name') {
  console.log(`✓ Company Name: ${company}`);
} else {
  console.log('⚠️  Company Name: Using default');
  console.log('  Customize in .env: COMPANY_NAME=Your Company');
}

// Check Email Config
const emailEnabled = process.env.SEND_EMAIL_NOTIFICATIONS === 'true';
if (emailEnabled) {
  console.log('✓ Email Notifications: Enabled');
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASSWORD;
  if (!emailUser || !emailPass) {
    console.log('  ⚠️  Warning: Email credentials not fully configured');
  }
} else {
  console.log('✓ Email Notifications: Disabled (optional)');
}

// Check Dependencies
console.log('\nChecking dependencies...');
try {
  require('@anthropic-ai/sdk');
  console.log('✓ @anthropic-ai/sdk: Installed');
} catch (e) {
  console.log('✗ @anthropic-ai/sdk: Not installed');
  console.log('  Run: npm install');
  allGood = false;
}

try {
  require('express');
  console.log('✓ express: Installed');
} catch (e) {
  console.log('✗ express: Not installed');
  console.log('  Run: npm install');
  allGood = false;
}

// Summary
console.log('\n' + '='.repeat(60));
if (allGood) {
  console.log('✅ ALL CHECKS PASSED! Ready to start the server.');
  console.log('\nRun: npm start');
} else {
  console.log('❌ CONFIGURATION ISSUES FOUND');
  console.log('\nFix the issues above, then run: node check-config.js');
}
console.log('='.repeat(60) + '\n');

process.exit(allGood ? 0 : 1);
