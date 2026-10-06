<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingAddon extends Model
{
    protected $fillable = [
        'booking_header_id',
        'facility_id',
        'price',
    ];

    /** @return BelongsTo<BookingHeader, $this> */
    public function booking(): BelongsTo
    {
        return $this->belongsTo(BookingHeader::class, 'booking_header_id');
    }

    /** @return BelongsTo<Facility, $this> */
    public function facility(): BelongsTo
    {
        return $this->belongsTo(Facility::class, 'facility_id');
    }
}
