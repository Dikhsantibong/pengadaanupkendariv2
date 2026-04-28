import { usePage } from '@inertiajs/react';
import { Bell, ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';

type NotificationItem = {
    id: string;
    data: { pengadaan_id: number; pengadaan_nama: string; message: string; days_left: number };
    read_at: string | null;
    created_at: string;
};

export function NavUser() {
    const { auth, unreadNotificationsCount } = usePage().props as any;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [showNotif, setShowNotif] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/notifications');
            const data = await res.json();
            setNotifications(data);
        } catch {}
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/notifications/${id}/read`, { method: 'POST', headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' } });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        } catch {}
    };

    useEffect(() => {
        if (showNotif) fetchNotifications();
    }, [showNotif]);

    return (
        <SidebarMenu>
            {/* Notification Bell */}
            <SidebarMenuItem>
                <div className="relative">
                    <SidebarMenuButton
                        size="lg"
                        className="group text-sidebar-accent-foreground"
                        onClick={() => setShowNotif(!showNotif)}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md">
                            <Bell className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-sm font-medium">Notifikasi</span>
                        {(unreadNotificationsCount > 0) && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                                {unreadNotificationsCount}
                            </span>
                        )}
                    </SidebarMenuButton>

                    {showNotif && (
                        <div className="absolute bottom-full left-0 right-0 mb-2 max-h-80 overflow-y-auto rounded-lg border bg-popover p-2 shadow-lg z-50">
                            <div className="flex items-center justify-between px-2 pb-2 border-b mb-2">
                                <span className="text-sm font-semibold">Notifikasi</span>
                                <button onClick={() => setShowNotif(false)} className="text-xs text-muted-foreground hover:text-foreground">Tutup</button>
                            </div>
                            {notifications.length === 0 ? (
                                <p className="text-center text-xs text-muted-foreground py-4">Tidak ada notifikasi.</p>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        className={`rounded-md px-3 py-2 mb-1 text-xs cursor-pointer transition-colors ${n.read_at ? 'bg-muted/30 text-muted-foreground' : 'bg-red-50 dark:bg-red-950/30 text-foreground font-medium'}`}
                                        onClick={() => !n.read_at && markAsRead(n.id)}
                                    >
                                        <p>{n.data.message}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">{n.created_at}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </SidebarMenuItem>

            {/* User Menu */}
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} showEmail={true} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
