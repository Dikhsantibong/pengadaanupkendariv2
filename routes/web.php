<?php

use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $role = auth()->user()->role;
        if ($role === 'asmen') {
            return redirect()->route('asmen.dashboard');
        }
        if ($role === 'pelaksana') {
            return inertia('pelaksana/dashboard');
        }
        return inertia('perencana/dashboard');
    })->name('dashboard');
    Route::inertia('pengadaan', 'pengadaan/index')->name('pengadaan.index');
    Route::inertia('pengadaan/1', 'pengadaan/show')->name('pengadaan.show');
    Route::inertia('asmen/dashboard', 'asmen/dashboard')->name('asmen.dashboard');
});

require __DIR__.'/settings.php';
