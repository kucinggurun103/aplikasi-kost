<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketReply;
use App\Models\TenantContract;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Ticket::with(['branch', 'user']);

        if ($user->hasRole('tenant') || $user->role === 'tenant') {
            $query->where('user_id', $user->id);
        } elseif (!$user->hasRole('admin') && $user->role !== 'admin') {
            $branchIds = \App\Models\Branch::whereHas('users', function ($q) use ($user) {
                $q->where('users.id', $user->id);
            })->pluck('id');
            $query->whereIn('branch_id', $branchIds);
        }

        $tickets = $query->orderBy('created_at', 'desc')->get();
        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category' => 'required|string',
            'subject' => 'required|string',
            'description' => 'required|string',
            'priority' => 'required|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        $user = $request->user();
        
        // Cari branch_id dari kontrak aktif tenant
        $activeContract = TenantContract::where('user_id', $user->id)
            ->where('status', 'Active')
            ->with('bookingHeader.roomType')
            ->first();

        $branchId = $activeContract ? $activeContract->bookingHeader->roomType->branch_id : null;

        if (!$branchId) {
            return response()->json(['message' => 'Anda belum memiliki sewa aktif.'], 403);
        }

        $attachmentPath = null;
        if ($request->hasFile('photo')) {
            $attachmentPath = $request->file('photo')->store('tickets', 'public');
        }

        $ticket = Ticket::create([
            'ticket_no' => 'TKT-' . strtoupper(Str::random(8)),
            'user_id' => $user->id,
            'branch_id' => $branchId,
            'category' => $request->category,
            'subject' => $request->subject,
            'description' => $request->description,
            'priority' => $request->priority,
            'status' => 'Open',
            'attachment' => $attachmentPath,
        ]);

        return response()->json($ticket);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['user', 'branch', 'replies.user']);
        return response()->json($ticket);
    }

    public function reply(Request $request, Ticket $ticket)
    {
        $request->validate([
            'message' => 'required|string',
            'photo' => 'nullable|image|max:5120',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('photo')) {
            $attachmentPath = $request->file('photo')->store('tickets', 'public');
        }

        $reply = TicketReply::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
            'message' => $request->message,
            'attachment' => $attachmentPath,
        ]);

        return response()->json($reply->load('user'));
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        $request->validate([
            'status' => 'required|string|in:Open,In Progress,Resolved,Closed',
        ]);

        $ticket->update(['status' => $request->status]);

        return response()->json($ticket);
    }
}
