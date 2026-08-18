<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class EnsureProfileIsComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            // Hanya admin dan operator yang lolos tanpa melengkapi profil (karena profil difokuskan untuk penghuni)
            if ($user->hasRole('admin') || $user->hasRole('operator')) {
                return $next($request);
            }

            $profile = DB::table('user_profiles')->where('user_id', $user->id)->first();

            // Kriteria lengkap: punya nomor identitas dan nomor HP
            $isComplete = $profile && ! empty($profile->identity_number) && ! empty($profile->phone_number);

            if (! $isComplete && ! $request->routeIs('onboarding.*')) {
                return redirect()->route('onboarding.index');
            }
        }

        return $next($request);
    }
}
