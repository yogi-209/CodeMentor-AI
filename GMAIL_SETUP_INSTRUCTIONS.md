# Gmail SMTP Setup Instructions

## Issue: Email Authentication Error
The error `535-5.7.8 Username and Password not accepted` occurs because Gmail requires App Passwords for SMTP authentication when using third-party applications.

## Solution Steps:

### 1. Enable 2-Step Verification
1. Go to your [Google Account Security page](https://myaccount.google.com/security)
2. Under "Signing in to Google", click on "2-Step Verification"
3. Follow the prompts to set up 2-Step Verification
4. You'll need to verify your phone number

### 2. Generate App Password
1. After enabling 2-Step Verification, return to the [Security page](https://myaccount.google.com/security)
2. Under "Signing in to Google", click on "App passwords"
3. Select "Mail" as the app type
4. Select "Other" as the device and name it "CodingStartup" or similar
5. Click "Generate"
6. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### 3. Update Configuration
1. Open your `config.env` file
2. Replace the current `GMAIL_PASS` value with the new App Password:
   ```
   GMAIL_PASS=your-16-character-app-password-here
   ```
3. Make sure there are no spaces in the password (remove spaces if present)

### 4. Restart Server
1. Stop your server (Ctrl+C)
2. Restart it with `npm start` or `node server.js`

### 5. Test Email Functionality
1. Try registering a new user
2. Check if welcome and verification emails are sent successfully

## Alternative Solutions:

### Option 1: Use a Different Email Service
If Gmail continues to cause issues, consider using:
- **SendGrid** (free tier available)
- **Mailgun** (free tier available)
- **Outlook/Hotmail** (similar setup process)

### Option 2: Disable Email Verification (Temporary)
If you want to test the application without email functionality:
1. Comment out the email sending code in `routes/auth.js`
2. Set `isEmailVerified: true` by default in the User model

## Troubleshooting:

### Common Issues:
1. **"Less secure app access"** - This is deprecated, use App Passwords instead
2. **"Invalid credentials"** - Make sure you're using the App Password, not your regular password
3. **"Access blocked"** - Gmail may block the login attempt, try again after a few minutes

### Verification:
- Check your Gmail account's "Recent security activity" to see if the login attempt was successful
- Look for any security alerts from Google

## Security Notes:
- Never commit your App Password to version control
- Keep your App Password secure and don't share it
- Consider using environment variables for production deployment
- App Passwords are specific to your Google account and the application

## Current Configuration:
Your current setup in `config.env`:
```
GMAIL_USER=227r1a6209@cmrtc.ac.in
GMAIL_PASS=mfzs rufx dewf skhk
```

Make sure the App Password is correct and properly formatted (no spaces).
