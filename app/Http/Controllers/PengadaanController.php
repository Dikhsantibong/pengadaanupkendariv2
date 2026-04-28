<?php

namespace App\Http\Controllers;

use App\Models\Pengadaan;
use App\Models\PengadaanChecklist;
use App\Models\User;
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

        $user = $request->user();
        if ($user->isAsmen()) {
            $query->whereHas('direksiUsers', fn($q) => $q->where('users.id', $user->id));
        }

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
            'direksi_ids' => 'nullable|array',
            'direksi_ids.*' => 'exists:users,id',
        ]);

        $pengadaan = Pengadaan::createWithChecklists(
            $request->nama,
            $request->user()->id
        );

        if ($request->filled('direksi_ids')) {
            $pengadaan->direksiUsers()->sync($request->direksi_ids);
        }

        return redirect()->route('pengadaan.show', $pengadaan->id)
            ->with('success', 'Pengadaan berhasil dibuat.');
    }

    public function show(Pengadaan $pengadaan)
    {
        $pengadaan->load(['creator', 'checklists.checkedByUser', 'direksiUsers']);

        $asmenUsers = User::where('role', 'like', 'asmen_%')->get(['id', 'name', 'role']);

        return Inertia::render('pengadaan/show', [
            'pengadaan' => $pengadaan,
            'asmenUsers' => $asmenUsers,
        ]);
    }

    public function update(Request $request, Pengadaan $pengadaan)
    {
        $validated = $request->validate([
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'amandemen_keterangan' => 'nullable|string',
            'amandemen_tanggal' => 'nullable|date',
            'jaminan_bank_nama' => 'nullable|string|max:255',
            'jaminan_bank_nomor' => 'nullable|string|max:255',
            'jaminan_bank_nilai' => 'nullable|numeric|min:0',
            'jaminan_bank_berlaku_sampai' => 'nullable|date',
            'pemeliharaan_durasi_hari' => 'nullable|integer|min:1',
            'pemeliharaan_keterangan' => 'nullable|string',
        ]);

        // Auto-calculate pemeliharaan dates if durasi provided
        if (isset($validated['pemeliharaan_durasi_hari']) && $pengadaan->tanggal_selesai) {
            $durasi = (int) $validated['pemeliharaan_durasi_hari'];
            $validated['pemeliharaan_mulai'] = $pengadaan->tanggal_selesai;
            $validated['pemeliharaan_selesai'] = $pengadaan->tanggal_selesai->copy()->addDays($durasi);
        }

        $pengadaan->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function assignDireksi(Request $request, Pengadaan $pengadaan)
    {
        $request->validate([
            'direksi_ids' => 'required|array',
            'direksi_ids.*' => 'exists:users,id',
        ]);

        $pengadaan->direksiUsers()->sync($request->direksi_ids);

        return back()->with('success', 'Direksi pekerjaan berhasil ditunjuk.');
    }

    public function toggleChecklist(Request $request, Pengadaan $pengadaan, PengadaanChecklist $checklist)
    {
        $user = $request->user();

        if ($user->isAsmen()) {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengubah checklist.');
        }

        if ($user->isManager()) {
            // Manager can toggle anything
        } elseif ($user->role === 'perencana') {
            if ($checklist->fase !== 'perencanaan') {
                return back()->with('error', 'Perencana hanya dapat mengubah checklist perencanaan.');
            }
        } elseif ($user->role === 'pelaksana') {
            if ($checklist->fase !== 'pelaksanaan') {
                return back()->with('error', 'Pelaksana hanya dapat mengubah checklist pelaksanaan.');
            }
            if ($pengadaan->status !== 'pelaksanaan') {
                return back()->with('error', 'Checklist pelaksanaan hanya bisa diubah saat status Pelaksanaan.');
            }
        }

        $checklist->is_checked = !$checklist->is_checked;
        $checklist->checked_at = $checklist->is_checked ? now() : null;
        $checklist->checked_by = $checklist->is_checked ? $user->id : null;
        $checklist->save();

        $pengadaan->recalculateProgress();

        return back();
    }

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
            'siap' => Pengadaan::where('status', 'pelaksanaan')->count()
                + Pengadaan::where('status', 'selesai')->count(),
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

    public function dashboardAsmen(Request $request)
    {
        $user = $request->user();

        $query = Pengadaan::whereHas('direksiUsers', fn($q) => $q->where('users.id', $user->id));

        $stats = [
            'total' => (clone $query)->count(),
            'perencanaan' => (clone $query)->where('status', 'perencanaan')->count(),
            'pelaksanaan' => (clone $query)->where('status', 'pelaksanaan')->count(),
            'selesai' => (clone $query)->where('status', 'selesai')->count(),
        ];

        $pengadaans = (clone $query)->with('creator')
            ->withCount([
                'checklists',
                'checklists as checked_count' => fn($q) => $q->where('is_checked', true),
            ])
            ->latest()
            ->get();

        return Inertia::render('asmen/dashboard', [
            'stats' => $stats,
            'pengadaans' => $pengadaans,
            'bidang' => $user->getAsmenLabel(),
        ]);
    }

    public function dashboardManager()
    {
        $stats = [
            'total' => Pengadaan::count(),
            'perencanaan' => Pengadaan::where('status', 'perencanaan')->count(),
            'pelaksanaan' => Pengadaan::where('status', 'pelaksanaan')->count(),
            'selesai' => Pengadaan::where('status', 'selesai')->count(),
        ];

        $pengadaans = Pengadaan::with(['creator', 'direksiUsers'])
            ->withCount([
                'checklists',
                'checklists as checked_count' => fn($q) => $q->where('is_checked', true),
            ])
            ->latest()
            ->get();

        $asmenSummary = User::where('role', 'like', 'asmen_%')
            ->withCount('pengadaanDireksi')
            ->get()
            ->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'role' => $u->role,
                'label' => $u->getAsmenLabel(),
                'assigned_count' => $u->pengadaan_direksi_count,
            ]);

        return Inertia::render('manager/dashboard', [
            'stats' => $stats,
            'pengadaans' => $pengadaans,
            'asmenSummary' => $asmenSummary,
        ]);
    }

    public function getNotifications(Request $request)
    {
        $notifications = $request->user()
            ->notifications()
            ->latest()
            ->take(20)
            ->get()
            ->map(fn($n) => [
                'id' => $n->id,
                'data' => $n->data,
                'read_at' => $n->read_at,
                'created_at' => $n->created_at->diffForHumans(),
            ]);

        return response()->json($notifications);
    }

    public function markNotificationRead(Request $request, string $id)
    {
        $request->user()->notifications()->where('id', $id)->update(['read_at' => now()]);
        return response()->json(['success' => true]);
    }

    public function markAllNotificationsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['success' => true]);
    }
}
