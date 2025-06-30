<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PatientResource;
use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class PatientController extends Controller
{
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

        return new PatientResource($patient->load('medicalRecords'));
    }
}
