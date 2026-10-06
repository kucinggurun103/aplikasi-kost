<?php

namespace Database\Factories;

use App\Models\BookingHeader;
use App\Models\Branch;
use App\Models\RoomType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BookingHeader>
 */
class BookingHeaderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'booking_no' => fake()->unique()->bothify('BOOK-########'),
            'tenant_id' => User::factory(),
            'branch_id' => Branch::factory(),
            'room_type_id' => RoomType::factory(),
            'check_in_date' => now()->toDateString(),
            'check_out_date' => now()->addMonths(1)->toDateString(),
            'duration_month' => 1,
            'status' => 'Pending',
            'payment_status' => 'Pending',
        ];
    }
}
