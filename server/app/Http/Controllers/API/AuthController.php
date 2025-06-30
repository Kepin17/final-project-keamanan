<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

use function Laravel\Prompts\error;

class AuthController extends Controller
{
    public function registerDokter(Request $request) {
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                "message" => "You are not allowed to register dokter"
            ], 403);
        }

        $data = $request->validate([
            "name" => "required|string",
            "email" => "required|email|unique:users",
            "phone" => "required|string",
            "department" => "required|string",
            "password" => "required|string"
        ]);

        $user = User::create([
            "name" => $data["name"],
            "email" => $data["email"],
            "phone" => $data["phone"],
            "department" => $data["department"],
            "password" => bcrypt($data["password"]),
            "role" => "dokter"
        ]);

        return response()->json([
            "message" => "Dokter registered successfully",
            "user" => $user
        ], 201);
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
}
