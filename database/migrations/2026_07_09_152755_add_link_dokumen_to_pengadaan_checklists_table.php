<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('pengadaan_checklists', function (Blueprint $table) {
            $table->text('link_dokumen')->nullable()->after('checked_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengadaan_checklists', function (Blueprint $table) {
            $table->dropColumn('link_dokumen');
        });
    }
};
