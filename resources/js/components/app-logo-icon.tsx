export default function AppLogoIcon({ className = '' }: { className?: string }) {
    return (
        <img
            src="/logo/sidebarlogo.png"
            alt="PLN Nusantara Power"
            className={`h-6 w-auto object-contain ${className}`}
        />
    );
}
