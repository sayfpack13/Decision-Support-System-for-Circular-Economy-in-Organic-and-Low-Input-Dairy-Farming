import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Button, Paper, Chip, Card, CardContent, CardActionArea, TextField } from '@mui/material';
import { LoaderContext } from '../Loader';
import SimulationResults from '../Components/SimulationResults';

export default function SimulationSaves() {
    const { isLoading, setisLoading } = useContext(LoaderContext);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedSimulations, setSelectedSimulations] = useState([]);
    const [confirmedSimulations, setConfirmedSimulations] = useState([]);
    const [simulationGroups, setSimulationGroups] = useState([]);
    const [simulationRecords, setSimulationRecords] = useState([]);
    const [groupedSimulations, setGroupedSimulations] = useState({});
    const [dateFilterStart, setDateFilterStart] = useState('');
    const [dateFilterEnd, setDateFilterEnd] = useState('');
    const [showResults, setShowResults] = useState(false);

    const isSelected = (sim) => selectedSimulations.some(selected => selected.name === sim.name);

    useEffect(() => {
        const simulations = JSON.parse(localStorage.getItem('simulations')) || [];
        const groups = [...new Set(simulations.map(sim => sim.group_id))];
        setSimulationGroups(groups);

        const grouped = simulations.reduce((acc, sim) => {
            (acc[sim.group_id] = acc[sim.group_id] || []).push(sim);
            return acc;
        }, {});

        setGroupedSimulations(grouped);
        setSimulationRecords(simulations);
        setisLoading(false);
    }, [setisLoading]);

    const handleGroupSelect = (event) => {
        setSelectedGroup(event.target.value);
        setShowResults(false);
    };

    const handleSelectSimulation = (sim) => {
        setSelectedSimulations(prev => 
            prev.some(selected => selected.name === sim.name) ? 
            prev.filter(selected => selected.name !== sim.name) : 
            [...prev, sim]
        );
    };

    const handleConfirmComparison = () => {
        setConfirmedSimulations(selectedSimulations);
        setShowResults(true);
    };

    const handleClearSelections = () => {
        setSelectedSimulations([]);
        setConfirmedSimulations([]);
        setShowResults(false);
    };

    const filteredSimulations = () => {
        if (!selectedGroup) return [];
        const sims = groupedSimulations[selectedGroup] || [];
        return sims.filter(sim => {
            const simDate = new Date(sim.date);
            const startDate = dateFilterStart ? new Date(dateFilterStart) : new Date(-8640000000000000); // Min possible date
            const endDate = dateFilterEnd ? new Date(dateFilterEnd) : new Date(8640000000000000); // Max possible date
            return simDate >= startDate && simDate <= endDate;
        });
    };

    return (
        <div className='container'>
            <Paper elevation={3} style={{ padding: 20 }}>
                <Typography variant="h5" gutterBottom>
                    Saved Simulations
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <FormControl margin="normal" style={{ width: "30%" }}>
                            <InputLabel>Select Group</InputLabel>
                            <Select
                                value={selectedGroup}
                                onChange={handleGroupSelect}
                            >
                                {simulationGroups.length > 0 ? (
                                    simulationGroups.map((group) => (
                                        <MenuItem key={group} value={group}>
                                            {group}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No groups available</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    {selectedGroup && (
                        <>
                            <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    size="small"
                                    style={{ marginRight: 8 }}
                                    value={dateFilterStart}
                                    onChange={(e) => setDateFilterStart(e.target.value)}
                                />
                                <TextField
                                    label="End Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    variant="outlined"
                                    size="small"
                                    value={dateFilterEnd}
                                    onChange={(e) => setDateFilterEnd(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Available Simulations
                                </Typography>
                                <Box style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {filteredSimulations().map((sim) => (
                                        <Card
                                            key={sim.name}
                                            style={{
                                                width: 200,
                                                margin: 8,
                                                border: isSelected(sim) ? '2px solid #3f51b5' : '1px solid #ddd',
                                                cursor: 'pointer',
                                                transition: 'transform 0.2s, border-color 0.2s',
                                                transform: isSelected(sim) ? 'scale(1.05)' : 'scale(1)',
                                                backgroundColor: isSelected(sim) ? '#e3f2fd' : '#fff'
                                            }}
                                            onClick={() => handleSelectSimulation(sim)}
                                        >
                                            <CardActionArea>
                                                <CardContent>
                                                    <Typography variant="h6">
                                                        {sim.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {sim.date}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12} style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleConfirmComparison}
                                    disabled={selectedSimulations.length === 0}
                                    style={{ marginRight: 16 }}
                                >
                                    Confirm Comparison
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleClearSelections}
                                >
                                    Clear All Selections
                                </Button>
                            </Grid>
                            {showResults && (
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Selected Simulations
                                    </Typography>
                                    <Box style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {confirmedSimulations.map((sim) => (
                                            <Chip
                                                key={sim.name}
                                                label={`${sim.name} (${sim.group_id})`}
                                                onDelete={() => handleSelectSimulation(sim)}
                                                color="primary"
                                            />
                                        ))}
                                    </Box>
                                    <SimulationResults simulationRecords={confirmedSimulations} small={true} />
                                </Grid>
                            )}
                        </>
                    )}
                </Grid>
            </Paper>
        </div>
    );
}
