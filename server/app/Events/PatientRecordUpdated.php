<?php

namespace App\Events;

use App\Models\Patient;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PatientRecordUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $patient;
    public $action;

    /**
     * Create a new event instance.
     */
    public function __construct(Patient $patient, string $action = 'updated')
    {
        $this->patient = $patient;
        $this->action = $action;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('patient-records'),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'patient' => [
                'id' => $this->patient->id,
                'name' => $this->patient->name,
                'email' => $this->patient->email,
                'phone' => $this->patient->phone,
                'address' => $this->patient->address,
                'date_of_birth' => $this->patient->date_of_birth,
                'gender' => $this->patient->gender,
                'medical_record_number' => $this->patient->medical_record_number,
                'emergency_contact' => $this->patient->emergency_contact,
                'medical_history' => $this->patient->medical_history,
                'created_at' => $this->patient->created_at,
                'updated_at' => $this->patient->updated_at,
            ],
            'action' => $this->action,
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * Get the broadcast event name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'patient.record.' . $this->action;
    }
}
