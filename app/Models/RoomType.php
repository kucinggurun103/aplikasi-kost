<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomType extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    protected $casts = [
        'electricity_included' => 'boolean',
        'water_included' => 'boolean',
        'monthly_price' => 'decimal:2',
        'deposit_price' => 'decimal:2',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function category()
    {
        return $this->belongsTo(RoomCategory::class, 'room_category_id');
    }

    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'room_type_facilities');
    }

    public function images()
    {
        return $this->hasMany(RoomImage::class)->orderBy('sort_order');
    }

    public function units()
    {
        return $this->hasMany(RoomUnit::class);
    }
}
