<?php

namespace Database\Seeders;

use App\Models\WebSetting;
use Illuminate\Database\Seeder;

class WebSettingSeeder extends Seeder
{
    public function run(): void
    {
        WebSetting::firstOrCreate(
            ['id' => 1],
            [
                'site_name' => 'CozQta',
                'site_tagline' => 'Kost & Coliving Nyaman',
                'site_description' => 'Platform manajemen kost terpercaya di Indonesia. Temukan, pesan, dan kelola hunian kost dengan mudah.',
                'email' => 'cozqtaweb@gmail.com',
                'phone' => '08123456789',
                'whatsapp' => '08123456789',
                'address' => 'Belum ada',
                'admin_fee' => 5000,
            ]
        );
    }
}
