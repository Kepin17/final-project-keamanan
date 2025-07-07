# Email Configuration Setup for MedInsight

## ✅ Current Status

Email functionality is **WORKING** and configured. The system currently uses **log driver** for testing.

## Quick Test

Run this command to test email functionality:

```bash
php artisan test:email your-email@example.com
```

## Current Configuration (Working)

### Option 1: Log Driver (Currently Active)

Emails are logged to `storage/logs/laravel.log`. Perfect for development and testing.

```env
MAIL_MAILER=log
MAIL_FROM_ADDRESS="noreply@medinsight.com"
MAIL_FROM_NAME="MedInsight System"
```

**How to check emails:**

1. Approve an access request in admin panel
2. Check `storage/logs/laravel.log` file
3. Search for recent email content with HTML template

### Option 2: Gmail SMTP (For Real Email)

To send actual emails through Gmail:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:

    - Go to Google Account settings → Security → 2-Step Verification
    - App passwords → Generate password for "Mail"
    - Copy the 16-character password

3. **Update .env file**:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@medinsight.com"
MAIL_FROM_NAME="MedInsight System"
```

4. **Clear cache and test**:

```bash
php artisan config:clear
php artisan test:email your-email@gmail.com
```

### Option 3: Mailtrap (Development Testing)

1. Register at https://mailtrap.io (free)
2. Get SMTP credentials from your inbox
3. Update .env:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@medinsight.com"
MAIL_FROM_NAME="MedInsight System"
```

## How Email Works in the System

1. **Doctor requests access** to patient data
2. **Admin approves** the request and sets access code + duration
3. **System automatically sends email** to doctor with:
    - Access code
    - Expiration time
    - Patient details
    - Instructions on how to use the code

## Email Template Features

The email includes:

-   📧 **Professional HTML design**
-   🔐 **Access code prominently displayed**
-   ⏰ **Expiration date and time**
-   👤 **Patient and doctor information**
-   📋 **Step-by-step usage instructions**
-   ⚠️ **Security warnings and guidelines**

## Production Recommendations

For production use:

-   **SendGrid**: Reliable transactional emails
-   **Mailgun**: Great delivery rates
-   **Amazon SES**: Cost-effective for high volume
-   **Postmark**: Fast delivery

## Troubleshooting

### Email not sending?

1. Check configuration: `php artisan test:email`
2. Verify .env file settings
3. Clear cache: `php artisan config:clear`
4. Check logs: `tail -f storage/logs/laravel.log`

### Common Issues:

-   **"Connection refused"**: Wrong MAIL_HOST or MAIL_PORT
-   **"Authentication failed"**: Wrong MAIL_USERNAME or MAIL_PASSWORD
-   **Gmail not working**: Use App Password, not regular password
-   **SSL errors**: Try changing MAIL_ENCRYPTION to `ssl` or `null`

### Success Indicators:

-   ✅ Test command runs without errors
-   ✅ Log shows email content (if using log driver)
-   ✅ Admin gets success message with email status
-   ✅ Doctor receives email (if using real SMTP)

## Current Features Working:

1. ✅ **Email template rendering**
2. ✅ **Access code generation**
3. ✅ **Doctor notification system**
4. ✅ **Admin feedback on email status**
5. ✅ **Professional HTML email design**
6. ✅ **Error handling and logging**
