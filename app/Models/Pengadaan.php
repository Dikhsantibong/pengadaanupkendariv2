<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pengadaan extends Model
{
    protected $fillable = ['nama', 'status', 'progress', 'created_by'];

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

    /**
     * Recalculate progress and auto-update status
     */
    public function recalculateProgress(): void
    {
        $totalChecklists = $this->checklists()->count();
        $checkedCount = $this->checklists()->where('is_checked', true)->count();

        $this->progress = $totalChecklists > 0 ? round(($checkedCount / $totalChecklists) * 100) : 0;

        // Auto status transition
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

        $pelaksanaanItems = [
            'Evaluasi Dokumen',
            'Penyusunan HPS',
            'Progress Pengadaan',
            'Berita Acara',
            'Penyusunan Kontrak',
            'Purchase Order',
            'Kontrak',
            'Durasi Pekerjaan',
            'Amandemen',
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
