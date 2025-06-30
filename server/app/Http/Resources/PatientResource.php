<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Crypt;

class PatientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'birth_date' => $this->birth_date,
            'address' => $this->address,
            'medical_records' => $this->medicalRecords->map(function ($record) {
                return [
                    'id' => $record->id,
                    'dokter' => $record->dokter->name,
                    'diagnosis' => Crypt::decryptString($record->diagnosis_encrypted),
                    'notes' => $record->notes,
                    'created_at' => $record->created_at->toDateTimeString(),
                ];
            }),
        ];
    }
}
