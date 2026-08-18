<?php

namespace App\Http\Middleware;

use App\Models\Branch;
use App\Models\DiscountRule;
use App\Models\Facility;
use App\Models\PaymentGateway;
use App\Models\SocialMedia;
use App\Models\UserProfile;
use App\Models\WebSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $authData = null;
        if ($user) {
            $user->loadMissing('roles');
            $authData = array_merge($user->toArray(), [
                'roles' => $user->roles->pluck('code'),
                'phone' => UserProfile::where('user_id', $user->id)->value('phone_number'),
                'notifications' => $user->notifications()->take(5)->get(),
                'unread_notifications_count' => $user->unreadNotifications()->count(),
            ]);
        }

        $hasGlobalGateway = PaymentGateway::whereNull('branch_id')->where('is_active', true)->exists();
        $globalBranches = Branch::where('is_active', true)
            ->when(! $hasGlobalGateway, function ($q) {
                $q->whereHas('paymentGateways', fn ($pg) => $pg->where('is_active', true));
            })
            ->get(['id', 'name', 'code'])
            ->map(function ($b) {
                $b->slug = Str::slug($b->name);
                return $b;
            })
            ->values();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $authData,
            ],
            'global_settings' => [
                'web_settings' => WebSetting::first(),
                'discount_rules' => DiscountRule::where('is_active', true)->orderBy('minimum_months', 'desc')->get(),
                'social_media' => SocialMedia::where('is_active', true)->orderBy('sort_order')->get(),
            ],
            'global_branches' => $globalBranches,
            'global_facilities' => Facility::get(['id', 'name', 'icon']),
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ];
    }
}
