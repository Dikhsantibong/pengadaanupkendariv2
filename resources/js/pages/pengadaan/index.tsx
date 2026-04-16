import { Head, Link, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { dashboard } from '@/routes';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

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

export default function PengadaanIndex() {

    const [searchQuery, setSearchQuery] = useState('');
    const [namaBaru, setNamaBaru] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filtered = dummyPengadaan.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsOpen(false);
        // Simulate redirect to the new item detail (we just redirect to ID 1 for now)
        router.visit(`/pengadaan/1`);
    };

    return (
        <>
            <Head title="List Pengadaan" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">
                
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Daftar Pengadaan</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Kelola dan monitor proses pengadaan Anda.</p>
                    </div>

                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Pengadaan
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleCreate}>
                                <DialogHeader>
                                    <DialogTitle>Tambah Pengadaan Baru</DialogTitle>
                                    <DialogDescription>
                                        Masukkan nama pekerjaan pengadaan. Proses checklist akan dimulai setelah dibuat.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nama Pekerjaan</Label>
                                        <Input
                                            id="name"
                                            value={namaBaru}
                                            onChange={(e) => setNamaBaru(e.target.value)}
                                            placeholder="Contoh: Pengadaan Laptop Karyawan"
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={!namaBaru}>Buat dan Lanjut</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between py-4">
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
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Nama Pengadaan</th>
                                    <th scope="col" className="px-6 py-3 hidden md:table-cell">Tanggal Dibuat</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Progress</th>
                                    <th scope="col" className="px-6 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length > 0 ? filtered.map((item) => (
                                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 hidden md:table-cell">
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
                                        <td className="px-6 py-4 min-w-[150px]">
                                            <div className="flex items-center gap-2">
                                                <Progress value={item.progress} />
                                                <span className="text-xs font-semibold">{item.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/pengadaan/${item.id}`}>Lihat Detail</Link>
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

PengadaanIndex.layout = () => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'List Pengadaan',
            href: '#',
        },
    ],
});
