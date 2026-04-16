<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Perencana',
            'email' => 'perencana@example.com',
            'role' => 'perencana',
        ]);

        User::factory()->create([
            'name' => 'Pelaksana',
            'email' => 'pelaksana@example.com',
            'role' => 'pelaksana',
        ]);

        User::factory()->create([
            'name' => 'Asmen',
            'email' => 'asmen@example.com',
            'role' => 'asmen',
        ]);
    }
}
