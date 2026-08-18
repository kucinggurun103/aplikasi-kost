<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Facility extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function roomTypes()
    {
        return $this->belongsToMany(RoomType::class, 'room_type_facilities');
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
