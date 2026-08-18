<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\BookingHeader;
use App\Models\Branch;
use App\Models\DiscountRule;
use App\Models\Facility;
use App\Models\Faq;
use App\Models\NotificationLog;
use App\Models\NotificationTemplate;
use App\Models\PaymentGateway;
use App\Models\PaymentHeader;
use App\Models\Review;
use App\Models\Role;
use App\Models\RoomCategory;
use App\Models\RoomType;
use App\Models\RoomUnit;
use App\Models\SocialMedia;
use App\Models\TenantContract;
use App\Models\Ticket;
use App\Models\User;
use App\Models\UserProfile;
use App\Models\WebSetting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isAdmin = $user->hasRole('admin');
        $isOperator = $user->hasRole('operator');
        $isAdminOrOperator = $isAdmin || $isOperator;

        // Cek profile photo
        $profile = UserProfile::where('user_id', $user->id)->first();
        $profilePhoto = $profile && $profile->profile_photo ? $profile->profile_photo : null;

        // Menarik statistik pengguna (penghuni) — HANYA JIKA BUKAN ADMIN/OPERATOR
        if (! $isAdminOrOperator) {
            $activeBookingsCount = BookingHeader::where('tenant_id', $user->id)
                ->whereIn('status', ['Pending', 'Confirmed'])
                ->count();

            $totalPaid = PaymentHeader::whereHas('booking', function ($query) use ($user) {
                $query->where('tenant_id', $user->id);
            })->where('status', 'Paid')->sum('grand_total');

            // Untuk sewa aktif, cek jika ada booking dengan status Checked In
            $activeLease = BookingHeader::where('tenant_id', $user->id)
                ->where('status', 'Checked In')
                ->first();

            // Untuk ulasan: ambil riwayat cabang/kamar yang pernah/sedang disewa
            $rentalHistory = BookingHeader::with(['roomType.branch', 'roomUnit'])
                ->where('tenant_id', $user->id)
                ->whereIn('status', ['Checked In', 'Completed'])
                ->get()
                ->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'branch_id' => $booking->roomType->branch_id ?? null,
                        'branch_name' => $booking->roomType->branch->name ?? 'Cabang Utama',
                        'unit_number' => $booking->roomUnit->unit_number ?? '-',
                    ];
                });

            // Fitur Dashboard Penghuni Baru
            $activeContract = TenantContract::with(['bookingHeader.roomUnit', 'bookingHeader.roomType.branch', 'bookingHeader.roomType.category', 'bookingHeader.roomType.facilities'])
                ->where('user_id', $user->id)
                ->where('status', 'Active')
                ->first();

            $bookingHistory = BookingHeader::with(['roomType.branch', 'roomUnit', 'paymentHeaders'])
                ->where('tenant_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->take(20)
                ->get();

            $pendingInvoices = PaymentHeader::with(['booking.roomType.branch', 'booking.roomUnit'])
                ->whereHas('booking', function ($q) use ($user) {
                    $q->where('tenant_id', $user->id);
                })
                ->whereIn('status', ['Unpaid', 'Pending'])
                ->orderBy('created_at', 'desc')
                ->take(20)
                ->get();

            $paymentHistory = PaymentHeader::with(['booking.roomType.branch', 'booking.roomUnit'])
                ->whereHas('booking', function ($q) use ($user) {
                    $q->where('tenant_id', $user->id);
                })
                ->whereIn('status', ['Paid', 'Failed'])
                ->orderBy('created_at', 'desc')
                ->take(20)
                ->get();

            $stats = [
                'active_bookings' => $activeBookingsCount,
                'total_paid' => $totalPaid,
                'reward_points' => 0,
                'new_notifications' => 0,
                'active_lease' => $activeLease ? [
                    'period' => Carbon::parse($activeLease->check_in_date)->format('j M Y').' – '.Carbon::parse($activeLease->check_out_date)->format('j M Y'),
                    'status' => 'Aktif',
                    'monthly_price' => $activeLease->monthly_price,
                    'days_left' => max(0, Carbon::now()->diffInDays(Carbon::parse($activeLease->check_out_date), false)),
                ] : null,
                'profile_photo_url' => $profilePhoto ? asset('storage/'.$profilePhoto) : null,
                'profile' => $profile,
                'rental_history' => $rentalHistory,
                'active_contract' => $activeContract,
                'booking_history' => $bookingHistory,
                'pending_invoices' => $pendingInvoices,
                'payment_history' => $paymentHistory,
                'payment_gateways' => PaymentGateway::where('is_active', true)->get(),
            ];
        } else {
            $stats = [
                'active_bookings' => 0,
                'total_paid' => 0,
                'reward_points' => 0,
                'new_notifications' => 0,
                'active_lease' => null,
                'profile_photo_url' => $profilePhoto ? asset('storage/'.$profilePhoto) : null,
                'profile' => $profile,
                'rental_history' => [],
                'active_contract' => null,
                'booking_history' => [],
                'pending_invoices' => [],
                'payment_history' => [],
                'payment_gateways' => [],
            ];
        }

        // Admin & Operator logic
        $adminStats = null;
        if ($isAdminOrOperator) {
            // Query for branches based on role (only active, non-deleted branches)
            $branchesQuery = Branch::where('is_active', true)->with('users');
            if (! $isAdmin) {
                $branchesQuery->whereHas('users', function ($q) use ($user) {
                    $q->where('users.id', $user->id);
                });
            }
            $branches = $branchesQuery->get();
            $branchIds = $branches->pluck('id');

            $totalProperties = $branches->count();

            $roomQuery = RoomUnit::query();
            if (! $isAdmin) {
                $roomQuery->whereHas('roomType', function ($q) use ($branchIds) {
                    $q->whereIn('branch_id', $branchIds);
                });
            }
            $totalRooms = $roomQuery->count();

            // Filled rooms
            $filledRoomsQuery = BookingHeader::where('status', 'Checked In');
            if (! $isAdmin) {
                $filledRoomsQuery->whereHas('roomUnit', function ($q) use ($branchIds) {
                    $q->whereHas('roomType', function ($q2) use ($branchIds) {
                        $q2->whereIn('branch_id', $branchIds);
                    });
                });
            }
            $filledRooms = $filledRoomsQuery->distinct('room_unit_id')->count('room_unit_id');
            $vacantRooms = $totalRooms - $filledRooms;

            $revenueQuery = PaymentHeader::where('status', 'Paid')
                ->whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year);

            if (! $isAdmin) {
                $revenueQuery->whereHas('booking', function ($q) use ($branchIds) {
                    $q->whereIn('branch_id', $branchIds);
                });
            }

            $revenueThisMonth = $revenueQuery->sum('grand_total');

            $pendingPaymentsQuery = PaymentHeader::where('status', 'Pending');
            if (! $isAdmin) {
                $pendingPaymentsQuery->whereHas('booking', function ($q) use ($branchIds) {
                    $q->whereIn('branch_id', $branchIds);
                });
            }
            $pendingPayments = $pendingPaymentsQuery->count();

            $bookingsTodayQuery = BookingHeader::whereDate('created_at', Carbon::today());
            if (! $isAdmin) {
                $bookingsTodayQuery->whereIn('branch_id', $branchIds);
            }
            $bookingsToday = $bookingsTodayQuery->count();

            $newUsers = User::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count();

            $recentTransactionsQuery = PaymentHeader::with(['booking.tenant', 'booking.roomUnit'])
                ->orderBy('created_at', 'desc')
                ->limit(5);

            if (! $isAdmin) {
                $recentTransactionsQuery->whereHas('booking', function ($q) use ($branchIds) {
                    $q->whereIn('branch_id', $branchIds);
                });
            }

            $recentTransactions = $recentTransactionsQuery->get()
                ->map(function ($payment) {
                    return [
                        'id' => 'TRX-'.$payment->id,
                        'tenant_name' => $payment->booking->tenant->name ?? 'Unknown',
                        'room_name' => $payment->booking->roomUnit->unit_number ?? 'Unknown',
                        'amount' => $payment->grand_total,
                        'method' => $payment->payment_method ?? 'Transfer',
                        'date' => $payment->created_at->format('d M Y'),
                        'status' => strtolower($payment->status),
                    ];
                });

            // Master Data
            $roomTypesQuery = RoomType::with(['branch', 'category', 'facilities', 'images', 'units']);
            if (! $isAdmin) {
                $roomTypesQuery->whereIn('branch_id', $branchIds);
            }

            $adminStats = [
                'total_properties' => $totalProperties,
                'total_rooms' => $totalRooms,
                'filled_rooms' => $filledRooms,
                'vacant_rooms' => max(0, $vacantRooms),
                'revenue_this_month' => $revenueThisMonth,
                'pending_payments' => $pendingPayments,
                'bookings_today' => $bookingsToday,
                'new_users' => $newUsers,
                'recent_transactions' => $recentTransactions,
                'web_settings' => WebSetting::first(),
                'discount_rules' => DiscountRule::orderBy('minimum_months')->get(),
                'social_media' => SocialMedia::orderBy('sort_order')->get(),
                'faqs' => Faq::orderBy('sort_order')->get(),

                // Master Data for CRUD
                'branches' => $branches,
                'room_categories' => RoomCategory::when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds)->orWhereNull('branch_id'))->get(),
                'facilities' => Facility::when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds)->orWhereNull('branch_id'))->get(),
                'room_types' => $roomTypesQuery->get(),
                'operators' => User::whereHas('roles', function ($q) {
                    $q->where('code', 'operator');
                })->get(),

                // Transactions & Maintenance
                'bookings' => BookingHeader::with(['tenant', 'branch', 'roomType', 'roomUnit', 'bookingLines', 'paymentHeaders'])
                    ->when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds))
                    ->orderBy('created_at', 'desc')
                    ->take(100)
                    ->get(),
                'contracts' => TenantContract::with(['bookingHeader', 'tenant', 'branch', 'roomType', 'roomUnit'])
                    ->when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds))
                    ->orderBy('created_at', 'desc')
                    ->take(100)
                    ->get(),
                'invoices' => PaymentHeader::with(['booking.tenant', 'booking.branch', 'booking.roomType'])
                    ->when(! $isAdmin, fn ($q) => $q->whereHas('booking', fn ($q2) => $q2->whereIn('branch_id', $branchIds)))
                    ->where('status', 'Pending')
                    ->orderBy('created_at', 'desc')
                    ->take(100)
                    ->get(),
                'transactions' => PaymentHeader::with(['booking.tenant', 'booking.branch', 'booking.roomType'])
                    ->when(! $isAdmin, fn ($q) => $q->whereHas('booking', fn ($q2) => $q2->whereIn('branch_id', $branchIds)))
                    ->orderBy('created_at', 'desc')
                    ->take(100)
                    ->get(),
                'deposits' => BookingHeader::with(['tenant', 'branch', 'roomUnit', 'paymentHeaders'])
                    ->where('deposit', '>', 0)
                    ->whereIn('status', ['Checked In', 'Active', 'Completed', 'Cancelled'])
                    ->when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds))
                    ->orderBy('created_at', 'desc')
                    ->take(100)
                    ->get(),

                'room_units' => RoomUnit::with(['roomType.branch', 'roomType.category'])
                    ->when(! $isAdmin, fn ($q) => $q->whereHas('roomType', fn ($q2) => $q2->whereIn('branch_id', $branchIds)))
                    ->get()
                    ->sortBy(function ($unit) {
                        return $unit->roomType->branch->name ?? '';
                    })
                    ->values(),

                // Payment Configs
                'payment_gateways' => PaymentGateway::with('branch')
                    ->when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds)->orWhereNull('branch_id'))
                    ->get(),

                // Notification & Logs
                'notification_templates' => NotificationTemplate::orderBy('id', 'desc')->get(),
                'notification_logs' => NotificationLog::with(['template', 'user'])->orderBy('sent_at', 'desc')->take(50)->get(),
                'activity_logs' => ActivityLog::with(['user', 'branch'])
                    ->when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds)->orWhereNull('branch_id'))
                    ->orderBy('created_at', 'desc')
                    ->take(50)
                    ->get(),
                'reviews' => Review::with('branch')
                    ->when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds))
                    ->orderBy('created_at', 'desc')
                    ->take(100)
                    ->get(),

                // RBAC Data
                'roles' => Role::all(),
                'users' => User::with('roles')->take(100)->get(),

                // Badges Data
                'open_tickets' => Ticket::where('status', 'Open')
                    ->when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds))
                    ->count(),
                'pending_bookings' => BookingHeader::where('status', 'Pending')
                    ->when(! $isAdmin, fn ($q) => $q->whereIn('branch_id', $branchIds))
                    ->count(),
                'pending_notification_queues' => DB::table('notification_queues')->where('status', 'Pending')->count(),
            ];
        }

        return inertia('dashboard', [
            'stats' => $stats,
            'admin_stats' => $adminStats,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:30',
            'emergency_contact_number' => 'nullable|string|max:30',
            'identity_number' => 'nullable|string|max:50',
            'gender' => 'nullable|string|in:male,female',
            'birth_place' => 'nullable|string|max:100',
            'birth_day' => 'nullable|date',
            'address' => 'nullable|string',
            'profile_photo' => 'nullable|image|max:5120',
            'identity_number_photo' => 'nullable|image|max:5120',
        ]);

        $profile = UserProfile::firstOrNew(['user_id' => $user->id]);

        $profile->fill([
            'full_name' => $validated['full_name'],
            'phone_number' => $validated['phone_number'],
            'emergency_contact_number' => $validated['emergency_contact_number'],
            'identity_number' => $validated['identity_number'],
            'gender' => $validated['gender'],
            'birth_place' => $validated['birth_place'],
            'birth_day' => $validated['birth_day'],
            'address' => $validated['address'],
        ]);

        if ($request->hasFile('profile_photo')) {
            $profile->profile_photo = $this->compressAndStoreImage($request->file('profile_photo'), 'profiles');
        }

        if ($request->hasFile('identity_number_photo')) {
            $profile->identity_number_photo = $this->compressAndStoreImage($request->file('identity_number_photo'), 'identities');
        }

        $profile->save();

        // Also update User name if needed
        $user->name = $validated['full_name'];
        $user->save();

        return redirect()->back()->with('success', 'Profil berhasil diperbarui!');
    }

    private function compressAndStoreImage($imageFile, $directory = 'profiles')
    {
        $extension = strtolower($imageFile->getClientOriginalExtension());
        $filename = Str::random(40).'.webp';
        $path = $directory.'/'.$filename;
        $fullPath = storage_path('app/public/'.$path);

        $sourceImage = null;
        if ($extension == 'jpg' || $extension == 'jpeg') {
            $sourceImage = @imagecreatefromjpeg($imageFile->getRealPath());
        } elseif ($extension == 'png') {
            $sourceImage = @imagecreatefrompng($imageFile->getRealPath());
        } elseif ($extension == 'webp') {
            $sourceImage = @imagecreatefromwebp($imageFile->getRealPath());
        }

        if ($sourceImage) {
            if (! file_exists(dirname($fullPath))) {
                mkdir(dirname($fullPath), 0755, true);
            }

            // Resize if width > 800 for profile
            $width = imagesx($sourceImage);
            $height = imagesy($sourceImage);
            $maxWidth = 800;

            if ($width > $maxWidth) {
                $newWidth = $maxWidth;
                $newHeight = (int) floor($height * ($maxWidth / $width));
                $resized = imagecreatetruecolor($newWidth, $newHeight);

                // Preserve transparency
                if ($extension == 'png' || $extension == 'webp') {
                    imagealphablending($resized, false);
                    imagesavealpha($resized, true);
                    $transparent = imagecolorallocatealpha($resized, 255, 255, 255, 127);
                    imagefilledrectangle($resized, 0, 0, $newWidth, $newHeight, $transparent);
                }

                imagecopyresampled($resized, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagedestroy($sourceImage);
                $sourceImage = $resized;
            }

            imagewebp($sourceImage, $fullPath, 80);
            imagedestroy($sourceImage);

            return $path;
        }

        return $imageFile->store($directory, 'public');
    }
}
