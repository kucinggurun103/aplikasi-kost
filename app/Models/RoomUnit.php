<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class RoomUnit extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }
}
