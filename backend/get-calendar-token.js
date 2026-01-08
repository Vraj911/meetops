require('dotenv').config();
const { getTokenFromCode } = require('./src/config/calendar');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔑 Google Calendar Token Exchange Tool\n');
console.log('This tool helps you exchange an authorization code for refresh tokens.\n');

rl.question('Enter the authorization code from the callback URL: ', async (code) => {
  if (!code || code.trim() === '') {
    console.log('❌ No code provided. Exiting.\n');
    rl.close();
    process.exit(1);
  }

  try {
    console.log('\n⏳ Exchanging code for tokens...');
    const tokens = await getTokenFromCode(code.trim());
    
    console.log('\n✅ Success! Tokens received.\n');
    console.log('═'.repeat(60));
    console.log('\nAdd these to your .env file:\n');
    
    if (tokens.refresh_token) {
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    } else {
      console.log('⚠️  No refresh_token in response.');
      console.log('This can happen if you\'ve already authorized before.');
      console.log('To get a new refresh token:');
      console.log('  1. Go to https://myaccount.google.com/permissions');
      console.log('  2. Remove MeetOps from connected apps');
      console.log('  3. Run test-calendar.js again to get a new auth URL\n');
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('\nFull token response:');
    console.log(JSON.stringify(tokens, null, 2));
    console.log('\n');
    
    rl.close();
  } catch (error) {
    console.log('\n❌ Error exchanging code:', error.message);
    console.log('\nPossible issues:');
    console.log('  - Code may have expired (codes expire quickly)');
    console.log('  - GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is incorrect');
    console.log('  - GOOGLE_REDIRECT_URI doesn\'t match Google Cloud Console');
    console.log('\nTry getting a fresh authorization code.\n');
    rl.close();
    process.exit(1);
  }
});
