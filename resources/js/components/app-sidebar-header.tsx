import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { usePage } from '@inertiajs/react';
import { Calendar, Search, UserCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props as any;

    const date = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar */}
                <div className="relative hidden md:flex items-center">
                    <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari pengadaan..."
                        className="w-64 pl-9 h-9 bg-muted/50 focus-visible:ring-1"
                    />
                    <kbd className="pointer-events-none absolute right-2.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>

                {/* Date Display */}
                <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground border-l pl-4 border-sidebar-border">
                    <Calendar className="h-4 w-4" />
                    <span className="capitalize">{date}</span>
                </div>

                {/* Role Badge */}
                <div className="hidden sm:flex items-center gap-2 border-l pl-4 border-sidebar-border">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 capitalize py-1 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                        <UserCircle className="mr-1 h-3.5 w-3.5" />
                        {auth.user.role.replace('_', ' ')}
                    </Badge>
                </div>
            </div>
        </header>
    );
}
