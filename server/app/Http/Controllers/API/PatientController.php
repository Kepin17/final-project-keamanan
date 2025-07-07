<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PatientResource;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\AccessRequest;
use App\Events\PatientRecordUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class PatientController extends Controller
{
    /**
     * Display a listing of patients.
     */
    public function index()
    {
        // Validasi role: hanya dokter yang boleh
        if (!auth()->user()->isDokter()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $patients = Patient::latest()
                ->with(['medicalRecords' => function($query) {
                    $query->latest()->first();
                }])
                ->get()
                ->map(function($patient) {
                    $latestRecord = $patient->medicalRecords->first();
                    
                    // Get access request status for current doctor
                    $accessRequest = AccessRequest::where([
                        'dokter_id' => auth()->id(),
                        'patient_id' => $patient->id
                    ])->latest()->first();
                    
                    $accessStatus = 'none';
                    $accessType = null;
                    $accessCode = null;
                    $accessExpiry = null;
                    
                    if ($accessRequest) {
                        $accessStatus = $accessRequest->status;
                        $accessType = $accessRequest->access_type;
                        if ($accessRequest->status === 'approved' && $accessRequest->expires_at > now()) {
                            $accessCode = $accessRequest->access_code;
                            $accessExpiry = $accessRequest->expires_at;
                        } elseif ($accessRequest->status === 'approved' && $accessRequest->expires_at <= now()) {
                            $accessStatus = 'expired';
                        }
                    }
                    
                    return [
                        'id' => $patient->id,
                        'name' => $patient->name,
                        'birth_date' => $patient->birth_date,
                        'gender' => $patient->gender,
                        'phone' => $patient->phone,
                        'address' => $patient->address,
                        'created_at' => $patient->created_at,
                        'diagnosis' => $latestRecord ? Crypt::decryptString($latestRecord->diagnosis_encrypted) : null,
                        'notes' => $latestRecord ? $latestRecord->notes : null,
                        // Access control fields
                        'access_status' => $accessStatus,
                        'access_type' => $accessType,
                        'access_code' => $accessCode,
                        'access_expiry' => $accessExpiry,
                    ];
                });

            return response()->json($patients, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch patients'], 500);
        }
    }

    /**
     * Store a new patient
     */
    public function store(Request $request)
    {
        // Validasi role: hanya dokter yang boleh
        if (!auth()->user()->isDokter()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validasi input
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'birth_date' => 'required|date',
            'gender' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'diagnosis' => 'required|string',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            // Simpan pasien
            $patient = Patient::create([
                'name' => $data['name'],
                'birth_date' => $data['birth_date'],
                'gender' => $data['gender'] ?? null,
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
            ]);

            // Simpan diagnosis awal
            MedicalRecord::create([
                'patient_id' => $patient->id,
                'dokter_id' => auth()->id(),
                'diagnosis_encrypted' => Crypt::encryptString($data['diagnosis']),
                'notes' => $data['notes'] ?? null,
            ]);

            // Load relasi dan return response
            $patient->load('medicalRecords');
            
            // Broadcast the new patient record
            event(new PatientRecordUpdated($patient, 'created'));
            
            $response = [
                'id' => $patient->id,
                'name' => $patient->name,
                'birth_date' => $patient->birth_date,
                'gender' => $patient->gender,
                'phone' => $patient->phone,
                'address' => $patient->address,
                'created_at' => $patient->created_at,
                'diagnosis' => $data['diagnosis'], // Original diagnosis (not encrypted)
                'notes' => $data['notes'],
            ];

            return response()->json($response, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified patient with their medical records
     */
    public function show($id)
    {
        try {
            $patient = Patient::with('medicalRecords')->findOrFail($id);
            
            // Decrypt diagnoses
            $patient->medicalRecords->transform(function($record) {
                $record->diagnosis = Crypt::decryptString($record->diagnosis_encrypted);
                unset($record->diagnosis_encrypted);
                return $record;
            });

            return response()->json($patient, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Patient not found'], 404);
        }
    }

    /**
     * Update the specified patient
     */
    public function update(Request $request, $id)
    {
        if (!auth()->user()->isDokter()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $validator = \Validator::make($request->all(), [
                'name' => 'string|max:255',
                'birth_date' => 'date',
                'gender' => 'string|max:20',
                'phone' => 'string|max:20',
                'address' => 'string|max:255',
                'diagnosis' => 'string',
                'notes' => 'nullable|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $patient = Patient::findOrFail($id);
            
            // Update patient info
            $patient->update($request->only([
                'name', 'birth_date', 'gender', 'phone', 'address'
            ]));

            // If diagnosis is provided, create new medical record
            if ($request->has('diagnosis')) {
                MedicalRecord::create([
                    'patient_id' => $patient->id,
                    'dokter_id' => auth()->id(),
                    'diagnosis_encrypted' => Crypt::encryptString($request->diagnosis),
                    'notes' => $request->notes
                ]);
            }

            // Broadcast the patient record update
            event(new PatientRecordUpdated($patient->fresh(), 'updated'));

            return response()->json($patient, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update patient'], 500);
        }
    }
}
