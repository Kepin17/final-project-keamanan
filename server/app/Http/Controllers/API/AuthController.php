<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Models\Otp;
use App\Mail\OtpMail;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Exception;

class AuthController extends Controller
{
    /**
     * Get all users (requires admin role)
     */
    public function index()
    {
        try {
            if (!auth()->user()->isAdmin()) {
                return response()->json([
                    "message" => "Unauthorized access"
                ], 403);
            }

            $users = User::select(['id', 'name', 'email', 'phone', 'role', 'department', 'created_at'])
                        ->latest()
                        ->get();

            return response()->json($users, 200); // Return array directly for frontend compatibility
        } catch (Exception $e) {
            return response()->json([
                "message" => "Error fetching users: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single user details (requires admin role or own profile)
     */
    public function show($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    "message" => "User not found"
                ], 404);
            }

            // Check if user is admin or requesting their own profile
            if (!auth()->user()->isAdmin() && auth()->id() !== $user->id) {
                return response()->json([
                    "message" => "Unauthorized access"
                ], 403);
            }

            return response()->json($user, 200); // Return user directly for frontend compatibility
        } catch (Exception $e) {
            return response()->json([
                "message" => "Error fetching user: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user (requires admin role or own profile)
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    "message" => "User not found"
                ], 404);
            }

            // Check if user is admin or updating their own profile
            if (!auth()->user()->isAdmin() && auth()->id() !== $user->id) {
                return response()->json([
                    "message" => "Unauthorized access"
                ], 403);
            }

            $rules = [
                "name" => "string",
                "email" => "email|unique:users,email," . $id,
                "phone" => "string",
                "department" => "string",
            ];

            // Only admin can change roles
            if (auth()->user()->isAdmin()) {
                $rules["role"] = "string|in:admin,dokter";
            }

            // Only include password validation if it's being updated
            if ($request->has('password')) {
                $rules["password"] = "string|min:6|confirmed";
                $rules["password_confirmation"] = "string|min:6";
            }

            $data = $request->validate($rules);

            // Hash password if it's being updated
            if (isset($data['password'])) {
                $data['password'] = bcrypt($data['password']);
            }

            $user->update($data);

            return response()->json([
                "message" => "User updated successfully",
                "data" => $user
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "message" => "Error updating user: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user (requires admin role)
     */
    public function destroy($id)
    {
        try {
            if (!auth()->user()->isAdmin()) {
                return response()->json([
                    "message" => "Unauthorized access"
                ], 403);
            }

            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    "message" => "User not found"
                ], 404);
            }

            // Prevent admin from deleting themselves
            if ($user->id === auth()->id()) {
                return response()->json([
                    "message" => "Cannot delete your own account"
                ], 400);
            }

            $user->delete();

            return response()->json([
                "message" => "User deleted successfully"
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                "message" => "Error deleting user: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Register new staff (requires admin role)
     */
    public function registerDokter(Request $request) {
        try {
            if (!auth()->user()->isAdmin()) {
                return response()->json([
                    "message" => "You are not allowed to register staff"
                ], 403);
            }

            $data = $request->validate([
                "name" => "required|string",
                "email" => "required|email|unique:users",
                "phone" => "required|string",
                "department" => "required|string",
                "password" => "required|string|min:6|confirmed",
                "password_confirmation" => "required|string|min:6",
                "role" => "required|string|in:admin,dokter"
            ]);

            $user = User::create([
                "name" => $data["name"],
                "email" => $data["email"],
                "phone" => $data["phone"],
                "department" => $data["department"],
                "password" => bcrypt($data["password"]),
                "role" => $data["role"] // Allow setting role during creation
            ]);

            return response()->json([
                "message" => "Staff member registered successfully",
                "data" => $user
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                "message" => "Error registering staff: " . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request) {
        $data = $request->validate([
            "email" => "required|email",
            "password" => "required|string"
        ]);

        $user = User::where("email", $data["email"])->first();

        if (!$user || !Hash::check($data["password"], $user->password)) {
            return response()->json([
                "message" => "Email or password is incorrect"
            ], 401);
        }

        try {
            // Check if there's an existing OTP for this email that's still in cooldown
            $existingOtp = Otp::where('email', $user->email)
                             ->where('purpose', 'login')
                             ->where('is_verified', false)
                             ->first();

            if ($existingOtp && !$existingOtp->canResend()) {
                $remainingTime = $existingOtp->getRemainingCooldown();
                return response()->json([
                    "success" => false,
                    "message" => "Please wait {$remainingTime} seconds before requesting another OTP",
                    "otp_required" => true,
                    "email" => $user->email,
                    "remaining_seconds" => $remainingTime
                ], 429);
            }

            // Create or update OTP for login verification
            $otp = Otp::createForEmail($user->email, 'login');

            // Send OTP email
            Mail::to($user->email)->send(new OtpMail($otp, $user->name));

            return response()->json([
                "success" => true,
                "message" => "Login credentials verified. Please check your email for the verification code.",
                "otp_required" => true,
                "email" => $user->email,
                "user_info" => [
                    "name" => $user->name,
                    "role" => $user->role
                ]
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Failed to send verification code: " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify OTP and complete login
     */
    public function verifyLoginOtp(Request $request) {
        $data = $request->validate([
            "email" => "required|email",
            "otp_code" => "required|string|size:6"
        ]);

        try {
            $user = User::where("email", $data["email"])->first();

            if (!$user) {
                return response()->json([
                    "success" => false,
                    "message" => "User not found"
                ], 404);
            }

            $otp = Otp::where('email', $data["email"])
                     ->where('purpose', 'login')
                     ->where('is_verified', false)
                     ->first();

            if (!$otp) {
                return response()->json([
                    "success" => false,
                    "message" => "No valid OTP found. Please request a new login."
                ], 404);
            }

            $result = $otp->verify($data["otp_code"]);

            if ($result['success']) {
                // Create access token after successful OTP verification
                $token = $user->createToken('api-token')->plainTextToken;

                return response()->json([
                    "success" => true,
                    "message" => "Login successful",
                    "role" => $user->role,
                    "token" => $token,
                    "user" => [
                        "id" => $user->id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "role" => $user->role,
                        "department" => $user->department
                    ]
                ], 200);
            } else {
                return response()->json([
                    "success" => false,
                    "message" => $result['message'],
                    "attempts_remaining" => $result['attempts_remaining'] ?? null
                ], 400);
            }

        } catch (Exception $e) {
            return response()->json([
                "success" => false,
                "message" => "Verification failed: " . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            "message" => "Logout successful"
        ]);
    }

    /**
     * Get current user profile
     */
    public function profile()
    {
        try {
            $user = auth()->user();
            return response()->json($user, 200); // Return user directly for frontend compatibility
        } catch (Exception $e) {
            return response()->json([
                "message" => "Error fetching profile: " . $e->getMessage()
            ], 500);
        }
    }
}
