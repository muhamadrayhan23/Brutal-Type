import { Line } from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
);

export default function WpmChart({
    points = [],
    compact = false,
    variant = "test",
}) {
    const isProfile = variant === "profile";
    const chartPoints = points.length ? points : [];
    const labels = isProfile
        ? chartPoints.map((_, index) => `Test ${index + 1}`)
        : chartPoints.map((point) => `Word ${point.word}`);
    const values = chartPoints.map((point) =>
        isProfile ? Number(point.accuracy ?? 0) : Number(point.wpm ?? 0),
    );

    return (
        <div className={compact ? "h-24" : "h-72"}>
            <Line
                data={{
                    labels,
                    datasets: [
                        {
                            label: isProfile ? "Accuracy" : "WPM",
                            data: values,
                            borderColor: isProfile ? "#00F0FF" : "#D7FF28",
                            backgroundColor: isProfile
                                ? "rgba(0,240,255,0.08)"
                                : "rgba(215,255,40,0.08)",
                            borderWidth: 3,
                            pointRadius: 3,
                            pointBackgroundColor: "#00F0FF",
                            tension: 0,
                            fill: true,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 350 },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: "#000000",
                            borderColor: "#ffffff",
                            borderWidth: 2,
                            titleFont: { family: "Space Mono" },
                            bodyFont: { family: "Space Mono" },
                            callbacks: {
                                label: (context) => {
                                    const point =
                                        chartPoints[context.dataIndex];

                                    if (isProfile) {
                                        return [
                                            `Accuracy: ${point.accuracy}%`,
                                            `WPM: ${point.wpm}`,
                                            `RAW: ${point.rawWpm}`,
                                            `Mode: ${point.language}`,
                                        ];
                                    }

                                    return [
                                        `Word: ${point.word}`,
                                        `WPM: ${point.wpm}`,
                                        `RAW: ${point.rawWpm}`,
                                        `Accuracy: ${point.accuracy}%`,
                                    ];
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            grid: { color: "#333333" },
                            title: {
                                display: true,
                                text: isProfile
                                    ? "Tests Completed"
                                    : "Words Typed",
                                color: "#ffffff",
                                font: { family: "Space Mono", size: 11 },
                            },
                            ticks: {
                                color: "#777777",
                                font: { family: "Space Mono", size: 10 },
                            },
                        },
                        y: {
                            beginAtZero: true,
                            max: isProfile ? 100 : undefined,
                            title: {
                                display: true,
                                text: isProfile
                                    ? "Accuracy (%)"
                                    : "Words Per Minute",
                                color: "#ffffff",
                                font: { family: "Space Mono", size: 11 },
                            },
                            grid: { color: "#333333" },
                            ticks: {
                                color: "#777777",
                                font: { family: "Space Mono", size: 10 },
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
