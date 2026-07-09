<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Pengadaan extends Model
{
    protected $fillable = [
        'nama', 'status', 'progress', 'created_by',
        'hpe_nilai', 'tujuan_unit_id', 'sumber_anggaran', 'nomor_prk', 'nomor_pr', 'nomor_po', 'nomor_nota_dinas_manager', 'metode_pengadaan',
        'hps_nilai', 'nomor_kontrak', 'vendor_pelaksana', 'jenis_kontrak', 'tahap_bayar', 'nilai_terkontrak',
        'tanggal_mulai', 'tanggal_selesai',
        'amandemen_keterangan', 'amandemen_tanggal', 'amandemen_tanggal_mulai',
        'jaminan_bank_nama', 'jaminan_bank_nomor', 'jaminan_bank_nilai', 'jaminan_bank_berlaku_sampai', 'jaminan_bank_berlaku_mulai',
        'pemeliharaan_durasi_hari', 'pemeliharaan_mulai', 'pemeliharaan_selesai', 'pemeliharaan_keterangan',
    ];

    protected $casts = [
        'hpe_nilai' => 'decimal:2',
        'hps_nilai' => 'decimal:2',
        'nilai_terkontrak' => 'decimal:2',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'amandemen_tanggal' => 'date',
        'amandemen_tanggal_mulai' => 'date',
        'jaminan_bank_nilai' => 'decimal:2',
        'jaminan_bank_berlaku_sampai' => 'date',
        'jaminan_bank_berlaku_mulai' => 'date',
        'pemeliharaan_durasi_hari' => 'integer',
        'pemeliharaan_mulai' => 'date',
        'pemeliharaan_selesai' => 'date',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tujuanUnit(): BelongsTo
    {
        return $this->belongsTo(PowerPlant::class, 'tujuan_unit_id');
    }

    public function checklists(): HasMany
    {
        return $this->hasMany(PengadaanChecklist::class)->orderBy('urutan');
    }

    public function checklistsPerencanaan(): HasMany
    {
        return $this->hasMany(PengadaanChecklist::class)->where('fase', 'perencanaan')->orderBy('urutan');
    }

    public function checklistsPelaksanaan(): HasMany
    {
        return $this->hasMany(PengadaanChecklist::class)->where('fase', 'pelaksanaan')->orderBy('urutan');
    }

    public function direksiUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'pengadaan_direksi')->withTimestamps();
    }

    public function isNearDeadline(int $daysBeforeWarning = 7): bool
    {
        if (!$this->tanggal_selesai) {
            return false;
        }
        $now = Carbon::now();
        return $now->lte($this->tanggal_selesai) && $now->diffInDays($this->tanggal_selesai) <= $daysBeforeWarning;
    }

    public function isPemeliharaanNearDeadline(int $daysBeforeWarning = 7): bool
    {
        if (!$this->pemeliharaan_selesai) {
            return false;
        }
        $now = Carbon::now();
        return $now->lte($this->pemeliharaan_selesai) && $now->diffInDays($this->pemeliharaan_selesai) <= $daysBeforeWarning;
    }

    /**
     * Recalculate progress and auto-update status.
     * Only 3 statuses: perencanaan → pelaksanaan → selesai
     */
    public function recalculateProgress(): void
    {
        $totalChecklists = $this->checklists()->where('is_optional', false)->count();
        $checkedCount = $this->checklists()->where('is_optional', false)->where('is_checked', true)->count();

        $this->progress = $totalChecklists > 0 ? round(($checkedCount / $totalChecklists) * 100) : 0;

        $perencanaanTotal = $this->checklistsPerencanaan()->where('is_optional', false)->count();
        $perencanaanChecked = $this->checklistsPerencanaan()->where('is_optional', false)->where('is_checked', true)->count();
        $pelaksanaanTotal = $this->checklistsPelaksanaan()->where('is_optional', false)->count();
        $pelaksanaanChecked = $this->checklistsPelaksanaan()->where('is_optional', false)->where('is_checked', true)->count();

        if ($perencanaanTotal > 0 && $perencanaanChecked === $perencanaanTotal && $this->status === 'perencanaan') {
            $this->status = 'pelaksanaan';
        }

        if ($pelaksanaanTotal > 0 && $pelaksanaanChecked === $pelaksanaanTotal && $this->status === 'pelaksanaan') {
            $this->status = 'selesai';
        }

        $this->save();
    }

    /**
     * Create default checklists when a new pengadaan is created.
     * Masa Pemeliharaan is the LAST item in pelaksanaan fase.
     */
    public static function createWithChecklists(array $data, int $userId): self
    {
        $pengadaan = self::create([
            'nama' => $data['nama'],
            'status' => 'perencanaan',
            'progress' => 0,
            'created_by' => $userId,
            'hpe_nilai' => $data['hpe_nilai'] ?? null,
            'tujuan_unit_id' => $data['tujuan_unit_id'] ?? null,
            'sumber_anggaran' => $data['sumber_anggaran'] ?? null,
            'nomor_prk' => $data['nomor_prk'] ?? null,
            'nomor_nota_dinas_manager' => $data['nomor_nota_dinas_manager'] ?? null,
            'metode_pengadaan' => $data['metode_pengadaan'] ?? null,
        ]);

        $perencanaanItems = [
            'Nota Dinas Usulan',
            'TOR',
            'RAB',
            'Penawaran',
            'CSMS',
            'Nota Dinas Perintah Pekerjaan',
            'HPE',
            'UPB',
            'RKS',
            'Smart SCM',
            'PR / RO',
        ];

        // Pemeliharaan is the last step inside pelaksanaan
        $pelaksanaanItems = [
            'Evaluasi Dokumen',
            'Penyusunan HPS',
            'Progress Pengadaan',
            'Berita Acara',
            'Penyusunan Kontrak',
            'Purchase Order',
            'Jaminan Bank',
            'Kontrak',
            'Rentang Waktu',
            'Amandemen',
            'Masa Pemeliharaan',
        ];

        $urutan = 1;
        foreach ($perencanaanItems as $item) {
            $pengadaan->checklists()->create([
                'nama' => $item,
                'fase' => 'perencanaan',
                'urutan' => $urutan++,
                'is_optional' => $item === 'PR / RO',
            ]);
        }

        foreach ($pelaksanaanItems as $item) {
            $pengadaan->checklists()->create([
                'nama' => $item,
                'fase' => 'pelaksanaan',
                'urutan' => $urutan++,
                'is_optional' => false,
            ]);
        }

        return $pengadaan;
    }
}
