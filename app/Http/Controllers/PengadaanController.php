<?php

namespace App\Http\Controllers;

use App\Models\Pengadaan;
use App\Models\PengadaanChecklist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PengadaanController extends Controller
{
    public function index(Request $request)
    {
        $query = Pengadaan::with('creator')->withCount([
            'checklists',
            'checklists as checked_count' => fn($q) => $q->where('is_checked', true),
        ]);

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $pengadaans = $query->latest()->get();

        return Inertia::render('pengadaan/index', [
            'pengadaans' => $pengadaans,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $pengadaan = Pengadaan::createWithChecklists(
            $request->nama,
            $request->user()->id
        );

        return redirect()->route('pengadaan.show', $pengadaan->id)
            ->with('success', 'Pengadaan berhasil dibuat.');
    }

    public function show(Pengadaan $pengadaan)
    {
        $pengadaan->load(['creator', 'checklists.checkedByUser']);

        return Inertia::render('pengadaan/show', [
            'pengadaan' => $pengadaan,
        ]);
    }

    public function toggleChecklist(Request $request, Pengadaan $pengadaan, PengadaanChecklist $checklist)
    {
        $user = $request->user();

        // Asmen cannot toggle
        if ($user->role === 'asmen') {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengubah checklist.');
        }

        // Perencana can only toggle perencanaan items
        if ($user->role === 'perencana' && $checklist->fase !== 'perencanaan') {
            return back()->with('error', 'Perencana hanya dapat mengubah checklist perencanaan.');
        }

        // Pelaksana can only toggle pelaksanaan items
        if ($user->role === 'pelaksana' && $checklist->fase !== 'pelaksanaan') {
            return back()->with('error', 'Pelaksana hanya dapat mengubah checklist pelaksanaan.');
        }

        // Pelaksana can only toggle when status is pelaksanaan
        if ($user->role === 'pelaksana' && $pengadaan->status !== 'pelaksanaan') {
            return back()->with('error', 'Checklist pelaksanaan hanya bisa diubah saat status Pelaksanaan.');
        }

        // Toggle
        $checklist->is_checked = !$checklist->is_checked;
        $checklist->checked_at = $checklist->is_checked ? now() : null;
        $checklist->checked_by = $checklist->is_checked ? $user->id : null;
        $checklist->save();

        // Recalculate progress and auto-transition status
        $pengadaan->recalculateProgress();

        return back();
    }

    /**
     * Dashboard data for Perencana
     */
    public function dashboardPerencana()
    {
        $stats = [
            'total' => Pengadaan::where('status', 'perencanaan')->count(),
            'draft' => Pengadaan::where('status', 'perencanaan')
                ->whereDoesntHave('checklists', fn($q) => $q->where('is_checked', true)->where('fase', 'perencanaan'))
                ->count(),
            'proses' => Pengadaan::where('status', 'perencanaan')
                ->whereHas('checklists', fn($q) => $q->where('is_checked', true)->where('fase', 'perencanaan'))
                ->count(),
            'siap' => Pengadaan::where('status', 'pelaksanaan')->count() + Pengadaan::where('status', 'selesai')->count(),
        ];

        $pengadaanAktif = Pengadaan::where('status', 'perencanaan')
            ->with(['checklistsPerencanaan'])
            ->withCount([
                'checklistsPerencanaan',
                'checklistsPerencanaan as perencanaan_checked' => fn($q) => $q->where('is_checked', true),
            ])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('perencana/dashboard', [
            'stats' => $stats,
            'pengadaanAktif' => $pengadaanAktif,
        ]);
    }

    /**
     * Dashboard data for Pelaksana
     */
    public function dashboardPelaksana()
    {
        $stats = [
            'total' => Pengadaan::where('status', 'pelaksanaan')->count(),
            'proses' => Pengadaan::where('status', 'pelaksanaan')
                ->whereHas('checklists', fn($q) => $q->where('is_checked', true)->where('fase', 'pelaksanaan'))
                ->count(),
            'baru' => Pengadaan::where('status', 'pelaksanaan')
                ->whereDoesntHave('checklists', fn($q) => $q->where('is_checked', true)->where('fase', 'pelaksanaan'))
                ->count(),
            'selesai' => Pengadaan::where('status', 'selesai')->count(),
        ];

        $pengadaanAktif = Pengadaan::where('status', 'pelaksanaan')
            ->with(['checklistsPelaksanaan'])
            ->withCount([
                'checklistsPelaksanaan',
                'checklistsPelaksanaan as pelaksanaan_checked' => fn($q) => $q->where('is_checked', true),
            ])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('pelaksana/dashboard', [
            'stats' => $stats,
            'pengadaanAktif' => $pengadaanAktif,
        ]);
    }

    /**
     * Dashboard data for Asmen
     */
    public function dashboardAsmen()
    {
        $stats = [
            'total' => Pengadaan::count(),
            'perencanaan' => Pengadaan::where('status', 'perencanaan')->count(),
            'pelaksanaan' => Pengadaan::where('status', 'pelaksanaan')->count(),
            'selesai' => Pengadaan::where('status', 'selesai')->count(),
        ];

        $pengadaans = Pengadaan::with('creator')
            ->withCount([
                'checklists',
                'checklists as checked_count' => fn($q) => $q->where('is_checked', true),
            ])
            ->latest()
            ->get();

        return Inertia::render('asmen/dashboard', [
            'stats' => $stats,
            'pengadaans' => $pengadaans,
        ]);
    }
}
