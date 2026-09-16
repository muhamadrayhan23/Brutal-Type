export default function LiveStats({
    elapsedSeconds = 0,
    wpm,
    accuracy,
    isRunning,
}) {
    return (
        <div className="grid grid-cols-3 border-3 border-white bg-surface-dark shadow-brutal-white">
            <div className="border-r-3 border-white p-4">
                <p className="font-mono text-[10px] uppercase text-white/50">
                    TIME
                </p>
                <p
                    className={`font-mono text-3xl font-bold ${isRunning ? "text-lime-electric" : "text-white"}`}
                >
                    {String(elapsedSeconds).padStart(2, "0")}
                    <span className="text-sm text-white/50"> s</span>
                </p>
            </div>
            <div className="border-r-3 border-white p-4">
                <p className="font-mono text-[10px] uppercase text-white/50">
                    WPM
                </p>
                <p className="font-mono text-3xl font-bold text-cyan-neon">
                    {wpm}
                </p>
            </div>
            <div className="p-4">
                <p className="font-mono text-[10px] uppercase text-white/50">
                    ACCURACY
                </p>
                <p className="font-mono text-3xl font-bold">
                    {accuracy}
                    <span className="text-sm text-white/50">%</span>
                </p>
            </div>
        </div>
    );
}
