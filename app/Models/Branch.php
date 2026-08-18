<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    public function users()
    {
        return $this->belongsToMany(User::class, 'branch_users');
    }

    public function roomTypes()
    {
        return $this->hasMany(RoomType::class);
    }

    public function paymentGateways()
    {
        return $this->hasMany(PaymentGateway::class);
    }

    public function roomCategories()
    {
        return $this->hasMany(RoomCategory::class);
    }

    public function facilities()
    {
        return $this->hasMany(Facility::class);
    }

    protected static function booted()
    {
        static::deleting(function ($branch) {
            // Soft delete related models and detach users when branch is deleted
            $branch->users()->detach();
            $branch->roomTypes()->delete();
            $branch->roomCategories()->delete();
            $branch->facilities()->delete();
            $branch->paymentGateways()->delete();
        });
    }
}
