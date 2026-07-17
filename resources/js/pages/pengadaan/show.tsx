import { Head, router, usePage, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Clock, FileText, Lock, TrendingUp, Wrench, Users, Calendar, Landmark, AlertTriangle, Wallet, Building2, Receipt, ExternalLink, Link2, AlertCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

type ChecklistItem = {
    id: number;
    nama: string;
    fase: 'perencanaan' | 'pelaksanaan';
    is_checked: boolean;
    is_optional: boolean;
    checked_at: string | null;
    checked_by_user?: { name: string } | null;
};

type AsmenUser = { id: number; name: string; role: string };

type PowerPlant = { id: number; name: string };

type PengadaanData = {
    id: number;
    nama: string;
    status: 'perencanaan' | 'pelaksanaan' | 'selesai';
    progress: number;
    created_at: string;
    creator?: { name: string };
    checklists: ChecklistItem[];
    direksi_users: AsmenUser[];
    hpe_nilai: string | null;
    hps_nilai: string | null;
    nilai_terkontrak: string | null;
    tujuan_unit_id: number | null;
    tujuan_unit?: { name: string } | null;
    sumber_anggaran: string | null;
    nomor_prk: string | null;
    nomor_pr: string | null;
    nomor_po: string | null;
    nomor_po: string | null;
    nomor_nota_dinas_manager: string | null;
    nomor_nota_dinas_manager: string | null;
    metode_pengadaan: string | null;
    nomor_kontrak: string | null;
    vendor_pelaksana: string | null;
    jenis_kontrak: string | null;
    tahap_bayar: string | null;
    tanggal_selesai: string | null;
    user_departemen: string | null;
    progress_status: string | null;
    pic: string | null;
    amandemen_keterangan: string | null;
    amandemen_tanggal: string | null;
    amandemen_tanggal_mulai: string | null;
    jaminan_bank_nama: string | null;
    jaminan_bank_nomor: string | null;
    jaminan_bank_nilai: string | null;
    jaminan_bank_berlaku_mulai: string | null;
    jaminan_bank_berlaku_sampai: string | null;
    pemeliharaan_durasi_hari: number | null;
    pemeliharaan_mulai: string | null;
    pemeliharaan_selesai: string | null;
    pemeliharaan_keterangan: string | null;
};

type Props = { 
    pengadaan: PengadaanData; 
    asmenUsers: AsmenUser[]; 
    powerPlants: PowerPlant[];
    nextcloudLinkPerencanaan: string;
    nextcloudLinkPelaksanaan: string;
};

const statusColors: Record<string, string> = {
    perencanaan: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    pelaksanaan: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    selesai: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
};
const statusLabels: Record<string, string> = { perencanaan: 'Perencanaan', pelaksanaan: 'Pelaksanaan', selesai: 'Selesai' };
const statusIcons: Record<string, any> = { perencanaan: Clock, pelaksanaan: TrendingUp, selesai: CheckCircle2 };

const asmenRoleLabels: Record<string, string> = {
    asmen_pemeliharaan: 'Pemeliharaan', asmen_operasi: 'Operasi', asmen_engineering: 'Engineering',
    asmen_business_support: 'Business Support', asmen_k3: 'Team Leader K3', asmen_lingkungan: 'Team Leader Lingkungan',
};

const metodeLabels: Record<string, string> = { surat_pesanan: 'Surat Pesanan', spk: 'SPK', tender: 'Tender' };
const jenisKontrakLabels: Record<string, string> = { lump_sum: 'Lump Sum', khs: 'KHS' };

function formatRupiah(value: string | number | null): string {
    if (!value) return '-';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
}

function DireksiSection({ pengadaan, asmenUsers, userRole }: { pengadaan: PengadaanData; asmenUsers: AsmenUser[]; userRole: string }) {
    const [selected, setSelected] = useState<number[]>(pengadaan.direksi_users.map(u => u.id));
    const [saving, setSaving] = useState(false);
    const toggleUser = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    const handleSave = () => {
        setSaving(true);
        router.post(`/pengadaan/${pengadaan.id}/direksi`, { direksi_ids: selected }, { preserveScroll: true, onFinish: () => setSaving(false) });
    };
    const canEdit = userRole === 'perencana';

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-600" />Direksi Pekerjaan</CardTitle>
                <CardDescription>Penunjukan Asman sebagai direksi pekerjaan</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {asmenUsers.map(user => {
                        let displayName = user.name.replace(/Asmen/gi, 'Asman');
                        if (displayName.toLowerCase() === 'asman lingkungan') displayName = 'Team Leader Lingkungan';
                        if (displayName.toLowerCase() === 'asman k3') displayName = 'Team Leader K3';
                        return (
                            <div key={user.id} className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${selected.includes(user.id) ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30' : 'hover:bg-muted/50'}`}>
                                <Checkbox id={`dir-${user.id}`} checked={selected.includes(user.id)} disabled={!canEdit} onCheckedChange={() => toggleUser(user.id)} />
                                <label htmlFor={`dir-${user.id}`} className="flex-1 cursor-pointer select-none">
                                    <div className="font-medium text-sm">{displayName}</div>
                                    <div className="text-xs text-muted-foreground">{asmenRoleLabels[user.role] || user.role}</div>
                                </label>
                            </div>
                        );
                    })}
                </div>
                {canEdit && (
                    <Button onClick={handleSave} disabled={saving} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                        {saving ? 'Menyimpan...' : 'Simpan Direksi'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function PerencanaanDataSection({ pengadaan, powerPlants, userRole }: { pengadaan: PengadaanData; powerPlants: PowerPlant[]; userRole: string }) {
    const canEdit = userRole === 'perencana';
    const form = useForm({
        hpe_nilai: pengadaan.hpe_nilai || '',
        tujuan_unit_id: pengadaan.tujuan_unit_id?.toString() || '',
        sumber_anggaran: pengadaan.sumber_anggaran || '',
        nomor_prk: pengadaan.nomor_prk || '',
        nomor_pr: pengadaan.nomor_pr || '',
        nomor_po: pengadaan.nomor_po || '',
        nomor_nota_dinas_manager: pengadaan.nomor_nota_dinas_manager || '',
        metode_pengadaan: pengadaan.metode_pengadaan || '',
        user_departemen: pengadaan.user_departemen || '',
        progress_status: pengadaan.progress_status || '',
        pic: pengadaan.pic || '',
    });

    const [tipeNomor, setTipeNomor] = useState<'pr' | 'po'>(pengadaan.nomor_po ? 'po' : 'pr');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/pengadaan/${pengadaan.id}`, { preserveScroll: true });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-sky-600" />Data Perencanaan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div><Label>Metode Pengadaan</Label>
                            <Select
                                value={form.data.metode_pengadaan}
                                onValueChange={(value) => form.setData('metode_pengadaan', value)}
                                disabled={!canEdit}
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
                        </div>
                        <div><Label>Tujuan Unit</Label>
                            <Select
                                value={form.data.tujuan_unit_id}
                                onValueChange={(value) => form.setData('tujuan_unit_id', value)}
                                disabled={!canEdit}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Unit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {powerPlants.map(pp => (
                                        <SelectItem key={pp.id} value={pp.id.toString()}>{pp.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>Sumber Anggaran</Label>
                            <Select
                                value={form.data.sumber_anggaran}
                                onValueChange={(value) => form.setData('sumber_anggaran', value)}
                                disabled={!canEdit}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Sumber" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AO">AO</SelectItem>
                                    <SelectItem value="AI">AI</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>User</Label>
                            <Select
                                value={form.data.user_departemen}
                                onValueChange={(value) => form.setData('user_departemen', value)}
                                disabled={!canEdit}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih User" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Operasi">Operasi</SelectItem>
                                    <SelectItem value="Pemeliharaan">Pemeliharaan</SelectItem>
                                    <SelectItem value="K3kemananan">K3kemananan</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Lingkungan">Lingkungan</SelectItem>
                                    <SelectItem value="Businnes support">Businnes support</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>PIC</Label>
                            <Select
                                value={form.data.pic}
                                onValueChange={(value) => form.setData('pic', value)}
                                disabled={!canEdit}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih PIC" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Hikmatullah">Hikmatullah</SelectItem>
                                    <SelectItem value="Bastial">Bastial</SelectItem>
                                    <SelectItem value="Iklan nano">Iklan nano</SelectItem>
                                    <SelectItem value="Putu wisna">Putu wisna</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>Progress Status</Label>
                            <Select
                                value={form.data.progress_status}
                                onValueChange={(value) => form.setData('progress_status', value)}
                                disabled={!canEdit}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Progress" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Batal">Batal</SelectItem>
                                    <SelectItem value="Inisiasi laksdan">Inisiasi laksdan</SelectItem>
                                    <SelectItem value="Penyusunan rks">Penyusunan rks</SelectItem>
                                    <SelectItem value="Kelengkapan dokumen">Kelengkapan dokumen</SelectItem>
                                    <SelectItem value="Penawaran harga">Penawaran harga</SelectItem>
                                    <SelectItem value="Disposisi ams">Disposisi ams</SelectItem>
                                    <SelectItem value="Proses validasi">Proses validasi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>Nomor PRK (Nota Dinas Usulan)</Label><Input value={form.data.nomor_prk} onChange={e => form.setData('nomor_prk', e.target.value)} disabled={!canEdit} placeholder="Nomor PRK..." /></div>
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
                                }} disabled={!canEdit}>
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
                                    disabled={!canEdit}
                                    className="flex-1"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-2"><Label>Nomor Nota Dinas Manager ke Pengadaan (Evaluasi Dokumen)</Label><Input value={form.data.nomor_nota_dinas_manager} onChange={e => form.setData('nomor_nota_dinas_manager', e.target.value)} disabled={!canEdit} placeholder="Nomor nota dinas..." /></div>
                        <div><Label>Nilai HPE (Anggaran)</Label><Input type="number" value={form.data.hpe_nilai} onChange={e => form.setData('hpe_nilai', e.target.value)} disabled={!canEdit} placeholder="0" /></div>
                        {pengadaan.hpe_nilai && <div className="flex items-end"><span className="text-sm font-medium text-emerald-700">{formatRupiah(pengadaan.hpe_nilai)}</span></div>}
                    </div>
                </CardContent>
            </Card>
            {canEdit && (
                <Button type="submit" disabled={form.processing} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                    {form.processing ? 'Menyimpan...' : 'Simpan Data Perencanaan'}
                </Button>
            )}
        </form>
    );
}

function PelaksanaanDataSection({ pengadaan, userRole }: { pengadaan: PengadaanData; userRole: string }) {
    const canEdit = userRole === 'pelaksana';
    const form = useForm({
        hps_nilai: pengadaan.hps_nilai || '',
        nomor_kontrak: pengadaan.nomor_kontrak || '',
        vendor_pelaksana: pengadaan.vendor_pelaksana || '',
        jenis_kontrak: pengadaan.jenis_kontrak || '',
        tahap_bayar: pengadaan.tahap_bayar || '',
        nilai_terkontrak: pengadaan.nilai_terkontrak || '',
        tanggal_mulai: pengadaan.tanggal_mulai || '',
        tanggal_selesai: pengadaan.tanggal_selesai || '',
        amandemen_keterangan: pengadaan.amandemen_keterangan || '',
        amandemen_tanggal: pengadaan.amandemen_tanggal || '',
        amandemen_tanggal_mulai: pengadaan.amandemen_tanggal_mulai || '',
        jaminan_bank_nama: pengadaan.jaminan_bank_nama || '',
        jaminan_bank_nomor: pengadaan.jaminan_bank_nomor || '',
        jaminan_bank_nilai: pengadaan.jaminan_bank_nilai || '',
        jaminan_bank_berlaku_mulai: pengadaan.jaminan_bank_berlaku_mulai || '',
        jaminan_bank_berlaku_sampai: pengadaan.jaminan_bank_berlaku_sampai || '',
        pemeliharaan_durasi_hari: pengadaan.pemeliharaan_durasi_hari?.toString() || '',
        pemeliharaan_keterangan: pengadaan.pemeliharaan_keterangan || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/pengadaan/${pengadaan.id}`, { preserveScroll: true });
    };

    const deadlineWarning = pengadaan.tanggal_selesai && new Date(pengadaan.tanggal_selesai) > new Date() &&
        Math.ceil((new Date(pengadaan.tanggal_selesai).getTime() - Date.now()) / 86400000) <= 7;

    const amandemen14DayWarning = pengadaan.tanggal_selesai &&
        Math.ceil((new Date(pengadaan.tanggal_selesai).getTime() - Date.now()) / 86400000) <= 14 &&
        Math.ceil((new Date(pengadaan.tanggal_selesai).getTime() - Date.now()) / 86400000) > 0;

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {deadlineWarning && (
                <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                        <h4 className="font-medium text-red-800 dark:text-red-200">Peringatan Deadline</h4>
                        <p className="text-sm text-red-600 dark:text-red-300">Rentang waktu pekerjaan akan berakhir dalam {Math.ceil((new Date(pengadaan.tanggal_selesai!).getTime() - Date.now()) / 86400000)} hari!</p>
                    </div>
                </div>
            )}

            {/* Kontrak & Keuangan */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-emerald-600" />Kontrak & Keuangan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div><Label>Nilai HPS</Label><Input type="number" value={form.data.hps_nilai} onChange={e => form.setData('hps_nilai', e.target.value)} disabled={!canEdit} placeholder="0" /></div>
                        {pengadaan.hps_nilai && <div className="flex items-end"><span className="text-sm font-medium text-emerald-700">{formatRupiah(pengadaan.hps_nilai)}</span></div>}
                        <div><Label>Nomor Kontrak</Label><Input value={form.data.nomor_kontrak} onChange={e => form.setData('nomor_kontrak', e.target.value)} disabled={!canEdit} placeholder="Nomor kontrak..." /></div>
                        <div><Label>Vendor Pelaksana Pekerjaan</Label><Input value={form.data.vendor_pelaksana} onChange={e => form.setData('vendor_pelaksana', e.target.value)} disabled={!canEdit} placeholder="Nama vendor..." /></div>
                        <div><Label>Jenis Kontrak</Label>
                            <Select
                                value={form.data.jenis_kontrak}
                                onValueChange={(value) => form.setData('jenis_kontrak', value)}
                                disabled={!canEdit}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Jenis" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lump_sum">Lump Sum</SelectItem>
                                    <SelectItem value="khs">KHS</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div><Label>Tahap Bayar</Label><Input value={form.data.tahap_bayar} onChange={e => form.setData('tahap_bayar', e.target.value)} disabled={!canEdit} placeholder="Tahap bayar..." /></div>
                        <div><Label>Nilai Terkontrak</Label><Input type="number" value={form.data.nilai_terkontrak} onChange={e => form.setData('nilai_terkontrak', e.target.value)} disabled={!canEdit} placeholder="0" /></div>
                        {pengadaan.nilai_terkontrak && <div className="flex items-end"><span className="text-sm font-medium text-emerald-700">{formatRupiah(pengadaan.nilai_terkontrak)}</span></div>}
                    </div>
                </CardContent>
            </Card>

            {/* Jaminan Bank */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Landmark className="h-5 w-5 text-purple-600" />Jaminan Bank <span className="text-xs font-normal text-muted-foreground">(Opsional)</span></CardTitle></CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div><Label>Nama Bank</Label><Input value={form.data.jaminan_bank_nama} onChange={e => form.setData('jaminan_bank_nama', e.target.value)} disabled={!canEdit} placeholder="Nama bank penerbit" /></div>
                        <div><Label>Nomor Jaminan</Label><Input value={form.data.jaminan_bank_nomor} onChange={e => form.setData('jaminan_bank_nomor', e.target.value)} disabled={!canEdit} placeholder="Nomor surat jaminan" /></div>
                        <div><Label>Nilai Jaminan (Rp)</Label><Input type="number" value={form.data.jaminan_bank_nilai} onChange={e => form.setData('jaminan_bank_nilai', e.target.value)} disabled={!canEdit} placeholder="0" /></div>
                        <div><Label>Berlaku Mulai</Label><Input type="date" value={form.data.jaminan_bank_berlaku_mulai} onChange={e => form.setData('jaminan_bank_berlaku_mulai', e.target.value)} disabled={!canEdit} /></div>
                        <div><Label>Berlaku Sampai</Label><Input type="date" value={form.data.jaminan_bank_berlaku_sampai} onChange={e => form.setData('jaminan_bank_berlaku_sampai', e.target.value)} disabled={!canEdit} /></div>
                    </div>
                </CardContent>
            </Card>

            {/* Rentang Waktu */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-600" />Rentang Waktu</CardTitle></CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div><Label>Tanggal Mulai</Label><Input type="date" value={form.data.tanggal_mulai} onChange={e => form.setData('tanggal_mulai', e.target.value)} disabled={!canEdit} /></div>
                        <div><Label>Tanggal Selesai</Label><Input type="date" value={form.data.tanggal_selesai} onChange={e => form.setData('tanggal_selesai', e.target.value)} disabled={!canEdit} /></div>
                    </div>
                </CardContent>
            </Card>

            {/* Amandemen */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-amber-600" />Amandemen <span className="text-xs font-normal text-muted-foreground">(Opsional)</span></CardTitle>
                    <CardDescription>Amandemen harus dibuat maksimal 14 hari sebelum kontrak berakhir</CardDescription>
                </CardHeader>
                <CardContent>
                    {amandemen14DayWarning && (
                        <div className="mb-4 flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-900/20">
                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            <p className="text-sm text-amber-700 dark:text-amber-300">Kontrak akan berakhir dalam {Math.ceil((new Date(pengadaan.tanggal_selesai!).getTime() - Date.now()) / 86400000)} hari. Segera buat amandemen jika diperlukan.</p>
                        </div>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2"><Label>Keterangan Amandemen</Label><Textarea value={form.data.amandemen_keterangan} onChange={e => form.setData('amandemen_keterangan', e.target.value)} disabled={!canEdit} placeholder="Keterangan amandemen..." rows={3} /></div>
                        <div><Label>Tanggal Awal Amandemen</Label><Input type="date" value={form.data.amandemen_tanggal_mulai} onChange={e => form.setData('amandemen_tanggal_mulai', e.target.value)} disabled={!canEdit} /></div>
                        <div><Label>Tanggal Akhir Amandemen</Label><Input type="date" value={form.data.amandemen_tanggal} onChange={e => form.setData('amandemen_tanggal', e.target.value)} disabled={!canEdit} /></div>
                    </div>
                </CardContent>
            </Card>

            {/* Pemeliharaan */}
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="h-5 w-5 text-teal-600" />Pemeliharaan <span className="text-xs font-normal text-muted-foreground">(Opsional - input dalam HARI)</span></CardTitle></CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div><Label>Durasi Pemeliharaan (Hari)</Label><Input type="number" min="1" value={form.data.pemeliharaan_durasi_hari} onChange={e => form.setData('pemeliharaan_durasi_hari', e.target.value)} disabled={!canEdit} placeholder="Contoh: 90" /></div>
                        <div className="flex items-end">
                            {pengadaan.pemeliharaan_mulai && pengadaan.pemeliharaan_selesai && (
                                <div className="text-sm text-muted-foreground">
                                    <span className="font-medium">Periode:</span> {new Date(pengadaan.pemeliharaan_mulai).toLocaleDateString('id-ID')} - {new Date(pengadaan.pemeliharaan_selesai).toLocaleDateString('id-ID')}
                                </div>
                            )}
                        </div>
                        <div className="sm:col-span-2"><Label>Keterangan Pemeliharaan</Label><Textarea value={form.data.pemeliharaan_keterangan} onChange={e => form.setData('pemeliharaan_keterangan', e.target.value)} disabled={!canEdit} placeholder="Catatan pemeliharaan..." rows={2} /></div>
                    </div>
                </CardContent>
            </Card>

            {canEdit && (
                <Button type="submit" disabled={form.processing} className="w-full bg-sky-600 hover:bg-sky-700 text-white">
                    {form.processing ? 'Menyimpan...' : 'Simpan Data Pelaksanaan'}
                </Button>
            )}
        </form>
    );
}

export default function PengadaanShow({ pengadaan, asmenUsers, powerPlants, nextcloudLinkPerencanaan, nextcloudLinkPelaksanaan }: Props) {
    const page = usePage();
    const userRole = (page.props.auth as any)?.user?.role;

    const perencanaanItems = pengadaan.checklists.filter(c => c.fase === 'perencanaan');
    const pelaksanaanItems = pengadaan.checklists.filter(c => c.fase === 'pelaksanaan');

    const perencanaanChecked = perencanaanItems.filter(c => c.is_checked).length;
    const pelaksanaanChecked = pelaksanaanItems.filter(c => c.is_checked).length;

    const handleToggle = (checklistId: number, isCurrentlyChecked: boolean) => {
        router.post(`/pengadaan/${pengadaan.id}/checklist/${checklistId}/toggle`, {}, { preserveScroll: true });
    };

    const canTogglePerencanaan = (userRole === 'perencana' && pengadaan.status === 'perencanaan');
    const canTogglePelaksanaan = (userRole === 'pelaksana' && pengadaan.status === 'pelaksanaan');

    const StatusIcon = statusIcons[pengadaan.status];

    const nilaiSaving = pengadaan.hpe_nilai && pengadaan.nilai_terkontrak
        ? parseFloat(pengadaan.hpe_nilai) - parseFloat(pengadaan.nilai_terkontrak)
        : null;

    return (
        <>
            <Head title={`Detail - ${pengadaan.nama}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{pengadaan.nama}</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Dibuat oleh <span className="font-medium">{pengadaan.creator?.name}</span> pada{' '}
                            {new Date(pengadaan.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                            {pengadaan.metode_pengadaan && <span><span className="font-medium">Metode:</span> {metodeLabels[pengadaan.metode_pengadaan]}</span>}
                            {pengadaan.tujuan_unit && <span><span className="font-medium">Unit:</span> {pengadaan.tujuan_unit.name}</span>}
                            {pengadaan.sumber_anggaran && <span><span className="font-medium">Sumber:</span> {pengadaan.sumber_anggaran}</span>}
                            {pengadaan.nomor_prk && <span><span className="font-medium">PRK:</span> {pengadaan.nomor_prk}</span>}
                            {pengadaan.nomor_pr && <span><span className="font-medium">PR:</span> {pengadaan.nomor_pr}</span>}
                            {pengadaan.nomor_po && <span><span className="font-medium">PO:</span> {pengadaan.nomor_po}</span>}
                        </div>
                        {pengadaan.direksi_users.length > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">
                                <span className="font-medium">Direksi:</span> {pengadaan.direksi_users.map(u => u.name).join(', ')}
                            </p>
                        )}
                    </div>
                    <Badge className={`${statusColors[pengadaan.status]} px-3 py-1 text-sm`}><StatusIcon className="mr-1.5 h-4 w-4" />{statusLabels[pengadaan.status]}</Badge>
                </div>

                {/* Nilai Saving Card */}
                {nilaiSaving !== null && (
                    <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <Wallet className="h-6 w-6 text-emerald-600" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Nilai Saving (HPE - Kontrak)</p>
                                    <p className="text-2xl font-bold text-emerald-700">{formatRupiah(nilaiSaving)}</p>
                                </div>
                                <div className="ml-auto text-right text-sm text-muted-foreground">
                                    <p>HPE: {formatRupiah(pengadaan.hpe_nilai)}</p>
                                    <p>Kontrak: {formatRupiah(pengadaan.nilai_terkontrak)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Progress */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">Progress Keseluruhan</span>
                            <span className="text-2xl font-bold">{pengadaan.progress}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className={`h-full transition-all duration-500 ${pengadaan.progress === 100 ? 'bg-emerald-500' : pengadaan.progress >= 50 ? 'bg-orange-500' : 'bg-sky-500'}`} style={{ width: `${pengadaan.progress}%` }} />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>Perencanaan: {perencanaanChecked}/{perencanaanItems.length}</span>
                            <span>Pelaksanaan: {pelaksanaanChecked}/{pelaksanaanItems.length}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Direksi */}
                <DireksiSection pengadaan={pengadaan} asmenUsers={asmenUsers} userRole={userRole} />

                {/* Data Perencanaan (always visible) */}
                <PerencanaanDataSection pengadaan={pengadaan} powerPlants={powerPlants} userRole={userRole} />

                {/* Checklists - 2 columns */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Perencanaan */}
                    <Card className={pengadaan.status === 'perencanaan' ? 'ring-2 ring-sky-500/30' : ''}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-sky-600" />Checklist Perencanaan</CardTitle>
                                    <CardDescription className="mt-1">{perencanaanChecked}/{perencanaanItems.length} item selesai</CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    {nextcloudLinkPerencanaan && (
                                        <a href={nextcloudLinkPerencanaan} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline bg-sky-50 dark:bg-sky-900/30 px-3 py-1.5 rounded-md transition-colors border border-sky-100 dark:border-sky-800">
                                            <Link2 className="h-3.5 w-3.5" /> Buka Nextcloud
                                        </a>
                                    )}
                                    {perencanaanChecked === perencanaanItems.length && perencanaanItems.length > 0 && (
                                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"><CheckCircle2 className="mr-1 h-3 w-3" />Selesai</Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1">
                                {perencanaanItems.map((item, idx) => (
                                    <div key={item.id} className="flex flex-col">
                                        <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${item.is_checked ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'hover:bg-muted/50'}`}>
                                            <Checkbox id={`p-${item.id}`} checked={item.is_checked} disabled={!canTogglePerencanaan} onCheckedChange={() => handleToggle(item.id, item.is_checked)} />
                                            <div className="flex-1 min-w-0">
                                                <label htmlFor={`p-${item.id}`} className={`text-sm cursor-pointer select-none block ${item.is_checked ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                                                    {idx + 1}. {item.nama}
                                                    {item.is_optional && (
                                                        <span className="text-xs text-muted-foreground font-normal ml-1">(Opsional)</span>
                                                    )}
                                                </label>
                                            </div>
                                            {!canTogglePerencanaan && !item.is_checked && pengadaan.status !== 'perencanaan' && <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pelaksanaan */}
                    <Card className={pengadaan.status === 'pelaksanaan' ? 'ring-2 ring-orange-500/30' : ''}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-orange-600" />Checklist Pelaksanaan</CardTitle>
                                    <CardDescription className="mt-1">{pelaksanaanChecked}/{pelaksanaanItems.length} item selesai</CardDescription>
                                </div>
                                <div className="flex items-center gap-3">
                                    {nextcloudLinkPelaksanaan && (
                                        <a href={nextcloudLinkPelaksanaan} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline bg-orange-50 dark:bg-orange-900/30 px-3 py-1.5 rounded-md transition-colors border border-orange-100 dark:border-orange-800">
                                            <Link2 className="h-3.5 w-3.5" /> Buka Nextcloud
                                        </a>
                                    )}
                                    {pelaksanaanChecked === pelaksanaanItems.length && pelaksanaanItems.length > 0 && (
                                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"><CheckCircle2 className="mr-1 h-3 w-3" />Selesai</Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {pengadaan.status === 'perencanaan' ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                    <Lock className="h-8 w-8 mb-3 opacity-40" /><p className="font-medium">Checklist Terkunci</p><p className="text-xs mt-1">Selesaikan semua checklist Perencanaan terlebih dahulu.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {pelaksanaanItems.map((item, idx) => (
                                        <div key={item.id} className="flex flex-col">
                                            <div className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${item.is_checked ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'hover:bg-muted/50'}`}>
                                                <Checkbox id={`e-${item.id}`} checked={item.is_checked} disabled={!canTogglePelaksanaan} onCheckedChange={() => handleToggle(item.id, item.is_checked)} />
                                                <div className="flex-1 min-w-0">
                                                    <label htmlFor={`e-${item.id}`} className={`text-sm cursor-pointer select-none block ${item.is_checked ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                                                        {idx + 1}. {item.nama}
                                                        {item.is_optional && (
                                                            <span className="text-xs text-muted-foreground font-normal ml-1">(Opsional)</span>
                                                        )}
                                                    </label>
                                                </div>
                                                {item.is_checked && item.checked_by_user && <span className="text-xs text-muted-foreground whitespace-nowrap">oleh {item.checked_by_user.name}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Pelaksanaan Data Forms */}
                {pengadaan.status !== 'perencanaan' && <PelaksanaanDataSection pengadaan={pengadaan} userRole={userRole} />}
            </div>
        </>
    );
}

PengadaanShow.layout = () => ({
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'List Pengadaan', href: '/pengadaan' },
        { title: 'Detail', href: '#' },
    ],
});
