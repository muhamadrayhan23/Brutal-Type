import Navbar from "../Components/Common/Navbar";

export default function AppLayout({
    children,
    compactTopSpacing = false,
    balancedTopSpacing = false,
}) {
    const currentYear = new Date().getFullYear();
    const mainSpacing = balancedTopSpacing
        ? "pt-4 pb-10 lg:pt-4 lg:pb-14"
        : "py-10 lg:py-14";

    return (
        <div className="min-h-screen bg-void-black text-white">
            <Navbar />
            <main className={`mx-auto max-w-7xl px-5 lg:px-8 ${mainSpacing}`}>
                <div
                    className={`${balancedTopSpacing || compactTopSpacing ? "mb-4 pb-0" : "mb-10 pb-8"} flex flex-col justify-between gap-4 md:flex-row md:items-end`}
                ></div>
                {children}
            </main>
            <footer className="flex items-center justify-center border-t-4 border-white px-5 py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 lg:px-8">
                &copy; {currentYear} BrutalType. All rights reserved.
            </footer>
        </div>
    );
}
