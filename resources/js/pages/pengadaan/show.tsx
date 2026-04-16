import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import { useState, useMemo } from 'react';

// Custom Progress for local use
const Progress = ({ value, className }: { value: number; className?: string }) => (
    <div className={`relative h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${className}`}>
        <div className="h-full bg-blue-600 transition-all dark:bg-blue-500" style={{ width: `${value}%` }} />
    </div>
);

const PERENCANAAN_ITEMS = [
    { id: 'nota_dinas', label: 'Nota Dinas Usulan' },
    { id: 'tor', label: 'TOR' },
    { id: 'rab', label: 'RAB' },
    { id: 'penawaran', label: 'Penawaran' },
    { id: 'csms', label: 'CSMS' },
    { id: 'nd_perintah', label: 'Nota Dinas Perintah Pekerjaan' },
    { id: 'hpe', label: 'HPE' },
    { id: 'upb', label: 'UPB' },
    { id: 'rks', label: 'RKS' },
    { id: 'smart_scm', label: 'Smart SCM' },
    { id: 'pr_ro', label: 'PR / RO' },
];

const PELAKSANAAN_ITEMS = [
    { id: 'evaluasi', label: 'Evaluasi Dokumen' },
    { id: 'hps', label: 'Penyusunan HPS' },
    { id: 'progress', label: 'Progress Pengadaan' },
    { id: 'ba', label: 'Berita Acara' },
    { id: 'susun_kontrak', label: 'Penyusunan Kontrak' },
    { id: 'po', label: 'Purchase Order' },
    { id: 'kontrak', label: 'Kontrak' },
    { id: 'durasi', label: 'Durasi Pekerjaan' },
    { id: 'amandemen', label: 'Amandemen' },
];

export default function PengadaanShow() {
    // Initial state: let's pretend some are already checked
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
        'nota_dinas': true,
        'tor': true,
        'rab': true,
    });

    const totalItems = PERENCANAAN_ITEMS.length + PELAKSANAAN_ITEMS.length;
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    const progressPercent = Math.round((checkedCount / totalItems) * 100);

    const isPerencanaanDone = PERENCANAAN_ITEMS.every(item => checkedItems[item.id]);
    const isPelaksanaanDone = PELAKSANAAN_ITEMS.every(item => checkedItems[item.id]);

    const status = useMemo(() => {
        if (checkedCount === 0) return 'Dibuat';
        if (progressPercent === 100) return 'Selesai';
        if (isPerencanaanDone) return 'Pelaksanaan';
        return 'Perencanaan';
    }, [checkedCount, progressPercent, isPerencanaanDone]);

    const statusColor = useMemo(() => {
        if (status === 'Selesai') return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400';
        if (status === 'Pelaksanaan') return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
        if (status === 'Perencanaan') return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400';
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
    }, [status]);

    const handleToggle = (id: string, checked: boolean) => {
        setCheckedItems(prev => ({
            ...prev,
            [id]: checked
        }));
    };

    const todayStr = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date());

    return (
        <>
            <Head title="Detail Pengadaan" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">
                
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between border-b pb-6 dark:border-gray-800">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Pengadaan Server Data Center</h1>
                            <Badge variant="outline" className={statusColor}>
                                {status}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Dibuat pada: 10 Okt 2026</p>
                    </div>

                    <div className="flex flex-col w-full md:w-64 gap-2 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex justify-between items-center text-sm font-medium">
                            <span className="text-gray-600 dark:text-gray-300">Progress Keseluruhan</span>
                            <span className="text-blue-600 dark:text-blue-400 text-lg">{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} />
                        <p className="text-xs text-gray-500 text-right mt-1">{checkedCount} dari {totalItems} selesai</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Perencanaan */}
                    <Card className={`transition-all duration-300 ${isPerencanaanDone ? 'opacity-80' : 'ring-2 ring-blue-500/20'}`}>
                        <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs text-white ${isPerencanaanDone ? 'bg-emerald-500' : 'bg-blue-500'}`}>1</span>
                                Proses Perencanaan
                            </CardTitle>
                            <CardDescription>Tahap awal persiapan dokumen teknis dan administratif</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4">
                                {PERENCANAAN_ITEMS.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 group">
                                        <Checkbox 
                                            id={item.id} 
                                            checked={!!checkedItems[item.id]}
                                            onCheckedChange={(c) => handleToggle(item.id, c as boolean)}
                                            className="mt-1 h-5 w-5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                        />
                                        <div className="grid gap-1.5 flex-1">
                                            <Label 
                                                htmlFor={item.id} 
                                                className={`text-sm font-medium leading-none cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${checkedItems[item.id] ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
                                            >
                                                {item.label}
                                            </Label>
                                            {checkedItems[item.id] && (
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 opacity-80">Selesai pada {todayStr}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pelaksanaan */}
                    <Card className={`transition-all duration-300 ${!isPerencanaanDone ? 'opacity-60 grayscale-[30%]' : 'ring-2 ring-blue-500/20'} ${isPelaksanaanDone ? 'opacity-80 grayscale-0 ring-0' : ''}`}>
                        <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800/50">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs text-white ${isPelaksanaanDone ? 'bg-emerald-500' : (!isPerencanaanDone ? 'bg-gray-400' : 'bg-blue-500')}`}>2</span>
                                Proses Pelaksanaan
                            </CardTitle>
                            <CardDescription>Tahap eksekusi dan penyelesaian kontrak kerja</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="flex flex-col gap-4">
                                {PELAKSANAAN_ITEMS.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 group">
                                        <Checkbox 
                                            id={item.id} 
                                            disabled={!isPerencanaanDone}
                                            checked={!!checkedItems[item.id]}
                                            onCheckedChange={(c) => handleToggle(item.id, c as boolean)}
                                            className="mt-1 h-5 w-5 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                        />
                                        <div className="grid gap-1.5 flex-1">
                                            <Label 
                                                htmlFor={item.id} 
                                                className={`text-sm font-medium leading-none ${!isPerencanaanDone ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'} ${checkedItems[item.id] ? 'line-through text-gray-400 dark:text-gray-500 group-hover:text-gray-400' : ''}`}
                                            >
                                                {item.label}
                                            </Label>
                                            {checkedItems[item.id] && (
                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 opacity-80">Selesai pada {todayStr}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

PengadaanShow.layout = () => {
    return {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: '/dashboard',
            },
            {
                title: 'List Pengadaan',
                href: `/pengadaan`,
            },
            {
                title: 'Detail',
                href: '#',
            },
        ],
    };
};
