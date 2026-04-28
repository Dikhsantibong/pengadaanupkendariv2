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

        // Asmen per-bidang
        User::factory()->create([
            'name' => 'Asmen Pemeliharaan',
            'email' => 'asmen.pemeliharaan@example.com',
            'role' => 'asmen_pemeliharaan',
        ]);

        User::factory()->create([
            'name' => 'Asmen Operasi',
            'email' => 'asmen.operasi@example.com',
            'role' => 'asmen_operasi',
        ]);

        User::factory()->create([
            'name' => 'Asmen Engineering',
            'email' => 'asmen.engineering@example.com',
            'role' => 'asmen_engineering',
        ]);

        User::factory()->create([
            'name' => 'Asmen Business Support',
            'email' => 'asmen.bs@example.com',
            'role' => 'asmen_business_support',
        ]);

        User::factory()->create([
            'name' => 'Asmen K3',
            'email' => 'asmen.k3@example.com',
            'role' => 'asmen_k3',
        ]);

        User::factory()->create([
            'name' => 'Asmen Lingkungan',
            'email' => 'asmen.lingkungan@example.com',
            'role' => 'asmen_lingkungan',
        ]);

        // Manager (Super Admin)
        User::factory()->create([
            'name' => 'Manager',
            'email' => 'manager@example.com',
            'role' => 'manager',
        ]);
    }
}
