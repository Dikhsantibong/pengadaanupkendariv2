<?php

namespace App\Http\Controllers;

use App\Models\Pengadaan;
use App\Models\PengadaanChecklist;
use App\Models\PowerPlant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PengadaanController extends Controller
{
    public function index(Request $request)
    {
        $query = Pengadaan::with(['creator', 'tujuanUnit'])->withCount([
            'checklists' => fn($q) => $q->where('is_optional', false),
            'checklists as checked_count' => fn($q) => $q->where('is_checked', true)->where('is_optional', false),
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

        if ($request->filled('metode')) {
            $query->where('metode_pengadaan', $request->metode);
        }

        $pengadaans = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('pengadaan/index', [
            'pengadaans' => $pengadaans,
            'filters' => $request->only(['search', 'status', 'metode']),
            'powerPlants' => PowerPlant::all(['id', 'name']),
        ]);
    }

    public function store(Request $request)
    {
        if ($request->user()->role === 'manager') {
            return back()->with('error', 'Manager tidak memiliki akses untuk menambah data.');
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'hpe_nilai' => 'nullable|numeric|min:0',
            'tujuan_unit_id' => 'nullable|exists:power_plants,id',
            'sumber_anggaran' => 'nullable|in:AO,AI',
            'nomor_prk' => 'nullable|string|max:255',
            'nomor_pr' => 'nullable|string|max:255',
            'nomor_po' => 'nullable|string|max:255',
            'nomor_nota_dinas_manager' => 'nullable|string|max:255',
            'metode_pengadaan' => 'nullable|in:surat_pesanan,spk,tender',
            'user_departemen' => 'nullable|string|max:255',
            'progress_status' => 'nullable|string|max:255',
            'pic' => 'nullable|string|max:255',
            'direksi_ids' => 'nullable|array',
            'direksi_ids.*' => 'exists:users,id',
        ]);

        $pengadaan = Pengadaan::createWithChecklists(
            $validated,
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
        $pengadaan->load(['creator', 'checklists.checkedByUser', 'direksiUsers', 'tujuanUnit']);

        $asmenUsers = User::where('role', 'like', 'asmen_%')->get(['id', 'name', 'role']);
        $powerPlants = PowerPlant::all(['id', 'name']);

        return Inertia::render('pengadaan/show', [
            'pengadaan' => $pengadaan,
            'asmenUsers' => $asmenUsers,
            'powerPlants' => $powerPlants,
            'nextcloudLinkPerencanaan' => env('NEXTCLOUD_LINK_PERENCANAAN', '#'),
            'nextcloudLinkPelaksanaan' => env('NEXTCLOUD_LINK_PELAKSANAAN', '#'),
        ]);
    }

    public function update(Request $request, Pengadaan $pengadaan)
    {
        if ($request->user()->role === 'manager') {
            return back()->with('error', 'Manager tidak memiliki akses untuk mengubah data.');
        }

        $validated = $request->validate([
            'hpe_nilai' => 'nullable|numeric|min:0',
            'tujuan_unit_id' => 'nullable|exists:power_plants,id',
            'sumber_anggaran' => 'nullable|in:AO,AI',
            'nomor_prk' => 'nullable|string|max:255',
            'nomor_pr' => 'nullable|string|max:255',
            'nomor_po' => 'nullable|string|max:255',
            'nomor_nota_dinas_manager' => 'nullable|string|max:255',
            'metode_pengadaan' => 'nullable|in:surat_pesanan,spk,tender',
            'user_departemen' => 'nullable|string|max:255',
            'progress_status' => 'nullable|string|max:255',
            'pic' => 'nullable|string|max:255',
            'hps_nilai' => 'nullable|numeric|min:0',
            'nomor_kontrak' => 'nullable|string|max:255',
            'vendor_pelaksana' => 'nullable|string|max:255',
            'jenis_kontrak' => 'nullable|in:lump_sum,khs',
            'tahap_bayar' => 'nullable|string|max:255',
            'nilai_terkontrak' => 'nullable|numeric|min:0',
            'tanggal_mulai' => 'nullable|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'amandemen_keterangan' => 'nullable|string',
            'amandemen_tanggal' => 'nullable|date',
            'amandemen_tanggal_mulai' => 'nullable|date',
            'jaminan_bank_nama' => 'nullable|string|max:255',
            'jaminan_bank_nomor' => 'nullable|string|max:255',
            'jaminan_bank_nilai' => 'nullable|numeric|min:0',
            'jaminan_bank_berlaku_mulai' => 'nullable|date',
            'jaminan_bank_berlaku_sampai' => 'nullable|date|after_or_equal:jaminan_bank_berlaku_mulai',
            'pemeliharaan_durasi_hari' => 'nullable|integer|min:1',
            'pemeliharaan_keterangan' => 'nullable|string',
        ]);

        // Validate amandemen must be created 14 days before contract ends
        if (!empty($validated['amandemen_tanggal']) && $pengadaan->tanggal_selesai) {
            $amandemenDate = Carbon::parse($validated['amandemen_tanggal']);
            $contractEnd = $pengadaan->tanggal_selesai->copy();
            $minAmandemenDate = $contractEnd->copy()->subDays(14);

            if ($amandemenDate->gt($contractEnd)) {
                return back()->with('error', 'Tanggal amandemen tidak boleh melebihi tanggal selesai kontrak.');
            }
        }

        // Auto-calculate pemeliharaan dates if durasi provided
        if (isset($validated['pemeliharaan_durasi_hari']) && $pengadaan->tanggal_selesai) {
            $durasi = (int) $validated['pemeliharaan_durasi_hari'];
            $validated['pemeliharaan_mulai'] = $pengadaan->tanggal_selesai;
            $validated['pemeliharaan_selesai'] = $pengadaan->tanggal_selesai->copy()->addDays($durasi);
        }

        $pengadaan->update($validated);

        return back()->with('success', 'Data berhasil diperbarui.');
    }

    public function destroy(Request $request, Pengadaan $pengadaan)
    {
        $user = $request->user();

        if (!in_array($user->role, ['perencana', 'pelaksana'])) {
            return back()->with('error', 'Anda tidak memiliki akses untuk menghapus data pengadaan.');
        }

        $pengadaan->delete();

        return redirect()->route('pengadaan.index')
            ->with('success', 'Pengadaan berhasil dihapus.');
    }

    public function assignDireksi(Request $request, Pengadaan $pengadaan)
    {
        if ($request->user()->role === 'manager') {
            return back()->with('error', 'Manager tidak memiliki akses untuk menunjuk direksi.');
        }

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

        if ($user->isAsmen() || $user->isManager()) {
            return back()->with('error', 'Anda tidak memiliki akses untuk mengubah checklist.');
        }

        if ($user->role === 'perencana') {
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

        // Jika sedang uncheck (sudah tercentang → mau di-uncheck)
        if ($checklist->is_checked) {
            $checklist->is_checked = false;
            $checklist->checked_at = null;
            $checklist->checked_by = null;
            $checklist->save();
        } else {
            $checklist->is_checked = true;
            $checklist->checked_at = now();
            $checklist->checked_by = $user->id;
            $checklist->save();
        }

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
            'total_nilai' => Pengadaan::where('status', 'perencanaan')->sum('hpe_nilai'),
            'near_deadline' => Pengadaan::where('status', 'perencanaan')
                ->whereNotNull('tanggal_selesai')
                ->where('tanggal_selesai', '<=', now()->addDays(7))
                ->count(),
        ];

        $pengadaanAktif = Pengadaan::where('status', 'perencanaan')
            ->with(['checklistsPerencanaan'])
            ->withCount([
                'checklistsPerencanaan' => fn($q) => $q->where('is_optional', false),
                'checklistsPerencanaan as perencanaan_checked' => fn($q) => $q->where('is_checked', true)->where('is_optional', false),
            ])
            ->latest()
            ->take(5)
            ->get();

        $recentActivities = PengadaanChecklist::with(['pengadaan', 'checkedByUser'])
            ->where('fase', 'perencanaan')
            ->where('is_checked', true)
            ->latest('checked_at')
            ->take(4)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'nama' => $c->nama,
                'pengadaan_nama' => $c->pengadaan->nama,
                'user_name' => $c->checkedByUser?->name ?? 'System',
                'checked_at' => $c->checked_at->diffForHumans(),
            ]);

        $statusDistribution = [
            ['name' => 'Draft', 'value' => $stats['draft'], 'color' => '#64748b'],
            ['name' => 'Proses', 'value' => $stats['proses'], 'color' => '#eab308'],
            ['name' => 'Siap Kirim', 'value' => $stats['siap'], 'color' => '#10b981'],
        ];

        return Inertia::render('perencana/dashboard', [
            'stats' => $stats,
            'pengadaanAktif' => $pengadaanAktif,
            'recentActivities' => $recentActivities,
            'statusDistribution' => $statusDistribution,
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
            'total_nilai' => Pengadaan::where('status', 'pelaksanaan')->sum('hps_nilai'),
            'total_saving' => Pengadaan::where('status', 'pelaksanaan')
                ->whereNotNull('hpe_nilai')
                ->whereNotNull('nilai_terkontrak')
                ->selectRaw('SUM(COALESCE(hpe_nilai, 0) - COALESCE(nilai_terkontrak, 0)) as total')
                ->value('total') ?? 0,
            'near_deadline' => Pengadaan::where('status', 'pelaksanaan')
                ->whereNotNull('tanggal_selesai')
                ->where('tanggal_selesai', '<=', now()->addDays(7))
                ->count(),
        ];

        $pengadaanAktif = Pengadaan::where('status', 'pelaksanaan')
            ->with(['checklistsPelaksanaan'])
            ->withCount([
                'checklistsPelaksanaan' => fn($q) => $q->where('is_optional', false),
                'checklistsPelaksanaan as pelaksanaan_checked' => fn($q) => $q->where('is_checked', true)->where('is_optional', false),
            ])
            ->latest()
            ->take(5)
            ->get();

        $recentActivities = PengadaanChecklist::with(['pengadaan', 'checkedByUser'])
            ->where('fase', 'pelaksanaan')
            ->where('is_checked', true)
            ->latest('checked_at')
            ->take(4)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'nama' => $c->nama,
                'pengadaan_nama' => $c->pengadaan->nama,
                'user_name' => $c->checkedByUser?->name ?? 'System',
                'checked_at' => $c->checked_at->diffForHumans(),
            ]);

        $statusDistribution = [
            ['name' => 'Baru', 'value' => $stats['baru'], 'color' => '#3b82f6'],
            ['name' => 'Proses', 'value' => $stats['proses'], 'color' => '#f97316'],
            ['name' => 'Selesai', 'value' => $stats['selesai'], 'color' => '#10b981'],
        ];

        return Inertia::render('pelaksana/dashboard', [
            'stats' => $stats,
            'pengadaanAktif' => $pengadaanAktif,
            'recentActivities' => $recentActivities,
            'statusDistribution' => $statusDistribution,
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
            'total_nilai' => (clone $query)->sum('hps_nilai'),
            'total_saving' => (clone $query)
                ->whereNotNull('hpe_nilai')
                ->whereNotNull('nilai_terkontrak')
                ->selectRaw('SUM(COALESCE(hpe_nilai, 0) - COALESCE(nilai_terkontrak, 0)) as total')
                ->value('total') ?? 0,
            'near_deadline' => (clone $query)->where('status', '!=', 'selesai')
                ->whereNotNull('tanggal_selesai')
                ->where('tanggal_selesai', '<=', now()->addDays(7))
                ->count(),
        ];

        $pengadaans = (clone $query)->with('creator')
            ->withCount([
                'checklists' => fn($q) => $q->where('is_optional', false),
                'checklists as checked_count' => fn($q) => $q->where('is_checked', true)->where('is_optional', false),
            ])
            ->latest()
            ->get();

        $recentActivities = PengadaanChecklist::whereIn('pengadaan_id', (clone $query)->pluck('id'))
            ->with(['pengadaan', 'checkedByUser'])
            ->where('is_checked', true)
            ->latest('checked_at')
            ->take(4)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'nama' => $c->nama,
                'pengadaan_nama' => $c->pengadaan->nama,
                'user_name' => $c->checkedByUser?->name ?? 'System',
                'checked_at' => $c->checked_at->diffForHumans(),
            ]);

        $statusDistribution = [
            ['name' => 'Perencanaan', 'value' => $stats['perencanaan'], 'color' => '#eab308'],
            ['name' => 'Pelaksanaan', 'value' => $stats['pelaksanaan'], 'color' => '#f97316'],
            ['name' => 'Selesai', 'value' => $stats['selesai'], 'color' => '#10b981'],
        ];

        return Inertia::render('asmen/dashboard', [
            'stats' => $stats,
            'pengadaans' => $pengadaans,
            'bidang' => $user->getAsmenLabel(),
            'recentActivities' => $recentActivities,
            'statusDistribution' => $statusDistribution,
        ]);
    }

    public function dashboardManager(Request $request)
    {
        $stats = [
            'total' => Pengadaan::count(),
            'perencanaan' => Pengadaan::where('status', 'perencanaan')->count(),
            'pelaksanaan' => Pengadaan::where('status', 'pelaksanaan')->count(),
            'selesai' => Pengadaan::where('status', 'selesai')->count(),
            'total_nilai' => Pengadaan::sum('hps_nilai'),
            'total_saving' => Pengadaan::whereNotNull('hpe_nilai')
                ->whereNotNull('nilai_terkontrak')
                ->selectRaw('SUM(COALESCE(hpe_nilai, 0) - COALESCE(nilai_terkontrak, 0)) as total')
                ->value('total') ?? 0,
            'near_deadline' => Pengadaan::where('status', '!=', 'selesai')
                ->whereNotNull('tanggal_selesai')
                ->where('tanggal_selesai', '<=', now()->addDays(7))
                ->count(),
        ];

        $query = Pengadaan::with(['creator', 'direksiUsers', 'tujuanUnit'])
            ->withCount([
                'checklists' => fn($q) => $q->where('is_optional', false),
                'checklists as checked_count' => fn($q) => $q->where('is_checked', true)->where('is_optional', false),
            ]);

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }

        $pengadaans = $query->latest()->paginate(10)->withQueryString();

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

        $recentActivities = PengadaanChecklist::with(['pengadaan', 'checkedByUser'])
            ->where('is_checked', true)
            ->latest('checked_at')
            ->take(5)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'nama' => $c->nama,
                'pengadaan_nama' => $c->pengadaan->nama,
                'pengadaan_id' => $c->pengadaan_id,
                'user_name' => $c->checkedByUser?->name ?? 'System',
                'checked_at' => $c->checked_at->diffForHumans(),
            ]);

        $statusDistribution = [
            ['name' => 'Perencanaan', 'value' => $stats['perencanaan'], 'color' => '#EAB308'],
            ['name' => 'Pelaksanaan', 'value' => $stats['pelaksanaan'], 'color' => '#F97316'],
            ['name' => 'Selesai', 'value' => $stats['selesai'], 'color' => '#10B981'],
        ];

        return Inertia::render('manager/dashboard', [
            'stats' => $stats,
            'pengadaans' => $pengadaans,
            'filters' => $request->only(['search']),
            'asmenSummary' => $asmenSummary,
            'recentActivities' => $recentActivities,
            'statusDistribution' => $statusDistribution,
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

    public function publicDashboard(Request $request)
    {
        $filterTime = $request->query('finansial_filter', 'all');

        $queryNilai = Pengadaan::query();
        $querySaving = Pengadaan::whereNotNull('hpe_nilai')->whereNotNull('nilai_terkontrak');

        if ($filterTime === 'month') {
            $queryNilai->whereMonth('tanggal_selesai', now()->month)
                       ->whereYear('tanggal_selesai', now()->year);
            $querySaving->whereMonth('tanggal_selesai', now()->month)
                        ->whereYear('tanggal_selesai', now()->year);
        } elseif ($filterTime === 'semester') {
            $semester = now()->month <= 6 ? 1 : 2;
            $startMonth = $semester === 1 ? 1 : 7;
            $endMonth = $semester === 1 ? 6 : 12;
            
            $queryNilai->whereMonth('tanggal_selesai', '>=', $startMonth)
                       ->whereMonth('tanggal_selesai', '<=', $endMonth)
                       ->whereYear('tanggal_selesai', now()->year);
            $querySaving->whereMonth('tanggal_selesai', '>=', $startMonth)
                        ->whereMonth('tanggal_selesai', '<=', $endMonth)
                        ->whereYear('tanggal_selesai', now()->year);
        } elseif ($filterTime === 'year') {
            $queryNilai->whereYear('tanggal_selesai', now()->year);
            $querySaving->whereYear('tanggal_selesai', now()->year);
        }

        $stats = [
            'total' => Pengadaan::count(),
            'perencanaan' => Pengadaan::where('status', 'perencanaan')->count(),
            'pelaksanaan' => Pengadaan::where('status', 'pelaksanaan')->count(),
            'selesai' => Pengadaan::where('status', 'selesai')->count(),
            'total_nilai' => $queryNilai->sum('hps_nilai') ?? 0,
            'total_saving' => $querySaving->selectRaw('SUM(COALESCE(hpe_nilai, 0) - COALESCE(nilai_terkontrak, 0)) as total')
                ->value('total') ?? 0,
            'near_deadline' => Pengadaan::where('status', '!=', 'selesai')
                ->whereNotNull('tanggal_selesai')
                ->where('tanggal_selesai', '<=', now()->addDays(7))
                ->count(),
        ];

        // Hitung distribusi status untuk chart
        $statusDistribution = [
            'perencanaan' => $stats['perencanaan'],
            'pelaksanaan' => $stats['pelaksanaan'],
            'selesai' => $stats['selesai'],
        ];

        // Ambil proyek berjalan (pelaksanaan)
        $activeProjects = Pengadaan::with(['tujuanUnit', 'checklists' => function ($query) {
                $query->where('is_checked', true)->orderBy('checked_at', 'desc');
            }])
            ->where('status', 'pelaksanaan')
            ->orderBy('progress', 'desc')
            ->take(10)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama' => $p->nama,
                    'unit' => $p->tujuanUnit ? $p->tujuanUnit->name : '-',
                    'progress' => $p->progress,
                    'nilai_terkontrak' => $p->nilai_terkontrak,
                    'vendor' => $p->vendor_pelaksana,
                    'is_near_deadline' => $p->isNearDeadline(14),
                    'pic' => $p->pic,
                    'progress_status' => $p->progress_status,
                    'tahap_terakhir' => $p->checklists->first() ? $p->checklists->first()->nama : 'Belum ada',
                ];
            });

        // Ambil proyek mendesak (kendala/akan berakhir)
        $urgentProjects = Pengadaan::with(['tujuanUnit', 'checklists' => function ($query) {
                $query->where('is_checked', true)->orderBy('checked_at', 'desc');
            }])
            ->where('status', '!=', 'selesai')
            ->whereNotNull('tanggal_selesai')
            ->where('tanggal_selesai', '<=', now()->addDays(14))
            ->orderBy('tanggal_selesai', 'asc')
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama' => $p->nama,
                    'unit' => $p->tujuanUnit ? $p->tujuanUnit->name : '-',
                    'status' => $p->status,
                    'tanggal_selesai' => $p->tanggal_selesai ? $p->tanggal_selesai->format('Y-m-d') : null,
                    'progress' => $p->progress,
                    'pic' => $p->pic,
                    'progress_status' => $p->progress_status,
                    'tahap_terakhir' => $p->checklists->first() ? $p->checklists->first()->nama : 'Belum ada',
                ];
            });

        // Ambil proyek selesai terbaru
        $completedProjects = Pengadaan::with(['tujuanUnit', 'direksiUsers'])
            ->where('status', 'selesai')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'nama' => $p->nama,
                    'unit' => $p->tujuanUnit ? $p->tujuanUnit->name : '-',
                    'nilai_terkontrak' => $p->nilai_terkontrak,
                    'direksi' => $p->direksiUsers->map(fn($u) => $u->name)->toArray(),
                ];
            });

        return Inertia::render('welcome', [
            'stats' => $stats,
            'statusDistribution' => $statusDistribution,
            'activeProjects' => $activeProjects,
            'urgentProjects' => $urgentProjects,
            'completedProjects' => $completedProjects,
            'finansialFilter' => $filterTime,
        ]);
    }
}
