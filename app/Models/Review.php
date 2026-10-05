<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'branch_id', 'user_id', 'reviewer_name', 'rating', 'review_text', 'is_published',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'float',
            'is_published' => 'boolean',
        ];
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
