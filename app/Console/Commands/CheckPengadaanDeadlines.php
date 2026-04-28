<?php

namespace App\Console\Commands;

use App\Models\Pengadaan;
use App\Models\User;
use App\Notifications\DeadlineApproachingNotification;
use Illuminate\Console\Command;

class CheckPengadaanDeadlines extends Command
{
    protected $signature = 'pengadaan:check-deadlines {--days=7 : Days before deadline to send notification}';
    protected $description = 'Check pengadaan deadlines and send notifications';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $count = 0;

        // Check pekerjaan deadlines (status pelaksanaan)
        $pengadaans = Pengadaan::whereIn('status', ['pelaksanaan', 'pemeliharaan'])
            ->whereNotNull('tanggal_selesai')
            ->get();

        foreach ($pengadaans as $pengadaan) {
            if ($pengadaan->isNearDeadline($days)) {
                $this->notifyRelatedUsers($pengadaan, 'pekerjaan');
                $count++;
            }

            if ($pengadaan->isPemeliharaanNearDeadline($days)) {
                $this->notifyRelatedUsers($pengadaan, 'pemeliharaan');
                $count++;
            }
        }

        $this->info("Checked deadlines. Sent notifications for {$count} pengadaan.");

        return Command::SUCCESS;
    }

    private function notifyRelatedUsers(Pengadaan $pengadaan, string $type): void
    {
        // Notify creator
        $creator = $pengadaan->creator;
        if ($creator) {
            $this->sendIfNotDuplicate($creator, $pengadaan, $type);
        }

        // Notify assigned direksi
        foreach ($pengadaan->direksiUsers as $user) {
            $this->sendIfNotDuplicate($user, $pengadaan, $type);
        }

        // Notify managers
        $managers = User::where('role', 'manager')->get();
        foreach ($managers as $manager) {
            $this->sendIfNotDuplicate($manager, $pengadaan, $type);
        }
    }

    private function sendIfNotDuplicate(User $user, Pengadaan $pengadaan, string $type): void
    {
        // Don't send if already sent today
        $exists = $user->notifications()
            ->where('type', DeadlineApproachingNotification::class)
            ->whereDate('created_at', today())
            ->get()
            ->filter(function ($n) use ($pengadaan, $type) {
                $data = $n->data;
                return ($data['pengadaan_id'] ?? null) === $pengadaan->id
                    && ($data['type'] ?? null) === $type;
            })
            ->isNotEmpty();

        if (!$exists) {
            $user->notify(new DeadlineApproachingNotification($pengadaan, $type));
        }
    }
}
