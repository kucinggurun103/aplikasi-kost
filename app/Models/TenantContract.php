<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TenantContract extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    /** @return BelongsTo<BookingHeader, $this> */
    public function bookingHeader(): BelongsTo
    {
        return $this->belongsTo(BookingHeader::class, 'booking_header_id');
    }

    /** @return BelongsTo<User, $this> */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
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
}
