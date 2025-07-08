# Implementasi OTP (One-Time Password) untuk MedInsight

## Overview

Sistem OTP telah diintegrasikan ke dalam flow authentication sebagai lapisan keamanan tambahan. Setelah user memasukkan email dan password yang benar, sistem akan mengirimkan kode OTP 6 digit ke email mereka sebelum memberikan akses ke dashboard.

## Flow Authentication dengan OTP

### 1. Login Flow

1. User memasukkan email dan password
2. Sistem memverifikasi kredensial
3. Jika valid, sistem mengirim OTP ke email user
4. User memasukkan kode OTP 6 digit
5. Sistem memverifikasi OTP
6. Jika valid, user mendapat access token dan diarahkan ke dashboard

### 2. Fitur Keamanan OTP

- **Masa berlaku**: 10 menit
- **Cooldown resend**: 5 menit (300 detik)
- **Maksimal percobaan**: 3 kali
- **Auto cleanup**: OTP expired otomatis dihapus dari database

## Backend Implementation

### Database Migration

```sql
-- File: database/migrations/2025_07_08_020712_create_otps_table.php
CREATE TABLE otps (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    purpose ENUM('login', 'password_reset', 'access_request') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    can_resend_at TIMESTAMP NOT NULL,
    attempts INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX(email, purpose),
    INDEX(expires_at)
);
```

### Model OTP

- **File**: `app/Models/Otp.php`
- **Metode utama**:
  - `generateOtp()`: Generate kode 6 digit random
  - `createOrUpdateOtp()`: Buat atau update OTP untuk email
  - `verify()`: Verifikasi kode OTP
  - `canResend()`: Check apakah bisa resend (cooldown)
  - `isExpired()`: Check apakah OTP sudah expired

### Controllers

#### AuthController

- **Modified method**: `login()` - Sekarang mengirim OTP setelah verifikasi kredensial
- **New method**: `verifyLoginOtp()` - Verifikasi OTP dan complete login

#### OtpController

- `sendOtp()`: Kirim OTP untuk berbagai purpose
- `verifyOtp()`: Verifikasi OTP umum
- `resendOtp()`: Kirim ulang OTP dengan cooldown check
- `checkOtpStatus()`: Check status OTP (expired, attempts, dll)

### Email Template

- **File**: `resources/views/emails/otp.blade.php`
- **Subject**: "Your Security Code for MedInsight"
- **Content**: HTML template dengan kode OTP dan informasi keamanan

### API Routes

```php
// Public routes
POST /api/login                   // Step 1: Login dengan email/password
POST /api/verify-login-otp        // Step 2: Verifikasi OTP untuk login

// OTP management routes
POST /api/otp/send                // Kirim OTP
POST /api/otp/verify              // Verifikasi OTP
POST /api/otp/resend              // Resend OTP
GET  /api/otp/status              // Check status OTP
```

## Frontend Implementation

### API Services

- **authApi.js**: Service untuk authentication dengan OTP
- **otpApi.js**: Service untuk OTP management
- **apiClient.js**: Axios client dengan interceptors

### Custom Hooks

- **useAuth.js**: Hook untuk authentication flow
- **useOtp.js**: Hook untuk OTP functionality dengan countdown timer

### Components

#### OTPFragment

- **File**: `components/fragments/OtpFragment/index.jsx`
- **Features**:
  - Auto-submit ketika 6 digit dimasukkan
  - Countdown timer untuk resend button
  - Support berbagai purpose (login, password_reset, access_request)
  - Loading states dan error handling
  - User info display untuk login

#### OTPInput

- **File**: `components/elements/OTPInput/index.jsx`
- **Features**:
  - 6 input fields untuk digit OTP
  - Auto-focus dan auto-advance
  - Paste support
  - Disabled state support

#### LoginPage

- **Modified**: Sekarang menggunakan useAuth hook
- **Flow**: Redirect ke OTP page setelah credentials verified

### Notifications

- **Library**: react-toastify
- **Implementation**: Toast notifications untuk semua feedback
- **Types**: Success, Error, Warning, Info

## Security Features

### Server-side

1. **Rate limiting**: Cooldown 5 menit untuk resend
2. **Attempt limiting**: Maksimal 3 percobaan per OTP
3. **Expiration**: OTP expired dalam 10 menit
4. **Cleanup**: Auto-delete expired OTP
5. **Purpose validation**: OTP hanya valid untuk purpose tertentu

### Client-side

1. **Token management**: Automatic token storage dan cleanup
2. **Route protection**: Redirect jika tidak authenticated
3. **Error handling**: Comprehensive error handling
4. **Loading states**: UI feedback untuk semua actions

## Usage Examples

### Login Flow

```javascript
// Step 1: Login
const result = await login(email, password);
if (result.otpRequired) {
  // Redirect to OTP page
  navigate("/auth-otp", {
    state: { email, purpose: "login", userInfo },
  });
}

// Step 2: Verify OTP
const verifyResult = await verifyLoginOtp(email, otpCode);
if (verifyResult.success) {
  // Redirected to dashboard automatically
}
```

### Resend OTP

```javascript
const resendResult = await resendLoginOtp(email);
// Cooldown automatically managed
```

## Configuration

### Environment Variables (.env)

```env
# Email configuration (required for OTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=support@kevien-portfolio.com
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS="support@kevien-portfolio.com"
MAIL_FROM_NAME="MedInsight Team Support"
```

## Testing

### Manual Testing

1. Login dengan credentials valid
2. Check email untuk kode OTP
3. Input kode OTP yang benar → Success
4. Input kode salah 3x → Blocked
5. Test resend dengan cooldown
6. Test expired OTP

### Email Testing

- Email template responsive dan readable
- Kode OTP jelas dan mudah dibaca
- Subject line informatif
- Spam folder detection notice

## Error Handling

### Common Scenarios

1. **Email tidak ditemukan**: Clear error message
2. **OTP salah**: Attempts counter dengan warning
3. **OTP expired**: Clear instruction to request new
4. **Too many attempts**: Blocked with clear message
5. **Cooldown active**: Timer display for resend
6. **Network errors**: Retry suggestion

## Future Enhancements

### Possible Improvements

1. **SMS OTP**: Alternative delivery method
2. **TOTP**: Time-based OTP dengan authenticator app
3. **Backup codes**: Recovery codes untuk emergency
4. **Device trust**: Remember trusted devices
5. **Geolocation**: Location-based security
6. **Admin dashboard**: OTP usage analytics

## Troubleshooting

### Common Issues

1. **Email tidak terkirim**: Check SMTP configuration
2. **OTP tidak valid**: Check server time synchronization
3. **Frontend errors**: Check API base URL configuration
4. **Database errors**: Ensure migration has run

### Debug Commands

```bash
# Check OTP records
php artisan tinker
>>> App\Models\Otp::all();

# Test email configuration
php artisan tinker
>>> Mail::raw('Test email', function($msg) { $msg->to('test@example.com')->subject('Test'); });

# Clear expired OTPs
php artisan tinker
>>> App\Models\Otp::cleanupExpired();
```
