<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomImage;
use App\Models\RoomType;
use App\Models\RoomUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RoomTypeController extends Controller
{
    public function store(Request $request)
    {
        // Validate or auto-assign branch for operators
        if (! $request->user()->hasRole('admin')) {
            $allowedBranches = $request->user()->branches()->pluck('branches.id')->toArray();
            if (empty($request->branch_id) || ! in_array($request->branch_id, $allowedBranches)) {
                $operatorBranch = $request->user()->branches()->first();
                if ($operatorBranch) {
                    $request->merge(['branch_id' => $operatorBranch->id]);
                }
            }
        }

        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'room_category_id' => 'required|exists:room_categories,id',
            'type_code' => 'required|string|max:30|unique:room_types,type_code',
            'type_name' => 'required|string|max:255',
            'gender_type' => 'required|string|in:Pria,Wanita,Campur',
            'description' => 'nullable|string',
            'room_size' => 'nullable|numeric|min:0',
            'monthly_price' => 'required|numeric|min:0',
            'booking_price' => 'required|numeric|min:0',
            'deposit_price' => 'required|numeric|min:0',
            'deposit_type' => 'required|in:Upfront,AtEnd,None',
            'electricity_included' => 'boolean',
            'water_included' => 'boolean',
            'is_active' => 'boolean',
            'amount_of_rooms' => 'nullable|integer|min:1|max:100',
            'facilities' => 'nullable|array',
            'facilities.*' => 'exists:facilities,id',
            'images' => 'nullable|array',
            'images.*' => 'image',
        ]);

        $validated['slug'] = Str::slug($validated['type_name'].'-'.Str::random(6));

        $roomType = RoomType::create([
            'branch_id' => $validated['branch_id'],
            'room_category_id' => $validated['room_category_id'],
            'type_code' => $validated['type_code'],
            'type_name' => $validated['type_name'],
            'gender_type' => $validated['gender_type'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'room_size' => $validated['room_size'] ?? null,
            'monthly_price' => $validated['monthly_price'],
            'booking_price' => $validated['booking_price'],
            'deposit_price' => $validated['deposit_type'] === 'None' ? 0 : $validated['deposit_price'],
            'deposit_type' => $validated['deposit_type'],
            'electricity_included' => $request->boolean('electricity_included'),
            'water_included' => $request->boolean('water_included'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Sync facilities
        if (isset($validated['facilities'])) {
            $roomType->facilities()->sync($validated['facilities']);
        }

        // Handle images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $this->compressAndStoreImage($image);
                RoomImage::create([
                    'room_type_id' => $roomType->id,
                    'image' => $path,
                    'sort_order' => $index,
                ]);

                // Set first image as cover image
                if ($index === 0) {
                    $roomType->update(['cover_image' => $path]);
                }
            }
        }

        // Generate room units automatically
        $amountOfRooms = (int) $request->input('amount_of_rooms', 1);
        $startNumber = (int) $request->input('start_number', 1);
        $unitPrefix = $request->input('unit_prefix', '');
        $unitFormat = $request->input('unit_format', 'numeric');
        $floorNumber = $request->input('floor') ?: '1';
        $floor = 'Lantai '.$floorNumber;
        
        if ($amountOfRooms > 0) {
            for ($i = 0; $i < $amountOfRooms; $i++) {
                $currentIndex = $startNumber + $i;
                
                $unitIdentifier = (string) $currentIndex;
                if ($unitFormat === 'alphabet') {
                    $result = '';
                    $num = $currentIndex;
                    while ($num > 0) {
                        $rem = ($num - 1) % 26;
                        $result = chr(65 + $rem) . $result;
                        $num = (int)(($num - $rem) / 26);
                    }
                    $unitIdentifier = $result;
                }

                $prefix = trim($unitPrefix);
                $unitName = $prefix !== '' ? $prefix.' '.$unitIdentifier : $unitIdentifier;

                RoomUnit::create([
                    'room_type_id' => $roomType->id,
                    'unit_code' => $roomType->type_code.'-U'.str_pad($currentIndex, 2, '0', STR_PAD_LEFT),
                    'unit_number' => $unitName,
                    'floor' => $floor,
                    'status' => 'Available',
                    'is_active' => true,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Tipe kamar berhasil ditambahkan');
    }

    public function update(Request $request, RoomType $roomType)
    {
        // Validate or auto-assign branch for operators
        if (! $request->user()->hasRole('admin')) {
            $allowedBranches = $request->user()->branches()->pluck('branches.id')->toArray();
            if (empty($request->branch_id) || ! in_array($request->branch_id, $allowedBranches)) {
                $operatorBranch = $request->user()->branches()->first();
                if ($operatorBranch) {
                    $request->merge(['branch_id' => $operatorBranch->id]);
                }
            }
        }

        $validated = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'room_category_id' => 'required|exists:room_categories,id',
            'type_code' => 'required|string|max:30|unique:room_types,type_code,'.$roomType->id,
            'type_name' => 'required|string|max:255',
            'gender_type' => 'required|string|in:Pria,Wanita,Campur',
            'description' => 'nullable|string',
            'room_size' => 'nullable|numeric|min:0',
            'monthly_price' => 'required|numeric|min:0',
            'booking_price' => 'required|numeric|min:0',
            'deposit_price' => 'required|numeric|min:0',
            'deposit_type' => 'required|in:Upfront,AtEnd,None',
            'electricity_included' => 'boolean',
            'water_included' => 'boolean',
            'is_active' => 'boolean',
            'facilities' => 'nullable|array',
            'facilities.*' => 'exists:facilities,id',
        ]);

        $roomType->update([
            'branch_id' => $validated['branch_id'],
            'room_category_id' => $validated['room_category_id'],
            'type_code' => $validated['type_code'],
            'type_name' => $validated['type_name'],
            'gender_type' => $validated['gender_type'],
            'description' => $validated['description'] ?? null,
            'room_size' => $validated['room_size'] ?? null,
            'monthly_price' => $validated['monthly_price'],
            'booking_price' => $validated['booking_price'],
            'deposit_price' => $validated['deposit_type'] === 'None' ? 0 : $validated['deposit_price'],
            'deposit_type' => $validated['deposit_type'],
            'electricity_included' => $request->boolean('electricity_included'),
            'water_included' => $request->boolean('water_included'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        // Sync facilities
        if (isset($validated['facilities'])) {
            $roomType->facilities()->sync($validated['facilities']);
        } else {
            $roomType->facilities()->sync([]);
        }

        // New Images
        if ($request->hasFile('images')) {
            $request->validate([
                'images' => 'array',
                'images.*' => 'image',
            ]);

            $maxSort = $roomType->images()->max('sort_order') ?? -1;

            foreach ($request->file('images') as $index => $image) {
                $path = $this->compressAndStoreImage($image);
                RoomImage::create([
                    'room_type_id' => $roomType->id,
                    'image' => $path,
                    'sort_order' => $maxSort + 1 + $index,
                ]);

                if (! $roomType->cover_image) {
                    $roomType->update(['cover_image' => $path]);
                }
            }
        }

        return redirect()->back()->with('success', 'Tipe kamar berhasil diperbarui');
    }

    public function uploadImages(Request $request, RoomType $roomType)
    {
        $request->validate([
            'images' => 'required|array|min:1',
            'images.*' => 'required|image|max:10240',
        ]);

        $maxSort = $roomType->images()->max('sort_order') ?? -1;

        foreach ($request->file('images') as $index => $image) {
            $path = $this->compressAndStoreImage($image);
            RoomImage::create([
                'room_type_id' => $roomType->id,
                'image' => $path,
                'sort_order' => $maxSort + 1 + $index,
            ]);

            if (! $roomType->cover_image) {
                $roomType->update(['cover_image' => $path]);
            }
        }

        return redirect()->back()->with('success', 'Gambar berhasil diunggah');
    }

    public function destroyImage(RoomImage $image)
    {
        $roomType = $image->roomType;

        // Remove from storage
        if (Storage::disk('public')->exists($image->image)) {
            Storage::disk('public')->delete($image->image);
        }

        // If it was cover, reset cover
        if ($roomType->cover_image === $image->image) {
            $nextImage = $roomType->images()->where('id', '!=', $image->id)->orderBy('sort_order')->first();
            $roomType->update(['cover_image' => $nextImage ? $nextImage->image : null]);
        }

        $image->delete();

        return redirect()->back()->with('success', 'Gambar berhasil dihapus');
    }

    public function destroy(RoomType $roomType)
    {
        // Images are cascade deleted in DB, but files in storage won't be deleted automatically
        foreach ($roomType->images as $image) {
            if (Storage::disk('public')->exists($image->image)) {
                Storage::disk('public')->delete($image->image);
            }
        }

        $roomType->delete();

        return redirect()->back()->with('success', 'Tipe kamar berhasil dihapus');
    }

    private function compressAndStoreImage($imageFile)
    {
        $extension = strtolower($imageFile->getClientOriginalExtension());
        $filename = Str::random(40).'.'.($extension == 'jpeg' ? 'jpg' : $extension);
        $path = 'room_images/'.$filename;
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

            // Resize if width > 1200
            $width = imagesx($sourceImage);
            $height = imagesy($sourceImage);
            $maxWidth = 1200;

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

            if ($extension == 'png') {
                imagepng($sourceImage, $fullPath, 6);
            } elseif ($extension == 'webp') {
                imagewebp($sourceImage, $fullPath, 80);
            } else {
                imagejpeg($sourceImage, $fullPath, 80);
            }

            imagedestroy($sourceImage);

            return $path;
        }

        // Fallback
        return $imageFile->store('room_images', 'public');
    }
}
