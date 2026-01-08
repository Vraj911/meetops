const express = require('express');
const { getAuthUrl, getTokenFromCode, isConfigured } = require('../config/calendar');

const router = express.Router();

/**
 * GET /api/oauth/google/authorize
 * Get the Google OAuth authorization URL
 */
router.get('/google/authorize', (req, res) => {
  try {
    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Google Calendar OAuth is not configured',
        message: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables',
      });
    }

    const authUrl = getAuthUrl();
    
    // Return both as JSON and redirect option
    return res.json({
      success: true,
      authUrl,
      message: 'Visit the authUrl to authorize the application',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/oauth/google/callback
 * Handle OAuth callback and exchange code for tokens
 */
router.get('/google/callback', async (req, res) => {
  try {
    const { code, error } = req.query;

    // Handle OAuth errors
    if (error) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authorization Failed</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            h1 { color: #dc3545; }
            .error { background: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24; }
          </style>
        </head>
        <body>
          <h1>❌ Authorization Failed</h1>
          <div class="error">
            <strong>Error:</strong> ${error}
          </div>
          <p>Please try again or contact support.</p>
        </body>
        </html>
      `);
    }

    if (!code) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Missing Code</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            h1 { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1>❌ Missing Authorization Code</h1>
          <p>No authorization code was provided in the callback.</p>
        </body>
        </html>
      `);
    }

    // Exchange code for tokens
    const tokens = await getTokenFromCode(code);

    // Success response with instructions
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorization Successful</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 40px; 
            max-width: 800px; 
            margin: 0 auto; 
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #28a745; }
          .success { 
            background: #d4edda; 
            padding: 15px; 
            border-radius: 5px; 
            color: #155724; 
            margin: 20px 0;
          }
          .token-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #dee2e6;
            margin: 20px 0;
            word-break: break-all;
            font-family: 'Courier New', monospace;
            font-size: 14px;
          }
          .instructions {
            background: #fff3cd;
            padding: 15px;
            border-radius: 5px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
          }
          .copy-btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
          }
          .copy-btn:hover {
            background: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Authorization Successful!</h1>
          
          <div class="success">
            <strong>Success!</strong> Your Google Calendar has been authorized.
          </div>

          ${tokens.refresh_token ? `
            <div class="instructions">
              <h3>📝 Next Steps:</h3>
              <ol>
                <li>Copy the refresh token below</li>
                <li>Add it to your <code>.env</code> file</li>
                <li>Restart your server</li>
              </ol>
            </div>

            <h3>Refresh Token:</h3>
            <div class="token-box" id="tokenBox">
              GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}
            </div>
            <button class="copy-btn" onclick="copyToken()">📋 Copy to Clipboard</button>
          ` : `
            <div class="instructions">
              <h3>⚠️ No Refresh Token</h3>
              <p>A refresh token was not provided. This can happen if:</p>
              <ul>
                <li>You've already authorized this app before</li>
                <li>The OAuth consent prompt was not set to "consent"</li>
              </ul>
              <p><strong>To get a new refresh token:</strong></p>
              <ol>
                <li>Go to <a href="https://myaccount.google.com/permissions" target="_blank">Google Account Permissions</a></li>
                <li>Remove "MeetOps" from connected apps</li>
                <li>Try authorizing again</li>
              </ol>
            </div>
          `}

          <h3>Full Response:</h3>
          <div class="token-box">
            ${JSON.stringify(tokens, null, 2)}
          </div>

          <p style="margin-top: 30px; color: #6c757d; font-size: 14px;">
            You can now close this window and return to your terminal.
          </p>
        </div>

        <script>
          function copyToken() {
            const text = document.getElementById('tokenBox').innerText;
            navigator.clipboard.writeText(text).then(() => {
              const btn = document.querySelector('.copy-btn');
              btn.innerHTML = '✅ Copied!';
              setTimeout(() => {
                btn.innerHTML = '📋 Copy to Clipboard';
              }, 2000);
            });
          }
        </script>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('OAuth callback error:', error);
    
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Token Exchange Failed</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
          h1 { color: #dc3545; }
          .error { background: #f8d7da; padding: 15px; border-radius: 5px; color: #721c24; }
          .details { margin-top: 20px; font-family: monospace; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>❌ Token Exchange Failed</h1>
        <div class="error">
          <strong>Error:</strong> ${error.message}
        </div>
        <div class="details">
          <p><strong>Possible causes:</strong></p>
          <ul>
            <li>Authorization code expired (codes are single-use and expire quickly)</li>
            <li>Incorrect GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET</li>
            <li>GOOGLE_REDIRECT_URI doesn't match Google Cloud Console</li>
          </ul>
        </div>
        <p>Please try authorizing again with a fresh code.</p>
      </body>
      </html>
    `);
  }
});

module.exports = router;
