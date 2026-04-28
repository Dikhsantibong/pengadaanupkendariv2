<?php

namespace App\Notifications;

use App\Models\Pengadaan;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DeadlineApproachingNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Pengadaan $pengadaan,
        public string $type = 'pekerjaan' // 'pekerjaan' or 'pemeliharaan'
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $deadline = $this->type === 'pemeliharaan'
            ? $this->pengadaan->pemeliharaan_selesai
            : $this->pengadaan->tanggal_selesai;

        $daysLeft = now()->diffInDays($deadline);

        return [
            'pengadaan_id' => $this->pengadaan->id,
            'pengadaan_nama' => $this->pengadaan->nama,
            'type' => $this->type,
            'deadline' => $deadline->toDateString(),
            'days_left' => $daysLeft,
            'message' => $this->type === 'pemeliharaan'
                ? "Masa pemeliharaan \"{$this->pengadaan->nama}\" akan berakhir dalam {$daysLeft} hari."
                : "Rentang waktu pekerjaan \"{$this->pengadaan->nama}\" akan berakhir dalam {$daysLeft} hari.",
        ];
    }
}
