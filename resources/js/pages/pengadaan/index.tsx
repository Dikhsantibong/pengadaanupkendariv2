import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Search, Eye } from 'lucide-react';
import { useState } from 'react';

type Pengadaan = {
    id: number;
    nama: string;
    status: 'perencanaan' | 'pelaksanaan' | 'selesai';
    progress: number;
    created_at: string;
    creator?: { name: string };
    checklists_count: number;
    checked_count: number;
};

type Props = {
    pengadaans: Pengadaan[];
    filters: { search?: string; status?: string };
};

const statusColors: Record<string, string> = {
    perencanaan: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    pelaksanaan: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    selesai: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const statusLabels: Record<string, string> = {
    perencanaan: 'Perencanaan',
    pelaksanaan: 'Pelaksanaan',
    selesai: 'Selesai',
};

export default function PengadaanIndex({ pengadaans, filters }: Props) {
    const page = usePage();
    const userRole = (page.props.auth as any)?.user?.role;
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm({ nama: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/pengadaan', {
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
            },
        });
    };

    const handleSearch = () => {
        router.get('/pengadaan', { search: searchQuery, status: statusFilter }, { preserveState: true });
    };

    const handleFilterStatus = (status: string) => {
        setStatusFilter(status);
        router.get('/pengadaan', { search: searchQuery, status }, { preserveState: true });
    };

    return (
        <>
            <Head title="List Pengadaan" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">List Pengadaan</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Kelola semua data pengadaan.</p>
                    </div>
                    {userRole === 'perencana' && (
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-sky-600 hover:bg-sky-700 text-white">
                                    <Plus className="mr-2 h-4 w-4" /> Buat Pengadaan
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Buat Pengadaan Baru</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="nama">Nama Pengadaan</Label>
                                            <Input
                                                id="nama"
                                                value={form.data.nama}
                                                onChange={(e) => form.setData('nama', e.target.value)}
                                                placeholder="Contoh: Pengadaan Server Data Center"
                                                required
                                            />
                                            {form.errors.nama && <p className="text-sm text-red-500">{form.errors.nama}</p>}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={form.processing} className="bg-sky-600 hover:bg-sky-700 text-white">
                                            {form.processing ? 'Menyimpan...' : 'Simpan'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end">
                            <div className="flex-1">
                                <Label htmlFor="search" className="mb-2 block text-sm">Cari Pengadaan</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Cari berdasarkan nama..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant={statusFilter === '' ? 'default' : 'outline'} size="sm" onClick={() => handleFilterStatus('')}>Semua</Button>
                                <Button variant={statusFilter === 'perencanaan' ? 'default' : 'outline'} size="sm" onClick={() => handleFilterStatus('perencanaan')}>Perencanaan</Button>
                                <Button variant={statusFilter === 'pelaksanaan' ? 'default' : 'outline'} size="sm" onClick={() => handleFilterStatus('pelaksanaan')}>Pelaksanaan</Button>
                                <Button variant={statusFilter === 'selesai' ? 'default' : 'outline'} size="sm" onClick={() => handleFilterStatus('selesai')}>Selesai</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengadaan ({pengadaans.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pengadaans.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-lg font-medium">Belum ada data pengadaan</p>
                                <p className="text-sm mt-1">Klik "Buat Pengadaan" untuk memulai.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-muted-foreground">
                                            <th className="px-4 py-3 font-medium">No</th>
                                            <th className="px-4 py-3 font-medium">Nama Pengadaan</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium">Progress</th>
                                            <th className="px-4 py-3 font-medium">Dibuat oleh</th>
                                            <th className="px-4 py-3 font-medium">Tanggal</th>
                                            <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pengadaans.map((item, idx) => (
                                            <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground">{idx + 1}</td>
                                                <td className="px-4 py-3 font-medium">{item.nama}</td>
                                                <td className="px-4 py-3">
                                                    <Badge className={statusColors[item.status]}>
                                                        {statusLabels[item.status]}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                            <div
                                                                className={`h-full transition-all ${
                                                                    item.progress === 100 ? 'bg-emerald-500' :
                                                                    item.progress >= 50 ? 'bg-orange-500' : 'bg-sky-500'
                                                                }`}
                                                                style={{ width: `${item.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-medium text-muted-foreground">{item.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{item.creator?.name || '-'}</td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/pengadaan/${item.id}`}>
                                                            <Eye className="mr-1 h-4 w-4" /> Detail
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

PengadaanIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'List Pengadaan', href: '/pengadaan' },
    ],
});
