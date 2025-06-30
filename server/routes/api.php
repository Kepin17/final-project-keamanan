<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\PatientController;
use App\Http\Controllers\API\AccessRequestController;

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

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/register-dokter', [AuthController::class, 'registerDokter']);

    Route::post('/patients', [PatientController::class, 'store']);
});


Route::middleware(['auth:sanctum', 'role:dokter'])->group(function () {
    Route::post('/request-access', [AccessRequestController::class, 'requestAccess']);
    Route::post('/patients/{id}/access', [AccessRequestController::class, 'showDiagnosis']);
});

// Admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/access-requests', [AccessRequestController::class, 'listRequests']);
    Route::post('/access-requests/{id}/approve', [AccessRequestController::class, 'approve']);
    Route::post('/access-requests/{id}/reject', [AccessRequestController::class, 'reject']);
});