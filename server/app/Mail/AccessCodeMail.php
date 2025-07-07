<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AccessCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $accessRequest;
    public $accessCode;
    public $expiresAt;

    /**
     * Create a new message instance.
     */
    public function __construct($accessRequest, $accessCode, $expiresAt)
    {
        $this->accessRequest = $accessRequest;
        $this->accessCode = $accessCode;
        $this->expiresAt = $expiresAt;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Patient Access Code - MedInsight System',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.access-code',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
