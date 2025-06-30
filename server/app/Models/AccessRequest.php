<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccessRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'dokter_id',
        'patient_id',
        'status',
        'access_code',
        'expires_at',
    ];

    public function dokter()
    {
        return $this->belongsTo(User::class, 'dokter_id');
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
