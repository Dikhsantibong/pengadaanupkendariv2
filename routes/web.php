<?php

use App\Http\Controllers\PengadaanController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard routing per role
    Route::get('dashboard', function () {
        $role = auth()->user()->role;
        if ($role === 'manager') {
            return redirect()->route('manager.dashboard');
        }
        if (str_starts_with($role, 'asmen_')) {
            return redirect()->route('asmen.dashboard');
        }
        if ($role === 'pelaksana') {
            return app(PengadaanController::class)->dashboardPelaksana();
        }
        return app(PengadaanController::class)->dashboardPerencana();
    })->name('dashboard');

    // Pengadaan CRUD
    Route::get('pengadaan', [PengadaanController::class, 'index'])->name('pengadaan.index');
    Route::post('pengadaan', [PengadaanController::class, 'store'])->name('pengadaan.store');
    Route::get('pengadaan/{pengadaan}', [PengadaanController::class, 'show'])->name('pengadaan.show');
    Route::put('pengadaan/{pengadaan}', [PengadaanController::class, 'update'])->name('pengadaan.update');

    // Checklist toggle
    Route::post('pengadaan/{pengadaan}/checklist/{checklist}/toggle', [PengadaanController::class, 'toggleChecklist'])->name('pengadaan.checklist.toggle');

    // Direksi assignment
    Route::post('pengadaan/{pengadaan}/direksi', [PengadaanController::class, 'assignDireksi'])->name('pengadaan.direksi');

    // Role-specific dashboards
    Route::get('asmen/dashboard', [PengadaanController::class, 'dashboardAsmen'])->name('asmen.dashboard');
    Route::get('manager/dashboard', [PengadaanController::class, 'dashboardManager'])->name('manager.dashboard');

    // Notifications
    Route::get('notifications', [PengadaanController::class, 'getNotifications'])->name('notifications.index');
    Route::post('notifications/{id}/read', [PengadaanController::class, 'markNotificationRead'])->name('notifications.read');
    Route::post('notifications/read-all', [PengadaanController::class, 'markAllNotificationsRead'])->name('notifications.readAll');
});

require __DIR__.'/settings.php';
