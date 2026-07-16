import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, FileText, CheckCircle2, TrendingUp, AlertTriangle, Wallet, Building2, Clock, Activity, BarChart3, Briefcase, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Project = {
    id: number;
    nama: string;
    unit: string;
    progress?: number;
    nilai_terkontrak?: number | null;
    vendor?: string | null;
    is_near_deadline?: boolean;
    status?: string;
    tanggal_selesai?: string | null;
    direksi?: string[];
};

type Props = {
    stats: {
        total: number;
        perencanaan: number;
        pelaksanaan: number;
        selesai: number;
        total_nilai: number;
        total_saving: number;
        near_deadline: number;
    };
    statusDistribution: {
        perencanaan: number;
        pelaksanaan: number;
        selesai: number;
    };
    activeProjects: Project[];
    urgentProjects: Project[];
    completedProjects: Project[];
    finansialFilter: string;
};

export default function Welcome({ stats, statusDistribution, activeProjects, urgentProjects, completedProjects, finansialFilter }: Props) {
    const formatRupiah = (angka: number | null | undefined) => {
        if (angka == null) return '-';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(angka);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'perencanaan': return 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200';
            case 'pelaksanaan': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200';
            case 'selesai': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
        }
    };

    return (
        <>
            <Head title="Dashboard Publik - SIPengadaan" />
            
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-sky-500/30">
                <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm">
                    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-2">
                                <img src="/logo/sidebarlogo.png" alt="Logo" className="h-10 w-auto" />
                            </div>
                            <div className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                UP KENDARI
                            </div>
                        </div>
                    </div>
                </header>

                <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
                    
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Ringkasan Eksekutif</h1>
                        <p className="text-slate-500 dark:text-slate-400">Pantau pergerakan dan status seluruh proyek pengadaan secara real-time.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-l-4 border-l-sky-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Proyek</CardTitle>
                                <Briefcase className="h-4 w-4 text-sky-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</div>
                                <p className="text-xs text-slate-500 mt-1">Keseluruhan pengadaan tercatat</p>
                            </CardContent>
                        </Card>
                        
                        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Sedang Berjalan</CardTitle>
                                <Activity className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pelaksanaan}</div>
                                <p className="text-xs text-slate-500 mt-1">Dalam tahap pelaksanaan</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Proyek Selesai</CardTitle>
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.selesai}</div>
                                <p className="text-xs text-slate-500 mt-1">Pengadaan telah rampung</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-rose-500 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">Tenggat Waktu Dekat</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-rose-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">{stats.near_deadline}</div>
                                <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-1">Selesai dalam &le; 7 hari</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-1 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2"><LayoutDashboard className="h-5 w-5 text-indigo-500"/> Distribusi Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Perencanaan</span>
                                        <span className="text-slate-500">{statusDistribution.perencanaan} Proyek</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full">
                                        <div className="h-full bg-sky-500 transition-all duration-500" style={{ width: `${stats.total > 0 ? (statusDistribution.perencanaan / stats.total) * 100 : 0}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Pelaksanaan</span>
                                        <span className="text-slate-500">{statusDistribution.pelaksanaan} Proyek</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full">
                                        <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${stats.total > 0 ? (statusDistribution.pelaksanaan / stats.total) * 100 : 0}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium text-slate-700 dark:text-slate-300">Selesai</span>
                                        <span className="text-slate-500">{statusDistribution.selesai} Proyek</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full">
                                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${stats.total > 0 ? (statusDistribution.selesai / stats.total) * 100 : 0}%` }} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2 shadow-sm">
                            <CardHeader className="flex flex-row items-start justify-between">
                                <div>
                                    <CardTitle className="text-lg flex items-center gap-2"><Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-400"/> Tinjauan Finansial</CardTitle>
                                    <CardDescription>Akumulasi nilai dari seluruh pengadaan tercatat.</CardDescription>
                                </div>
                                <div className="w-32">
                                    <Select value={finansialFilter} onValueChange={(val) => router.get('/', { finansial_filter: val }, { preserveScroll: true })}>
                                        <SelectTrigger className="h-8 text-xs">
                                            <SelectValue placeholder="Filter Waktu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Waktu</SelectItem>
                                            <SelectItem value="year">Tahun Ini</SelectItem>
                                            <SelectItem value="semester">Semester Ini</SelectItem>
                                            <SelectItem value="month">Bulan Ini</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
                                    <div>
                                        <div className="text-sm font-medium text-slate-500 mb-1">Total Nilai HPS (Estimasi)</div>
                                        <div className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                            {formatRupiah(stats.total_nilai)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-1">Total Efisiensi (Saving)</div>
                                        <div className="text-3xl sm:text-4xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight flex items-center gap-2">
                                            {formatRupiah(stats.total_saving)}
                                            {stats.total_saving > 0 && <TrendingUp className="h-6 w-6 opacity-75" />}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Dihitung dari selisih Nilai HPE dan Nilai Kontrak.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        <Card className="shadow-sm border-rose-200 dark:border-rose-900/50">
                            <CardHeader className="bg-rose-50/30 dark:bg-rose-950/10 border-b border-rose-100 dark:border-rose-900/30 rounded-t-xl pb-4">
                                <CardTitle className="text-lg flex items-center gap-2 text-rose-700 dark:text-rose-400">
                                    <Clock className="h-5 w-5"/> Perhatian Khusus (Mendesak)
                                </CardTitle>
                                <CardDescription className="text-rose-600/70 dark:text-rose-400/70">Proyek dengan tenggat waktu dalam 14 hari ke depan.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {urgentProjects.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {urgentProjects.map(project => (
                                            <div key={project.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{project.nama}</h3>
                                                    <Badge variant="outline" className={getStatusColor(project.status || '') + " shrink-0 ml-2"}>
                                                        {project.status === 'perencanaan' ? 'Perencanaan' : 'Pelaksanaan'}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center text-sm text-slate-500 mb-3 gap-4">
                                                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5"/> {project.unit}</span>
                                                    <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium"><Clock className="h-3.5 w-3.5"/> {project.tanggal_selesai}</span>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-xs text-slate-500">
                                                        <span>Progress</span>
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">{project.progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full">
                                                        <div className={`h-full transition-all duration-500 ${project.status === 'perencanaan' ? 'bg-sky-500' : 'bg-orange-500'}`} style={{ width: `${project.progress}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                                        <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2 opacity-50" />
                                        <p>Tidak ada proyek yang mendekati tenggat waktu.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="text-lg flex items-center gap-2 text-slate-800 dark:text-slate-200">
                                    <TrendingUp className="h-5 w-5 text-orange-500"/> Sedang Berjalan (Pelaksanaan)
                                </CardTitle>
                                <CardDescription>Daftar proyek aktif dengan progress tertinggi.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {activeProjects.length > 0 ? (
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {activeProjects.slice(0, 5).map(project => (
                                            <div key={project.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1">{project.nama}</h3>
                                                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400 shrink-0 ml-2">{project.progress}%</span>
                                                </div>
                                                <div className="flex flex-wrap items-center text-xs text-slate-500 gap-x-4 gap-y-1 mb-2">
                                                    <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5"/> {project.unit}</span>
                                                    {project.vendor && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5"/> {project.vendor}</span>}
                                                    {project.nilai_terkontrak && <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300"><Wallet className="h-3.5 w-3.5 text-emerald-500"/> {formatRupiah(project.nilai_terkontrak)}</span>}
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-full mt-2">
                                                    <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${project.progress}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-500">
                                        <p>Belum ada proyek dalam tahap pelaksanaan.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {completedProjects.length > 0 && (
                        <Card className="shadow-sm border-emerald-100 dark:border-emerald-900/50">
                            <CardHeader className="bg-emerald-50/30 dark:bg-emerald-950/10 border-b border-emerald-50 dark:border-emerald-900/20 rounded-t-xl">
                                <CardTitle className="text-lg flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle2 className="h-5 w-5"/> Baru Saja Selesai
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                    {completedProjects.map(project => (
                                        <div key={project.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-medium text-slate-900 dark:text-white line-clamp-2 mb-2 leading-snug">{project.nama}</h3>
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md w-fit"><Building2 className="h-3 w-3"/> {project.unit}</span>
                                                    {project.direksi && project.direksi.length > 0 && (
                                                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md w-fit mt-1"><Users className="h-3 w-3"/> Direksi: {project.direksi.join(', ')}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">Selesai</Badge>
                                                {project.nilai_terkontrak && <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatRupiah(project.nilai_terkontrak)}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </main>
                
                <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12">
                    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center">
                        <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
                            <Activity className="h-4 w-4 opacity-50" />
                            SIPengadaan &copy; {new Date().getFullYear()} - Sistem Informasi Monitoring Pengadaan
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
