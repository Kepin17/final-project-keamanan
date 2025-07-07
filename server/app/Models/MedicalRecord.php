<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalRecord extends Model
{
    use HasFactory;

    protected $table = 'medical_records';

    protected $fillable = [
        'patient_id',
        'dokter_id',
        'diagnosis_encrypted',
        'notes',
        'symptoms',
        'treatment',
        'medications',
    ];

    public function patient()
{
    return $this->belongsTo(Patient::class);
}

public function dokter()
{
    return $this->belongsTo(User::class, 'dokter_id');
}
}
