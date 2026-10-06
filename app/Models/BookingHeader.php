<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class BookingHeader extends Model
{
    /** @use HasFactory<\Database\Factories\BookingHeaderFactory> */
    use HasFactory;

    protected $guarded = [];

    /** @return BelongsTo<User, $this> */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    /** @return BelongsTo<Branch, $this> */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    /** @return BelongsTo<RoomType, $this> */
    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class, 'room_type_id');
    }

    /** @return BelongsTo<RoomUnit, $this> */
    public function roomUnit(): BelongsTo
    {
        return $this->belongsTo(RoomUnit::class, 'room_unit_id');
    }

    /** @return HasMany<BookingLine, $this> */
    public function bookingLines(): HasMany
    {
        return $this->hasMany(BookingLine::class, 'booking_header_id');
    }

    /** @return HasOne<TenantContract, $this> */
    public function tenantContract(): HasOne
    {
        return $this->hasOne(TenantContract::class, 'booking_header_id');
    }

    /** @return HasMany<BookingAddon, $this> */
    public function addons(): HasMany
    {
        return $this->hasMany(BookingAddon::class, 'booking_header_id');
    }

    /** @return HasMany<PaymentHeader, $this> */
    public function paymentHeaders(): HasMany
    {
        return $this->hasMany(PaymentHeader::class, 'booking_header_id');
    }
}
