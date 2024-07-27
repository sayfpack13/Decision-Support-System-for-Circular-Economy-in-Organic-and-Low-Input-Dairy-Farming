import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Paper, Typography, Grid, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { simulationResultModel } from '../utils/InputModels';
import { simulateResult } from '../utils/Calculations';
import { LoaderContext } from '../Loader';
import 'chartjs-adapter-date-fns';
import debounce from 'lodash/debounce';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    zoomPlugin
);

export default function SimulationResults({ simulationRecords, small }) {
    const predictionPeriods = [1, 7, 30];
    const [predictionPeriod, setPredictionPeriod] = useState(predictionPeriods[0]);
    const [simulationResults, setSimulationResults] = useState([]);
    const [simulationResultsDates, setSimulationResultsDates] = useState([]);
    const { isLoading, setisLoading } = useContext(LoaderContext);

    const handleSimulate = useCallback(async () => {
        try {
            const groupedSimulationRecords = {};
            const groupIds = [];

            simulationRecords.forEach(simulationRecord => {
                if (!groupedSimulationRecords[simulationRecord.group_id]) {
                    groupedSimulationRecords[simulationRecord.group_id] = [];
                    groupIds.push(simulationRecord.group_id);
                }
                groupedSimulationRecords[simulationRecord.group_id].push(simulationRecord);
            });

            const newSimulationResults = [];
            const newSimulationResultsDates = [];

            groupIds.forEach(group_id => {
                const groupedSimulationRecord = groupedSimulationRecords[group_id];
                groupedSimulationRecord.sort((a, b) => new Date(a.date) - new Date(b.date));

                let combinedSimulationResult = simulationResultModel();
                combinedSimulationResult.group_id = group_id;

                groupedSimulationRecord.forEach((record, index) => {
                    const isLast = index === groupedSimulationRecord.length - 1;
                    const simulationResult = simulateResult(record, isLast ? predictionPeriod : 1);

                    combinedSimulationResult.simulationRecords.push(...simulationResult.simulationRecords);
                    combinedSimulationResult.dates.push(...simulationResult.dates);
                    combinedSimulationResult.forageYield.push(...simulationResult.forageYield);
                    combinedSimulationResult.feedNeeds.push(...simulationResult.feedNeeds);
                    combinedSimulationResult.totalForageProduction.push(...simulationResult.totalForageProduction);
                    combinedSimulationResult.totalFeedNeeds.push(...simulationResult.totalFeedNeeds);
                    combinedSimulationResult.forageSurplus.push(...simulationResult.forageSurplus);
                    combinedSimulationResult.recommendations.push(...simulationResult.recommendations);
                });

                newSimulationResults.push(combinedSimulationResult);
                newSimulationResultsDates.push(combinedSimulationResult.dates);
            });

            setSimulationResults(newSimulationResults);
            setSimulationResultsDates(newSimulationResultsDates);
        } finally {
            setisLoading(false);
        }
    }, [simulationRecords, predictionPeriod, setisLoading]);

    const debouncedHandleSimulate = useMemo(() => debounce(handleSimulate, 300), [handleSimulate]);

    useEffect(() => {
        if (!simulationRecords.length) return;
        setisLoading(true);
        debouncedHandleSimulate();
    }, [simulationRecords, predictionPeriod, debouncedHandleSimulate, setisLoading]);

    const processData = (results, key) => {
        return results.map((result, index) => ({
            label: `${key.replace(/([a-z])([A-Z])/g, '$1 $2')} (${result.group_id})`,
            data: result.dates.map((date, i) => ({ x: new Date(date), y: result[key][i] })),
            borderColor: `hsl(${index * 60}, 100%, 50%)`,
            backgroundColor: `hsla(${index * 60}, 100%, 50%, 0.6)`,
            borderWidth: 1,
            barThickness: 10, // Fixed bar thickness
            maxBarThickness: 15, // Maximum bar thickness
            minBarLength: 2 // Minimum bar length
        }));
    };

    const processedDataForage = useMemo(() => processData(simulationResults, 'forageYield'), [simulationResults]);
    const processedDataFeedNeeds = useMemo(() => processData(simulationResults, 'feedNeeds'), [simulationResults]);
    const processedDataComparison = useMemo(() => [
        ...processData(simulationResults, 'totalForageProduction'),
        ...processData(simulationResults, 'totalFeedNeeds')
    ], [simulationResults]);
    const processedDataSurplus = useMemo(() => processData(simulationResults, 'forageSurplus'), [simulationResults]);

    const dataForage = useMemo(() => ({
        datasets: processedDataForage,
    }), [processedDataForage]);

    const dataFeedNeeds = useMemo(() => ({
        datasets: processedDataFeedNeeds,
    }), [processedDataFeedNeeds]);

    const dataComparison = useMemo(() => ({
        datasets: processedDataComparison,
    }), [processedDataComparison]);

    const dataSurplus = useMemo(() => ({
        datasets: processedDataSurplus,
    }), [processedDataSurplus]);

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM d, h:mm a'
                    },
                    tooltipFormat: 'MMM d, yyyy, h:mm a'
                },
                title: {
                    display: true,
                    text: 'Date and Time',
                    color: '#4a4a4a',
                    font: {
                        family: 'Arial',
                        size: 14,
                        weight: 'bold',
                    }
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 0,
                    color: '#4a4a4a',
                    font: {
                        family: 'Arial',
                        size: 12,
                    }
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Values (kg)',
                    color: '#4a4a4a',
                    font: {
                        family: 'Arial',
                        size: 14,
                        weight: 'bold',
                    }
                },
                ticks: {
                    color: '#4a4a4a',
                    font: {
                        family: 'Arial',
                        size: 12,
                    }
                }
            },
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#4a4a4a',
                    font: {
                        family: 'Arial',
                        size: 12,
                    }
                }
            },
            title: {
                display: true,
                text: 'Simulation Results',
                color: '#4a4a4a',
                font: {
                    family: 'Arial',
                    size: 16,
                    weight: 'bold',
                }
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    mode: 'x',
                },
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
                        onChange={(e) => {
                            const value = e.target.value;
                            if (predictionPeriods.includes(value)) {
                                setPredictionPeriod(value);
                            }
                        }}
                        label="Prediction Period"
                    >
                        {predictionPeriods.map((period, index) => (
                            <MenuItem key={index} value={period}>
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
                    <Line data={dataForage} options={chartOptions} />
                </Grid>
                <Grid item xs={12} md={small ? 12 : 6}>
                    <Box mb={2}>
                        <Typography variant="h6">Feed Needs Over Time</Typography>
                    </Box>
                    <Bar data={dataFeedNeeds} options={chartOptions} />
                </Grid>
                <Grid item xs={12} md={small ? 12 : 6}>
                    <Box mb={2}>
                        <Typography variant="h6">Comparison of Total Forage Production and Total Feed Needs</Typography>
                    </Box>
                    <div style={{ overflowX: 'auto' }}>
                        <div style={{ minWidth: '1000px' }}>
                            <Bar data={dataComparison} options={chartOptions} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} md={small ? 12 : 6}>
                    <Box mb={2}>
                        <Typography variant="h6">Forage Surplus Over Time</Typography>
                    </Box>
                    <Line data={dataSurplus} options={chartOptions} />
                </Grid>
            </Grid>
        </Paper>
    );
}
