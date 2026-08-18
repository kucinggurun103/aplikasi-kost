<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingAddon extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_header_id',
        'facility_id',
        'price',
    ];

    public function booking()
    {
        return $this->belongsTo(BookingHeader::class, 'booking_header_id');
    }

    public function facility()
    {
        return $this->belongsTo(Facility::class, 'facility_id');
    }
}
