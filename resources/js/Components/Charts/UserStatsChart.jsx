import { Bar } from "react-chartjs-2";
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Tooltip,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function UserStatsChart({ points = [] }) {
    const labels = Array.from(
        { length: 10 },
        (_, index) => `${index * 10}-${index * 10 + 9}`,
    );
    const testCounts = labels.map(() => 0);

    points.forEach((point) => {
        const wpm = Math.round(Number(point.wpm ?? 0));
        const category = Math.floor(wpm / 10);

        if (category >= 0 && category < testCounts.length) {
            testCounts[category] += 1;
        }
    });

    return (
        <div className="h-72">
            <Bar
                data={{
                    labels,
                    datasets: [
                        {
                            label: "Tests",
                            data: testCounts,
                            backgroundColor: "rgba(0,240,255,0.72)",
                            borderColor: "#00F0FF",
                            borderWidth: 1,
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
                                label: (context) =>
                                    `Tests: ${context.parsed.y}`,
                                title: (context) => `WPM: ${context[0].label}`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            grid: { color: "#333333" },
                            title: {
                                display: true,
                                text: "Words Per Minute",
                                color: "#ffffff",
                                font: { family: "Space Mono", size: 11 },
                            },
                            ticks: {
                                color: "#777777",
                                font: { family: "Space Mono", size: 10 },
                                maxTicksLimit: 11,
                            },
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Tests Completed",
                                color: "#ffffff",
                                font: { family: "Space Mono", size: 11 },
                            },
                            grid: { color: "#333333" },
                            ticks: {
                                color: "#777777",
                                font: { family: "Space Mono", size: 10 },
                                precision: 0,
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
