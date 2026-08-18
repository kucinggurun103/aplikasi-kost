<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationTemplate;
use Illuminate\Http\Request;

class NotificationTemplateController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:notification_templates,code',
            'email_enabled' => 'boolean',
            'whatsapp_enabled' => 'boolean',
            'email_subject' => 'nullable|string|max:255',
            'email_content' => 'nullable|string',
            'whatsapp_subject' => 'nullable|string|max:255',
            'whatsapp_content' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        NotificationTemplate::create($validated);

        return back()->with('success', 'Template notifikasi berhasil dibuat.');
    }

    public function update(Request $request, NotificationTemplate $notificationTemplate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:notification_templates,code,'.$notificationTemplate->id,
            'email_enabled' => 'boolean',
            'whatsapp_enabled' => 'boolean',
            'email_subject' => 'nullable|string|max:255',
            'email_content' => 'nullable|string',
            'whatsapp_subject' => 'nullable|string|max:255',
            'whatsapp_content' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $notificationTemplate->update($validated);

        return back()->with('success', 'Template notifikasi berhasil diperbarui.');
    }

    public function destroy(NotificationTemplate $notificationTemplate)
    {
        $notificationTemplate->delete();

        return back()->with('success', 'Template notifikasi berhasil dihapus.');
    }
}
