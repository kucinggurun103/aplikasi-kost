<?php

namespace Database\Factories;

use App\Models\PaymentHeader;
use App\Models\BookingHeader;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentHeader>
 */
class PaymentHeaderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'payment_no' => fake()->unique()->bothify('PAY-########'),
            'booking_header_id' => BookingHeader::factory(),
            'invoice_date' => now()->toDateString(),
            'due_date' => now()->addDay()->toDateString(),
            'status' => 'Unpaid',
        ];
    }
}
