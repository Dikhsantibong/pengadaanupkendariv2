import { Link, usePage } from '@inertiajs/react';
import { BookOpen, LayoutGrid, Shield } from 'lucide-react';
import AppLogo from '@/components/app-logo';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const page = usePage();
    const dashboardUrl = '/dashboard';

    const userRole = (page.props.auth as any)?.user?.role;
    const isAsmen = userRole?.startsWith('asmen_');

    let mainNavItems: NavItem[];

    if (userRole === 'manager') {
        mainNavItems = [
            { title: 'Dashboard Manager', href: '/manager/dashboard', icon: Shield },
            { title: 'List Pengadaan', href: '/pengadaan', icon: BookOpen },
        ];
    } else if (isAsmen) {
        mainNavItems = [
            { title: 'Dashboard Asmen', href: '/asmen/dashboard', icon: LayoutGrid },
            { title: 'List Pengadaan', href: '/pengadaan', icon: BookOpen },
        ];
    } else {
        mainNavItems = [
            { title: 'Dashboard', href: dashboardUrl, icon: LayoutGrid },
            { title: 'List Pengadaan', href: '/pengadaan', icon: BookOpen },
        ];
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
