/**
 * Password strength meter for the Register page.
 * Score is calculated from length + character variety.
 *
 * Props:
 * - password : current password string
 */
const LEVELS = [
    { label: "Weak", color: "bg-red-500", width: "25%" },
    { label: "Medium", color: "bg-yellow-400", width: "50%" },
    { label: "Strong", color: "bg-lime-electric", width: "75%" },
    { label: "Very strong", color: "bg-cyan-neon", width: "100%" },
];

function scorePassword(password) {
    if (!password) return 0;

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Map skor 0-5 -> level 0-3
    if (score <= 1) return 0;
    if (score === 2) return 1;
    if (score <= 4) return 2;
    return 3;
}

export default function PasswordStrengthMeter({ password }) {
    const level = scorePassword(password);
    const { label, color } = LEVELS[level];

    // Password kosong -> 0 segmen terisi.
    // Password terisi -> minimal 1 segmen sesuai level.
    const filledCount = password ? level + 1 : 0;

    return (
        <div className="mt-2">
            <div className="flex h-2 w-full gap-1">
                {[0, 1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className={`h-full flex-1 border border-white/30 ${
                            i < filledCount ? color : "bg-transparent"
                        }`}
                    />
                ))}
            </div>
            <p className="mt-1 font-mono text-xs text-white/60">
                Password strength:{" "}
                <span className="font-bold text-white">{label}</span>
            </p>
        </div>
    );
}
