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
        Schema::table('pengadaans', function (Blueprint $table) {
            $table->text('link_nextcloud_perencanaan')->nullable()->after('amandemen_tanggal_mulai');
            $table->text('link_nextcloud_pelaksanaan')->nullable()->after('link_nextcloud_perencanaan');
        });

        Schema::table('pengadaan_checklists', function (Blueprint $table) {
            if (Schema::hasColumn('pengadaan_checklists', 'link_dokumen')) {
                $table->dropColumn('link_dokumen');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pengadaan_checklists', function (Blueprint $table) {
            $table->text('link_dokumen')->nullable();
        });

        Schema::table('pengadaans', function (Blueprint $table) {
            $table->dropColumn(['link_nextcloud_perencanaan', 'link_nextcloud_pelaksanaan']);
        });
    }
};
