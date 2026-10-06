<?php

namespace App\Notifications;

use App\Models\BookingHeader;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    public BookingHeader $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct(BookingHeader $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id ?? null,
            'message' => 'Pesanan baru '.($this->booking->booking_no ?? '').' masuk.',
            'type' => 'new_booking',
        ];
    }
}
