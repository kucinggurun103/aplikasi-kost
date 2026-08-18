<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationTemplate extends Model
{
    protected $fillable = [
        'name', 'code', 'email_enabled', 'whatsapp_enabled',
        'email_subject', 'email_content', 'whatsapp_subject', 'whatsapp_content', 'is_active',
    ];
}
