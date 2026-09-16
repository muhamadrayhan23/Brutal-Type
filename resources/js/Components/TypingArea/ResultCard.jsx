import { BarChart3, RotateCcw, UserPlus } from "lucide-react";
import Button from "../Common/Button";
import WpmChart from "../Charts/WpmChart";

export default function ResultCard({
    result,
    onRestart,
    isGuest = true,
    onGuestAction,
}) {
    return (
        <section className="border-4 border-white bg-surface-dark p-5 shadow-brutal-lime md:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 border-b-2 border-white/30 pb-5 md:flex-row md:items-center">
                <div>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-lime-electric">
                        TEST COMPLETE
                    </p>
                    <h2 className="font-display text-4xl font-black uppercase">
                        Your results
                    </h2>
                </div>
                <Button onClick={onRestart} variant="dark">
                    <RotateCcw
                        size={15}
                        strokeWidth={2.5}
                        className="mr-2 inline"
                    />{" "}
                    Retry
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
                <div className="border-3 border-lime-electric bg-black p-4 md:col-span-2">
                    <p className="font-mono text-xs text-white/50">WPM</p>
                    <p className="font-display text-7xl font-black text-lime-electric">
                        {result.wpm}
                    </p>
                </div>
                <Metric label="ACCURACY" value={`${result.accuracy}%`} />
                <Metric label="RAW WPM" value={result.rawWpm} />
                <Metric label="CONSISTENCY" value={`${result.consistency}%`} />
                <Metric
                    label="TOTAL TIME"
                    value={`${result.timeElapsed ?? 0}s`}
                />
                <Metric label="CORRECT" value={result.correct} />
                <Metric label="WRONG" value={result.errors} />
            </div>
            <div className="mt-6 border-3 border-white p-4">
                <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase text-cyan-neon">
                    <BarChart3 size={16} strokeWidth={2.5} /> WPM OVER TIME
                </div>
                <WpmChart points={result.wordStats} />
            </div>
            {isGuest && (
                <div className="mt-6 flex flex-col justify-between gap-4 border-3 border-cyan-neon bg-cyan-neon p-5 text-black md:flex-row md:items-center">
                    <div>
                        <p className="font-display text-2xl font-black uppercase">
                            Save this score.
                        </p>
                        <p className="font-mono text-xs">
                            Create an account to save your progress and climb
                            the leaderboard.
                        </p>
                    </div>
                    <Button variant="dark" onClick={onGuestAction}>
                        <UserPlus
                            size={16}
                            strokeWidth={2.5}
                            className="mr-2 inline"
                        />{" "}
                        Save & Create Account
                    </Button>
                </div>
            )}
        </section>
    );
}

function Metric({ label, value }) {
    return (
        <div className="border-3 border-white p-4">
            <p className="font-mono text-xs text-white/50">{label}</p>
            <p className="mt-3 font-mono text-2xl font-bold">{value}</p>
        </div>
    );
}
