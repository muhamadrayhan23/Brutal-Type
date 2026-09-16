import Navbar from "../Components/Common/Navbar";

export default function AppLayout({ children, title = "Type without mercy." }) {
    return (
        <div className="min-h-screen bg-void-black text-white">
            <Navbar />
            <main className="mx-auto max-w-7xl px-5 py-10 lg:px-8 lg:py-14">
                <div className="mb-10 flex flex-col justify-between gap-4 border-b-2 border-white/30 pb-8 md:flex-row md:items-end">
                    <div>
                        <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[0.24em] text-cyan-neon">
                            BRUTALTYPE / ENGINE LIVE
                        </p>
                        <h1 className="font-display text-5xl font-black uppercase leading-none md:text-7xl">
                            {title}
                        </h1>
                    </div>
                    <p className="max-w-xs font-mono text-xs leading-5 text-white/55">
                        NO AUTO-CORRECT. NO EXCUSES.
                        <br />
                        PURE FINGER SPEED.
                    </p>
                </div>
                {children}
            </main>
            <footer className="items-center justify-center border-t-4 border-white px-5 py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 lg:px-8">
                BRUTALTYPE // BUILD YOUR MUSCLE MEMORY
            </footer>
        </div>
    );
}
