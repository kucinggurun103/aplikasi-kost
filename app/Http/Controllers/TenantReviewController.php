<?php

namespace App\Http\Controllers;

use App\Models\BookingHeader;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class TenantReviewController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'review_text' => ['required', 'string'],
        ]);

        abort_unless(
            BookingHeader::where('tenant_id', $request->user()->id)
                ->where('branch_id', $validated['branch_id'])
                ->whereIn('status', ['Checked In', 'Completed'])
                ->exists(),
            403,
        );

        $payload = [
            ...$validated,
            'reviewer_name' => $request->user()->name,
            'is_published' => true,
        ];

        if (Schema::hasColumn('reviews', 'user_id')) {
            $payload['user_id'] = $request->user()->id;
        }

        Review::create($payload);

        return back()->with('success', 'Ulasan Anda berhasil dikirim.');
    }

    public function update(Request $request, Review $review): RedirectResponse
    {
        $isOwner = $review->user_id !== null
            ? (int) $review->user_id === (int) $request->user()->id
            : $review->reviewer_name === $request->user()->name;

        abort_unless($isOwner, 403);

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'review_text' => ['required', 'string'],
        ]);

        $review->update($validated);

        return back()->with('success', 'Ulasan Anda berhasil diperbarui.');
    }

    public function destroy(Request $request, Review $review): RedirectResponse
    {
        $isOwner = $review->user_id !== null
            ? (int) $review->user_id === (int) $request->user()->id
            : $review->reviewer_name === $request->user()->name;

        abort_unless($isOwner, 403);

        $review->delete();

        return back()->with('success', 'Ulasan Anda berhasil dihapus.');
    }
}
