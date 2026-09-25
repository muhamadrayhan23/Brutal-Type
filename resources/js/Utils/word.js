import { generate as randomWords } from "random-words";

const WORD_BANKS = {
    English: randomWords({ exactly: 256, seed: "brutaltype-english-bank" }),
    Indonesian:
        "saya kamu mereka mengetik cepat tepat latihan fokus adalah sebuah kata layar tombol waktu hasil akurasi konsisten kerja belajar tumbuh berani mulai sekarang sistem aplikasi kode data fitur proses karya manusia pikir rasa jalan arah batas tujuan tingkat nilai nyata bentuk ruang waktu malam siang terang gelap tinggi luas capai bisa mampu buat jadi".split(
            " ",
        ),
    Code: "const function return async await import export default component props state value map filter reduce fetch response className display flex grid gap padding margin console log let var if else switch case break try catch throw new class extends interface type null undefined true false length push pop shift unshift inline block".split(
        " ",
    ),
};

function createSeededRandom(seedString) {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = (Math.imul(31, hash) + seedString.charCodeAt(i)) | 0;
    }
    return function () {
        hash = (hash ^ (hash << 13)) | 0;
        hash = (hash ^ (hash >> 17)) | 0;
        hash = (hash ^ (hash << 5)) | 0;
        return (Math.abs(hash) % 100000) / 100000;
    };
}

export function getWordBank(mode = "English") {
    return WORD_BANKS[mode] || WORD_BANKS.English;
}

export function buildWordStream(mode = "English", count = 80, seed = 0) {
    const normalize = (value) => value.trim().replace(/\s+/g, " ");
    const seedKey = `brutaltype-${mode}-${seed}`;

    if (mode === "English") {
        return normalize(
            randomWords({ exactly: count, join: " ", seed: seedKey }),
        );
    }

    const bank = getWordBank(mode);
    const rng = createSeededRandom(seedKey);

    const words = Array.from({ length: count }, () => {
        const randomIndex = Math.floor(rng() * bank.length);
        return bank[randomIndex];
    });

    return normalize(words.join(" "));
}

export default WORD_BANKS;
