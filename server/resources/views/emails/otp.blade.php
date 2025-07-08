<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Security Code - MedInsight</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e9ecef;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
        }
        .otp-section {
            text-align: center;
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-radius: 12px;
            border: 2px solid #3b82f6;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #1e40af;
            letter-spacing: 8px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .otp-label {
            font-size: 14px;
            color: #374151;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }
        .security-notice {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 30px 0;
        }
        .security-notice h3 {
            color: #d97706;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .security-notice p {
            margin: 0;
            color: #92400e;
            font-size: 14px;
        }
        .info-grid {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
            gap: 20px;
        }
        .info-item {
            flex: 1;
            text-align: center;
            padding: 15px;
            background-color: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .info-item strong {
            display: block;
            color: #475569;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .info-item span {
            color: #1e293b;
            font-weight: 600;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6b7280;
            font-size: 14px;
        }
        .support-info {
            background-color: #f1f5f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .support-info p {
            margin: 5px 0;
            color: #475569;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .otp-code {
                font-size: 28px;
                letter-spacing: 4px;
            }
            .info-grid {
                flex-direction: column;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🏥 MedInsight</div>
            <div class="subtitle">Healthcare Management System</div>
        </div>

        <h2 style="color: #1f2937; margin-bottom: 20px;">
            Hello {{ $userName ?? 'User' }}! 👋
        </h2>

        <p style="font-size: 16px; color: #4b5563; margin-bottom: 30px;">
            You requested a security code for <strong>{{ ucfirst($purpose) }}</strong>. 
            Please use the code below to proceed:
        </p>

        <div class="otp-section">
            <div class="otp-label">Your Security Code</div>
            <div class="otp-code">{{ $otpCode }}</div>
            <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 14px;">
                This code is valid for <strong>3 minutes</strong>
            </p>
        </div>

        <div class="info-grid">
            <div class="info-item">
                <strong>Expires At</strong>
                <span>{{ $expiresAt->setTimezone('Asia/Jakarta')->format('d M Y, H:i') }} WIB</span>
            </div>
            <div class="info-item">
                <strong>Purpose</strong>
                <span>{{ ucfirst($purpose) }}</span>
            </div>
            <div class="info-item">
                <strong>Valid For</strong>
                <span>3 minutes</span>
            </div>
        </div>

        <div class="security-notice">
            <h3>🔒 Security Information</h3>
            <p>
                <strong>Never share this code</strong> with anyone. MedInsight staff will never ask for your security code. 
                If you didn't request this code, please ignore this email or contact our support team.
            </p>
        </div>

        <div class="support-info">
            <p><strong>Need Help?</strong></p>
            <p>Contact our support team at <strong>support@medinsight.com</strong></p>
            <p>Or visit our help center for assistance</p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} MedInsight Healthcare Management System</p>
            <p style="margin-top: 10px;">
                This is an automated message. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
