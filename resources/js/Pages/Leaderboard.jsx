import { Crown, Medal, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";

export default function Leaderboard({ leaderboards = [], filters = {} }) {
    const rows = Array.isArray(leaderboards) ? leaderboards : [];
    const currentWordCount = Number(filters.word_count ?? 10);
    const showingLabel = rows.length
        ? `SHOWING 1-${Math.min(rows.length, 50)} OF ${rows.length} USERS`
        : "NO USERS AVAILABLE";

    return (
        <AppLayout title="The fastest hands.">
            <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    {[10, 15, 20, 25, 30].map((wordCount) => (
                        <Link
                            key={wordCount}
                            href={`/leaderboard?word_count=${wordCount}&language=${filters.language ?? "indonesian"}`}
                            className={`border-3 px-5 py-3 font-mono text-xs font-bold ${Number(currentWordCount) === wordCount ? "border-lime-electric bg-lime-electric text-black shadow-brutal-white" : "border-white bg-surface-dark hover:border-cyan-neon"}`}
                        >
                            {wordCount} WORDS
                        </Link>
                    ))}
                </div>

                {rows.length === 0 ? (
                    <div className="border-3 border-white bg-surface-dark p-8 text-center shadow-brutal-white">
                        <p className="font-display text-3xl font-black uppercase">
                            Not available
                        </p>
                        <p className="mt-2 font-mono text-xs uppercase text-white/60">
                            No leaderboard data has been recorded yet.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto border-3 border-white bg-surface-dark shadow-brutal-white">
                            <table className="w-full min-w-170 border-collapse text-left">
                                <thead className="border-b-3 border-white bg-black font-mono text-[10px] uppercase text-white/50">
                                    <tr>
                                        <th className="p-4">#</th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">WPM</th>
                                        <th className="p-4">Accuracy</th>
                                        <th className="p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, index) => (
                                        <tr
                                            key={`${row.name}-${index}`}
                                            className="border-b-2 border-white/15 hover:bg-white/5"
                                        >
                                            <td className="p-4 font-display text-2xl font-black text-white/50">
                                                {index < 3 ? (
                                                    <Medal
                                                        size={25}
                                                        className={
                                                            index === 0
                                                                ? "text-yellow-300"
                                                                : index === 1
                                                                  ? "text-white"
                                                                  : "text-orange-400"
                                                        }
                                                        strokeWidth={2.5}
                                                    />
                                                ) : (
                                                    String(index + 1).padStart(
                                                        2,
                                                        "0",
                                                    )
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="grid h-9 w-9 place-items-center border-2 border-white bg-cyan-neon font-display font-black text-black">
                                                        {row.name?.[0] ?? "A"}
                                                    </div>
                                                    <span className="font-mono text-sm font-bold">
                                                        {row.user?.name ??
                                                            "Anonymous"}
                                                    </span>
                                                    {index === 0 && (
                                                        <Crown
                                                            size={16}
                                                            className="text-lime-electric"
                                                            strokeWidth={2.5}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-xl font-bold text-lime-electric">
                                                {row.wpm ?? 0}
                                            </td>
                                            <td className="p-4 font-mono text-sm">
                                                {row.accuracy ?? 0}%
                                            </td>
                                            <td className="p-4 font-mono text-xs text-white/50">
                                                {row.created_at
                                                    ? new Date(
                                                          row.created_at,
                                                      ).toLocaleDateString(
                                                          "en-GB",
                                                          {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                          },
                                                      )
                                                    : "Not available"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex items-center justify-between border-t-2 border-white/30 pt-5 font-mono text-xs">
                            <span className="text-white/50">
                                {showingLabel}
                            </span>
                            <div className="flex gap-2">
                                <button className="border-2 border-white p-2 hover:bg-lime-electric hover:text-black">
                                    <ChevronLeft size={17} strokeWidth={2.5} />
                                </button>
                                <button className="border-2 border-white p-2 hover:bg-lime-electric hover:text-black">
                                    <ChevronRight size={17} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}
