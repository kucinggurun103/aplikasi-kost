<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    protected $fillable = [
        'notification_template_id', 'payment_header_id', 'user_id', 'channel', 'recipient', 'subject', 'message', 'status', 'sent_at',
    ];

    const UPDATED_AT = null;

    public function template()
    {
        return $this->belongsTo(NotificationTemplate::class, 'notification_template_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
