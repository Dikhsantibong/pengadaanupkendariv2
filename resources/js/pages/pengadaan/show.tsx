import { Head, router, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, Clock, FileText, Lock, TrendingUp } from 'lucide-react';

type ChecklistItem = {
    id: number;
    nama: string;
    fase: 'perencanaan' | 'pelaksanaan';
    is_checked: boolean;
    checked_at: string | null;
    checked_by_user?: { name: string } | null;
};

type PengadaanData = {
    id: number;
    nama: string;
    status: 'perencanaan' | 'pelaksanaan' | 'selesai';
    progress: number;
    created_at: string;
    creator?: { name: string };
    checklists: ChecklistItem[];
};

type Props = {
    pengadaan: PengadaanData;
};

const statusColors: Record<string, string> = {
    perencanaan: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800',
    pelaksanaan: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
    selesai: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
};

const statusLabels: Record<string, string> = {
    perencanaan: 'Perencanaan',
    pelaksanaan: 'Pelaksanaan',
    selesai: 'Selesai',
};

const statusIcons: Record<string, any> = {
    perencanaan: Clock,
    pelaksanaan: TrendingUp,
    selesai: CheckCircle2,
};

export default function PengadaanShow({ pengadaan }: Props) {
    const page = usePage();
    const userRole = (page.props.auth as any)?.user?.role;

    const perencanaanItems = pengadaan.checklists.filter(c => c.fase === 'perencanaan');
    const pelaksanaanItems = pengadaan.checklists.filter(c => c.fase === 'pelaksanaan');

    const perencanaanChecked = perencanaanItems.filter(c => c.is_checked).length;
    const pelaksanaanChecked = pelaksanaanItems.filter(c => c.is_checked).length;

    const handleToggle = (checklistId: number) => {
        router.post(`/pengadaan/${pengadaan.id}/checklist/${checklistId}/toggle`, {}, {
            preserveScroll: true,
        });
    };

    const canTogglePerencanaan = userRole === 'perencana' && pengadaan.status === 'perencanaan';
    const canTogglePelaksanaan = userRole === 'pelaksana' && pengadaan.status === 'pelaksanaan';

    const StatusIcon = statusIcons[pengadaan.status];

    return (
        <>
            <Head title={`Detail — ${pengadaan.nama}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto rounded-xl p-4 md:p-8">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{pengadaan.nama}</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Dibuat oleh <span className="font-medium">{pengadaan.creator?.name}</span> pada{' '}
                            {new Date(pengadaan.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                    <Badge className={`${statusColors[pengadaan.status]} px-3 py-1 text-sm`}>
                        <StatusIcon className="mr-1.5 h-4 w-4" />
                        {statusLabels[pengadaan.status]}
                    </Badge>
                </div>

                {/* Progress Overview */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">Progress Keseluruhan</span>
                            <span className="text-2xl font-bold">{pengadaan.progress}%</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                                className={`h-full transition-all duration-500 ${
                                    pengadaan.progress === 100 ? 'bg-emerald-500' :
                                    pengadaan.progress >= 50 ? 'bg-orange-500' : 'bg-sky-500'
                                }`}
                                style={{ width: `${pengadaan.progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                            <span>Perencanaan: {perencanaanChecked}/{perencanaanItems.length}</span>
                            <span>Pelaksanaan: {pelaksanaanChecked}/{pelaksanaanItems.length}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Checklist Sections */}
                <div className="grid gap-6 md:grid-cols-2">

                    {/* Perencanaan Checklist */}
                    <Card className={`${pengadaan.status === 'perencanaan' ? 'ring-2 ring-sky-500/30' : ''}`}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-sky-600" />
                                        Checklist Perencanaan
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {perencanaanChecked}/{perencanaanItems.length} item selesai
                                    </CardDescription>
                                </div>
                                {perencanaanChecked === perencanaanItems.length && perencanaanItems.length > 0 && (
                                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                        <CheckCircle2 className="mr-1 h-3 w-3" /> Selesai
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-1">
                                {perencanaanItems.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                                            item.is_checked ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'hover:bg-muted/50'
                                        }`}
                                    >
                                        <Checkbox
                                            id={`perencanaan-${item.id}`}
                                            checked={item.is_checked}
                                            disabled={!canTogglePerencanaan}
                                            onCheckedChange={() => handleToggle(item.id)}
                                        />
                                        <label
                                            htmlFor={`perencanaan-${item.id}`}
                                            className={`flex-1 text-sm cursor-pointer select-none ${
                                                item.is_checked ? 'line-through text-muted-foreground' : 'font-medium'
                                            }`}
                                        >
                                            {idx + 1}. {item.nama}
                                        </label>
                                        {!canTogglePerencanaan && !item.is_checked && pengadaan.status !== 'perencanaan' && (
                                            <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pelaksanaan Checklist */}
                    <Card className={`${pengadaan.status === 'pelaksanaan' ? 'ring-2 ring-orange-500/30' : ''}`}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-orange-600" />
                                        Checklist Pelaksanaan
                                    </CardTitle>
                                    <CardDescription className="mt-1">
                                        {pelaksanaanChecked}/{pelaksanaanItems.length} item selesai
                                    </CardDescription>
                                </div>
                                {pelaksanaanChecked === pelaksanaanItems.length && pelaksanaanItems.length > 0 && (
                                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                                        <CheckCircle2 className="mr-1 h-3 w-3" /> Selesai
                                    </Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {pengadaan.status === 'perencanaan' ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                    <Lock className="h-8 w-8 mb-3 opacity-40" />
                                    <p className="font-medium">Checklist Terkunci</p>
                                    <p className="text-xs mt-1">Selesaikan semua checklist Perencanaan terlebih dahulu.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {pelaksanaanItems.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                                                item.is_checked ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : 'hover:bg-muted/50'
                                            }`}
                                        >
                                            <Checkbox
                                                id={`pelaksanaan-${item.id}`}
                                                checked={item.is_checked}
                                                disabled={!canTogglePelaksanaan}
                                                onCheckedChange={() => handleToggle(item.id)}
                                            />
                                            <label
                                                htmlFor={`pelaksanaan-${item.id}`}
                                                className={`flex-1 text-sm cursor-pointer select-none ${
                                                    item.is_checked ? 'line-through text-muted-foreground' : 'font-medium'
                                                }`}
                                            >
                                                {idx + 1}. {item.nama}
                                            </label>
                                            {item.is_checked && item.checked_by_user && (
                                                <span className="text-xs text-muted-foreground">oleh {item.checked_by_user.name}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
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
