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
        if ($role === 'asmen') {
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

    // Checklist toggle
    Route::post('pengadaan/{pengadaan}/checklist/{checklist}/toggle', [PengadaanController::class, 'toggleChecklist'])->name('pengadaan.checklist.toggle');

    // Asmen dashboard
    Route::get('asmen/dashboard', [PengadaanController::class, 'dashboardAsmen'])->name('asmen.dashboard');
});

require __DIR__.'/settings.php';
