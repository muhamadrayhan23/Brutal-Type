import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildWordStream } from "../Utils/word";
import {
    calculateAccuracy,
    calculateResult,
    calculateWpm,
} from "../Utils/calculateWpm";

export default function useEngine({ mode = "English", wordCount = 30 }) {
    const [typed, setTyped] = useState("");
    const [completedWords, setCompletedWords] = useState([]);
    const [currentWord, setCurrentWord] = useState("");
    const [wordIndex, setWordIndex] = useState(0);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [startedAt, setStartedAt] = useState(null);
    const [result, setResult] = useState(null);
    const [points, setPoints] = useState([]);
    const [restartVersion, setRestartVersion] = useState(0);
    const inputRef = useRef(null);
    const tabPressed = useRef(false);
    const typedRef = useRef("");
    const currentWordRef = useRef("");
    const completedWordsRef = useRef([]);
    const wordIndexRef = useRef(0);
    const startedAtRef = useRef(null);
    const wordCompletionTimesRef = useRef([]);
    const resultRef = useRef(null);
    const finishRef = useRef(null);
    const target = useMemo(
        () => buildWordStream(mode, wordCount, restartVersion),
        [mode, wordCount, restartVersion],
    );
    const words = useMemo(() => target.split(" "), [target]);

    useEffect(() => {
        typedRef.current = "";
        currentWordRef.current = "";
        completedWordsRef.current = [];
        wordIndexRef.current = 0;
        startedAtRef.current = null;
        wordCompletionTimesRef.current = [];
        resultRef.current = null;
        setTyped("");
        setCompletedWords([]);
        setCurrentWord("");
        setWordIndex(0);
        setElapsedSeconds(0);
        setStartedAt(null);
        setResult(null);
        setPoints([]);
    }, [mode, wordCount]);

    const restart = useCallback(() => {
        setRestartVersion((version) => version + 1);
        typedRef.current = "";
        currentWordRef.current = "";
        completedWordsRef.current = [];
        wordIndexRef.current = 0;
        startedAtRef.current = null;
        wordCompletionTimesRef.current = [];
        resultRef.current = null;
        setTyped("");
        setCompletedWords([]);
        setCurrentWord("");
        setWordIndex(0);
        setElapsedSeconds(0);
        setStartedAt(null);
        setResult(null);
        setPoints([]);
    }, []);

    const finish = useCallback(
        (
            value = typedRef.current,
            started = startedAtRef.current,
            completionTimes = wordCompletionTimesRef.current,
        ) => {
            const elapsed = Math.max(
                1,
                started ? Math.ceil((Date.now() - started) / 1000) : 1,
            );
            const nextPoints = points.length
                ? points
                : [calculateWpm(value, elapsed, target)];
            const nextResult = calculateResult(
                target,
                value,
                elapsed,
                nextPoints,
                completionTimes,
            );
            setResult(nextResult);
            resultRef.current = nextResult;
        },
        [points, target],
    );

    finishRef.current = finish;

    const handleInput = useCallback(
        (event) => {
            const nextValue = event.target.value;
            const previousValue = typedRef.current;

            if (nextValue.length < previousValue.length) {
                const deletedCount = previousValue.length - nextValue.length;
                for (let index = 0; index < deletedCount; index += 1) {
                    if (currentWordRef.current) {
                        currentWordRef.current = currentWordRef.current.slice(
                            0,
                            -1,
                        );
                        typedRef.current = typedRef.current.slice(0, -1);
                        setCurrentWord(currentWordRef.current);
                    } else if (completedWordsRef.current.length) {
                        const previousWord = completedWordsRef.current.at(-1);
                        completedWordsRef.current =
                            completedWordsRef.current.slice(0, -1);
                        wordCompletionTimesRef.current =
                            wordCompletionTimesRef.current.slice(0, -1);
                        wordIndexRef.current -= 1;
                        currentWordRef.current = previousWord;
                        typedRef.current = typedRef.current.slice(
                            0,
                            -(previousWord.length + 1),
                        );
                        setCompletedWords(completedWordsRef.current);
                        setCurrentWord(previousWord);
                        setWordIndex(wordIndexRef.current);
                    }
                }
                setTyped(typedRef.current);
            }

            const addedValue = nextValue.slice(typedRef.current.length);
            for (const character of addedValue) {
                if (character === " ") {
                    if (
                        !currentWordRef.current ||
                        wordIndexRef.current >= words.length - 1
                    )
                        continue;
                    completedWordsRef.current = [
                        ...completedWordsRef.current,
                        currentWordRef.current,
                    ];
                    wordCompletionTimesRef.current = [
                        ...wordCompletionTimesRef.current,
                        Math.max(
                            Math.floor(
                                (Date.now() - startedAtRef.current) / 1000,
                            ),
                            1,
                        ),
                    ];
                    currentWordRef.current = "";
                    wordIndexRef.current += 1;
                    typedRef.current += " ";
                    setCompletedWords(completedWordsRef.current);
                    setCurrentWord("");
                    setWordIndex(wordIndexRef.current);
                    setTyped(typedRef.current);
                    continue;
                }

                if (character.length !== 1) continue;
                if (!startedAtRef.current) {
                    const now = Date.now();
                    startedAtRef.current = now;
                    setStartedAt(now);
                }
                currentWordRef.current += character;
                typedRef.current += character;
                setCurrentWord(currentWordRef.current);
                setTyped(typedRef.current);
                if (
                    wordIndexRef.current === words.length - 1 &&
                    currentWordRef.current.length >=
                        words[wordIndexRef.current].length
                ) {
                    if (wordCompletionTimesRef.current.length < words.length) {
                        wordCompletionTimesRef.current = [
                            ...wordCompletionTimesRef.current,
                            Math.max(
                                Math.floor(
                                    (Date.now() - startedAtRef.current) / 1000,
                                ),
                                1,
                            ),
                        ];
                    }
                    finishRef.current?.(typedRef.current, startedAtRef.current);
                }
            }

            event.target.value = typedRef.current;
        },
        [words],
    );

    useEffect(() => {
        if (!startedAt || result) return undefined;
        const timer = window.setInterval(() => {
            const elapsed = Math.floor((Date.now() - startedAt) / 1000);
            setElapsedSeconds(elapsed);
            if (elapsed > 0)
                setPoints((current) => [
                    ...current.slice(-59),
                    calculateWpm(typedRef.current, elapsed, target),
                ]);
            if (resultRef.current) return;
        }, 1000);
        return () => window.clearInterval(timer);
    }, [result, startedAt, target]);

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "Tab") {
                event.preventDefault();
                tabPressed.current = true;
                return;
            }
            if (event.key === "Enter" && tabPressed.current) {
                event.preventDefault();
                tabPressed.current = false;
                restart();
                return;
            }
            if (event.target === inputRef.current) return;
            if (
                resultRef.current ||
                event.metaKey ||
                event.ctrlKey ||
                event.altKey
            )
                return;
            if (event.key === "Backspace") {
                if (currentWordRef.current) {
                    currentWordRef.current = currentWordRef.current.slice(
                        0,
                        -1,
                    );
                    typedRef.current = typedRef.current.slice(0, -1);
                    setCurrentWord(currentWordRef.current);
                } else if (completedWordsRef.current.length) {
                    const previousWord = completedWordsRef.current.at(-1);
                    completedWordsRef.current = completedWordsRef.current.slice(
                        0,
                        -1,
                    );
                    wordCompletionTimesRef.current =
                        wordCompletionTimesRef.current.slice(0, -1);
                    wordIndexRef.current -= 1;
                    currentWordRef.current = previousWord;
                    typedRef.current = typedRef.current.slice(
                        0,
                        -(previousWord.length + 1),
                    );
                    setCompletedWords(completedWordsRef.current);
                    setCurrentWord(previousWord);
                    setWordIndex(wordIndexRef.current);
                }
                setTyped(typedRef.current);
                return;
            }
            if (event.key === " ") {
                event.preventDefault();
                if (
                    !currentWordRef.current ||
                    wordIndexRef.current >= words.length - 1
                )
                    return;
                completedWordsRef.current = [
                    ...completedWordsRef.current,
                    currentWordRef.current,
                ];
                wordCompletionTimesRef.current = [
                    ...wordCompletionTimesRef.current,
                    Math.max(
                        (Date.now() - startedAtRef.current) / 1000,
                        1 / 60,
                    ),
                ];
                currentWordRef.current = "";
                wordIndexRef.current += 1;
                typedRef.current += " ";
                setCompletedWords(completedWordsRef.current);
                setCurrentWord("");
                setWordIndex(wordIndexRef.current);
                setTyped(typedRef.current);
                return;
            }
            if (event.key.length !== 1) return;
            if (!startedAtRef.current) {
                const now = Date.now();
                startedAtRef.current = now;
                setStartedAt(now);
            }
            currentWordRef.current += event.key;
            typedRef.current += event.key;
            setCurrentWord(currentWordRef.current);
            setTyped(typedRef.current);
            if (
                wordIndexRef.current === words.length - 1 &&
                currentWordRef.current.length >=
                    words[wordIndexRef.current].length
            ) {
                if (wordCompletionTimesRef.current.length < words.length) {
                    wordCompletionTimesRef.current = [
                        ...wordCompletionTimesRef.current,
                        Math.max(
                            Math.floor(
                                (Date.now() - startedAtRef.current) / 1000,
                            ),
                            1,
                        ),
                    ];
                }
                finishRef.current?.(typedRef.current, startedAtRef.current);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [restart, result, startedAt]);

    return {
        target,
        words,
        typed,
        completedWords,
        currentWord,
        wordIndex,
        charIndex: currentWord.length,
        elapsedSeconds,
        startedAt,
        result,
        restart,
        wpm: calculateWpm(typed, Math.max(1, elapsedSeconds), target),
        accuracy: calculateAccuracy(target, typed),
        isRunning: Boolean(startedAt && !result),
        inputRef,
        handleInput,
    };
}
