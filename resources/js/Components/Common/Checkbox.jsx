/**
 * Checkbox reusable bergaya Neo-Brutalism.
 * Dipakai untuk "Remember me" dan persetujuan Terms di halaman Register.
 */
export default function Checkbox({
    label,
    name,
    id,
    checked,
    onChange,
    error = null,
    className = '',
    ...props
}) {
    const inputId = id ?? name;

    return (
        <div className={className}>
            <label
                htmlFor={inputId}
                className="flex cursor-pointer items-start gap-3 text-sm text-white/80"
            >
                <input
                    id={inputId}
                    name={name}
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none border-3 border-white bg-void-black transition-colors checked:border-cyan-neon checked:bg-cyan-neon focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-neon"
                    {...props}
                />
                <span>
                    {label}
                </span>
            </label>

            {error && (
                <p className="mt-2 text-xs font-bold text-red-500">{error}</p>
            )}
        </div>
    );
}
