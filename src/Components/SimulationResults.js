import React, { useContext, useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Paper, Typography, Grid, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { simulationRecordModel, simulationResultModel } from '../utils/InputModels';
import { simulateResult } from '../utils/Calculations';
import { LoaderContext } from '../Loader';

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

export default function SimulationResults({ simulationRecords, small }) {
    const predictionPeriods = [1, 7, 30]; // Prediction period options in days
    const [predictionPeriod, setPredictionPeriod] = useState(predictionPeriods[0]); // Default to 7 days
    const [simulationResults, setsimulationResults] = useState([]);
    const [simulationResultsDates, setsimulationResultsDates] = useState([]);
    const { isLoading, setisLoading } = useContext(LoaderContext);

    useEffect(() => {
        if (!simulationRecords.length) {
            return;
        }
        setisLoading(true);
        handleSimulate();
    }, [simulationRecords, predictionPeriod]);

    const handleSimulate = () => {
        var grouped_simulationRecords = [];
        var group_ids = [];

        // Group by group_id
        for (let a = 0; a < simulationRecords.length; a++) {
            const simulationRecord = simulationRecords[a];
            if (!grouped_simulationRecords[simulationRecord.group_id]) {
                grouped_simulationRecords[simulationRecord.group_id] = [];
                group_ids.push(simulationRecord.group_id);
            }
            grouped_simulationRecords[simulationRecord.group_id].push(simulationRecord);
        }

        const new_simulationResults = [];
        const new_simulationResultsDates = [];

        // Combine simulation records values
        for (let a = 0; a < group_ids.length; a++) {
            const grouped_simulationRecord = grouped_simulationRecords[group_ids[a]];

            const combined_simulationResult = simulationResultModel();
            combined_simulationResult.group_id = group_ids[a];

            for (let b = 0; b < grouped_simulationRecord.length; b++) {
                const simulationResult = simulateResult(grouped_simulationRecord[b], predictionPeriod);

                combined_simulationResult.simulationRecords.push(...simulationResult.simulationRecords);
                combined_simulationResult.dates.push(...simulationResult.dates);
                combined_simulationResult.forageYield.push(...simulationResult.forageYield);
                combined_simulationResult.feedNeeds.push(...simulationResult.feedNeeds);
                combined_simulationResult.totalForageProduction.push(...simulationResult.totalForageProduction);
                combined_simulationResult.totalFeedNeeds.push(...simulationResult.totalFeedNeeds);
                combined_simulationResult.forageSurplus.push(...simulationResult.forageSurplus);
                combined_simulationResult.recommendations.push(...simulationResult.recommendations);
            }

            new_simulationResults.push(combined_simulationResult);
            new_simulationResultsDates.push(combined_simulationResult.dates);
        }

        setsimulationResults(new_simulationResults);
        setsimulationResultsDates(new_simulationResultsDates);
        setisLoading(false);
    };

    // Data for Line charts
    const dataForage = {
        labels: simulationResultsDates.flat(),
        datasets: simulationResults.map((result, index) => ({
            label: `Forage Production (${result.group_id})`,
            data: result.forageYield.flat(),
            borderColor: `hsl(${index * 60}, 100%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 100%, 50%, 0.2)`,
            borderWidth: 1,
        })),
    };

    const dataFeedNeeds = {
        labels: simulationResultsDates.flat(),
        datasets: simulationResults.map((result, index) => ({
            label: `Feed Needs (${result.group_id})`,
            data: result.feedNeeds.flat(),
            borderColor: `hsl(${index * 60}, 100%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 100%, 50%, 0.2)`,
            borderWidth: 1,
        })),
    };

    // Data for Bar charts
    const dataComparison = {
        labels: simulationResultsDates.flat(),
        datasets: simulationResults.map((result, index) => ({
            label: `Total Forage Production (${result.group_id})`,
            data: result.totalForageProduction,
            backgroundColor: `hsl(${index * 60}, 100%, 50%)`,
            borderColor: `hsl(${index * 60}, 100%, 30%)`,
            borderWidth: 1,
        })).concat(
            simulationResults.map((result, index) => ({
                label: `Total Feed Needs (${result.group_id})`,
                data: result.totalFeedNeeds,
                backgroundColor: `hsl(${(index + 1) * 60}, 50%, 50%)`,
                borderColor: `hsl(${(index + 1) * 60}, 50%, 30%)`,
                borderWidth: 1,
            }))
        ),
    };

    const dataSurplus = {
        labels: simulationResultsDates.flat(),
        datasets: simulationResults.map((result, index) => ({
            label: `Forage Surplus (${result.group_id})`,
            data: result.forageSurplus,
            borderColor: `hsl(${index * 60}, 100%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 100%, 50%, 0.2)`,
            borderWidth: 1,
        })),
    };

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
            <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                <FormControl variant="outlined" style={{ width: "20%" }}>
                    <InputLabel>Prediction Period</InputLabel>
                    <Select
                        value={predictionPeriod}
                        onChange={(e) => setPredictionPeriod(e.target.value)}
                        label="Prediction Period"
                    >
                        {predictionPeriods.map((period) => (
                            <MenuItem key={period} value={period}>
                                {period} days
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
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
        </Paper>
    );
}
