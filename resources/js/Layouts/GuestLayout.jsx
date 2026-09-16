import Navbar from "../Components/Common/Navbar";

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-void-black text-white">
            <Navbar />
            <main className="mx-auto flex max-w-3xl justify-center px-5 py-10 lg:py-16">
                {children}
            </main>
            <footer className="border-t-4 border-white px-5 py-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                BRUTALTYPE // TYPE FIRST. ACCOUNT LATER.
            </footer>
        </div>
    );
}
