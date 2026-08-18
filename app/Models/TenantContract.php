<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TenantContract extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function bookingHeader()
    {
        return $this->belongsTo(BookingHeader::class, 'booking_header_id');
    }

    public function tenant()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function roomType()
    {
        return $this->belongsTo(RoomType::class, 'room_type_id');
    }

    public function roomUnit()
    {
        return $this->belongsTo(RoomUnit::class, 'room_unit_id');
    }
}
