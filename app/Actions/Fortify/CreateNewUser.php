<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ])->validate();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        // Buat profile kosong untuk user baru
        DB::table('user_profiles')->insert([
            'user_id' => $user->id,
            'full_name' => $input['name'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Assign 'tenant' role
        $tenantRole = Role::where('code', 'tenant')->first();
        if ($tenantRole) {
            $user->roles()->attach($tenantRole->id);
        }

        return $user;
    }
}
