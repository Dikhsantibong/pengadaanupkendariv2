import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
            <div className="relative hidden h-full flex-col bg-sky-900 text-white lg:flex">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/image.png" 
                        alt="PLN NP Background" 
                        className="h-full w-full object-cover opacity-60 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-900/40 to-transparent" />
                </div>
                
                <div className="absolute top-8 left-10 z-30">
                    <AppLogoIcon className="h-12 w-auto" />
                </div>

                <div className="absolute top-10 right-10 z-20">
                    <Link
                        href={home()}
                        className="flex items-center text-sm font-bold tracking-widest text-white/80 hover:text-white transition-colors uppercase"
                    >
                        PENGADAAN UP KENDARI
                    </Link>
                </div>
                
                <div className="relative z-20 mt-auto p-12">
                    <blockquote className="space-y-4">
                        <p className="text-4xl font-bold tracking-tight leading-tight">
                            Sistem Manajemen<br />Pengadaan
                        </p>
                        <footer className="text-lg font-medium text-sky-200/90 flex items-center gap-2">
                            <span className="h-px w-8 bg-sky-400/50" />
                            PLN Nusantara Power — Unit Pembangkitan Kendari
                        </footer>
                    </blockquote>
                </div>
            </div>
            
            <div className="w-full h-full flex items-center justify-center bg-white dark:bg-neutral-950 p-6 sm:p-10">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
                    <div className="flex flex-col items-center gap-3 lg:hidden mb-4">
                         <img 
                            src="/logo/sidebarlogo.png" 
                            alt="PLN NP" 
                            className="h-12 w-auto mb-2 object-contain"
                        />
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
                    </div>
                    
                    <div className="flex flex-col gap-2 text-center lg:text-left hidden lg:flex">
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
                        <p className="text-base text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    <div className="w-full">
                        {children}
                    </div>

                    <p className="text-center text-xs text-muted-foreground px-8 lg:text-left lg:px-0">
                        &copy; {new Date().getFullYear()} PLN Nusantara Power. Seluruh Hak Cipta Dilindungi.
                    </p>
                </div>
            </div>
        </div>
    );
}
