<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengadaans', function (Blueprint $table) {
            // Rentang Waktu (pengganti "Durasi Pekerjaan")
            $table->date('tanggal_mulai')->nullable()->after('progress');
            $table->date('tanggal_selesai')->nullable()->after('tanggal_mulai');

            // Amandemen (opsional)
            $table->text('amandemen_keterangan')->nullable()->after('tanggal_selesai');
            $table->date('amandemen_tanggal')->nullable()->after('amandemen_keterangan');

            // Jaminan Bank (opsional, antara PO dan Kontrak)
            $table->string('jaminan_bank_nama')->nullable()->after('amandemen_tanggal');
            $table->string('jaminan_bank_nomor')->nullable()->after('jaminan_bank_nama');
            $table->decimal('jaminan_bank_nilai', 15, 2)->nullable()->after('jaminan_bank_nomor');
            $table->date('jaminan_bank_berlaku_sampai')->nullable()->after('jaminan_bank_nilai');

            // Pemeliharaan (opsional, setelah durasi pekerjaan selesai)
            $table->integer('pemeliharaan_durasi_hari')->nullable()->after('jaminan_bank_berlaku_sampai');
            $table->date('pemeliharaan_mulai')->nullable()->after('pemeliharaan_durasi_hari');
            $table->date('pemeliharaan_selesai')->nullable()->after('pemeliharaan_mulai');
            $table->text('pemeliharaan_keterangan')->nullable()->after('pemeliharaan_selesai');
        });
    }

    public function down(): void
    {
        Schema::table('pengadaans', function (Blueprint $table) {
            $table->dropColumn([
                'tanggal_mulai',
                'tanggal_selesai',
                'amandemen_keterangan',
                'amandemen_tanggal',
                'jaminan_bank_nama',
                'jaminan_bank_nomor',
                'jaminan_bank_nilai',
                'jaminan_bank_berlaku_sampai',
                'pemeliharaan_durasi_hari',
                'pemeliharaan_mulai',
                'pemeliharaan_selesai',
                'pemeliharaan_keterangan',
            ]);
        });
    }
};
