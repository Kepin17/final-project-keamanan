<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PatientResource;
use App\Models\AccessRequest;
use App\Models\Patient;
use App\Mail\AccessCodeMail;
use App\Events\AccessRequestUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Mail;

class AccessRequestController extends Controller
{
    public function requestAccess(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'access_type' => 'required|in:view,edit',
            'reason' => 'nullable|string|max:500',
        ]);

        $existing = AccessRequest::where([
            'dokter_id' => auth()->id(),
            'patient_id' => $request->patient_id,
            'status' => 'pending'
        ])->first();

        if ($existing) {
            return response()->json(['message' => 'You already have a pending request for this patient'], 409);
        }

        $access = AccessRequest::create([
            'dokter_id' => auth()->id(),
            'patient_id' => $request->patient_id,
            'access_type' => $request->access_type,
            'reason' => $request->reason,
            'status' => 'pending'
        ]);

        // Broadcast the new access request
        event(new AccessRequestUpdated($access->load('dokter', 'patient'), 'created'));

        return response()->json([
            'message' => 'Access request submitted successfully',
            'request' => $access
        ]);
    }

    public function listRequests()
    {
        return AccessRequest::with('dokter', 'patient')->latest()->get();
    }

    public function myRequests()
    {
        return AccessRequest::with('patient')
            ->where('dokter_id', auth()->id())
            ->latest()
            ->get();
    }

    public function approve(Request $request, $id)
    {
        $data = $request->validate([
            'access_code' => 'required|string',
            'duration_minutes' => 'required|integer|min:1'
        ]);

        $access = AccessRequest::with(['dokter', 'patient'])->findOrFail($id);

        if ($access->status !== 'pending') {
            return response()->json(['message' => 'Already processed'], 400);
        }

        $expiresAt = now()->addMinutes($data['duration_minutes']);

        $access->update([
            'status' => 'approved',
            'access_code' => $data['access_code'],
            'expires_at' => $expiresAt
        ]);

        // Broadcast the access request approval
        event(new AccessRequestUpdated($access->load('dokter', 'patient'), 'approved'));

        $emailSent = false;
        $emailError = null;

        // Send email to doctor with access code
        try {
            Mail::to($access->dokter->email)->send(new AccessCodeMail($access, $data['access_code'], $expiresAt));
            $emailSent = true;
            \Log::info("Access code email sent successfully to: " . $access->dokter->email);
        } catch (\Exception $e) {
            $emailError = $e->getMessage();
            \Log::error('Failed to send access code email: ' . $emailError);
            \Log::error('Email was supposed to be sent to: ' . $access->dokter->email);
        }

        $response = [
            'message' => 'Access approved',
            'access_code' => $data['access_code'],
            'expires_at' => $expiresAt->toDateTimeString(),
            'email_sent' => $emailSent,
            'doctor_email' => $access->dokter->email
        ];

        if (!$emailSent) {
            $response['email_error'] = 'Failed to send email. Please provide the access code manually.';
            $response['manual_notice'] = "Please manually inform Dr. {$access->dokter->name} ({$access->dokter->email}) about the access code: {$data['access_code']}";
        }

        return response()->json($response);
    }

    public function reject($id)
    {
        $access = AccessRequest::findOrFail($id);

        if ($access->status !== 'pending') {
            return response()->json(['message' => 'Already processed'], 400);
        }

        $access->update(['status' => 'rejected']);

        // Broadcast the access request rejection
        event(new AccessRequestUpdated($access->load('dokter', 'patient'), 'rejected'));

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

        $patient = Patient::with(['medicalRecords' => function($query) {
            $query->latest();
        }])->findOrFail($patient_id);

        $latestRecord = $patient->medicalRecords->first();
        
        return response()->json([
            'id' => $patient->id,
            'name' => $patient->name,
            'birth_date' => $patient->birth_date,
            'gender' => $patient->gender,
            'phone' => $patient->phone,
            'address' => $patient->address,
            'diagnosis' => $latestRecord ? Crypt::decryptString($latestRecord->diagnosis_encrypted) : '',
            'notes' => $latestRecord ? $latestRecord->notes : '',
            'symptoms' => $latestRecord ? $latestRecord->symptoms : '',
            'treatment' => $latestRecord ? $latestRecord->treatment : '',
            'medications' => $latestRecord ? $latestRecord->medications : '',
            'access_granted_at' => now(),
            'access_expires_at' => $access->expires_at,
            'medical_records' => $patient->medicalRecords->map(function ($record) {
                return [
                    'id' => $record->id,
                    'dokter' => $record->dokter->name,
                    'diagnosis' => Crypt::decryptString($record->diagnosis_encrypted),
                    'notes' => $record->notes,
                    'created_at' => $record->created_at->toDateTimeString(),
                ];
            }),
        ]);
    }
}
