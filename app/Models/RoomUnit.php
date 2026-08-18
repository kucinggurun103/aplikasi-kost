<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomUnit extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }
}
