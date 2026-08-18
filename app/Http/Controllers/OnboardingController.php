<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OnboardingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $profile = DB::table('user_profiles')->where('user_id', $user->id)->first();

        // If already complete, go to dashboard
        if ($profile && ! empty($profile->identity_number) && ! empty($profile->phone_number)) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('auth/onboarding', [
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'phone_number' => ['required', 'string', 'max:30'],
            'emergency_contact_number' => ['required', 'string', 'max:30', 'different:phone_number'],
            'address' => ['required', 'string', 'max:500'],
            'gender' => ['required', 'in:male,female'],
            'birth_place' => ['required', 'string', 'max:100'],
            'birth_day' => ['required', 'date'],
            'identity_number' => ['required', 'string', 'max:50'],
            'identity_number_photo' => ['required', 'image', 'max:2048'], // Max 2MB Image
        ]);

        $user = $request->user();

        // Handle File Upload
        $photoPath = null;
        if ($request->hasFile('identity_number_photo')) {
            $photoPath = $request->file('identity_number_photo')->store('identity_photos', 'public');
        }

        DB::table('user_profiles')->updateOrInsert(
            ['user_id' => $user->id],
            [
                'phone_number' => $request->phone_number,
                'emergency_contact_number' => $request->emergency_contact_number,
                'address' => $request->address,
                'gender' => $request->gender,
                'birth_place' => $request->birth_place,
                'birth_day' => $request->birth_day,
                'identity_number' => $request->identity_number,
                'identity_number_photo' => $photoPath,
                'updated_at' => now(),
            ]
        );

        return redirect()->route('dashboard')->with('status', 'Profil berhasil dilengkapi.');
    }
}
