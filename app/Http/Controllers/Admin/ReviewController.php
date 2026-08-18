<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'reviewer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string',
            'is_published' => 'boolean',
        ]);

        Review::create($validated);

        return back()->with('success', 'Ulasan cabang berhasil ditambahkan.');
    }

    public function update(Request $request, Review $review)
    {
        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'reviewer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string',
            'is_published' => 'boolean',
        ]);

        $review->update($validated);

        return back()->with('success', 'Ulasan cabang berhasil diperbarui.');
    }

    public function destroy(Review $review)
    {
        $review->delete();

        return back()->with('success', 'Ulasan cabang berhasil dihapus.');
    }
}
