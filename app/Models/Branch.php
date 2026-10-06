<?php

namespace App\Models;

use Database\Factories\BranchFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property string $slug
 */
class Branch extends Model
{
    /** @use HasFactory<BranchFactory> */
    use HasFactory, SoftDeletes;

    protected $guarded = [];

    /** @return BelongsToMany<User, $this, Pivot, 'pivot'> */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'branch_users');
    }

    /** @return HasMany<RoomType, $this> */
    public function roomTypes(): HasMany
    {
        return $this->hasMany(RoomType::class);
    }

    /** @return HasMany<PaymentGateway, $this> */
    public function paymentGateways(): HasMany
    {
        return $this->hasMany(PaymentGateway::class);
    }

    /** @return HasMany<RoomCategory, $this> */
    public function roomCategories(): HasMany
    {
        return $this->hasMany(RoomCategory::class);
    }

    /** @return HasMany<Facility, $this> */
    public function facilities(): HasMany
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
