import { Link } from "@inertiajs/react";

/**
 * Auth page layout (Login & Register).
 * Split into two columns: brutal branding panel on the left (desktop),
 * form card on the right. Stacks automatically on small screens.
 *
 * Props:
 * - title       : main page title
 * - subtitle    : short description under the title
 * - children    : form content
 */
export default function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="grid min-h-screen bg-void-black lg:grid-cols-2">
            {/* ===== Branding panel (left, desktop only) ===== */}
            <aside className="relative hidden flex-col justify-between border-r-3 border-white bg-surface-dark p-10 lg:flex">
                {/* Brutal decorative shapes */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-10 bottom-10 h-40 w-40 border-3 border-cyan-neon/60"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-5 top-10 h-24 w-24 bg-lime-electric/20"
                />

                <div className="relative">
                    <Link href="/" className="inline-block">
                        <span className="font-display text-3xl font-black uppercase tracking-tight text-white">
                            Brutal
                            <span className="text-lime-electric">Type</span>
                        </span>
                    </Link>

                    <p className="mt-2 font-mono text-xs uppercase tracking-widest text-white/50">
                        Type Fast. Die Hard.
                    </p>
                </div>

                <div className="relative">
                    <h2 className="font-display text-4xl font-black uppercase leading-tight text-white">
                        Typing practice
                        <br />
                        <span className="text-lime-electric">
                            without mercy.
                        </span>
                    </h2>
                    <p className="mt-4 max-w-sm font-mono text-sm leading-relaxed text-white/60">
                        Measure your WPM, accuracy, and consistency. Build your
                        score, climb the leaderboard, and prove you are the
                        fastest.
                    </p>

                    <div className="mt-8 flex gap-3">
                        <span className="border-2 border-white bg-void-black px-3 py-1 font-mono text-xs font-bold uppercase text-cyan-neon">
                            WPM
                        </span>
                        <span className="border-2 border-white bg-void-black px-3 py-1 font-mono text-xs font-bold uppercase text-lime-electric">
                            Accuracy
                        </span>
                        <span className="border-2 border-white bg-void-black px-3 py-1 font-mono text-xs font-bold uppercase text-white">
                            Consistency
                        </span>
                    </div>
                </div>

                <p className="relative font-mono text-xs text-white/30">
                    © {new Date().getFullYear()} BrutalType
                </p>
            </aside>

            {/* ===== Form area (right) ===== */}
            <main className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8">
                {/* Mobile logo */}
                <Link href="/" className="mb-8 lg:hidden">
                    <span className="font-display text-2xl font-black uppercase tracking-tight text-white">
                        Brutal<span className="text-lime-electric">Type</span>
                        <span className="text-cyan-neon">.</span>
                    </span>
                    <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-widest text-white/50">
                        Type Fast. Die Hard.
                    </p>
                </Link>

                <div className="w-full max-w-md">
                    <h1 className="font-display text-3xl font-black uppercase text-white">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="mt-2 font-mono text-sm text-white/60">
                            {subtitle}
                        </p>
                    )}

                    <div className="mt-8">{children}</div>
                </div>
            </main>
        </div>
    );
}
