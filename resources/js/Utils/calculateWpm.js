export function calculateCorrectCharacters(target = "", typed = "") {
    return typed
        .split("")
        .reduce(
            (total, character, index) =>
                total + (character === target[index] ? 1 : 0),
            0,
        );
}

export function calculateAccuracy(target = "", typed = "") {
    if (!typed.length) return 100;
    return Math.round(
        (calculateCorrectCharacters(target, typed) / typed.length) * 100,
    );
}

export function calculateWpm(typed = "", elapsedSeconds = 0, target = "") {
    const correct = target
        ? calculateCorrectCharacters(target, typed)
        : typed.length;
    return Math.round(correct / 5 / Math.max(elapsedSeconds / 60, 1 / 60)) || 0;
}

export function calculateRawWpm(typed = "", elapsedSeconds = 0) {
    return (
        Math.round(typed.length / 5 / Math.max(elapsedSeconds / 60, 1 / 60)) ||
        0
    );
}

export function calculateResult(
    target,
    typed,
    elapsedSeconds,
    points = [],
    wordCompletionTimes = [],
) {
    const correct = calculateCorrectCharacters(target, typed);
    const wordStats = calculateWordStats(
        target,
        typed,
        elapsedSeconds,
        wordCompletionTimes,
    );
    return {
        wpm: calculateWpm(typed, elapsedSeconds, target),
        rawWpm: calculateRawWpm(typed, elapsedSeconds),
        accuracy: calculateAccuracy(target, typed),
        consistency:
            points.length > 1
                ? Math.max(
                      0,
                      Math.round(
                          100 - (Math.max(...points) - Math.min(...points)),
                      ),
                  )
                : 100,
        timeElapsed: elapsedSeconds,
        wordStats,
        correct,
        errors: Math.max(0, typed.length - correct),
        points,
    };
}

export function calculateWordStats(
    target = "",
    typed = "",
    elapsedSeconds = 1,
    wordCompletionTimes = [],
) {
    const targetWords = target.split(" ").filter(Boolean);
    const typedWords = typed.split(" ");
    const elapsed = Math.max(elapsedSeconds, 1);

    return targetWords.map((word, index) => {
        const completedText = typedWords.slice(0, index + 1).join(" ");
        const completedTarget = targetWords.slice(0, index + 1).join(" ");
        const completedCharacters = completedText.length;
        const correctCharacters = calculateCorrectCharacters(
            completedTarget,
            completedText,
        );
        const estimatedProgress = Math.min(
            1,
            completedCharacters / Math.max(completedTarget.length, 1),
        );
        const elapsedAtWord = Math.max(
            Number(wordCompletionTimes[index]) || elapsed * estimatedProgress,
            1 / 60,
        );

        return {
            word: index + 1,
            wpm: Math.round(correctCharacters / 5 / (elapsedAtWord / 60)),
            rawWpm: Math.round(completedCharacters / 5 / (elapsedAtWord / 60)),
            accuracy: completedCharacters
                ? Math.round((correctCharacters / completedCharacters) * 100)
                : 100,
        };
    });
}
