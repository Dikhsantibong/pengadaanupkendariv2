import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-3 font-medium"
                        >
                            <div className="mb-1 flex items-center justify-center">
                                <img
                                    src="/logo/sidebarlogo.png"
                                    alt="PLN Nusantara Power"
                                    className="h-14 w-auto object-contain"
                                />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">{title}</h1>
                            <p className="text-center text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-xl border border-neutral-200/80 bg-white/80 backdrop-blur-sm p-6 shadow-lg dark:border-neutral-800 dark:bg-neutral-900/80">
                        {children}
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                        &copy; {new Date().getFullYear()} PLN Nusantara Power — Sistem Manajemen Pengadaan
                    </p>
                </div>
            </div>
        </div>
    );
}
