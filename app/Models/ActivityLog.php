<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id', 'branch_id', 'module', 'action', 'table_name', 'record_id', 'ip_address', 'user_agent', 'old_values', 'new_values',
    ];

    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
