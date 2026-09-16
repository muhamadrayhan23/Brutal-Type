/**
 * Tombol reusable bergaya Neo-Brutalism.
 *
 * Varian warna mengikuti tema BrutalType:
 *  - "lime"  -> aksen utama (default)
 *  - "cyan"  -> aksen sekunder
 *  - "ghost" -> transparan (link, aksi netral)
 *  - "danger"-> merah (logout, hapus)
 *
 * Prop `loading` diisi dari `processing` yang dikembalikan
 * hook useForm() milik Inertia.
 */
export default function Button({
    variant = "lime",
    type = "submit",
    loading = false,
    disabled = false,
    children,
    className = "",
    ...props
}) {
    const base =
        "inline-flex items-center justify-center gap-2 border-3 px-5 py-3 font-display font-bold uppercase tracking-wider select-none transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-neon focus-visible:ring-offset-2 focus-visible:ring-offset-void-black";

    const variants = {
        lime: "border-white bg-lime-electric text-void-black shadow-brutal-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#ffffff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#ffffff]",
        cyan: "border-white bg-cyan-neon text-void-black shadow-brutal-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#ffffff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#ffffff]",
        dark: "border-white bg-surface-dark text-white shadow-brutal-lime hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#D7FF28] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#D7FF28]",
        ghost: "border-transparent bg-transparent text-white hover:border-white hover:bg-white/10 hover:shadow-none",
        danger: "border-white bg-red-500 text-white shadow-brutal-white hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#ffffff] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_#ffffff]",
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`${base} ${variants[variant] ?? variants.lime} ${className}`}
            {...props}
        >
            {loading && (
                <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
            )}
            {children}
        </button>
    );
}
