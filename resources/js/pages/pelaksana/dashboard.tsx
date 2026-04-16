import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Gavel, Package, TrendingUp } from 'lucide-react';

type Props = {
    stats: { total: number; proses: number; baru: number; selesai: number };
    pengadaanAktif: Array<{
        id: number;
        nama: string;
        progress: number;
        checklists_pelaksanaan_count: number;
        pelaksanaan_checked: number;
    }>;
};

const Progress = ({ value, className }: { value: number; className?: string }) => (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}>
        <div className="h-full bg-orange-500 transition-all dark:bg-orange-400" style={{ width: `${value}%` }} />
    </div>
);

export default function PelaksanaDashboard({ stats, pengadaanAktif }: Props) {
    return (
        <>
            <Head title="Dashboard Pelaksana" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">

                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard Pelaksana</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Kelola dan pantau pelaksanaan pengadaan.</p>
                    </div>
                    <Badge variant="outline" className="w-fit border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
                        <Gavel className="mr-1 h-3 w-3" /> Role: Pelaksana Pengadaan
                    </Badge>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Tahap Pelaksanaan</CardTitle>
                            <Package className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pengadaan dalam pelaksanaan</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Baru Masuk</CardTitle>
                            <Clock className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.baru}</div>
                            <p className="text-xs text-muted-foreground mt-1">Belum ada checklist pelaksanaan</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-cyan-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Sedang Proses</CardTitle>
                            <TrendingUp className="h-4 w-4 text-cyan-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.proses}</div>
                            <p className="text-xs text-muted-foreground mt-1">Checklist sedang dijalankan</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Selesai</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.selesai}</div>
                            <p className="text-xs text-muted-foreground mt-1">Pengadaan telah selesai</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Active Execution Items */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pelaksanaan Aktif</CardTitle>
                        <CardDescription>Pengadaan yang menunggu kelengkapan checklist pelaksanaan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pengadaanAktif.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Tidak ada pengadaan dalam tahap pelaksanaan.</p>
                                <p className="text-xs mt-1">Pengadaan akan muncul setelah Perencana menyelesaikan semua checklist perencanaan.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {pengadaanAktif.map((item) => {
                                    const total = item.checklists_pelaksanaan_count || 0;
                                    const checked = item.pelaksanaan_checked || 0;
                                    const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
                                    return (
                                        <Link key={item.id} href={`/pengadaan/${item.id}`} className="block">
                                            <div className="flex flex-col gap-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{item.nama}</span>
                                                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                                        {checked}/{total} checklist
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Progress value={pct} className="h-2 flex-1" />
                                                    <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                        <Button asChild variant="outline" className="mt-4 w-full">
                            <Link href="/pengadaan">Lihat Semua Pengadaan</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

PelaksanaDashboard.layout = () => ({
    breadcrumbs: [{ title: 'Dashboard Pelaksana', href: '/dashboard' }],
});
