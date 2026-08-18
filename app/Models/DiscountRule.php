<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountRule extends Model
{
    protected $fillable = ['minimum_months', 'discount_percentage', 'is_active'];

    protected $casts = [
        'minimum_months' => 'integer',
        'discount_percentage' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
