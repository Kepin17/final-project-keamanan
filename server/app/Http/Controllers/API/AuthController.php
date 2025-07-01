<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
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
                $rules["password"] = "string|min:6";
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
                "password" => "required|string|min:6",
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
                "message" => "Mail or password is incorrect"
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            "message" => "Login successful",
            "role" => $user->role,
            "token" => $token
        ], 200);
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
