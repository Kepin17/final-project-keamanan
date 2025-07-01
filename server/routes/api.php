<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\AccessRequestController;
use App\Http\Controllers\API\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Patient routes
    Route::get('/patients', [PatientController::class, 'index']);
    Route::post('/patients', [PatientController::class, 'store']);
});

// Doctor routes
Route::middleware(['auth:sanctum', 'role:dokter'])->group(function () {
    Route::post('/request-access', [AccessRequestController::class, 'requestAccess']);
    Route::post('/patients/{id}/access', [AccessRequestController::class, 'showDiagnosis']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    // Staff management
    Route::get('/users', [AuthController::class, 'index']);
    Route::post('/users', [AuthController::class, 'registerDokter']);
    Route::get('/users/{id}', [AuthController::class, 'show']);
    Route::put('/users/{id}', [AuthController::class, 'update']);
    Route::delete('/users/{id}', [AuthController::class, 'destroy']);

    // Access request management
    Route::get('/access-requests', [AccessRequestController::class, 'listRequests']);
    Route::post('/access-requests/{id}/approve', [AccessRequestController::class, 'approve']);
    Route::post('/access-requests/{id}/reject', [AccessRequestController::class, 'reject']);
});