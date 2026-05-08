import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    BarChart3,
    CheckCircle2,
    Clock,
    DollarSign,
    FolderKanban,
    Gavel,
    History,
    TrendingUp
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

type Props = {
    stats: {
        total: number;
        proses: number;
        baru: number;
        selesai: number;
        total_nilai: number;
        total_saving: number;
        near_deadline: number;
    };
    pengadaanAktif: Array<{
        id: number;
        nama: string;
        progress: number;
        checklists_pelaksanaan_count: number;
        pelaksanaan_checked: number;
    }>;
    recentActivities: Array<{
        id: number;
        nama: string;
        pengadaan_nama: string;
        user_name: string;
        checked_at: string;
    }>;
    statusDistribution: Array<{ name: string; value: number; color: string }>;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
};

export default function PelaksanaDashboard({ stats, pengadaanAktif, recentActivities, statusDistribution }: Props) {
    return (
        <>
            <Head title="Super Dashboard Pelaksana" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Super Dashboard</h1>
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">Pelaksana</Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Kelola dan pantau fase pelaksanaan pengadaan.</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Badge variant="outline" className="px-3 py-1 border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
                            <Gavel className="mr-1.5 h-3.5 w-3.5" />Pelaksana Pengadaan
                        </Badge>
                    </div>
                </div>

                {/* Top Statistics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden border-none shadow-md bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 opacity-90">
                            <CardTitle className="text-sm font-medium">Fase Pelaksanaan</CardTitle>
                            <FolderKanban className="h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats.total}</div>
                            <p className="text-xs opacity-70 mt-1">Pengadaan dalam pelaksanaan</p>
                        </CardContent>
                        <div className="absolute -right-4 -bottom-4 opacity-10"><FolderKanban size={100} /></div>
                    </Card>

                    <Card className="border-l-4 border-l-blue-400 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Baru Masuk</CardTitle>
                            <Clock className="h-4 w-4 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.baru}</div>
                            <div className="mt-1 flex items-center text-xs text-muted-foreground italic">
                                Menunggu inisiasi pelaksanaan
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Sedang Proses</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.proses}</div>
                             <div className="mt-1 flex items-center text-xs text-muted-foreground italic">
                                Checklist sedang diproses
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Selesai</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">{stats.selesai}</div>
                             <div className="mt-1 flex items-center text-xs text-muted-foreground italic">
                                Telah menyelesaikan semua fase
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Section: Financial & Chart & Activities */}
                <div className="grid gap-6 lg:grid-cols-3">
                     {/* Financial Summary */}
                     <Card className="lg:col-span-1 border-none shadow-md bg-slate-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-400" />Nilai Pelaksanaan</CardTitle>
                            <CardDescription className="text-slate-400">Total nilai jaminan bank yang dikelola</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-center py-6">
                            <div className="text-3xl font-extrabold text-emerald-400 mb-2">{formatCurrency(stats.total_nilai)}</div>
                            <div className="text-sm text-emerald-300 mb-1">Saving: {formatCurrency(stats.total_saving)}</div>
                            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-400">Near Deadline</span>
                                    <Badge variant="destructive" className="h-5 px-1.5">{stats.near_deadline}</Badge>
                                </div>
                                <p className="text-[10px] text-slate-500 italic">Pekerjaan dengan tenggat waktu dekat.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Distribution Chart */}
                    <Card className="lg:col-span-1 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-orange-600" />Kondisi Pelaksanaan</CardTitle>
                            <CardDescription>Penyebaran status per hari ini</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="lg:col-span-1 shadow-sm flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2"><History className="h-5 w-5 text-sky-600" />Update Pelaksanaan</CardTitle>
                            <CardDescription>Aktivitas checklist pelaksanaan terbaru</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto max-h-[250px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                            <div className="space-y-4 pr-1">
                                {recentActivities.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">Belum ada aktivitas.</p>
                                ) : (
                                    recentActivities.map((act) => (
                                        <div key={act.id} className="flex gap-3 text-sm border-b border-slate-50 dark:border-slate-900 pb-3 last:border-0 last:pb-0">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-900/30">
                                                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <p className="font-medium leading-none mb-1 text-xs">
                                                    <span className="text-sky-700 dark:text-sky-400 font-bold">{act.user_name}</span> <span className="text-muted-foreground">mengerjakan</span> <span className="italic font-medium">"{act.nama}"</span>
                                                </p>
                                                <p className="text-[10px] text-muted-foreground truncate" title={act.pengadaan_nama}>
                                                    {act.pengadaan_nama}
                                                </p>
                                                <span className="text-[10px] text-muted-foreground mt-1 opacity-70">{act.checked_at}</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Items List */}
                <Card className="shadow-lg border-t-4 border-t-orange-600">
                    <CardHeader>
                        <CardTitle className="text-xl">Monitoring Pelaksanaan Aktif</CardTitle>
                        <CardDescription>Selesaikan checklist pelaksanaan untuk menutup pengadaan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pengadaanAktif.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground">
                                <FolderKanban className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                <p className="text-lg font-medium">Tidak ada pelaksanaan aktif</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {pengadaanAktif.map((item) => {
                                    const total = item.checklists_pelaksanaan_count || 0;
                                    const checked = item.pelaksanaan_checked || 0;
                                    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
                                    return (
                                        <Link key={item.id} href={`/pengadaan/${item.id}`} className="group block">
                                            <div className="flex flex-col gap-3 rounded-xl border bg-white dark:bg-slate-950 p-5 shadow-sm hover:shadow-md transition-all hover:border-orange-500">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-orange-600 transition-colors">{item.nama}</span>
                                                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                                        {checked}/{total} Task
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div
                                                            className={cn(
                                                                "h-full transition-all duration-500 bg-orange-500",
                                                                pct === 100 && "bg-emerald-500"
                                                            )}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-black text-slate-500">{pct}%</span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                        <Button asChild variant="ghost" className="mt-6 w-full text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                            <Link href="/pengadaan">Lihat Seluruh Daftar Pengadaan</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PelaksanaDashboard.layout = () => ({ breadcrumbs: [{ title: 'Super Dashboard Pelaksana', href: '/dashboard' }] });
