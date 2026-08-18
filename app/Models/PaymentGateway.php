<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    protected $fillable = [
        'branch_id',
        'name',
        'provider',
        'driver',
        'client_key',
        'server_key',
        'api_key',
        'secret_key',
        'merchant_id',
        'account_number',
        'account_name',
        'qr_image_path',
        'environment',
        'callback_url',
        'logo',
        'instruction',
        'sort_order',
        'is_default',
        'is_active',
    ];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
