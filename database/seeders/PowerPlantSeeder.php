<?php

namespace Database\Seeders;

use App\Models\PowerPlant;
use Illuminate\Database\Seeder;

class PowerPlantSeeder extends Seeder
{
    public function run(): void
    {
        $plants = [
            'PLTU MORAMO ( Subsistem Kendari )',
            'PLTD Wua Wua',
            'PLTD Poasia',
            'PLTD Poasia Containerized',
            'PLTD Kolaka',
            'PLTD Lanipa Nipa',
            'PLTD Ladumpi',
            'PLTM Sabilambo',
            'PLTM Mikuasi',
            'PLTD Bau Bau',
            'PLTD Pasarwajo',
            'PLTM Winning',
            'PLTD Raha',
            'PLTD WANGI-WANGI ( SIstem Isolated Wangi-Wangi )',
            'PLTD LANGARA ( Isolated Sistem Langara )',
            'PLTD EREKE ( Sistem Isolated Ereke )',
            'PLTMG KENDARI ( Subsistem Kendari )',
            'PLTU BARUTA ( Sistem Bau-Bau )',
            'PLTMG BAU-BAU ( Sistem Bau-Bau )',
            'UP KENDARI',
            'PLTM RONGI',
        ];

        foreach ($plants as $plant) {
            PowerPlant::create(['name' => $plant]);
        }
    }
}
