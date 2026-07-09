import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Eye, Trash } from 'lucide-react';
import { useState } from 'react';

type PowerPlant = { id: number; name: string };

type Pengadaan = {
    id: number;
    nama: string;
    status: 'perencanaan' | 'pelaksanaan' | 'selesai';
    progress: number;
    created_at: string;
    creator?: { name: string };
    checklists_count: number;
    checked_count: number;
    tujuan_unit?: { name: string } | null;
    metode_pengadaan?: string | null;
};

type Props = {
    pengadaans: Pengadaan[] | {
        data: Pengadaan[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string; metode?: string };
    powerPlants: PowerPlant[];
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

const metodeLabels: Record<string, string> = {
    surat_pesanan: 'Surat Pesanan',
    spk: 'SPK',
    tender: 'Tender',
};

export default function PengadaanIndex({ pengadaans, filters, powerPlants }: Props) {
    const page = usePage();
    const userRole = (page.props.auth as any)?.user?.role;
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [metodeFilter, setMetodeFilter] = useState(filters.metode || '');
    const [isOpen, setIsOpen] = useState(false);
    const [tipeNomor, setTipeNomor] = useState<'pr' | 'po'>('pr');

    const isPaginated = pengadaans && typeof pengadaans === 'object' && 'data' in pengadaans;
    const items = isPaginated ? (pengadaans.data || []) : (pengadaans || []);
    const meta = isPaginated ? {
        current_page: (pengadaans as any).current_page || 1,
        last_page: (pengadaans as any).last_page || 1,
        per_page: (pengadaans as any).per_page || 10,
        total: (pengadaans as any).total || 0,
    } : { current_page: 1, last_page: 1, per_page: items.length, total: items.length };
    const links: { url: string | null; label: string; active: boolean }[] = isPaginated ? ((pengadaans as any).links || []) : [];

    const form = useForm({
        nama: '',
        hpe_nilai: '',
        tujuan_unit_id: '',
        sumber_anggaran: '',
        nomor_prk: '',
        nomor_pr: '',
        nomor_po: '',
        nomor_nota_dinas_manager: '',
        metode_pengadaan: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/pengadaan', {
            onSuccess: () => {
                setIsOpen(false);
                form.reset();
                setTipeNomor('pr');
            },
        });
    };



    const handleSearch = () => {
        router.get('/pengadaan', { search: searchQuery, status: statusFilter, metode: metodeFilter, page: 1 }, { preserveState: true });
    };

    const handleDelete = (id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus pengadaan ini?')) {
            router.delete(`/pengadaan/${id}`);
        }
    };

    const handleFilterStatus = (status: string) => {
        setStatusFilter(status);
        router.get('/pengadaan', { search: searchQuery, status, metode: metodeFilter, page: 1 }, { preserveState: true });
    };

    const handleFilterMetode = (metode: string) => {
        setMetodeFilter(metode);
        router.get('/pengadaan', { search: searchQuery, status: statusFilter, metode, page: 1 }, { preserveState: true });
    };

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState: true });
        }
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
                                        <div className="grid gap-2">
                                            <Label htmlFor="metode_pengadaan">Metode Pengadaan</Label>
                                            <Select
                                                value={form.data.metode_pengadaan}
                                                onValueChange={(value) => form.setData('metode_pengadaan', value)}
                                                required
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Metode" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="surat_pesanan">Surat Pesanan</SelectItem>
                                                    <SelectItem value="spk">SPK</SelectItem>
                                                    <SelectItem value="tender">Tender</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {form.errors.metode_pengadaan && <p className="text-sm text-red-500">{form.errors.metode_pengadaan}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="tujuan_unit_id">Tujuan Unit</Label>
                                            <Select
                                                value={form.data.tujuan_unit_id}
                                                onValueChange={(value) => form.setData('tujuan_unit_id', value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {powerPlants.map((pp) => (
                                                        <SelectItem key={pp.id} value={pp.id.toString()}>{pp.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {form.errors.tujuan_unit_id && <p className="text-sm text-red-500">{form.errors.tujuan_unit_id}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="sumber_anggaran">Sumber Anggaran</Label>
                                            <Select
                                                value={form.data.sumber_anggaran}
                                                onValueChange={(value) => form.setData('sumber_anggaran', value)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih Sumber" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="AO">AO</SelectItem>
                                                    <SelectItem value="AI">AI</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {form.errors.sumber_anggaran && <p className="text-sm text-red-500">{form.errors.sumber_anggaran}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="nomor_prk">Nomor PRK (Nota Dinas Usulan)</Label>
                                            <Input
                                                id="nomor_prk"
                                                value={form.data.nomor_prk}
                                                onChange={(e) => form.setData('nomor_prk', e.target.value)}
                                                placeholder="Nomor PRK..."
                                            />
                                            {form.errors.nomor_prk && <p className="text-sm text-red-500">{form.errors.nomor_prk}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Nomor PR / PO</Label>
                                            <div className="flex gap-2">
                                                <Select value={tipeNomor} onValueChange={(val: 'pr' | 'po') => {
                                                    setTipeNomor(val);
                                                    const currentVal = tipeNomor === 'pr' ? form.data.nomor_pr : form.data.nomor_po;
                                                    form.setData({
                                                        ...form.data,
                                                        nomor_pr: val === 'pr' ? currentVal : '',
                                                        nomor_po: val === 'po' ? currentVal : '',
                                                    });
                                                }}>
                                                    <SelectTrigger className="w-[120px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pr">No. PR</SelectItem>
                                                        <SelectItem value="po">No. PO</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input 
                                                    placeholder={`Masukkan Nomor ${tipeNomor.toUpperCase()}...`}
                                                    value={tipeNomor === 'pr' ? form.data.nomor_pr : form.data.nomor_po}
                                                    onChange={(e) => {
                                                        if (tipeNomor === 'pr') {
                                                            form.setData('nomor_pr', e.target.value);
                                                        } else {
                                                            form.setData('nomor_po', e.target.value);
                                                        }
                                                    }}
                                                    className="flex-1"
                                                />
                                            </div>
                                            {form.errors.nomor_pr && <p className="text-sm text-red-500">{form.errors.nomor_pr}</p>}
                                            {form.errors.nomor_po && <p className="text-sm text-red-500">{form.errors.nomor_po}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="nomor_nota_dinas_manager">Nomor Nota Dinas Manager ke Pengadaan (Evaluasi Dokumen)</Label>
                                            <Input
                                                id="nomor_nota_dinas_manager"
                                                value={form.data.nomor_nota_dinas_manager}
                                                onChange={(e) => form.setData('nomor_nota_dinas_manager', e.target.value)}
                                                placeholder="Nomor nota dinas..."
                                            />
                                            {form.errors.nomor_nota_dinas_manager && <p className="text-sm text-red-500">{form.errors.nomor_nota_dinas_manager}</p>}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="hpe_nilai">Nilai HPE (Anggaran)</Label>
                                            <Input
                                                id="hpe_nilai"
                                                type="number"
                                                value={form.data.hpe_nilai}
                                                onChange={(e) => form.setData('hpe_nilai', e.target.value)}
                                                placeholder="0"
                                            />
                                            {form.errors.hpe_nilai && <p className="text-sm text-red-500">{form.errors.hpe_nilai}</p>}
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
                            <div className="w-full md:w-56">
                                <Label htmlFor="metode_filter" className="mb-2 block text-sm">Metode Pengadaan</Label>
                                <Select
                                    value={metodeFilter}
                                    onValueChange={(value) => handleFilterMetode(value === "all" ? "" : value)}
                                >
                                    <SelectTrigger id="metode_filter" className="w-full">
                                        <SelectValue placeholder="Semua Metode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Metode</SelectItem>
                                        <SelectItem value="surat_pesanan">Surat Pesanan</SelectItem>
                                        <SelectItem value="spk">SPK</SelectItem>
                                        <SelectItem value="tender">Tender</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label className="mb-2 block text-sm opacity-0 hidden md:block">Status</Label>
                                <div className="flex gap-2">
                                    <Button variant={statusFilter === '' ? 'default' : 'outline'} size="sm" onClick={() => handleFilterStatus('')}>Semua</Button>
                                    <Button variant={statusFilter === 'perencanaan' ? 'default' : 'outline'} size="sm" onClick={() => handleFilterStatus('perencanaan')}>Perencanaan</Button>
                                    <Button variant={statusFilter === 'pelaksanaan' ? 'default' : 'outline'} size="sm" onClick={() => handleFilterStatus('pelaksanaan')}>Pelaksanaan</Button>
                                    <Button variant={statusFilter === 'selesai' ? 'default' : 'outline'} size="sm" onClick={() => handleFilterStatus('selesai')}>Selesai</Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daftar Pengadaan ({meta?.total ?? items.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {items.length === 0 ? (
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
                                            <th className="px-4 py-3 font-medium">Metode</th>
                                            <th className="px-4 py-3 font-medium">Unit</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium">Progress</th>
                                            <th className="px-4 py-3 font-medium">Dibuat oleh</th>
                                            <th className="px-4 py-3 font-medium">Tanggal</th>
                                            <th className="px-4 py-3 font-medium text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, idx) => (
                                            <tr key={item.id} className="border-b hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-3 text-muted-foreground">{(meta.current_page - 1) * meta.per_page + idx + 1}</td>
                                                <td className="px-4 py-3 font-medium">{item.nama}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{item.metode_pengadaan ? metodeLabels[item.metode_pengadaan] : '-'}</td>
                                                <td className="px-4 py-3 text-muted-foreground">{item.tujuan_unit?.name || '-'}</td>
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
                                                <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/pengadaan/${item.id}`}>
                                                            <Eye className="mr-1 h-4 w-4" /> Detail
                                                        </Link>
                                                    </Button>
                                                    {(userRole === 'perencana' || userRole === 'pelaksana') && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50">
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {(meta?.last_page ?? 1) > 1 && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Menampilkan {(((meta?.current_page ?? 1) - 1) * (meta?.per_page ?? 10)) + 1} sampai {Math.min((meta?.current_page ?? 1) * (meta?.per_page ?? 10), meta?.total ?? 0)} dari {meta?.total ?? 0} data
                                </div>
                                <div className="flex flex-wrap items-center gap-1">
                                    {links.map((link: { url: string | null; label: string; active: boolean }, idx: number) => {
                                        let label = link.label;
                                        if (label.includes('Previous')) label = '&laquo; Sebelumnya';
                                        if (label.includes('Next')) label = 'Selanjutnya &raquo;';
                                        
                                        return (
                                            <Button
                                                key={idx}
                                                variant={link.active ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => handlePageChange(link.url)}
                                                disabled={!link.url}
                                                className="min-w-[40px]"
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: label }} />
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
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
