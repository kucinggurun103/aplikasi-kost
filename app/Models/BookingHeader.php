<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BookingHeader extends Model
{
    protected $guarded = [];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class, 'room_type_id');
    }

    public function roomUnit(): BelongsTo
    {
        return $this->belongsTo(RoomUnit::class, 'room_unit_id');
    }

    public function bookingLines(): HasMany
    {
        return $this->hasMany(BookingLine::class, 'booking_header_id');
    }

    public function tenantContract(): HasOne
    {
        return $this->hasOne(TenantContract::class, 'booking_header_id');
    }

    public function addons(): HasMany
    {
        return $this->hasMany(BookingAddon::class, 'booking_header_id');
    }

    public function paymentHeaders(): HasMany
    {
        return $this->hasMany(PaymentHeader::class, 'booking_header_id');
    }
}
