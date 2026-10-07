import Navbar from "../Components/Common/Navbar";

export default function AppLayout({ children, title = "Type without mercy." }) {
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-void-black text-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
                <div className="mb-10 flex flex-col justify-between gap-4 border-b-2 border-white/30 pb-8 md:flex-row md:items-end">
                    <div>
                        <h1 className="font-display text-5xl font-black uppercase leading-none md:text-7xl">
                            {title}
                        </h1>
                    </div>
                </div>
                {children}
            </main>
            <footer className="flex items-center justify-center border-t-4 border-white px-5 py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 lg:px-8">
                &copy; {currentYear} BrutalType. All rights reserved.
            </footer>
        </div>
    );
}
