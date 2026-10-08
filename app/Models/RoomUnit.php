<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class RoomUnit extends Model
{
    use SoftDeletes;

    protected $guarded = [];

    /** @return BelongsTo<RoomType, $this> */
    public function roomType(): BelongsTo
    {
        return $this->belongsTo(RoomType::class);
    }

    /**
     * Generate a unique, safe unit code that fits both 30-char legacy and expanded columns.
     */
    public static function generateUnitCode(string $typeCode, int $roomTypeId, int $unitIndex): string
    {
        $cleanType = Str::slug($typeCode);
        $suffix = '-U'.str_pad((string) $unitIndex, 2, '0', STR_PAD_LEFT);
        $full = $cleanType.$suffix;

        // If fits within 30 chars, use clean uppercase string
        if (strlen($full) <= 30) {
            $code = strtoupper($full);
        } else {
            // For legacy VARCHAR(30) tables, trim prefix and add deterministic hash
            $baseMax = 30 - strlen($suffix) - 5;
            $trimmedPrefix = substr($cleanType, 0, max(4, $baseMax));
            $hash = substr(md5("{$roomTypeId}-{$unitIndex}-{$cleanType}"), 0, 4);
            $code = strtoupper("{$trimmedPrefix}-{$hash}{$suffix}");
        }

        // Failsafe collision check
        if (static::withTrashed()->where('unit_code', $code)->exists()) {
            $rand = strtoupper(substr(md5(uniqid((string) mt_rand(), true)), 0, 3));
            $prefix = substr($code, 0, 30 - 4);
            $code = "{$prefix}-{$rand}";
        }

        return $code;
    }
}
