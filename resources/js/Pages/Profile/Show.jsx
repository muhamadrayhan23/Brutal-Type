import { Link } from "@inertiajs/react";
import {
    CalendarDays,
    Clock3,
    Edit3,
    Gauge,
    Target,
    Trophy,
} from "lucide-react";
import AppLayout from "../../Layouts/AppLayout";
import WpmChart from "../../Components/Charts/WpmChart";
import UserStatsChart from "../../Components/Charts/UserStatsChart";

export default function ProfileShow({
    stats = {},
    recentTests = [],
    history = [],
    user: profileUser,
}) {
    const user = profileUser;
    const tests = Array.isArray(recentTests)
        ? recentTests
        : (recentTests.data ?? []);
    const pagination = Array.isArray(recentTests) ? null : recentTests;
    const values = history;
    return (
        <AppLayout title="Your stats.">
            <div className="space-y-8">
                <section className="flex flex-col justify-between gap-6 border-3 border-white bg-surface-dark p-6 shadow-brutal-white md:flex-row md:items-center">
                    <div className="flex items-center gap-5">
                        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden border-3 border-white font-display text-3xl font-black text-black">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={`${user.name || "User"} avatar`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                user.name?.[0]
                            )}
                        </div>
                        <div>
                            <p className="font-mono text-xs uppercase tracking-widest text-cyan-neon">
                                PROFILE
                            </p>
                            <h2 className="font-display text-4xl font-black uppercase">
                                {user.name}
                            </h2>
                            <p className="font-mono text-xs text-white/55">
                                {user.email}
                            </p>
                            <p className="mt-2 flex items-center gap-1 font-mono text-[10px] text-white/45">
                                <CalendarDays size={13} strokeWidth={2.5} />{" "}
                                Joined {formatDate(user.created_at)}
                            </p>
                        </div>
                    </div>
                </section>
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat
                        icon={<Target />}
                        label="TESTS COMPLETED"
                        value={stats.totalTests ?? "Not available"}
                    />
                    <Stat
                        icon={<Gauge />}
                        label="AVERAGE WPM"
                        value={stats.averageWpm ?? "Not available"}
                    />
                    <Stat
                        icon={<Trophy />}
                        label="HIGHEST WPM"
                        value={stats.highestWpm ?? "Not available"}
                    />
                    <Stat
                        icon={<Clock3 />}
                        label="TYPING TIME"
                        value={
                            stats.totalTime === null ||
                            stats.totalTime === undefined
                                ? "Not available"
                                : `${stats.totalTime}m`
                        }
                    />
                </section>
                <section className="border-3 border-white bg-surface-dark p-5 shadow-brutal-white">
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <p className="font-mono text-xs uppercase text-cyan-neon">
                                PERFORMANCE STATISTICS
                            </p>
                            <h3 className="font-display text-3xl font-black uppercase">
                                WPM distribution
                            </h3>
                        </div>
                        <span className="font-mono text-[10px] text-white/45">
                            LAST {values.length} TESTS
                        </span>
                    </div>
                    {values.length ? (
                        <UserStatsChart points={values} />
                    ) : (
                        <p className="border-2 border-white/20 p-6 text-center font-mono text-xs uppercase text-white/50">
                            No performance data available yet.
                        </p>
                    )}
                </section>
                <section className="border-3 border-white bg-surface-dark p-5 shadow-brutal-white">
                    <h3 className="mb-4 font-display text-3xl font-black uppercase">
                        Recent tests
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-150 text-left">
                            <thead className="border-b-2 border-white/30 font-mono text-[10px] uppercase text-white/50">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Mode</th>
                                    <th className="p-3">WPM</th>
                                    <th className="p-3">Accuracy</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tests.length ? (
                                    tests.map((test, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-white/15 font-mono text-xs"
                                        >
                                            <td className="p-3 ">
                                                {formatDate(test.created_at)}
                                            </td>
                                            <td className="p-3">
                                                {test.time_elapsed}s /{" "}
                                                {test.language}
                                            </td>
                                            <td className="p-3 ">{test.wpm}</td>
                                            <td className="p-3 ">
                                                {test.accuracy}%
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="p-6 text-center font-mono text-xs uppercase text-white/50"
                                        >
                                            No tests available yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pagination && pagination.last_page > 1 && (
                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-white/20 pt-4">
                            <span className="font-mono text-xs text-white/50">
                                Showing {pagination.from}-{pagination.to} of{" "}
                                {pagination.total} tests
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {pagination.links.map((link, index) => (
                                    <Link
                                        key={`${link.label}-${index}`}
                                        href={link.url || "#"}
                                        preserveScroll
                                        className={`border-2 px-3 py-2 font-mono text-xs ${
                                            link.active
                                                ? "border-lime-electric bg-lime-electric text-black"
                                                : link.url
                                                  ? "border-white hover:border-cyan-neon"
                                                  : "cursor-not-allowed border-white/20 text-white/30"
                                        }`}
                                        onClick={(event) => {
                                            if (!link.url)
                                                event.preventDefault();
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}

function Stat({ icon, label, value }) {
    return (
        <div className="border-3 border-white bg-surface-dark p-4 shadow-brutal-white">
            <div className="mb-5 text-cyan-neon">{icon}</div>
            <p className="font-mono text-[10px] text-white/50">{label}</p>
            <p className="mt-1 font-display text-3xl font-black">{value}</p>
        </div>
    );
}

function formatDate(value) {
    if (!value) return "Not available";

    return new Date(value).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}
