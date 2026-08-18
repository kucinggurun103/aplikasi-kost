<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingLine extends Model
{
    protected $guarded = [];

    public function bookingHeader()
    {
        return $this->belongsTo(BookingHeader::class, 'booking_header_id');
    }
}
