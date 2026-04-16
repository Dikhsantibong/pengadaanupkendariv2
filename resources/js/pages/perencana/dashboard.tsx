import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Clock, FileText, FolderKanban, TrendingUp } from 'lucide-react';

const Progress = ({ value, className }: { value: number; className?: string }) => (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}>
        <div className="h-full bg-sky-600 transition-all dark:bg-sky-400" style={{ width: `${value}%` }} />
    </div>
);

export default function PerencanaDashboard() {
    return (
        <>
            <Head title="Dashboard Perencana" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">
                
                {/* Header */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard Perencana</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Kelola dan pantau perencanaan pengadaan Anda.</p>
                    </div>
                    <Badge variant="outline" className="w-fit border-sky-300 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300">
                        <FileText className="mr-1 h-3 w-3" /> Role: Perencana Pengadaan
                    </Badge>
                </div>

                {/* Notification */}
                <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <div>
                        <h4 className="font-medium text-amber-800 dark:text-amber-200">Tugas Menunggu</h4>
                        <p className="text-sm text-amber-600 dark:text-amber-300">3 dokumen perencanaan menunggu kelengkapan checklist sebelum dilanjutkan ke tahap pelaksanaan.</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-l-4 border-l-sky-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Perencanaan</CardTitle>
                            <FolderKanban className="h-4 w-4 text-sky-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">32</div>
                            <p className="text-xs text-muted-foreground mt-1">Tugas perencanaan aktif</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-yellow-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Draft / Baru</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground mt-1">Belum dimulai checklistnya</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Proses Checklist</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">15</div>
                            <p className="text-xs text-muted-foreground mt-1">Sedang dilengkapi</p>
                        </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-emerald-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Siap Pelaksanaan</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-xs text-muted-foreground mt-1">Checklist selesai, siap lanjut</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom Section */}
                <div className="grid gap-6 md:grid-cols-7">
                    
                    {/* Chart */}
                    <Card className="md:col-span-4">
                        <CardHeader>
                            <CardTitle>Statistik Perencanaan</CardTitle>
                            <CardDescription>Jumlah pengadaan yang direncanakan per bulan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex h-[300px] w-full items-end gap-2 pt-6">
                                {[8, 14, 10, 18, 12, 22].map((val, i) => (
                                    <div key={i} className="group relative flex flex-1 flex-col items-center justify-end gap-2">
                                        <div className="absolute -top-8 hidden rounded bg-slate-800 px-2 py-1 text-xs text-white group-hover:block z-10 dark:bg-slate-100 dark:text-slate-900">
                                            {val} Pengadaan
                                        </div>
                                        <div 
                                            className="w-full max-w-[40px] rounded-t-md bg-sky-500/80 transition-all hover:bg-sky-600 dark:bg-sky-600/80 dark:hover:bg-sky-500" 
                                            style={{ height: `${(val / 22) * 100}%` }}
                                        />
                                        <span className="text-xs text-muted-foreground">{['Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Active Planning Items */}
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Perencanaan Aktif</CardTitle>
                            <CardDescription>Pengadaan yang tahap perencanannya sedang berjalan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-5">
                                {[
                                    { name: 'Pengadaan Server Data Center', progress: 80, checklist: '8/10' },
                                    { name: 'Pembangunan Gedung Arsip', progress: 35, checklist: '3/10' },
                                    { name: 'Pengadaan Seragam Dinas', progress: 50, checklist: '5/10' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <div className="font-medium text-sm">{item.name}</div>
                                            <Badge variant="secondary" className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300">
                                                {item.checklist} checklist
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

PerencanaDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard Perencana',
            href: '/dashboard',
        },
    ],
});
