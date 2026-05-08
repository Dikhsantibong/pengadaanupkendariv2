<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengadaans', function (Blueprint $table) {
            // Perencanaan fields
            $table->decimal('hpe_nilai', 15, 2)->nullable()->after('nama');
            $table->foreignId('tujuan_unit_id')->nullable()->after('hpe_nilai')->constrained('power_plants')->nullOnDelete();
            $table->enum('sumber_anggaran', ['AO', 'AI'])->nullable()->after('tujuan_unit_id');
            $table->string('nomor_prk')->nullable()->after('sumber_anggaran');
            $table->string('nomor_nota_dinas_manager')->nullable()->after('nomor_prk');
            $table->enum('metode_pengadaan', ['surat_pesanan', 'spk', 'tender'])->nullable()->after('nomor_nota_dinas_manager');

            // Pelaksanaan / Kontrak fields
            $table->decimal('hps_nilai', 15, 2)->nullable()->after('metode_pengadaan');
            $table->string('nomor_kontrak')->nullable()->after('hps_nilai');
            $table->string('vendor_pelaksana')->nullable()->after('nomor_kontrak');
            $table->enum('jenis_kontrak', ['lump_sum', 'khs'])->nullable()->after('vendor_pelaksana');
            $table->string('tahap_bayar')->nullable()->after('jenis_kontrak');
            $table->decimal('nilai_terkontrak', 15, 2)->nullable()->after('tahap_bayar');

            // Amandemen start date
            $table->date('amandemen_tanggal_mulai')->nullable()->after('amandemen_tanggal');

            // Jaminan bank start date
            $table->date('jaminan_bank_berlaku_mulai')->nullable()->after('jaminan_bank_berlaku_sampai');
        });
    }

    public function down(): void
    {
        Schema::table('pengadaans', function (Blueprint $table) {
            $table->dropForeign(['tujuan_unit_id']);
            $table->dropColumn([
                'hpe_nilai',
                'tujuan_unit_id',
                'sumber_anggaran',
                'nomor_prk',
                'nomor_nota_dinas_manager',
                'metode_pengadaan',
                'hps_nilai',
                'nomor_kontrak',
                'vendor_pelaksana',
                'jenis_kontrak',
                'tahap_bayar',
                'nilai_terkontrak',
                'amandemen_tanggal_mulai',
                'jaminan_bank_berlaku_mulai',
            ]);
        });
    }
};
