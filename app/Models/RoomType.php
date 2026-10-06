<?php

namespace App\Models;

use Database\Factories\RoomTypeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomType extends Model
{
    /** @use HasFactory<RoomTypeFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'electricity_included' => 'boolean',
        'water_included' => 'boolean',
        'monthly_price' => 'decimal:2',
        'deposit_price' => 'decimal:2',
    ];

    /** @return BelongsTo<Branch, $this> */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /** @return BelongsTo<RoomCategory, $this> */
    public function category(): BelongsTo
    {
        return $this->belongsTo(RoomCategory::class, 'room_category_id');
    }

    /** @return BelongsToMany<Facility, $this, Pivot, 'pivot'> */
    public function facilities(): BelongsToMany
    {
        return $this->belongsToMany(Facility::class, 'room_type_facilities');
    }

    /** @return HasMany<RoomImage, $this> */
    public function images(): HasMany
    {
        return $this->hasMany(RoomImage::class)->orderBy('sort_order');
    }

    /** @return HasMany<RoomUnit, $this> */
    public function units(): HasMany
    {
        return $this->hasMany(RoomUnit::class);
    }
}
