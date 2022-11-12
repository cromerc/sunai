import React, { useState, useEffect } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        }
    },
};

export default function ChartComponent({ data }) {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Dataset',
                data: [1, 4, 10],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ]
    });

    const [labels, setLabels] = useState([]);

    useEffect(() => {
        if (data.length > 0) {
            setLabels(data[data.length - 1].times);
            setChartData(
                {
                    labels,
                    datasets: [
                        {
                            label: data[data.length - 1].device,
                            data: data[data.length - 1].powers,
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        }
                    ]
                }
            );
        }
    }, [data]);

    return (
        <div className="w-full">
            <Line options={options} data={chartData} />
        </div>
    );
};
