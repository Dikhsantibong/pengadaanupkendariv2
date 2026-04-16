import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, Gavel, Package, TrendingUp } from 'lucide-react';

const Progress = ({ value, className }: { value: number; className?: string }) => (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}>
        <div className="h-full bg-orange-500 transition-all dark:bg-orange-400" style={{ width: `${value}%` }} />
    </div>
);

export default function PelaksanaDashboard() {
    return (
        <>
            <Head title="Dashboard Pelaksana" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">
                
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard Pelaksana</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Kelola dan pantau pelaksanaan pengadaan Anda.</p>
                    </div>
                    <Badge variant="outline" className="w-fit border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300">
                        <Gavel className="mr-1 h-3 w-3" /> Role: Pelaksana Pengadaan
                    </Badge>
                </div>

                {/* Notification */}
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                        <h4 className="font-medium text-red-800 dark:text-red-200">Perhatian</h4>
                        <p className="text-sm text-red-600 dark:text-red-300">Kontrak "Pengadaan Server Data Center" akan berakhir dalam 30 hari. Segera selesaikan proses pelaksanaan.</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pelaksanaan</CardTitle>
                            <Package className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45</div>
                            <p className="text-xs text-muted-foreground mt-1">Pengadaan dalam pelaksanaan</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Proses Tender</CardTitle>
                            <Gavel className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18</div>
                            <p className="text-xs text-muted-foreground mt-1">Menunggu evaluasi penawaran</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-cyan-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Negosiasi</CardTitle>
                            <Clock className="h-4 w-4 text-cyan-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">9</div>
                            <p className="text-xs text-muted-foreground mt-1">Tahap klarifikasi & negosiasi</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Kontrak Selesai</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">18</div>
                            <p className="text-xs text-muted-foreground mt-1">Kontrak telah ditandatangani</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid gap-6 md:grid-cols-7">
                    
                    {/* Chart */}
                    <Card className="md:col-span-4">
                        <CardHeader>
                            <CardTitle>Statistik Pelaksanaan</CardTitle>
                            <CardDescription>Jumlah pengadaan yang dieksekusi per bulan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[300px] w-full items-end gap-2 pt-6">
                                {[12, 20, 16, 24, 18, 30].map((val, i) => (
                                    <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-2">
                                        <div className="absolute -top-8 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block z-10 dark:bg-slate-100 dark:text-slate-900">
                                            {val} Pengadaan
                                        </div>
                                        <div 
                                            className="w-full max-w-[40px] rounded-t-md bg-orange-500/80 transition-all hover:bg-orange-600 dark:bg-orange-600/80 dark:hover:bg-orange-500" 
                                            style={{ height: `${(val / 30) * 100}%` }}
                                        />
                                        <span className="text-xs text-muted-foreground">{['Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Execution Items */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Pelaksanaan Aktif</CardTitle>
                            <CardDescription>Pengadaan yang tahap pelaksanaannya sedang berjalan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-5">
                                {[
                                    { name: 'Pengadaan Server Data Center', progress: 90, stage: 'Kontrak' },
                                    { name: 'Pengadaan Alat Kelistrikan', progress: 60, stage: 'Tender' },
                                    { name: 'Pengadaan Seragam Dinas', progress: 40, stage: 'Evaluasi' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium text-sm">{item.name}</div>
                                            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                                {item.stage}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Progress value={item.progress} className="h-2 flex-1" />
                                            <span className="text-xs font-medium text-muted-foreground">{item.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                                <Button asChild variant="outline" className="mt-2 w-full">
                                    <Link href="/pengadaan">Lihat Semua Pengadaan</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

PelaksanaDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard Pelaksana',
            href: '/dashboard',
        },
    ],
});
