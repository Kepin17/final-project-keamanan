<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Patient;
use App\Models\AccessRequest;
use App\Mail\AccessCodeMail;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email functionality for access code';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing email functionality...');

        // Check mail configuration
        $this->info('Mail Driver: ' . config('mail.default'));
        $this->info('From Address: ' . config('mail.from.address'));

        try {
            // Get test data
            $doctor = User::where('role', 'dokter')->first();
            $patient = Patient::first();

            if (!$doctor) {
                $this->error('No doctor found in database. Please create a doctor user first.');
                return;
            }

            if (!$patient) {
                $this->error('No patient found in database. Please create a patient first.');
                return;
            }

            // Create mock access request
            $accessRequest = new AccessRequest();
            $accessRequest->dokter_id = $doctor->id;
            $accessRequest->patient_id = $patient->id;
            $accessRequest->access_type = 'view';
            $accessRequest->reason = 'Test email functionality';
            $accessRequest->status = 'approved';
            $accessRequest->created_at = now();

            // Set relationships
            $accessRequest->setRelation('dokter', $doctor);
            $accessRequest->setRelation('patient', $patient);

            $accessCode = 'TEST123';
            $expiresAt = now()->addHours(1);

            $testEmail = $this->argument('email') ?? $doctor->email;

            $this->info("Sending test email to: {$testEmail}");
            $this->info("Doctor: {$doctor->name}");
            $this->info("Patient: {$patient->name}");
            $this->info("Access Code: {$accessCode}");

            // Send email
            Mail::to($testEmail)->send(new AccessCodeMail($accessRequest, $accessCode, $expiresAt));

            $this->info('✅ Email sent successfully!');
            
            if (config('mail.default') === 'log') {
                $this->info('📝 Since you\'re using log driver, check the email content in:');
                $this->info('   storage/logs/laravel.log');
            }

        } catch (\Exception $e) {
            $this->error('❌ Email failed: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
        }
    }
}
