import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Eye, FolderKanban, Shield, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

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
};

type AsmenSummary = { id: number; name: string; role: string; label: string; assigned_count: number };

type Props = {
    stats: { total: number; perencanaan: number; pelaksanaan: number; selesai: number };
    pengadaans: Pengadaan[];
    asmenSummary: AsmenSummary[];
};

const statusColors: Record<string, string> = {
    perencanaan: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    pelaksanaan: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    selesai: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};
const statusLabels: Record<string, string> = { perencanaan: 'Perencanaan', pelaksanaan: 'Pelaksanaan', selesai: 'Selesai' };

export default function ManagerDashboard({ stats, pengadaans, asmenSummary }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const filtered = pengadaans.filter(p => p.nama.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <>
            <Head title="Dashboard Manager — Super Admin" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard Manager</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Super Admin — Pantau semua data pengadaan secara menyeluruh.</p>
                    </div>
                    <Badge variant="outline" className="w-fit border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300">
                        <Shield className="mr-1 h-3 w-3" />Super Admin
                    </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle><FolderKanban className="h-4 w-4 text-blue-600" /></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Perencanaan</CardTitle><Clock className="h-4 w-4 text-yellow-600" /></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.perencanaan}</div></CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pelaksanaan</CardTitle><TrendingUp className="h-4 w-4 text-orange-600" /></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.pelaksanaan}</div></CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Selesai</CardTitle><CheckCircle2 className="h-4 w-4 text-emerald-600" /></CardHeader>
                        <CardContent><div className="text-2xl font-bold">{stats.selesai}</div></CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-600" />Ringkasan Asmen</CardTitle><CardDescription>Jumlah pengadaan yang ditugaskan ke setiap Asmen</CardDescription></CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {asmenSummary.map(a => (
                                <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div><div className="font-medium text-sm">{a.name}</div><div className="text-xs text-muted-foreground">{a.label}</div></div>
                                    <Badge variant="secondary">{a.assigned_count} pengadaan</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div><CardTitle>Semua Pengadaan</CardTitle><CardDescription>Data lengkap dari semua role</CardDescription></div>
                            <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari pengadaan..." className="md:w-64" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filtered.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground"><p>Tidak ada data ditemukan.</p></div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b text-left text-muted-foreground">
                                        <th className="px-4 py-3 font-medium">No</th><th className="px-4 py-3 font-medium">Nama</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Progress</th><th className="px-4 py-3 font-medium">Direksi</th><th className="px-4 py-3 font-medium">Dibuat</th><th className="px-4 py-3 font-medium text-right">Aksi</th>
                                    </tr></thead>
                                    <tbody>
                                        {filtered.map((item, idx) => (
                                            <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                                <td className="px-4 py-3 font-medium">{item.nama}</td>
                                                <td className="px-4 py-3"><Badge className={statusColors[item.status]}>{statusLabels[item.status]}</Badge></td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full transition-all ${item.progress === 100 ? 'bg-emerald-500' : item.progress >= 50 ? 'bg-orange-500' : 'bg-sky-500'}`} style={{ width: `${item.progress}%` }} /></div>
                                                        <span className="text-xs font-medium">{item.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-muted-foreground">{item.direksi_users?.map(u => u.name).join(', ') || '-'}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                <td className="px-4 py-3 text-right"><Button variant="ghost" size="sm" asChild><Link href={`/pengadaan/${item.id}`}><Eye className="mr-1 h-4 w-4" />Detail</Link></Button></td>
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

ManagerDashboard.layout = () => ({ breadcrumbs: [{ title: 'Dashboard Manager', href: '/manager/dashboard' }] });
