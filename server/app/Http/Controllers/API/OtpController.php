<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class OtpController extends Controller
{
    /**
     * Send OTP to email
     */
    public function sendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'purpose' => 'required|string|in:login,password_reset,access_request'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $purpose = $request->purpose;

        try {
            // Check if email exists in our system for login purpose
            if ($purpose === 'login') {
                $user = User::where('email', $email)->first();
                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Email not found in our system'
                    ], 404);
                }
            }

            // Create or get existing OTP
            $otp = Otp::createForEmail($email, $purpose);

            if (!$otp->wasRecentlyCreated && $otp->canResend() === false) {
                $remainingTime = $otp->getRemainingCooldown();
                return response()->json([
                    'success' => false,
                    'message' => "Please wait {$remainingTime} seconds before requesting another OTP"
                ], 429);
            }

            // Send OTP email
            $user = User::where('email', $email)->first();
            $userName = $user ? $user->name : null;
            Mail::to($email)->send(new OtpMail($otp, $userName));

            return response()->json([
                'success' => true,
                'message' => 'OTP sent successfully to your email',
                'can_resend_at' => $otp->can_resend_at
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp_code' => 'required|string|size:6',
            'purpose' => 'required|string|in:login,password_reset,access_request'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $code = $request->otp_code;
        $purpose = $request->purpose;

        try {
            $otp = Otp::where('email', $email)
                     ->where('purpose', $purpose)
                     ->where('is_verified', false)
                     ->first();

            if (!$otp) {
                return response()->json([
                    'success' => false,
                    'message' => 'No valid OTP found for this email'
                ], 404);
            }

            $result = $otp->verify($code);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'OTP verified successfully'
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'],
                    'attempts_remaining' => $result['attempts_remaining'] ?? null
                ], 400);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Resend OTP
     */
    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'purpose' => 'required|string|in:login,password_reset,access_request'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $purpose = $request->purpose;

        try {
            $existingOtp = Otp::where('email', $email)
                             ->where('purpose', $purpose)
                             ->first();

            if (!$existingOtp) {
                return response()->json([
                    'success' => false,
                    'message' => 'No OTP request found. Please request a new OTP.'
                ], 404);
            }

            if (!$existingOtp->canResend()) {
                $remainingTime = $existingOtp->getRemainingCooldown();
                return response()->json([
                    'success' => false,
                    'message' => "Please wait {$remainingTime} seconds before requesting another OTP",
                    'remaining_seconds' => $remainingTime
                ], 429);
            }

            // Generate new OTP and update
            $existingOtp->update([
                'otp_code' => Otp::generateOtp(),
                'expires_at' => now()->addMinutes(3),
                'can_resend_at' => now()->addSeconds(90), // 90 seconds cooldown
                'attempts' => 0,
                'is_verified' => false
            ]);

            // Send new OTP email
            $user = User::where('email', $email)->first();
            $userName = $user ? $user->name : null;
            Mail::to($email)->send(new OtpMail($existingOtp, $userName));

            return response()->json([
                'success' => true,
                'message' => 'New OTP sent successfully',
                'can_resend_at' => $existingOtp->can_resend_at
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to resend OTP: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check OTP status
     */
    public function checkOtpStatus(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'purpose' => 'required|string|in:login,password_reset,access_request'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $email = $request->email;
        $purpose = $request->purpose;

        $otp = Otp::where('email', $email)
                  ->where('purpose', $purpose)
                  ->first();

        if (!$otp) {
            return response()->json([
                'success' => false,
                'message' => 'No OTP found',
                'has_active_otp' => false
            ]);
        }

        $canResend = $otp->canResend();
        $remainingCooldown = $canResend ? 0 : $otp->getRemainingCooldown();

        return response()->json([
            'success' => true,
            'has_active_otp' => !$otp->isExpired(),
            'is_verified' => $otp->is_verified,
            'can_resend' => $canResend,
            'remaining_cooldown' => $remainingCooldown,
            'expires_at' => $otp->expires_at,
            'attempts_remaining' => max(0, 3 - $otp->attempts)
        ]);
    }
}
