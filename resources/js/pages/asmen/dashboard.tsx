import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FolderKanban, Clock, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { dashboard } from '@/routes';

// Custom Progress for local use
const Progress = ({ value, className }: { value: number; className?: string }) => (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}>
        <div className="h-full bg-blue-600 transition-all dark:bg-blue-500" style={{ width: `${value}%` }} />
    </div>
);

// Dummy Data
const dummyPengadaan = [
    { id: 1, name: 'Pengadaan Server Data Center', status: 'Pelaksanaan', progress: 80, date: '10 Okt 2026', color: 'orange' },
    { id: 2, name: 'Pembangunan Gedung Arsip', status: 'Perencanaan', progress: 35, date: '12 Okt 2026', color: 'yellow' },
    { id: 3, name: 'Pengadaaan Perangkat Jaringan', status: 'Selesai', progress: 100, date: '15 Okt 2026', color: 'green' },
    { id: 4, name: 'Peremajaan AC Ruang Rapat', status: 'Perencanaan', progress: 10, date: '16 Okt 2026', color: 'yellow' },
    { id: 5, name: 'Pengadaan Seragam Dinas', status: 'Pelaksanaan', progress: 50, date: '21 Okt 2026', color: 'orange' },
];

export default function AsmenDashboard() {

    const [searchQuery, setSearchQuery] = useState('');

    const filtered = dummyPengadaan.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <>
            <Head title="Dashboard Asmen" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8 bg-gray-50/30 dark:bg-gray-900/10">
                
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Executive Monitor</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Read-only live view of all procurement operations.</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 w-fit self-start md:self-auto py-1 px-3">
                        Asmen View (Read-Only)
                    </Badge>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pengadaan</CardTitle>
                            <FolderKanban className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">124</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Perencanaan</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">32</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-orange-200 dark:border-orange-900/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">Pelaksanaan</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">45</div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-sm border-emerald-200 dark:border-emerald-900/50">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Selesai</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">47</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notifications Alert */}
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm dark:border-red-900/50 dark:bg-red-900/20">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                        <h4 className="font-medium text-red-800 dark:text-red-200">Warning (Read-Only)</h4>
                        <p className="text-sm text-red-600 dark:text-red-300">Kontrak "Pengadaan Server Data Center" akan berakhir dalam 30 hari.</p>
                    </div>
                </div>

                <Card className="shadow-sm">
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between py-4 border-b dark:border-gray-800">
                        <div className="flex items-center gap-2 max-w-sm w-full relative">
                            <Search className="absolute left-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                type="search"
                                placeholder="Cari nama pengadaan..."
                                className="pl-9 bg-gray-50 dark:bg-gray-900 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300 border-b dark:border-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Nama Pengadaan</th>
                                    <th scope="col" className="px-6 py-4">Tanggal Dibuat</th>
                                    <th scope="col" className="px-6 py-4">Status</th>
                                    <th scope="col" className="px-6 py-4">Progress Visual</th>
                                    <th scope="col" className="px-6 py-4 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length > 0 ? filtered.map((item) => (
                                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50 dark:bg-gray-950 border-gray-100 dark:border-gray-800 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className={
                                                item.color === 'yellow' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' :
                                                item.color === 'orange' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800' :
                                                'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                                            }>
                                                {item.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 min-w-[200px]">
                                            <div className="flex items-center gap-3">
                                                <Progress value={item.progress} className="flex-1" />
                                                <span className="text-xs font-semibold w-8 text-right">{item.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="outline" size="sm" className="bg-white" asChild>
                                                <Link href={`/pengadaan/${item.id}`}>Monitor Detail</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Data pengadaan tidak ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </>
    );
}

AsmenDashboard.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Executive Monitor (Asmen)',
            href: '#',
        },
    ],
});
