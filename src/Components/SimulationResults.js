import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Paper, Typography, Grid, Box } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function SimulationResults({ results, small }) {
    // Process results to create datasets
    const dates = results.length > 0 ? results[0].dates : [];

    // Data for Line charts
    const dataForage = {
        labels: dates,
        datasets: results.map((result, index) => ({
            label: `Forage Production (${result.name})`,
            data: result.forageProduction,
            borderColor: `hsl(${index * 60}, 100%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 100%, 50%, 0.2)`,
            borderWidth: 1,
        })),
    };

    const dataFeedNeeds = {
        labels: dates,
        datasets: results.map((result, index) => ({
            label: `Feed Needs (${result.name})`,
            data: result.feedNeeds,
            borderColor: `hsl(${index * 60}, 100%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 100%, 50%, 0.2)`,
            borderWidth: 1,
        })),
    };

    // Aggregate data for Bar charts
    const totalForageProduction = results.reduce((sum, result) => sum + parseFloat(result.totalForageProduction), 0);
    const totalFeedNeeds = results.reduce((sum, result) => sum + parseFloat(result.totalFeedNeeds), 0);
    const forageSurplus = results.reduce((sum, result) => sum + parseFloat(result.forageSurplus), 0);

    // Data for Bar charts
    const dataComparison = {
        labels: results.map(result => result.name),
        datasets: [
            {
                label: 'Total Forage Production',
                data: results.map(result => result.totalForageProduction),
                backgroundColor: 'blue',
                borderColor: 'darkblue',
                borderWidth: 1,
            },
            {
                label: 'Total Feed Needs',
                data: results.map(result => result.totalFeedNeeds),
                backgroundColor: 'red',
                borderColor: 'darkred',
                borderWidth: 1,
            },
        ],
    };

    const dataSurplus = {
        labels: results.map(result => result.name),
        datasets: [
            {
                label: 'Forage Surplus',
                data: results.map(result => result.forageSurplus),
                backgroundColor: 'green',
                borderColor: 'darkgreen',
                borderWidth: 1,
            },
        ],
    };

    // Options for charts
    const lineOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Forage Production vs Feed Needs',
            },
        },
    };

    const barOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
            },
        },
    };

    return (
        <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h5" gutterBottom>
                Simulation Results
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={small ? 12 : 6}>
                    <Box mb={2}>
                        <Typography variant="h6">Forage Production Over Time</Typography>
                    </Box>
                    <Line data={dataForage} options={lineOptions} />
                </Grid>
                <Grid item xs={12} md={small ? 12 : 6}>
                    <Box mb={2}>
                        <Typography variant="h6">Feed Needs Over Time</Typography>
                    </Box>
                    <Line data={dataFeedNeeds} options={lineOptions} />
                </Grid>
                <Grid item xs={12} md={small ? 12 : 6}>
                    <Box mb={2}>
                        <Typography variant="h6">Comparison of Total Forage Production and Total Feed Needs</Typography>
                    </Box>
                    <Bar data={dataComparison} options={{ ...barOptions, plugins: { ...barOptions.plugins, title: { ...barOptions.plugins.title, text: 'Total Forage Production vs Total Feed Needs' } } }} />
                </Grid>
                <Grid item xs={12} md={small ? 12 : 6}>
                    <Box mb={2}>
                        <Typography variant="h6">Forage Surplus</Typography>
                    </Box>
                    <Bar data={dataSurplus} options={{ ...barOptions, plugins: { ...barOptions.plugins, title: { ...barOptions.plugins.title, text: 'Forage Surplus' } } }} />
                </Grid>
            </Grid>
            <Box mt={4}>
                <Typography variant="h6">Detailed Results</Typography>
                <Typography variant="body1"><strong>Total Forage Production:</strong> {totalForageProduction} kg</Typography>
                <Typography variant="body1"><strong>Total Feed Needs:</strong> {totalFeedNeeds} kg</Typography>
                <Typography variant="body1"><strong>Forage Surplus/Deficit:</strong> {forageSurplus} kg</Typography>
            </Box>
        </Paper>
    );
}
