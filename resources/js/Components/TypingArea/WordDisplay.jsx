export default function WordDisplay({
    target,

    words = target.split(" "),
    completedWords = [],
    currentWord = "",
    wordIndex = 0,
    charIndex = currentWord.length,
}) {
    return (
        <div
            className="min-h-44 border-3 border-white bg-surface-dark p-6 shadow-brutal-white md:p-8"
            aria-label="Typing text"
        >
            <div className="font-mono text-xl leading-[2.2] tracking-wide md:text-2xl">
                {words.map((word, wordPosition) => (
                    <span
                        key={`${word}-${wordPosition}`}
                        className="mr-3 inline-block"
                    >
                        {word.split("").map((character, characterPosition) => {
                            const typedCharacter =
                                wordPosition < wordIndex
                                    ? completedWords[wordPosition]?.[
                                          characterPosition
                                      ]
                                    : wordPosition === wordIndex
                                      ? currentWord[characterPosition]
                                      : undefined;
                            const state =
                                typedCharacter === undefined
                                    ? "text-white/35"
                                    : typedCharacter === character
                                      ? "text-white"
                                      : "bg-red-500 text-black";
                            return (
                                <span
                                    key={`${character}-${characterPosition}`}
                                    className={`relative ${state}`}
                                >
                                    {wordPosition === wordIndex &&
                                        characterPosition === charIndex && (
                                            <i className="absolute -left-0.5 top-1 h-7 w-1.5 animate-pulse bg-lime-electric" />
                                        )}
                                    {character}
                                </span>
                            );
                        })}
                        {wordPosition === wordIndex &&
                            currentWord.length > word.length && (
                                <span className="bg-red-500 px-1 text-black">
                                    {currentWord.slice(word.length)}
                                </span>
                            )}
                    </span>
                ))}
            </div>
        </div>
    );
}
