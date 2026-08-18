<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'branch_id', 'reviewer_name', 'rating', 'review_text', 'is_published',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
