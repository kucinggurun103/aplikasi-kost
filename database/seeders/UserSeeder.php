<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $operatorRole = Role::where('code', 'operator')->first();

        $operators = [
            [
                'email' => 'opr.ckr1@gmail.com',
                'name' => 'Operator Cikarang 1',
            ],
            [
                'email' => 'opr.ckr2@gmail.com',
                'name' => 'Operator Cikarang 2',
            ],
            [
                'email' => 'opr.ckr3@gmail.com',
                'name' => 'Operator Cikarang 3',
            ],
        ];

        foreach ($operators as $op) {
            $user = User::firstOrCreate(
                ['email' => $op['email']],
                [
                    'name' => $op['name'],
                    'password' => Hash::make('password'), // Ganti dengan password default yang diinginkan
                ]
            );

            // Buat profil jika belum ada
            DB::table('user_profiles')->updateOrInsert(
                ['user_id' => $user->id],
                [
                    'full_name' => $op['name'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );

            // Assign role
            if ($operatorRole && ! $user->hasRole('operator')) {
                $user->roles()->attach($operatorRole->id);
            }
        }
    }
}
