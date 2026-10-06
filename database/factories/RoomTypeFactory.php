<?php

namespace Database\Factories;

use App\Models\Branch;
use App\Models\RoomCategory;
use App\Models\RoomType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RoomType>
 */
class RoomTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'branch_id' => Branch::factory(),
            'room_category_id' => fn (): int => RoomCategory::query()->create([
                'name' => fake()->word(),
            ])->id,
            'type_code' => fake()->unique()->bothify('RT-###'),
            'type_name' => fake()->words(2, true),
            'slug' => fake()->unique()->slug(),
            'monthly_price' => 1500000,
            'deposit_price' => 500000,
            'is_active' => true,
        ];
    }
}
