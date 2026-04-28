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
        'tanggal_mulai', 'tanggal_selesai',
        'amandemen_keterangan', 'amandemen_tanggal',
        'jaminan_bank_nama', 'jaminan_bank_nomor', 'jaminan_bank_nilai', 'jaminan_bank_berlaku_sampai',
        'pemeliharaan_durasi_hari', 'pemeliharaan_mulai', 'pemeliharaan_selesai', 'pemeliharaan_keterangan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'amandemen_tanggal' => 'date',
        'jaminan_bank_nilai' => 'decimal:2',
        'jaminan_bank_berlaku_sampai' => 'date',
        'pemeliharaan_durasi_hari' => 'integer',
        'pemeliharaan_mulai' => 'date',
        'pemeliharaan_selesai' => 'date',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
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
        $totalChecklists = $this->checklists()->count();
        $checkedCount = $this->checklists()->where('is_checked', true)->count();

        $this->progress = $totalChecklists > 0 ? round(($checkedCount / $totalChecklists) * 100) : 0;

        $perencanaanTotal = $this->checklistsPerencanaan()->count();
        $perencanaanChecked = $this->checklistsPerencanaan()->where('is_checked', true)->count();
        $pelaksanaanTotal = $this->checklistsPelaksanaan()->count();
        $pelaksanaanChecked = $this->checklistsPelaksanaan()->where('is_checked', true)->count();

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
    public static function createWithChecklists(string $nama, int $userId): self
    {
        $pengadaan = self::create([
            'nama' => $nama,
            'status' => 'perencanaan',
            'progress' => 0,
            'created_by' => $userId,
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
            ]);
        }

        foreach ($pelaksanaanItems as $item) {
            $pengadaan->checklists()->create([
                'nama' => $item,
                'fase' => 'pelaksanaan',
                'urutan' => $urutan++,
            ]);
        }

        return $pengadaan;
    }
}
