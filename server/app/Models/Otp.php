<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Otp extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'otp_code',
        'purpose',
        'expires_at',
        'last_sent_at',
        'can_resend_at',
        'attempts',
        'is_verified'
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'last_sent_at' => 'datetime',
        'can_resend_at' => 'datetime',
        'is_verified' => 'boolean',
    ];

    /**
     * Generate a new OTP code
     */
    public static function generateOtp(): string
    {
        return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Create or update OTP for email
     */
    public static function createForEmail(string $email, string $purpose = 'login'): self
    {
        // Clean up expired OTPs
        self::where('expires_at', '<', now())->delete();

        // Check if there's an existing unverified OTP
        $existingOtp = self::where('email', $email)
            ->where('purpose', $purpose)
            ->where('is_verified', false)
            ->first();

        if ($existingOtp) {
            // If cooldown period hasn't passed, return existing OTP
            if ($existingOtp->can_resend_at && now() < $existingOtp->can_resend_at) {
                return $existingOtp;
            }
            
            // Cooldown has passed, update the existing OTP
            $existingOtp->update([
                'otp_code' => self::generateOtp(),
                'expires_at' => now()->addMinutes(3), // OTP expires in 3 minutes
                'last_sent_at' => now(),
                'can_resend_at' => now()->addSeconds(90), // 90 seconds resend cooldown
                'attempts' => 0,
            ]);
            
            return $existingOtp;
        }

        // Create new OTP
        $otp = self::create([
            'email' => $email,
            'purpose' => $purpose,
            'otp_code' => self::generateOtp(),
            'expires_at' => now()->addMinutes(3), // OTP expires in 3 minutes
            'last_sent_at' => now(),
            'can_resend_at' => now()->addSeconds(90), // 90 seconds resend cooldown
            'attempts' => 0,
            'is_verified' => false,
        ]);

        return $otp;
    }

    /**
     * Verify OTP code
     */
    public function verify(string $code): array
    {
        // Increment attempts
        $this->increment('attempts');

        // Check if OTP is expired
        if ($this->expires_at < now()) {
            return [
                'success' => false,
                'message' => 'OTP has expired. Please request a new one.',
                'attempts_remaining' => null
            ];
        }

        // Check if too many attempts (max 3)
        if ($this->attempts > 3) {
            return [
                'success' => false,
                'message' => 'Too many incorrect attempts. Please request a new OTP.',
                'attempts_remaining' => 0
            ];
        }

        // Check if code matches
        if ($this->otp_code === $code) {
            $this->update(['is_verified' => true]);
            return [
                'success' => true,
                'message' => 'OTP verified successfully.',
                'attempts_remaining' => null
            ];
        }

        $attemptsRemaining = 3 - $this->attempts;
        return [
            'success' => false,
            'message' => 'Invalid OTP code. Please try again.',
            'attempts_remaining' => $attemptsRemaining
        ];
    }

    /**
     * Check if OTP can be resent (5 minute cooldown)
     */
    public function canResend(): bool
    {
        if (!$this->can_resend_at) {
            return true;
        }

        return now() >= $this->can_resend_at;
    }

    /**
     * Get remaining time until resend is allowed
     */
    public function getResendCooldownSeconds(): int
    {
        if (!$this->can_resend_at) {
            return 0;
        }

        if (now() >= $this->can_resend_at) {
            return 0;
        }

        $remaining = $this->can_resend_at->diffInSeconds(now());

        return $remaining;
    }

    /**
     * Get remaining cooldown time in seconds
     */
    public function getRemainingCooldown(): int
    {
        return $this->getResendCooldownSeconds();
    }

    /**
     * Check if OTP is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }

    /**
     * Clean up expired OTPs
     */
    public static function cleanupExpired(): void
    {
        self::where('expires_at', '<', now())->delete();
    }
}
