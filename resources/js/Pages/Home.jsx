import { router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { Keyboard, RefreshCcw, Settings2 } from "lucide-react";
import AppLayout from "../Layouts/AppLayout";
import Button from "../Components/Common/Button";
import Modal from "../Components/Common/Modal";
import LiveStats from "../Components/TypingArea/LiveStats";
import ResultCard from "../Components/TypingArea/ResultCard";
import WordDisplay from "../Components/TypingArea/WordDisplay";
import useEngine from "../Hooks/useEngine";

const wordCounts = [10, 15, 20, 25, 30];
const modes = ["English", "Indonesian", "Code"];
const pendingGuestResultKey = "brutaltype-pending-result";

export default function Home() {
    const { auth } = usePage().props;
    const [wordCount, setWordCount] = useState(30);
    const [mode, setMode] = useState("English");
    const [guestModalOpen, setGuestModalOpen] = useState(false);
    const [saveResultModalOpen, setSaveResultModalOpen] = useState(false);
    const [pendingGuestResult, setPendingGuestResult] = useState(null);
    const [pbModalOpen, setPbModalOpen] = useState(false);
    const engine = useEngine({ mode, wordCount });
    const savedResultRef = useRef(null);

    useEffect(() => {
        if (!auth?.user) return;

        const pendingResult = sessionStorage.getItem(pendingGuestResultKey);
        if (!pendingResult) return;

        try {
            setPendingGuestResult(JSON.parse(pendingResult));
            setSaveResultModalOpen(true);
        } catch {
            sessionStorage.removeItem(pendingGuestResultKey);
        }
    }, [auth?.user]);

    const continueToAuth = (path) => {
        if (!engine.result) return;

        sessionStorage.setItem(
            pendingGuestResultKey,
            JSON.stringify({
                wpm: engine.result.wpm,
                raw_wpm: engine.result.rawWpm,
                accuracy: engine.result.accuracy,
                consistency: engine.result.consistency,
                time_elapsed: Math.max(1, engine.elapsedSeconds),
                word_count: wordCount,
                language: mode.toLowerCase(),
                key_stats: { points: engine.result.points ?? [] },
            }),
        );
        window.location.href = path;
    };

    const savePendingGuestResult = () => {
        if (!pendingGuestResult) return;

        router.post("/typing-test/results", pendingGuestResult, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                sessionStorage.removeItem(pendingGuestResultKey);
                setPendingGuestResult(null);
                setSaveResultModalOpen(false);
                if (page.props.flash?.typing_result?.is_pb) {
                    setPbModalOpen(true);
                }
            },
        });
    };

    useEffect(() => {
        if (!engine.result || savedResultRef.current === engine.result) {
            return;
        }

        savedResultRef.current = engine.result;
        const language = mode.toLowerCase();
        const localPbKey = `brutaltype-pb-${wordCount}-${language}`;
        const localPb = Number(localStorage.getItem(localPbKey));

        router.post(
            "/typing-test/results",
            {
                wpm: engine.result.wpm,
                raw_wpm: engine.result.rawWpm,
                accuracy: engine.result.accuracy,
                consistency: engine.result.consistency,
                time_elapsed: Math.max(1, engine.elapsedSeconds),
                word_count: wordCount,
                language,
                local_pb:
                    Number.isFinite(localPb) && localPb > 0 ? localPb : null,
                key_stats: { points: engine.result.points ?? [] },
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    if (auth?.user && page.props.flash?.typing_result?.is_pb) {
                        setPbModalOpen(true);
                    }
                    if (
                        !Number.isFinite(localPb) ||
                        engine.result.wpm > localPb
                    ) {
                        localStorage.setItem(
                            localPbKey,
                            String(engine.result.wpm),
                        );
                    }
                },
            },
        );
    }, [auth?.user, engine.elapsedSeconds, engine.result, mode, wordCount]);

    return (
        <AppLayout title="Type without mercy.">
            <div className="space-y-6">
                <section className="flex flex-col justify-between gap-5 border-3 border-white bg-surface-dark p-4 shadow-brutal-white md:flex-row md:items-center md:p-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-2 font-mono text-[10px] font-bold uppercase text-white/50">
                            WORD COUNT
                        </span>
                        {wordCounts.map((value) => (
                            <button
                                key={value}
                                onClick={() => {
                                    setWordCount(value);
                                    engine.restart();
                                }}
                                className={`border-2 px-3 py-2 font-mono text-xs font-bold ${wordCount === value ? "border-lime-electric bg-lime-electric text-black" : "border-white text-white hover:border-lime-electric"}`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="mr-2 font-mono text-[10px] font-bold uppercase text-white/50">
                            LANGUAGE
                        </span>
                        {modes.map((value) => (
                            <button
                                key={value}
                                onClick={() => {
                                    setMode(value);
                                    engine.restart();
                                }}
                                className={`border-2 px-3 py-2 font-mono text-xs font-bold ${mode === value ? "border-cyan-neon bg-cyan-neon text-black" : "border-white text-white hover:border-cyan-neon"}`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </section>
                {!engine.result ? (
                    <section className="space-y-5">
                        <LiveStats
                            elapsedSeconds={engine.elapsedSeconds}
                            wpm={engine.wpm}
                            accuracy={engine.accuracy}
                            isRunning={engine.isRunning}
                        />
                        <WordDisplay
                            target={engine.target}
                            typed={engine.typed}
                            words={engine.words}
                            completedWords={engine.completedWords}
                            currentWord={engine.currentWord}
                            wordIndex={engine.wordIndex}
                            charIndex={engine.charIndex}
                        />
                        <div className="flex flex-col justify-between gap-4 border-l-4 border-lime-electric pl-4 md:flex-row md:items-center">
                            <p className="font-mono text-xs text-white/60">
                                <Keyboard
                                    size={15}
                                    className="mr-2 inline text-lime-electric"
                                    strokeWidth={2.5}
                                />
                                Click the text area and start typing.{" "}
                                <span className="text-white">TAB + ENTER</span>{" "}
                                to restart.
                            </p>
                            <Button variant="dark" onClick={engine.restart}>
                                <RefreshCcw size={15} strokeWidth={2.5} />{" "}
                                Restart test
                            </Button>
                        </div>
                    </section>
                ) : (
                    <ResultCard
                        result={engine.result}
                        onRestart={() => {
                            setPbModalOpen(false);
                            engine.restart();
                        }}
                        isGuest={!auth?.user}
                        onGuestAction={() => setGuestModalOpen(true)}
                    />
                )}
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
                    <Settings2 size={14} strokeWidth={2.5} /> Engine live /{" "}
                    {mode} dictionary / protection active
                </div>
            </div>
            <Modal
                open={guestModalOpen}
                onClose={() => setGuestModalOpen(false)}
                title="Save score"
                actions={
                    <>
                        <Button
                            variant="dark"
                            onClick={() => setGuestModalOpen(false)}
                        >
                            Later
                        </Button>
                        <Button
                            variant="dark"
                            onClick={() => continueToAuth("/login")}
                        >
                            Login
                        </Button>
                        <Button onClick={() => continueToAuth("/register")}>
                            Create account
                        </Button>
                    </>
                }
            >
                Your test result is ready to save. Log in or create an account
                to keep it on your profile.
            </Modal>
            <Modal
                open={saveResultModalOpen}
                onClose={() => {
                    sessionStorage.removeItem(pendingGuestResultKey);
                    setPendingGuestResult(null);
                    setSaveResultModalOpen(false);
                }}
                title="Save this result?"
                actions={
                    <>
                        <Button
                            variant="dark"
                            onClick={() => {
                                sessionStorage.removeItem(
                                    pendingGuestResultKey,
                                );
                                setPendingGuestResult(null);
                                setSaveResultModalOpen(false);
                            }}
                        >
                            Later
                        </Button>
                        <Button onClick={savePendingGuestResult}>
                            Save result
                        </Button>
                    </>
                }
            >
                You are signed in. Would you like to save your guest test result
                to your account?
            </Modal>
            <Modal
                open={pbModalOpen}
                onClose={() => setPbModalOpen(false)}
                title="Personal best"
                actions={
                    <Button onClick={() => setPbModalOpen(false)}>
                        Continue
                    </Button>
                }
            >
                <p className="font-display text-2xl font-black uppercase text-lime-electric">
                    New record unlocked.
                </p>
                <p className="mt-2">
                    Your score has been saved as the personal best for this test
                    category.
                </p>
            </Modal>
        </AppLayout>
    );
}
