<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DiscountRule;
use App\Models\Faq;
use App\Models\SocialMedia;
use App\Models\WebSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    public function updateWebSettings(Request $request)
    {
        $request->validate([
            'site_name' => 'required|string|max:255',
            'site_tagline' => 'nullable|string|max:255',
            'site_description' => 'nullable|string',
            'site_keywords' => 'nullable|string',
            'primary_color' => 'nullable|string|max:20',
            'secondary_color' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'phone' => 'nullable|string|max:30',
            'whatsapp' => 'nullable|string|max:30',
            'address' => 'nullable|string',
            'maintenance_mode' => 'nullable|boolean',
            'favicon' => 'nullable|image|mimes:jpeg,png,jpg,svg,ico|max:1024',
            'site_logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'smtp_username' => 'nullable|string',
            'smtp_password' => 'nullable|string',
            'whatsapp_api_key' => 'nullable|string',
            'whatsapp_api_url' => 'nullable|url',
            'admin_fee' => 'nullable|numeric|min:0',
        ]);

        $data = $request->except(['favicon', 'site_logo', '_method']);

        $setting = WebSetting::first();
        if (! $setting) {
            $setting = new WebSetting;
            $setting->id = 1;
        }

        if ($request->hasFile('favicon')) {
            if ($setting->favicon) {
                Storage::disk('public')->delete($setting->favicon);
            }
            $data['favicon'] = $request->file('favicon')->store('settings', 'public');
        }

        if ($request->hasFile('site_logo')) {
            if ($setting->site_logo) {
                Storage::disk('public')->delete($setting->site_logo);
            }
            $data['site_logo'] = $request->file('site_logo')->store('settings', 'public');
        }

        $setting->fill($data);
        $setting->save();

        return back()->with('success', 'Pengaturan website berhasil diperbarui!');
    }

    public function storeSocial(Request $request)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:100',
            'icon' => 'nullable|string|max:100',
            'url' => 'required|url',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        SocialMedia::create($validated);

        return back()->with('success', 'Social media berhasil ditambahkan!');
    }

    public function updateSocial(Request $request, SocialMedia $social)
    {
        $validated = $request->validate([
            'platform' => 'required|string|max:100',
            'icon' => 'nullable|string|max:100',
            'url' => 'required|url',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $social->update($validated);

        return back()->with('success', 'Social media berhasil diperbarui!');
    }

    public function destroySocial(SocialMedia $social)
    {
        $social->delete();

        return back()->with('success', 'Social media berhasil dihapus!');
    }

    public function storeFaq(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        Faq::create($validated);

        return back()->with('success', 'FAQ berhasil ditambahkan!');
    }

    public function updateFaq(Request $request, Faq $faq)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        $faq->update($validated);

        return back()->with('success', 'FAQ berhasil diperbarui!');
    }

    public function destroyFaq(Faq $faq)
    {
        $faq->delete();

        return back()->with('success', 'FAQ berhasil dihapus!');
    }

    public function storeDiscountRule(Request $request)
    {
        $validated = $request->validate([
            'minimum_months' => 'required|integer|min:1',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'is_active' => 'nullable|boolean',
        ]);

        DiscountRule::create($validated);

        return back()->with('success', 'Aturan Diskon berhasil ditambahkan!');
    }

    public function updateDiscountRule(Request $request, DiscountRule $discountRule)
    {
        $validated = $request->validate([
            'minimum_months' => 'required|integer|min:1',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'is_active' => 'nullable|boolean',
        ]);

        $discountRule->update($validated);

        return back()->with('success', 'Aturan Diskon berhasil diperbarui!');
    }

    public function destroyDiscountRule(DiscountRule $discountRule)
    {
        $discountRule->delete();

        return back()->with('success', 'Aturan Diskon berhasil dihapus!');
    }
}
