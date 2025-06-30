<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PatientResource;
use App\Models\AccessRequest;
use App\Models\Patient;
use Illuminate\Http\Request;

class AccessRequestController extends Controller
{
    public function requestAccess(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
        ]);

        $existing = AccessRequest::where([
            'dokter_id' => auth()->id(),
            'patient_id' => $request->patient_id,
            'status' => 'pending'
        ])->first();

        if ($existing) {
            return response()->json(['message' => 'You already requested access'], 409);
        }

        $access = AccessRequest::create([
            'dokter_id' => auth()->id(),
            'patient_id' => $request->patient_id,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Access request submitted',
            'request' => $access
        ]);
    }

    public function listRequests()
    {
        return AccessRequest::with('dokter', 'patient')->latest()->get();
    }

    public function approve(Request $request, $id)
    {
        $data = $request->validate([
            'access_code' => 'required|string',
            'duration_minutes' => 'required|integer|min:1'
        ]);

        $access = AccessRequest::findOrFail($id);

        if ($access->status !== 'pending') {
            return response()->json(['message' => 'Already processed'], 400);
        }

        $access->update([
            'status' => 'approved',
            'access_code' => $data['access_code'],
            'expires_at' => now()->addMinutes($data['duration_minutes'])
        ]);

        return response()->json(['message' => 'Access approved']);
    }

    public function reject($id)
    {
        $access = AccessRequest::findOrFail($id);

        if ($access->status !== 'pending') {
            return response()->json(['message' => 'Already processed'], 400);
        }

        $access->update(['status' => 'rejected']);

        return response()->json(['message' => 'Access request rejected']);
    }

    public function showDiagnosis(Request $request, $patient_id)
    {
        $data = $request->validate([
            'access_code' => 'required|string'
        ]);

        $access = AccessRequest::where([
            'dokter_id' => auth()->id(),
            'patient_id' => $patient_id,
            'access_code' => $data['access_code'],
            'status' => 'approved'
        ])->where('expires_at', '>', now())->first();

        if (!$access) {
            return response()->json(['message' => 'Access denied or expired'], 403);
        }

        $patient = Patient::with('medicalRecords')->findOrFail($patient_id);

        return new PatientResource($patient);
    }
}
