import { generate as randomWords } from "random-words";

// Daftar kata bawaan untuk Indonesian dan Code
const INDONESIAN_WORDS = [
    "saya",
    "kamu",
    "mereka",
    "mengetik",
    "cepat",
    "tepat",
    "latihan",
    "fokus",
    "adalah",
    "sebuah",
    "kata",
    "layar",
    "tombol",
    "waktu",
    "hasil",
    "akurasi",
    "konsisten",
    "kerja",
    "belajar",
    "tumbuh",
    "berani",
    "mulai",
    "sekarang",
    "sistem",
    "aplikasi",
    "kode",
    "data",
    "fitur",
    "proses",
    "karya",
    "manusia",
    "pikir",
    "rasa",
    "jalan",
    "arah",
    "batas",
    "tujuan",
    "tingkat",
    "nilai",
    "nyata",
    "bentuk",
    "ruang",
    "malam",
    "siang",
    "terang",
    "gelap",
    "tinggi",
    "luas",
    "capai",
    "bisa",
    "selanjutnya",
    "segera",
    "akhirnya",
    "selalu",
    "kadang",
    "sering",
    "jarang",
    "pasti",
    "mungkin",
    "tidak",
    "ya",
    "tidak",
    "benar",
    "salah",
    "baik",
    "buruk",
    "besar",
    "kecil",
    "panjang",
    "pendek",
    "cepat",
    "lambat",
    "mudah",
    "sulit",
    "ringan",
    "berat",
    "panas",
    "dingin",
    "basah",
    "kering",
    "baru",
    "lama",
    "indah",
    "jelek",
    "senang",
    "sedih",
    "marah",
    "tenang",
    "bingung",
    "penuh",
    "kosong",
    "hidup",
    "mati",
    "cinta",
    "benci",
    "teman",
    "musuh",
    "keluarga",
    "anak",
    "pagi",
    "siang",
    "sore",
    "malam",
    "hari",
    "minggu",
    "bulan",
    "tahun",
    "waktu",
];

const CODE_WORDS = [
    "const",
    "function",
    "return",
    "async",
    "await",
    "import",
    "export",
    "default",
    "component",
    "props",
    "state",
    "value",
    "map",
    "filter",
    "reduce",
    "fetch",
    "response",
    "className",
    "display",
    "flex",
    "grid",
    "gap",
    "padding",
    "margin",
    "console",
    "log",
    "let",
    "var",
    "if",
    "else",
    "switch",
    "case",
    "break",
    "try",
    "catch",
    "throw",
    "new",
    "class",
    "extends",
    "interface",
    "type",
    "null",
    "undefined",
    "true",
    "false",
    "length",
    "push",
    "pop",
    "shift",
    "unshift",
];

// Helper fungsi generator acak yang perilakunya persis seperti randomWords()
function generateCustomWords(wordList, options = {}) {
    const { exactly = 10, join, seed } = options;

    let hash = 0;
    const seedStr = String(seed || "default-seed");
    for (let i = 0; i < seedStr.length; i++) {
        hash = (Math.imul(31, hash) + seedStr.charCodeAt(i)) | 0;
    }
    const rng = () => {
        hash = (hash ^ (hash << 13)) | 0;
        hash = (hash ^ (hash >> 17)) | 0;
        hash = (hash ^ (hash << 5)) | 0;
        return (Math.abs(hash) % 100000) / 100000;
    };

    const result = Array.from({ length: exactly }, () => {
        const randomIndex = Math.floor(rng() * wordList.length);
        return wordList[randomIndex];
    });

    return join ? result.join(join) : result;
}

// WORD_BANKS dengan struktur seragam untuk semua mode
const WORD_BANKS = {
    English: randomWords({ exactly: 256, seed: "brutaltype-english-bank" }),
    Indonesian: generateCustomWords(INDONESIAN_WORDS, {
        exactly: 256,
        seed: "brutaltype-indonesian-bank",
    }),
    Code: generateCustomWords(CODE_WORDS, {
        exactly: 256,
        seed: "brutaltype-code-bank",
    }),
};

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
    if (mode === "Indonesian") {
        return normalize(
            generateCustomWords(INDONESIAN_WORDS, {
                exactly: count,
                join: " ",
                seed: seedKey,
            }),
        );
    }
    if (mode === "Code") {
        return normalize(
            generateCustomWords(CODE_WORDS, {
                exactly: count,
                join: " ",
                seed: seedKey,
            }),
        );
    }

    return normalize(randomWords({ exactly: count, join: " ", seed: seedKey }));
}

export default WORD_BANKS;
