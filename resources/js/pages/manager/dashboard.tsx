import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    CheckCircle2,
    Clock,
    DollarSign,
    Eye,
    FolderKanban,
    History,
    Shield,
    TrendingUp,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

type Pengadaan = {
    id: number;
    nama: string;
    status: 'perencanaan' | 'pelaksanaan' | 'selesai';
    progress: number;
    created_at: string;
    creator?: { name: string };
    checklists_count: number;
    checked_count: number;
    direksi_users?: { id: number; name: string; role: string }[];
    jaminan_bank_nilai?: number;
};

type AsmenSummary = { id: number; name: string; role: string; label: string; assigned_count: number };

type RecentActivity = {
    id: number;
    nama: string;
    pengadaan_nama: string;
    pengadaan_id: number;
    user_name: string;
    checked_at: string;
};

type StatusDist = { name: string; value: number; color: string };

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
    pengadaans: Pengadaan[];
    asmenSummary: AsmenSummary[];
    recentActivities: RecentActivity[];
    statusDistribution: StatusDist[];
};

const statusColors: Record<string, string> = {
    perencanaan: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    pelaksanaan: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    selesai: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};
const statusLabels: Record<string, string> = { perencanaan: 'Perencanaan', pelaksanaan: 'Pelaksanaan', selesai: 'Selesai' };

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
};

export default function ManagerDashboard({ stats, pengadaans, asmenSummary, recentActivities, statusDistribution }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const filtered = pengadaans.filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <>
            <Head title="Super Dashboard Manager" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Super Dashboard</h1>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">v2.0</Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pusat Kendali Pengadaan — Monitoring Komprehensif Seluruh Data.</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Badge variant="outline" className="px-3 py-1 border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
                            <Shield className="mr-1.5 h-3.5 w-3.5" />Super Admin Access
                        </Badge>
                    </div>
                </div>

                {/* Top Statistics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden border-none shadow-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white transform hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 opacity-90">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider">Total Pengadaan</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <FolderKanban className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{stats.total}</div>
                            <p className="text-xs opacity-80 mt-2 font-medium">Semua fase pengadaan</p>
                        </CardContent>
                        <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12"><FolderKanban size={120} /></div>
                    </Card>

                    <Card className="relative overflow-hidden border-none shadow-md bg-amber-50 dark:bg-amber-950/20 border-l-4 border-l-amber-500 transform hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">Perencanaan</CardTitle>
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{stats.perencanaan}</div>
                            <div className="mt-2 flex items-center text-xs font-bold text-amber-700 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 w-fit px-2 py-0.5 rounded-full">
                                <Activity className="mr-1 h-3 w-3" /> {Math.round((stats.perencanaan / stats.total) * 100) || 0}% dari total
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-none shadow-md bg-orange-50 dark:bg-orange-950/20 border-l-4 border-l-orange-500 transform hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wider">Pelaksanaan</CardTitle>
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-orange-600 dark:text-orange-400">{stats.pelaksanaan}</div>
                             <div className="mt-2 flex items-center text-xs font-bold text-orange-700 dark:text-orange-500 bg-orange-100 dark:bg-orange-900/30 w-fit px-2 py-0.5 rounded-full">
                                <Activity className="mr-1 h-3 w-3" /> {Math.round((stats.pelaksanaan / stats.total) * 100) || 0}% dari total
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-none shadow-md bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500 transform hover:scale-[1.02] transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Selesai</CardTitle>
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{stats.selesai}</div>
                             <div className="mt-2 flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 w-fit px-2 py-0.5 rounded-full">
                                <Activity className="mr-1 h-3 w-3" /> {Math.round((stats.selesai / stats.total) * 100) || 0}% dari total
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Middle Section: Financial & Alerts & Chart */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Financial Summary */}
                    <Card className="lg:col-span-1 border-none shadow-md bg-slate-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-emerald-400" />Ringkasan Keuangan</CardTitle>
                            <CardDescription className="text-slate-400">Total nilai jaminan bank terdaftar</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col justify-center py-6">
                            <div className="text-3xl font-extrabold text-emerald-400 mb-2">{formatCurrency(stats.total_nilai)}</div>
                            <div className="text-sm text-emerald-300 mb-1">Saving: {formatCurrency(stats.total_saving)}</div>
                            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-400">Near Deadline</span>
                                    <Badge variant="destructive" className="h-5 px-1.5">{stats.near_deadline}</Badge>
                                </div>
                                <p className="text-[10px] text-slate-500 italic">Pengadaan yang berakhir dalam 7 hari kedepan.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Distribution Chart */}
                    <Card className="lg:col-span-1 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5 text-indigo-600" />Distribusi Status</CardTitle>
                            <CardDescription>Persentase per fase saat ini</CardDescription>
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
                            <CardTitle className="text-lg flex items-center gap-2"><History className="h-5 w-5 text-sky-600" />Aktivitas Terbaru</CardTitle>
                            <CardDescription>Log checklist terakhir</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
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
                                                    <span className="text-sky-700 dark:text-sky-400 font-bold">{act.user_name}</span> <span className="text-muted-foreground">menyelesaikan</span> <span className="italic font-medium">"{act.nama}"</span>
                                                </p>
                                                <p className="text-[10px] text-muted-foreground truncate" title={act.pengadaan_nama}>
                                                    Proyek: {act.pengadaan_nama}
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

                {/* Team Workload */}
                <Card className="shadow-sm">
                    <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50">
                        <CardTitle className="flex items-center gap-2 font-bold"><Users className="h-5 w-5 text-indigo-600" />Ringkasan Beban Kerja Asmen</CardTitle>
                        <CardDescription>Monitor distribusi penugasan Direksi Pekerjaan</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            {asmenSummary.map(a => (
                                <div key={a.id} className="flex flex-col rounded-xl border bg-white dark:bg-slate-950 p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                                        <Users className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div className="font-bold text-sm truncate">{a.name}</div>
                                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">{a.label}</div>
                                    <div className="mt-auto flex items-end justify-between">
                                        <span className="text-2xl font-black text-indigo-600">{a.assigned_count}</span>
                                        <span className="text-[10px] text-muted-foreground pb-1">Proyek</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Table Section */}
                <Card className="shadow-lg border-t-4 border-t-indigo-600">
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle className="text-xl">Daftar Pengadaan Menyeluruh</CardTitle>
                                <CardDescription>Data real-time dari semua perencana dan pelaksana</CardDescription>
                            </div>
                            <div className="relative md:w-80">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    placeholder="Cari nama pengadaan..."
                                    className="pl-9 bg-muted/30"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filtered.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground">
                                <FolderKanban className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                <p className="text-lg font-medium">Tidak ada data ditemukan</p>
                                <p className="text-sm">Coba kata kunci pencarian lain.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground bg-slate-50/50 dark:bg-slate-900/50">
                                            <th className="px-4 py-4 font-bold">No</th>
                                            <th className="px-4 py-4 font-bold">Informasi Pengadaan</th>
                                            <th className="px-4 py-4 font-bold">Status & Progress</th>
                                            <th className="px-4 py-4 font-bold">Nilai Kontrak</th>
                                            <th className="px-4 py-4 font-bold">Tim Direksi</th>
                                            <th className="px-4 py-4 font-bold text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filtered.map((item, idx) => (
                                            <tr key={item.id} className="group hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-4 text-muted-foreground font-medium">{idx + 1}</td>
                                                <td className="px-4 py-4">
                                                    <div className="font-bold text-slate-900 dark:text-slate-100">{item.nama}</div>
                                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                                                        <Clock className="h-3 w-3" />
                                                        Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} oleh {item.creator?.name}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge className={cn("mb-2", statusColors[item.status])}>
                                                        {statusLabels[item.status]}
                                                    </Badge>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                            <div
                                                                className={cn(
                                                                    "h-full transition-all duration-500",
                                                                    item.progress === 100 ? 'bg-emerald-500' : item.progress >= 50 ? 'bg-orange-500' : 'bg-sky-500'
                                                                )}
                                                                style={{ width: `${item.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10px] font-bold text-muted-foreground">{item.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    {item.jaminan_bank_nilai ? formatCurrency(item.jaminan_bank_nilai) : '-'}
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex -space-x-2 overflow-hidden">
                                                        {item.direksi_users?.slice(0, 3).map((u) => (
                                                            <div key={u.id} className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-200 text-[10px] font-bold dark:border-slate-900 dark:bg-slate-800" title={u.name}>
                                                                {u.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                        ))}
                                                        {item.direksi_users && item.direksi_users.length > 3 && (
                                                            <div className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold dark:border-slate-900 dark:bg-slate-800">
                                                                +{item.direksi_users.length - 3}
                                                            </div>
                                                        )}
                                                        {(!item.direksi_users || item.direksi_users.length === 0) && <span className="text-xs text-muted-foreground italic">Belum ditunjuk</span>}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <Button variant="outline" size="sm" className="h-8 group-hover:bg-indigo-600 group-hover:text-white transition-colors" asChild>
                                                        <Link href={`/pengadaan/${item.id}`}>
                                                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                            Detail
                                                        </Link>
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

// Re-using layout and adding Search icon specifically for this page header if needed (though already in AppSidebarHeader)
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
ManagerDashboard.layout = (page: any) => ({ breadcrumbs: [{ title: 'Super Dashboard Manager', href: '/manager/dashboard' }] });
