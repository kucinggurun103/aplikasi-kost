<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingLine extends Model
{
    protected $guarded = [];

    /** @return BelongsTo<BookingHeader, $this> */
    public function bookingHeader(): BelongsTo
    {
        return $this->belongsTo(BookingHeader::class, 'booking_header_id');
    }
}
