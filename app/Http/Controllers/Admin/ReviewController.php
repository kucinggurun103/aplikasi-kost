<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ReviewController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'reviewer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $this->authorizeBranchManagement($request->user(), (int) $validated['branch_id']);
        Review::create($validated);

        return back()->with('success', 'Ulasan cabang berhasil ditambahkan.');
    }

    public function update(Request $request, Review $review): RedirectResponse
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'reviewer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $this->authorizeBranchManagement($request->user(), $review->branch_id);
        $review->update($validated);

        return back()->with('success', 'Ulasan cabang berhasil diperbarui.');
    }

    public function destroy(Request $request, Review $review): RedirectResponse
    {
        $this->authorizeBranchManagement($request->user(), $review->branch_id);
        $review->delete();

        return back()->with('success', 'Ulasan cabang berhasil dihapus.');
    }

    private function authorizeBranchManagement(User $user, int $branchId): void
    {
        abort_unless(
            $user->hasRole('admin') || ($user->hasRole('operator') && $user->branches()->whereKey($branchId)->exists()),
            403,
        );
    }
}
