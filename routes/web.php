<?php

use App\Http\Controllers\Admin\BookingController;
use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\FacilityController;
use App\Http\Controllers\Admin\NotificationTemplateController;
use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\RBACController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\RoomMaintenanceController;
use App\Http\Controllers\Admin\RoomTypeController;
use App\Http\Controllers\Admin\RoomUnitController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\TenantContractController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OnboardingController;
use App\Http\Middleware\EnsureProfileIsComplete;
use App\Models\BookingAddon;
use App\Models\BookingHeader;
use App\Models\Facility;
use App\Models\Faq;
use App\Models\PaymentGateway;
use App\Models\PaymentHeader;
use App\Models\RoomUnit;
use App\Models\SocialMedia;
use App\Models\TenantContract;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

if (!function_exists('mapRoomUnit')) {
    function mapRoomUnit($unit)
    {
        $room = $unit->roomType;

        return [
            'id' => $unit->id,
            'room_type_id' => $room->id,
            'name' => $room->type_name.' - '.$unit->unit_number,
            'address' => $room->branch ? $room->branch->name : '-',
            'price' => (float) $room->monthly_price,
            'booking_price' => (float) ($room->booking_price ?? 0),
            'deposit_price' => (float) ($room->deposit_price ?? 0),
            'deposit_type' => $room->deposit_type ?? 'Upfront',
            'rating' => 4.8,
            'reviews' => rand(5, 20),
            'type' => $room->category ? $room->category->name : 'Campur',
            'gender' => $room->gender_type ?? 'Campur',
            'owner' => 'CozQta Admin',
            'ownerAvatar' => 'https://ui-avatars.com/api/?name=CozQta&background=4f46e5&color=fff',
            'available' => $unit->status === 'Available',
            'status' => $unit->status,
            'image' => $room->images->first() ? asset('storage/'.$room->images->first()->image) : 'https://placehold.co/800x420/e2e8f0/64748b?text=Belum+Ada+Foto',
            'images' => $room->images->map(fn ($img) => asset('storage/'.$img->image))->toArray(),
            'size' => (float) ($room->room_size ?? 0),
            'floor' => $unit->floor ?? 1,
            'building' => $unit->building_name ?? ($room->branch ? $room->branch->name : '-'),
            'description' => $room->description,
            'whatsapp' => $room->branch ? $room->branch->phone : null,
            'electricity_included' => (bool) ($room->electricity_included ?? false),
            'water_included' => (bool) ($room->water_included ?? false),
            'facilities' => array_merge(
                $room->facilities->map(function ($f) {
                    return [
                        'name' => $f->name,
                        'icon' => $f->icon ?? 'Sparkles',
                        'price' => (float) $f->price,
                    ];
                })->toArray(),
                $room->electricity_included ? [['name' => 'Listrik Termasuk', 'icon' => 'Zap', 'price' => 0.0]] : [],
                $room->water_included ? [['name' => 'Air Termasuk', 'icon' => 'Droplet', 'price' => 0.0]] : []
            ),
        ];
    }
}

Route::get('/', function () {
    $hasGlobalGateway = PaymentGateway::whereNull('branch_id')->where('is_active', true)->exists();

    $query = RoomUnit::with(['roomType.branch', 'roomType.category', 'roomType.facilities', 'roomType.images'])
        ->where('is_active', true)
        ->whereHas('roomType', function ($q) {
            $q->where('is_active', true);
        });

    if (! $hasGlobalGateway) {
        $query->whereHas('roomType.branch.paymentGateways', function ($q) {
            $q->where('is_active', true);
        });
    }

    $units = $query->get()->map(fn ($u) => mapRoomUnit($u));

    return inertia('welcome', [
        'faqs' => Faq::where('is_active', true)->orderBy('sort_order')->get(),
        'social_media' => SocialMedia::where('is_active', true)->orderBy('sort_order')->get(),
        'testimonials' => \App\Models\Review::with('branch')->where('is_published', true)->orderBy('created_at', 'desc')->take(10)->get(),
        'rooms' => $units,
    ]);
})->name('home');

Route::get('/rooms', function () {
    $hasGlobalGateway = PaymentGateway::whereNull('branch_id')->where('is_active', true)->exists();

    $query = RoomUnit::with(['roomType.branch', 'roomType.category', 'roomType.facilities', 'roomType.images'])
        ->where('is_active', true)
        ->whereHas('roomType', function ($q) {
            $q->where('is_active', true);
        });

    if (! $hasGlobalGateway) {
        $query->whereHas('roomType.branch.paymentGateways', function ($q) {
            $q->where('is_active', true);
        });
    }

    $units = $query->get()->map(fn ($u) => mapRoomUnit($u));

    return inertia('rooms/index', [
        'rooms' => $units,
    ]);
})->name('rooms.index');

Route::get('/rooms/{id}', function ($id) {
    // ID is room unit ID
    $unit = RoomUnit::with(['roomType.branch', 'roomType.category', 'roomType.facilities', 'roomType.images'])
        ->findOrFail($id);

    $similar = RoomUnit::with(['roomType.branch', 'roomType.category', 'roomType.facilities', 'roomType.images'])
        ->where('id', '!=', $id)
        ->whereHas('roomType', function ($q) use ($unit) {
            $q->where('room_category_id', $unit->roomType->room_category_id)
                ->where('is_active', true);
        })
        ->where('is_active', true)
        ->inRandomOrder()
        ->take(2)
        ->get()
        ->map(fn ($u) => mapRoomUnit($u));

    return inertia('rooms/show', [
        'room' => mapRoomUnit($unit),
        'similarRooms' => $similar,
    ]);
})->name('rooms.show');
Route::get('/bookings/create', function (Request $request) {
    if ($request->has('room_id')) {
        return redirect('/bookings/room/'.$request->query('room_id'));
    }

    return redirect('/rooms');
});
Route::get('/bookings/room/{room_id}', function (Request $request, $room_id) {
    $room = null;

    if ($room_id) {
        $unit = RoomUnit::with(['roomType.branch', 'roomType.category', 'roomType.facilities', 'roomType.images'])
            ->find($room_id);

        if ($unit) {
            $room = mapRoomUnit($unit);
        }
    }

    $addons = collect();
    if ($room) {
        $branchId = $unit->roomType->branch_id ?? null;
        $addons = Facility::where('price', '>', 0)
            ->where(function ($q) use ($branchId) {
                $q->whereNull('branch_id');
                if ($branchId) {
                    $q->orWhere('branch_id', $branchId);
                }
            })->get();
    } else {
        $addons = Facility::where('price', '>', 0)->whereNull('branch_id')->get();
    }

return inertia('bookings/create', [
        'room' => $room,
        'addons' => $addons,
    ]);
})->name('bookings.create');

Route::get('/payments/{payment_no}', function (Request $request, $payment_no) {
    $payment = PaymentHeader::with(['booking.roomUnit.roomType.branch', 'booking.roomUnit.roomType.category', 'booking.roomUnit.roomType.facilities', 'booking.roomUnit.roomType.images'])->where('payment_no', $payment_no)->firstOrFail();
    $booking = $payment->booking;
    $unit = $booking->roomUnit;
    $room = null;

    if ($unit && $unit->roomType) {
        $branchId = $unit->roomType->branch_id;
        $room = mapRoomUnit($unit);

        // Get gateways for this branch, or global ones if none exist for branch
        $gateways = PaymentGateway::where('is_active', true)
            ->where(function ($q) use ($branchId) {
                $q->where('branch_id', $branchId)
                    ->orWhereNull('branch_id');
            })
            ->orderBy('sort_order')
            ->get();
    } else {
        // Fallback to global
        $gateways = PaymentGateway::where('is_active', true)
            ->whereNull('branch_id')
            ->orderBy('sort_order')
            ->get();
    }

    return inertia('payments/show', [
        'payment_gateways' => $gateways,
        'payment' => $payment,
        'booking' => $booking,
        'room' => $room,
    ]);
})->name('payments.show');

Route::post('/payments/upload-proof', function (Request $request) {
    $request->validate([
        'payment_id' => 'required|integer',
        'method_id' => 'required|integer',
        'proof_file' => 'required|image|max:2048',
    ]);

    $paymentHeader = PaymentHeader::find($request->payment_id);

    if (! $paymentHeader) {
        return back()->with('flash', ['type' => 'error', 'message' => 'Data tagihan tidak ditemukan.']);
    }

    $path = $request->file('proof_file')->store('payments', 'public');

    $paymentHeader->update([
        'payment_gateway_id' => $request->method_id,
        'proof_of_payment' => $path,
        'status' => 'Pending',
    ]);

    return back()->with('flash', ['type' => 'success', 'message' => 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.']);
})->name('payments.upload-proof');

Route::post('/payments/simulate-gateway', function (Request $request) {
    $request->validate([
        'payment_id' => 'required|integer',
        'method_id' => 'required|integer',
    ]);

    $paymentHeader = PaymentHeader::find($request->payment_id);

    if (! $paymentHeader) {
        return back()->with('flash', ['type' => 'error', 'message' => 'Data tagihan tidak ditemukan.']);
    }

    $paymentHeader->update([
        'payment_gateway_id' => $request->method_id,
        'status' => 'Paid',
        'paid_at' => now(),
    ]);

    $booking = clone $paymentHeader->booking;

    $totalPaid = PaymentHeader::where('booking_header_id', $booking->id)
        ->where('status', 'Paid')
        ->sum('grand_total');

    $dpAmount = $booking->roomType->booking_price ?? 0;
    $isDPPayment = ($dpAmount > 0 && $paymentHeader->subtotal == $dpAmount);

    if ($isDPPayment) {
        $booking->update([
            'payment_status' => 'Partially Paid',
            'status' => 'Confirmed', 
        ]);

        $existingCount = PaymentHeader::where('booking_header_id', $booking->id)->count();
        if ($existingCount == 1) {
            PaymentHeader::generateMonthlyInvoices($booking);
        }
    } else {
        $isFirstRentPayment = !\App\Models\TenantContract::where('booking_header_id', $booking->id)->exists();

        $booking->update([
            'payment_status' => ($totalPaid >= $booking->grand_total) ? 'Paid' : 'Partially Paid',
            'status' => 'Checked In',
        ]);
        
        if ($booking->room_unit_id) {
            \App\Models\RoomUnit::where('id', $booking->room_unit_id)->update(['status' => 'Occupied']);
        }

        if ($isFirstRentPayment) {
            \App\Models\TenantContract::create([
                'contract_number' => 'CTR-'.time().'-'.rand(100, 999),
                'booking_header_id' => $booking->id,
                'user_id' => $booking->tenant_id,
                'branch_id' => $booking->branch_id,
                'room_type_id' => $booking->room_type_id,
                'room_unit_id' => $booking->room_unit_id,
                'start_date' => $booking->check_in_date,
                'end_date' => $booking->check_out_date,
                'monthly_price' => $booking->monthly_price,
                'deposit_amount' => $booking->deposit,
                'status' => 'Active',
                'notes' => 'Generated automatically from payment.',
            ]);
        }
    }

    return back()->with('flash', ['type' => 'success', 'message' => 'Pembayaran berhasil dikonfirmasi.']);
})->name('payments.simulate-gateway');

Route::inertia('/branches/{name}', 'branches/show')->name('branches.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::post('/bookings/create', function (Request $request) {
        $request->validate([
            'room_id' => 'required|exists:room_units,id',
            'duration' => 'required|integer|min:1',
            'checkInDate' => 'required|date',
            'notes' => 'nullable|string',
            'insurance' => 'boolean',
            'addons' => 'array',
        ]);

        $unit = RoomUnit::with('roomType')->findOrFail($request->room_id);
        $monthlyPrice = $unit->roomType->monthly_price ?? 0;
        $subtotal = $monthlyPrice * $request->duration;
        $insuranceFee = $request->insurance ? 50000 : 0;

        $addonTotal = 0;
        if (! empty($request->addons)) {
            $addonPrices = Facility::whereIn('id', $request->addons)->pluck('price')->toArray();
            $addonTotal = array_sum($addonPrices) * $request->duration;
        }

        $adminFee = \App\Models\WebSetting::first()->admin_fee ?? 25000;
        $bookingFee = $unit->roomType->booking_price ?? 0;
        $depositFee = $unit->roomType->deposit_price ?? 0;
        $depositType = $unit->roomType->deposit_type ?? 'Upfront';

        $discountRule = \App\Models\DiscountRule::where('minimum_months', $request->duration)->first();
        $discountRate = $discountRule ? ($discountRule->discount_percentage / 100) : 0;
        $discountAmount = $subtotal * $discountRate;

        $grandTotal = $subtotal + $insuranceFee + $addonTotal + $adminFee + $depositFee - $discountAmount;

        $booking = BookingHeader::create([
            'booking_no' => 'BKG-'.time().'-'.rand(100, 999),
            'tenant_id' => auth()->id(),
            'branch_id' => $unit->roomType->branch_id,
            'room_type_id' => $unit->roomType->id,
            'room_unit_id' => $unit->id,
            'check_in_date' => $request->checkInDate,
            'check_out_date' => Carbon::parse($request->checkInDate)->addMonths($request->duration)->format('Y-m-d'),
            'duration_month' => $request->duration,
            'monthly_price' => $monthlyPrice,
            'deposit' => $depositFee,
            'discount' => $discountAmount,
            'subtotal' => $subtotal + $insuranceFee + $addonTotal,
            'tax' => 0,
            'grand_total' => $grandTotal,
            'status' => 'Pending',
            'payment_status' => 'Unpaid',
            'notes' => $request->notes,
        ]);

        if (! empty($request->addons)) {
            $addonModels = Facility::whereIn('id', $request->addons)->get();
            foreach ($addonModels as $addon) {
                BookingAddon::create([
                    'booking_header_id' => $booking->id,
                    'facility_id' => $addon->id,
                    'price' => $addon->price,
                ]);
            }
        }

        // Notify Admins and Branch Operators
        $adminsAndOperators = \App\Models\User::with('branches')->whereHas('roles', function ($q) {
            $q->whereIn('code', ['admin', 'operator']);
        })->get()->filter(function ($user) use ($booking) {
            if ($user->hasRole('admin')) return true;
            if ($user->hasRole('operator')) {
                return $user->branches->contains('id', $booking->branch_id);
            }
            return false;
        });

        foreach ($adminsAndOperators as $userToNotify) {
            $userToNotify->notify(new \App\Notifications\NewBookingNotification($booking));
        }

        $addonTotalPerMonth = 0;
        if (! empty($request->addons)) {
            $addonPrices = Facility::whereIn('id', $request->addons)->pluck('price')->toArray();
            $addonTotalPerMonth = array_sum($addonPrices);
        }

        $upfrontDeposit = ($depositType === 'Upfront') ? $depositFee : 0;
        
        $paymentCount = 0;
        $initialPayment = 0;
        
        // 1. Invoice DP (Jika ada Booking Fee)
        if ($bookingFee > 0) {
            $paymentCount++;
            $initialPayment = $bookingFee + $adminFee;
            PaymentHeader::create([
                'payment_no' => 'PAY-'.time().'-'.$booking->id.'-'.$paymentCount,
                'booking_header_id' => $booking->id,
                'invoice_date' => now(),
                'due_date' => now()->addDays(1),
                'subtotal' => $bookingFee,
                'admin_fee' => $adminFee,
                'grand_total' => $initialPayment,
                'payment_method' => 'Transfer',
                'status' => 'Unpaid',
            ]);
        } else {
            // 2. Invoice Bulanan (Hanya dibuat di awal JIKA tidak ada DP)
            for ($i = 1; $i <= $request->duration; $i++) {
                $paymentCount++;
                $monthRent = $monthlyPrice + $addonTotalPerMonth;
                
                $isFirstMonth = ($i === 1);
                $monthSubtotal = $monthRent;
                $monthAdmin = 0;
                
                if ($isFirstMonth) {
                    $monthSubtotal += $insuranceFee + $upfrontDeposit;
                    $monthSubtotal -= $discountAmount;
                    $monthAdmin = $adminFee;
                    $initialPayment = $monthSubtotal + $monthAdmin;
                }
                
                $dueDate = $isFirstMonth ? Carbon::parse($request->checkInDate) : Carbon::parse($request->checkInDate)->addMonths($i - 1);
                $invoiceDate = $isFirstMonth ? now() : $dueDate->copy()->subDays(7);
                
                if ($isFirstMonth) {
                    $dueDate = now()->addDays(1);
                }
                
                PaymentHeader::create([
                    'payment_no' => 'PAY-'.time().'-'.$booking->id.'-'.$paymentCount,
                    'booking_header_id' => $booking->id,
                    'invoice_date' => $invoiceDate,
                    'due_date' => $dueDate,
                    'subtotal' => $monthSubtotal,
                    'admin_fee' => $monthAdmin,
                    'grand_total' => $monthSubtotal + $monthAdmin,
                    'payment_method' => 'Transfer',
                    'status' => 'Unpaid',
                ]);
            }
        }

        $firstPayment = PaymentHeader::where('booking_header_id', $booking->id)->orderBy('id', 'asc')->first();

        return redirect()->route('payments.show', [
            'payment_no' => $firstPayment->payment_no,
        ]);
    })->name('bookings.store');

    // Onboarding Routes
    Route::get('onboarding', [OnboardingController::class, 'index'])->name('onboarding.index');
    Route::post('onboarding', [OnboardingController::class, 'store'])->name('onboarding.store');

    // Notifications
    Route::post('/notifications/{id}/mark-as-read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.markAsRead');
    Route::post('/notifications/mark-all-as-read', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.markAllAsRead');

    // Dashboard Route (Protected by EnsureProfileIsComplete)
    Route::middleware([EnsureProfileIsComplete::class])->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::post('profile/update', [DashboardController::class, 'updateProfile'])->name('profile.update.tenant');

        // Admin Settings Routes
        Route::prefix('admin/settings')->name('admin.settings.')->group(function () {
            Route::post('web', [SettingsController::class, 'updateWebSettings'])->name('web.update');

            Route::post('social', [SettingsController::class, 'storeSocial'])->name('social.store');
            Route::put('social/{social}', [SettingsController::class, 'updateSocial'])->name('social.update');
            Route::delete('social/{social}', [SettingsController::class, 'destroySocial'])->name('social.destroy');

            Route::post('faq', [SettingsController::class, 'storeFaq'])->name('faq.store');
            Route::put('faq/{faq}', [SettingsController::class, 'updateFaq'])->name('faq.update');
            Route::delete('faq/{faq}', [SettingsController::class, 'destroyFaq'])->name('faq.destroy');

            Route::post('payment-gateways', [PaymentGatewayController::class, 'store'])->name('payment_gateways.store');
            Route::post('payment-gateways/{paymentGateway}', [PaymentGatewayController::class, 'update'])->name('payment_gateways.update');
            Route::delete('payment-gateways/{paymentGateway}', [PaymentGatewayController::class, 'destroy'])->name('payment_gateways.destroy');
            Route::post('payment-gateways/{paymentGateway}/toggle', [PaymentGatewayController::class, 'toggleActive'])->name('payment_gateways.toggle');

            Route::post('discount-rules', [SettingsController::class, 'storeDiscountRule'])->name('discount_rules.store');
            Route::put('discount-rules/{discountRule}', [SettingsController::class, 'updateDiscountRule'])->name('discount_rules.update');
            Route::delete('discount-rules/{discountRule}', [SettingsController::class, 'destroyDiscountRule'])->name('discount_rules.destroy');

            Route::post('notification-templates', [NotificationTemplateController::class, 'store']);
            Route::put('notification-templates/{notificationTemplate}', [NotificationTemplateController::class, 'update']);
            Route::delete('notification-templates/{notificationTemplate}', [NotificationTemplateController::class, 'destroy']);
        });

        // Admin Master Data Routes
        Route::prefix('admin/master')->group(function () {
            // Branches
            Route::post('branches', [BranchController::class, 'store']);
            Route::put('branches/{branch}', [BranchController::class, 'update']);
            Route::delete('branches/{branch}', [BranchController::class, 'destroy']);
            Route::post('branches/{branch}/assign', [BranchController::class, 'assignOperator']);

            // Room Categories
            Route::post('categories', [CategoryController::class, 'store']);
            Route::put('categories/{category}', [CategoryController::class, 'update']);
            Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

            // Facilities
            Route::post('facilities', [FacilityController::class, 'store']);
            Route::put('facilities/{facility}', [FacilityController::class, 'update']);
            Route::delete('facilities/{facility}', [FacilityController::class, 'destroy']);

            // Room Types
            Route::post('room-types', [RoomTypeController::class, 'store']);
            Route::post('room-types/{roomType}', [RoomTypeController::class, 'update']); // Using POST for form data with files (simulating PUT)
            Route::post('room-types/{roomType}/images', [RoomTypeController::class, 'uploadImages']);
            Route::delete('room-types/{roomType}', [RoomTypeController::class, 'destroy']);
            Route::delete('room-images/{image}', [RoomTypeController::class, 'destroyImage']);

            // Room Unit Routes
            Route::post('room-units/{roomType}', [RoomUnitController::class, 'store']);
            Route::put('room-units/{roomUnit}', [RoomUnitController::class, 'update']);
            Route::delete('room-units/{roomUnit}', [RoomUnitController::class, 'destroy']);

            // Reviews
            Route::post('reviews', [ReviewController::class, 'store']);
            Route::put('reviews/{review}', [ReviewController::class, 'update']);
            Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);

            // RBAC (Users & Roles)
            Route::post('roles', [RBACController::class, 'storeRole']);
            Route::put('roles/{role}', [RBACController::class, 'updateRole']);
            Route::delete('roles/{role}', [RBACController::class, 'destroyRole']);

            Route::post('users', [RBACController::class, 'storeUser']);
            Route::put('users/{user}', [RBACController::class, 'updateUser']);
            Route::delete('users/{user}', [RBACController::class, 'destroyUser']);
            Route::put('users/{user}/reset-password', [RBACController::class, 'resetPassword']);
        });

        // Admin Transactions Routes
        Route::prefix('admin/transactions')->group(function () {
            // Bookings
            Route::get('bookings', [BookingController::class, 'index']);
            Route::post('bookings/manual', [BookingController::class, 'manualBooking']);
            Route::post('bookings/{booking}/manual-pay', [BookingController::class, 'manualPay']);
            Route::post('bookings/{booking}/assign', [BookingController::class, 'assignUnit']);
            Route::put('bookings/{booking}/status', [BookingController::class, 'updateStatus']);
            Route::post('bookings/{booking}/extend', [BookingController::class, 'extendBooking']);
            Route::post('bookings/{booking}/terminate', [BookingController::class, 'terminateBooking']);
            Route::post('bookings/{booking}/refund-deposit', [BookingController::class, 'refundDeposit']);
            Route::put('bookings/invoice/{paymentHeader}/due-date', [BookingController::class, 'updateInvoiceDueDate']);

            // Contracts
            Route::get('contracts', [TenantContractController::class, 'index']);
            Route::post('contracts/{contract}/terminate', [TenantContractController::class, 'terminate']);
        });

        // Admin Maintenance Routes
        Route::prefix('admin/maintenance')->group(function () {
            Route::get('/', [RoomMaintenanceController::class, 'index']);
            Route::post('{unit}/status', [RoomMaintenanceController::class, 'updateStatus']);
            Route::post('{unit}/complete', [RoomMaintenanceController::class, 'complete']);
        });
        // Tickets Routes
        Route::prefix('tickets')->group(function () {
            Route::get('/', [\App\Http\Controllers\TicketController::class, 'index']);
            Route::post('/', [\App\Http\Controllers\TicketController::class, 'store']);
            Route::get('/{ticket}', [\App\Http\Controllers\TicketController::class, 'show']);
            Route::post('/{ticket}/reply', [\App\Http\Controllers\TicketController::class, 'reply']);
            Route::put('/{ticket}/status', [\App\Http\Controllers\TicketController::class, 'updateStatus']);
        });

        // Tenant Review Route
        Route::post('/reviews', function (Request $request) {
            $request->validate([
                'branch_id' => 'required|exists:branches,id',
                'rating' => 'required|integer|min:1|max:5',
                'review_text' => 'required|string',
            ]);
            \App\Models\Review::create([
                'branch_id' => $request->branch_id,
                'reviewer_name' => auth()->user()->name,
                'rating' => $request->rating,
                'review_text' => $request->review_text,
                'is_published' => true,
            ]);
            return back()->with('flash', ['type' => 'success', 'message' => 'Ulasan Anda berhasil dikirim!']);
        })->name('reviews.store.tenant');
    });
});

require __DIR__.'/settings.php';
