<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'cozqtaweb@gmail.com'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('cozqta2026!'),
            ]
        );

        // Buat profile kosong
        DB::table('user_profiles')->updateOrInsert(
            ['user_id' => $admin->id],
            [
                'full_name' => 'Administrator',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $adminRole = Role::where('code', 'admin')->first();
        if ($adminRole && ! $admin->hasRole('admin')) {
            $admin->roles()->attach($adminRole->id);
        }
    }
}
