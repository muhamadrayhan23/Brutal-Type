import { generate as randomWords } from 'random-words';

const WORD_BANKS = {
    English: randomWords({ exactly: 256, seed: 'brutaltype-english-bank' }),
    Indonesian: 'saya kamu mereka mengetik cepat tepat latihan fokus adalah sebuah kata layar tombol waktu hasil akurasi konsisten kerja belajar tumbuh berani mulai sekarang'.split(' '),
    Code: 'const function return async await import export default component props state value map filter reduce fetch response className display flex grid gap padding margin'.split(' '),
};

export function getWordBank(mode = 'English') {
    return WORD_BANKS[mode] || WORD_BANKS.English;
}

export function buildWordStream(mode = 'English', count = 80, seed = 0) {
    const normalize = (value) => value.trim().replace(/\s+/g, ' ');

    if (mode === 'English') {
        return normalize(randomWords({ exactly: count, join: ' ', seed: `brutaltype-${mode}-${seed}` }));
    }

    const bank = getWordBank(mode);
    return normalize(Array.from({ length: count }, (_, index) => bank[(index + seed) % bank.length]).join(' '));
}

export default WORD_BANKS;
