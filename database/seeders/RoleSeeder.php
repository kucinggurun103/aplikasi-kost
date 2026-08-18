<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::firstOrCreate(
            ['code' => 'admin'],
            ['name' => 'Administrator', 'description' => 'Super Admin', 'access_all_branches' => true]
        );

        Role::firstOrCreate(
            ['code' => 'operator'],
            ['name' => 'Operator Cabang', 'description' => 'Pengelola Kost di Cabang', 'access_all_branches' => false]
        );

        Role::firstOrCreate(
            ['code' => 'tenant'],
            ['name' => 'Penghuni', 'description' => 'Penyewa Kamar / Penghuni Kost', 'access_all_branches' => false]
        );
    }
}
