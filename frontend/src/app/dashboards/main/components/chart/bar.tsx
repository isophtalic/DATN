import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const get_options = (title: string) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            // title: {
            //     display: true,
            //     text: title,
            // },
        },
    }
};


export const get_data = (labels: string[], dataArray: number[], comment: string) => {
    return {
        labels,
        datasets: [
            {
                label: comment,
                data: dataArray,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }

};

type ChartPageProps = {
    title: string,
    labels: string[],
    dataArray: number[]
    comment: string
}

const BarChartCustom = ({ title, labels, dataArray, comment }: ChartPageProps) => {
    return <Bar options={get_options(title)} data={get_data(labels, dataArray, comment)} />;
}

export default BarChartCustom