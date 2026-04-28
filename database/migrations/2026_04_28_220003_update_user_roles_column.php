<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Migrate old 'asmen' role to 'asmen_pemeliharaan' as default fallback
        DB::table('users')->where('role', 'asmen')->update(['role' => 'asmen_pemeliharaan']);
    }

    public function down(): void
    {
        // Revert all asmen sub-roles back to generic 'asmen'
        DB::table('users')->where('role', 'like', 'asmen_%')->update(['role' => 'asmen']);
    }
};
