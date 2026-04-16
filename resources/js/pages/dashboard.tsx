import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, FolderKanban, TrendingUp } from 'lucide-react';
import { dashboard } from '@/routes';

// Make a temporary progress component
const Progress = ({ value, className }: { value: number; className?: string }) => (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}>
        <div className="h-full bg-slate-900 transition-all dark:bg-slate-50" style={{ width: `${value}%` }} />
    </div>
);

export default function Dashboard() {
    const pengadaanUrl = '/pengadaan';

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">
                
                {/* Header Section */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Ikhtisar sistem manajemen pengadaan Anda hari ini.</p>
                    </div>
                </div>

                {/* Notifications Alert */}
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                        <h4 className="font-medium text-red-800 dark:text-red-200">Perhatian</h4>
                        <p className="text-sm text-red-600 dark:text-red-300">Kontrak "Pengadaan Server Data Center" akan berakhir dalam 30 hari.</p>
                    </div>
                    <Button variant="outline" size="sm" className="ml-auto bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700">
                        Lihat Detail
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengadaan</CardTitle>
                            <FolderKanban className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">124</div>
                            <p className="text-xs text-muted-foreground mt-1">+4 dari bulan lalu</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Perencanaan</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">32</div>
                            <p className="text-xs text-muted-foreground mt-1">Menunggu dokumen teknis</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pelaksanaan</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">45</div>
                            <p className="text-xs text-muted-foreground mt-1">Dalam proses tender</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Selesai</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">47</div>
                            <p className="text-xs text-muted-foreground mt-1">Kontrak telah ditandatangani</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Dashboard Bottom Section */}
                <div className="grid gap-6 md:grid-cols-7">
                    
                    {/* Placeholder Bar Chart */}
                    <Card className="md:col-span-4">
                        <CardHeader>
                            <CardTitle>Statistik Pengadaan</CardTitle>
                            <CardDescription>Perbandingan status pengadaan 6 bulan terakhir</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[300px] w-full items-end gap-2 pt-6">
                                {/* Simple CSS Bar Chart Mockup */}
                                {[40, 70, 45, 90, 65, 120].map((val, i) => (
                                    <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-2">
                                        {/* Tooltip on hover */}
                                        <div className="absolute -top-8 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block z-10 dark:bg-slate-100 dark:text-slate-900">
                                            {val} Pengadaan
                                        </div>
                                        <div 
                                            className="w-full max-w-[40px] rounded-t-md bg-blue-500/80 transition-all hover:bg-blue-600 dark:bg-blue-600/80 dark:hover:bg-blue-500" 
                                            style={{ height: `${(val / 120) * 100}%` }}
                                        />
                                        <span className="text-xs text-muted-foreground">{['Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Active Procurements */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Pengadaan Aktif (Top 3)</CardTitle>
                            <CardDescription>Pengadaan yang sedang diproses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-5">
                                {[
                                    { name: 'Pengadaan Server Data Center', progress: 80, status: 'Pelaksanaan', color: 'orange' },
                                    { name: 'Pembangunan Gedung Arsip', progress: 35, status: 'Perencanaan', color: 'yellow' },
                                    { name: 'Pengadaan Seragam Dinas', progress: 50, status: 'Pelaksanaan', color: 'orange' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium">{item.name}</div>
                                            <Badge variant={item.color === 'yellow' ? 'secondary' : 'default'} className={
                                                item.color === 'orange' ? 'bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300' : 
                                                'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300'
                                            }>
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Progress value={item.progress} className="h-2 flex-1" />
                                            <span className="text-xs font-medium text-muted-foreground">{item.progress}%</span>
                                        </div>
                                    </div>
                                ))}
                                <Button asChild variant="outline" className="mt-2 w-full">
                                    <Link href={pengadaanUrl}>Lihat Semua Pengadaan</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
});
