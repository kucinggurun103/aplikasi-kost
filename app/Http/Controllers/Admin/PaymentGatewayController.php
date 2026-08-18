<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PaymentGatewayController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:255',
            'provider' => 'required|string|in:midtrans,duitku,manual,qris',
            'client_key' => 'nullable|string',
            'server_key' => 'nullable|string',
            'merchant_id' => 'nullable|string',
            'api_key' => 'nullable|string',
            'secret_key' => 'nullable|string',
            'environment' => 'nullable|string|in:sandbox,production',
            'account_number' => 'nullable|string',
            'account_name' => 'nullable|string',
            'qr_image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'is_active' => 'boolean',
        ]);

        $path = null;
        if ($request->hasFile('qr_image')) {
            $path = $request->file('qr_image')->store('payment_methods', 'public');
        }

        PaymentGateway::create([
            'branch_id' => $validated['branch_id'] ?? null,
            'name' => $validated['name'],
            'provider' => $validated['provider'],
            'client_key' => $validated['client_key'] ?? null,
            'server_key' => $validated['server_key'] ?? null,
            'api_key' => $validated['api_key'] ?? null,
            'secret_key' => $validated['secret_key'] ?? null,
            'merchant_id' => $validated['merchant_id'] ?? null,
            'environment' => $validated['environment'] ?? 'sandbox',
            'account_number' => $validated['account_number'] ?? null,
            'account_name' => $validated['account_name'] ?? null,
            'qr_image_path' => $path,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', 'Metode pembayaran berhasil ditambahkan.');
    }

    public function update(Request $request, PaymentGateway $paymentGateway)
    {
        $validated = $request->validate([
            'branch_id' => 'nullable|exists:branches,id',
            'name' => 'required|string|max:255',
            'provider' => 'required|string|in:midtrans,duitku,manual,qris',
            'client_key' => 'nullable|string',
            'server_key' => 'nullable|string',
            'api_key' => 'nullable|string',
            'secret_key' => 'nullable|string',
            'merchant_id' => 'nullable|string',
            'environment' => 'nullable|string|in:sandbox,production',
            'account_number' => 'nullable|string',
            'account_name' => 'nullable|string',
            'qr_image' => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'is_active' => 'boolean',
        ]);

        $path = $paymentGateway->qr_image_path;
        if ($request->hasFile('qr_image')) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
            $path = $request->file('qr_image')->store('payment_methods', 'public');
        }

        $paymentGateway->update([
            'branch_id' => $validated['branch_id'] ?? null,
            'name' => $validated['name'],
            'provider' => $validated['provider'],
            'client_key' => $validated['client_key'] ?? null,
            'server_key' => $validated['server_key'] ?? null,
            'api_key' => $validated['api_key'] ?? null,
            'secret_key' => $validated['secret_key'] ?? null,
            'merchant_id' => $validated['merchant_id'] ?? null,
            'environment' => $validated['environment'] ?? 'sandbox',
            'account_number' => $validated['account_number'] ?? null,
            'account_name' => $validated['account_name'] ?? null,
            'qr_image_path' => $path,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', 'Metode pembayaran berhasil diperbarui.');
    }

    public function destroy(PaymentGateway $paymentGateway)
    {
        if ($paymentGateway->qr_image_path) {
            Storage::disk('public')->delete($paymentGateway->qr_image_path);
        }

        $paymentGateway->delete();

        return back()->with('success', 'Metode pembayaran berhasil dihapus.');
    }

    public function toggleActive(PaymentGateway $paymentGateway)
    {
        $paymentGateway->update(['is_active' => ! $paymentGateway->is_active]);

        return back()->with('success', 'Status metode pembayaran berhasil diubah.');
    }
}
