# SendGrid Setup

For sending emails from the app.

## Setup

1. Go to sendgrid.com and sign up
2. In your dashboard go to Settings > API Keys
3. Create a new key, give it Mail Send permissions
4. Copy the key (starts with SG.)
5. Go to Settings > Sender Authentication and verify an email address
6. Add to your .env:

```
SENDGRID_API_KEY=SG.your-api-key-here
FROM_EMAIL=the-email-you-verified@yourdomain.com
```

7. Restart server

## Testing

Try these to see if emails work:
- Register a new user (should get welcome email)
- Reset password (should get reset link)
- Buy something (should get order confirmation)

## Troubleshooting

- Make sure your FROM_EMAIL matches exactly what you verified
- Check spam folder
- API key needs Mail Send permission
- Restart server after adding env vars