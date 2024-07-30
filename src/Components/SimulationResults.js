import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import { Paper, Typography, Grid, Box, Select, MenuItem, FormControl, InputLabel, Card, CardHeader, CardContent, Divider, Icon } from '@mui/material';
import { simulationResultModel } from '../utils/InputModels';
import { getRecommendation, simulateResult } from '../utils/Calculations';
import { LoaderContext } from './Loader';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import { List, ListItem, ListItemText } from '@mui/material';


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
    const predictionPeriods = Array.from({ length: 30 }, (_, i) => i + 1);
    const [predictionPeriod, setPredictionPeriod] = useState(predictionPeriods[0]);
    const [simulationResults, setSimulationResults] = useState([]);
    const { isLoading, setisLoading } = useContext(LoaderContext);

    const handleSimulate = () => {
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

                // combining same group simulations
                let combinedSimulationResult = simulationResultModel();
                combinedSimulationResult.group_id = group_id;

                groupedSimulationRecord.forEach((record, index) => {
                    const isLast = index === groupedSimulationRecord.length - 1;
                    const simulationResult = simulateResult(record, isLast ? predictionPeriod : 1);

                    combinedSimulationResult.simulationRecords.push(...simulationResult.simulationRecords);
                    combinedSimulationResult.dates.push(...simulationResult.dates);
                    combinedSimulationResult.forageYield.push(...simulationResult.forageYield);
                    combinedSimulationResult.feedNeeds.push(...simulationResult.feedNeeds);
                    combinedSimulationResult.dailyForageProduction.push(...simulationResult.dailyForageProduction);
                    combinedSimulationResult.dailyFeedNeeds.push(...simulationResult.dailyFeedNeeds);
                    combinedSimulationResult.dailyForageSurplus.push(...simulationResult.dailyForageSurplus);
                    combinedSimulationResult.meanForageProduction += simulationResult.meanForageProduction;
                    combinedSimulationResult.meanFeedNeeds += simulationResult.meanFeedNeeds;
                    combinedSimulationResult.meanForageSurplus += simulationResult.meanForageSurplus;
                });

                // overall data
                combinedSimulationResult.meanForageProduction /= groupedSimulationRecord.length
                combinedSimulationResult.meanFeedNeeds /= groupedSimulationRecord.length
                combinedSimulationResult.meanForageSurplus /= groupedSimulationRecord.length
                combinedSimulationResult.recommendation = getRecommendation(combinedSimulationResult)

                newSimulationResults.push(combinedSimulationResult);
                newSimulationResultsDates.push(combinedSimulationResult.dates);
            });

            setSimulationResults(newSimulationResults);
        } finally {
            setTimeout(() => {
                setisLoading(false);
            }, 300)
        }
    }


    useEffect(() => {
        if (simulationRecords.length) {
            setisLoading(true);
            handleSimulate();
        } else {
            setSimulationResults([])
        }
    }, [predictionPeriod, simulationRecords]);

    const processData = (results, key) => {
        return results.map((result, index) => ({
            label: `${key.replace(/([a-z])([A-Z])/g, '$1 $2')} (${result.group_id})`,
            data: result.dates.map((date, i) => ({ x: new Date(date), y: result[key][i] })),
            borderColor: `hsl(${index * 80}, 100%, 50%)`,
            backgroundColor: `hsla(${index * 80}, 100%, 50%, 0.6)`,
            borderWidth: 1,
            barThickness: 10,
            maxBarThickness: 15,
            minBarLength: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }));
    };

    const processedDataForage = useMemo(() => processData(simulationResults, 'forageYield'), [simulationResults]);
    const processedDataFeedNeeds = useMemo(() => processData(simulationResults, 'feedNeeds'), [simulationResults]);
    const processedDataComparison = useMemo(() => [
        ...processData(simulationResults, 'dailyForageProduction'),
        ...processData(simulationResults, 'dailyFeedNeeds')
    ], [simulationResults]);
    const processedDataSurplus = useMemo(() => processData(simulationResults, 'dailyForageSurplus'), [simulationResults]);

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

    const chartOptions = (title, xLabel, xUnit, yLabel, yUnit) => {
        return {
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
                        text: xLabel,
                        color: '#4a4a4a',
                        font: {
                            family: 'Arial',
                            size: 14,
                            weight: 'bold',
                        }
                    },
                    ticks: {
                        callback: xUnit && function (value) {
                            return value + " " + xUnit
                        },
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
                        text: yLabel,
                        color: '#4a4a4a',
                        font: {
                            family: 'Arial',
                            size: 14,
                            weight: 'bold',
                        }
                    },
                    ticks: {
                        callback: yUnit && function (value) {
                            return value + " " + yUnit
                        },
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
                    text: title,
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
        }
    }

    if (simulationResults.length == 0) {
        return (
            <div className='icon-bg'>
                <div className='icon-bg-content'>
                    <FlutterDashIcon />
                    <div className='icon-bg-msg'>Please select or run a simulation to view the results</div>
                </div>
            </div>
        )
    } else
        return (
            <div className='simulation-result'>
                <Typography variant="h5" gutterBottom>
                    Simulation Results
                </Typography>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                    <FormControl variant="outlined" style={{ width: "20%" }}>
                        <InputLabel>Prediction Period (from saved date)</InputLabel>
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
                                    {period + (period == 1 ? " day" : " days")}
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
                        <Line data={dataForage} options={chartOptions("Forage Production Over Time", "Date", "", "Production", "Kg")} />
                    </Grid>
                    <Grid item xs={12} md={small ? 12 : 6}>
                        <Box mb={2}>
                            <Typography variant="h6">Feed Needs Over Time</Typography>
                        </Box>
                        <Line data={dataFeedNeeds} options={chartOptions("Feed Needs Over Time", "Date", "", "Needs", "Kg")} />

                    </Grid>
                    <Grid item xs={12}>
                        <div className='cards'>
                            <Card className='card'>
                                <CardHeader className='card-title' title="Mean Forage Production"></CardHeader>
                                <Divider />
                                <CardContent className='card-content'>
                                    {simulationResults.map((sim, index) => (
                                        <div key={index} style={{ color: `hsl(${index * 100}, 100%, 30%)` }}>
                                            {sim.group_id}: {sim.meanForageProduction.toFixed(2)} Kg
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                            <Card className='card'>
                                <CardHeader className='card-title' title="Mean Feed Needs"></CardHeader>
                                <Divider />
                                <CardContent className='card-content'>
                                    {simulationResults.map((sim, index) => (
                                        <div key={index} style={{ color: `hsl(${index * 100}, 100%, 30%)` }}>
                                            {sim.group_id}: {sim.meanFeedNeeds.toFixed(2)} Kg
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={small ? 12 : 6}>
                        <Box mb={2}>
                            <Typography variant="h6">Comparison of Total Forage Production and Total Feed Needs</Typography>
                        </Box>
                        <Bar data={dataComparison} options={chartOptions("Comparison of Total Forage Production and Total Feed Needs", "Date", "", "Production Vs Needs", "Kg")} />
                    </Grid>
                    <Grid item xs={12} md={small ? 12 : 6}>
                        <Box mb={2}>
                            <Typography variant="h6">Forage Surplus Over Time</Typography>
                        </Box>
                        <Bar data={dataSurplus} options={chartOptions("Forage Surplus Over Time", "Date", "", "Surplus", "Kg")} />
                    </Grid>
                    <Grid item xs={12}>
                        <Card className='card'>
                            <CardHeader className='card-title' title="Mean Forage Surplus"></CardHeader>
                            <Divider />
                            <CardContent className='card-content'>
                                {simulationResults.map((sim, index) => (
                                    <div key={index} style={{ color: `hsl(${index * 100}, 100%, 30%)` }}>
                                        {sim.group_id}: {sim.meanForageSurplus.toFixed(2)} Kg
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <div className='recommendations-container'>
                            <Typography variant="h6" className='recommendations-title'>
                                Recommendations
                            </Typography>
                            <List className='recommendation-list'>
                                {simulationResults.map((sim, index) => (
                                    <div key={index}>
                                        <ListItem className='recommendation-item'>
                                            <ListItemText
                                                primary={<span style={{ color: `hsl(${index * 100}, 100%, 30%)` }}>{"● "+sim.group_id+":"}</span>}
                                                secondary={sim.recommendation}
                                                primaryTypographyProps={{ component: 'span', fontWeight: 'bold' }}
                                                secondaryTypographyProps={{fontWeight:"bold"}}
                                            />
                                        </ListItem>
                                        {index < simulationResults.length - 1 && <Divider />}
                                    </div>
                                ))}
                            </List>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
}
