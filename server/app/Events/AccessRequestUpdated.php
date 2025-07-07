<?php

namespace App\Events;

use App\Models\AccessRequest;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AccessRequestUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $accessRequest;
    public $action;

    /**
     * Create a new event instance.
     */
    public function __construct(AccessRequest $accessRequest, string $action = 'updated')
    {
        $this->accessRequest = $accessRequest;
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
            new Channel('access-requests'),
            new PrivateChannel('access-requests.user.' . $this->accessRequest->doctor_id),
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
            'access_request' => [
                'id' => $this->accessRequest->id,
                'doctor_id' => $this->accessRequest->doctor_id,
                'patient_id' => $this->accessRequest->patient_id,
                'access_code' => $this->accessRequest->access_code,
                'status' => $this->accessRequest->status,
                'expires_at' => $this->accessRequest->expires_at,
                'created_at' => $this->accessRequest->created_at,
                'updated_at' => $this->accessRequest->updated_at,
                'doctor' => $this->accessRequest->doctor,
                'patient' => $this->accessRequest->patient,
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
        return 'access.request.' . $this->action;
    }
}
