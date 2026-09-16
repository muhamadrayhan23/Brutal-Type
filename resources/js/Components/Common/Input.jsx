/**
 * Input reusable bergaya Neo-Brutalism.
 * Menampilkan label, ikon kiri, dan pesan error dari validasi Inertia.
 */
export default function Input({
    label,
    name,
    id,
    type = 'text',
    error = null,
    icon = null,
    endAdornment = null,
    className = '',
    ref,
    ...props
}) {
    const inputId = id ?? name;

    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="mb-2 block font-display text-sm font-bold uppercase tracking-wider text-white"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg leading-none">
                        {icon}
                    </span>
                )}

                <input
                    ref={ref}
                    id={inputId}
                    name={name}
                    type={type}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    className={`w-full border-3 bg-void-black px-3 py-3 font-mono text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-0 ${icon ? 'pl-10' : ''
                        } ${endAdornment ? 'pr-12' : ''
                        } ${error
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-white focus:border-lime-electric'
                        }`}
                    {...props}
                />
                {endAdornment && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {endAdornment}
                    </span>
                )}
            </div>

            {error && (
                <p id={`${inputId}-error`} className="mt-2 text-xs font-bold text-red-500">
                    {error}
                </p>
            )}
        </div>
    );
}
