<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingHeader extends Model
{
    protected $guarded = [];

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
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

    public function bookingLines()
    {
        return $this->hasMany(BookingLine::class, 'booking_header_id');
    }

    public function tenantContract()
    {
        return $this->hasOne(TenantContract::class, 'booking_header_id');
    }

    public function addons()
    {
        return $this->hasMany(BookingAddon::class, 'booking_header_id');
    }

    public function paymentHeaders()
    {
        return $this->hasMany(PaymentHeader::class, 'booking_header_id');
    }
}
