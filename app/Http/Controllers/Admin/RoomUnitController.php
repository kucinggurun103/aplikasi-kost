<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RoomType;
use App\Models\RoomUnit;
use Illuminate\Http\Request;

class RoomUnitController extends Controller
{
    public function store(Request $request, RoomType $roomType)
    {
        $amount = (int) $request->input('amount', 1);
        if ($amount < 1) {
            $amount = 1;
        }

        $startNumber = (int) $request->input('start_number', 1);
        $unitPrefix = $request->input('unit_prefix', '');
        $unitFormat = $request->input('unit_format', 'numeric');
        $floor = $request->input('floor');
        $floorText = $floor ? 'Lantai '.$floor : 'Lantai 1';

        $unitsToCreate = [];
        $existingUnits = [];

        for ($i = 0; $i < $amount; $i++) {
            $currentIndex = $startNumber + $i;
            $count = $roomType->units()->withTrashed()->count() + $i; // for internal unique code
            $unitCode = $roomType->type_code.'-U'.str_pad($count + 1, 2, '0', STR_PAD_LEFT);
            
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

            // Check if unit number already exists
            $exists = RoomUnit::where('room_type_id', $roomType->id)
                ->where('unit_number', $unitName)
                ->exists();

            if ($exists) {
                $existingUnits[] = $unitName;
            } else {
                $unitsToCreate[] = [
                    'room_type_id' => $roomType->id,
                    'unit_code' => $unitCode,
                    'unit_number' => $unitName,
                    'floor' => $floorText,
                    'status' => 'Available',
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        if (count($existingUnits) > 0) {
            return redirect()->back()->withErrors([
                'unit_prefix' => 'Unit dengan nomor/nama berikut sudah ada: ' . implode(', ', $existingUnits) . '. Silakan ubah Awalan atau Nomor Mulai.'
            ]);
        }

        RoomUnit::insert($unitsToCreate);

        return redirect()->back()->with('success', $amount.' Unit kamar berhasil ditambahkan');
    }

    public function update(Request $request, RoomUnit $roomUnit)
    {
        $request->validate([
            'status' => 'required|string',
            'unit_number' => 'required|string',
            'floor' => 'nullable|string',
            'building_name' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $roomUnit->update([
            'status' => $request->status,
            'unit_number' => $request->unit_number,
            'floor' => $request->has('floor') ? $request->floor : $roomUnit->floor,
            'building_name' => $request->has('building_name') ? $request->building_name : $roomUnit->building_name,
            'notes' => $request->has('notes') ? $request->notes : $roomUnit->notes,
        ]);

        return redirect()->back()->with('success', 'Unit kamar berhasil diupdate');
    }

    public function destroy(RoomUnit $roomUnit)
    {
        $roomUnit->delete();

        return redirect()->back()->with('success', 'Unit kamar berhasil dihapus');
    }
}
