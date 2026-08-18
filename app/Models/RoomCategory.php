<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function roomTypes()
    {
        return $this->hasMany(RoomType::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
