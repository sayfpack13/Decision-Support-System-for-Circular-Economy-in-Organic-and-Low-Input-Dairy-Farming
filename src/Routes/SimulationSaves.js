import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Button, Paper, Chip } from '@mui/material';
import SimulationResults from '../Components/SimulationResults';
import { LoaderContext } from '../Loader';

export default function SimulationSaves() {
    const { isLoading, setisLoading } = useContext(LoaderContext);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedSimulation, setSelectedSimulation] = useState(null);
    const [simulationGroups, setSimulationGroups] = useState([]);
    const [simulationRecords, setSimulationRecords] = useState([]);
    const [groupedSimulations, setGroupedSimulations] = useState({});
    const [selectedSimulations, setSelectedSimulations] = useState([]);

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

    useEffect(() => {
        if (selectedGroup) {
            setSelectedSimulation(null);
        }
    }, [selectedGroup]);

    const handleGroupSelect = (event) => {
        setSelectedGroup(event.target.value);
    };

    const handleSelect = (event) => {
        const name = event.target.value;
        const selected = simulationRecords.find(sim => sim.name === name);
        setSelectedSimulation(selected);
    };

    const handleAddComparison = () => {
        if (selectedSimulation && !selectedSimulations.find(sim => sim.name === selectedSimulation.name)) {
            setSelectedSimulations([...selectedSimulations, selectedSimulation]);
        }
    };

    const handleRemoveComparison = (name) => {
        setSelectedSimulations(selectedSimulations.filter(sim => sim.name !== name));
    };

    return (
        <div className='container'>
            <Paper elevation={3} style={{ padding: 5 }}>
                <Typography variant="h5" gutterBottom>
                    Saved Simulations
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <FormControl margin="normal" style={{ width: "20%" }}>
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
                                <FormControl margin="normal" style={{ width: "20%" }}>
                                    <InputLabel>Select Simulation</InputLabel>
                                    <Select
                                        value={selectedSimulation ? selectedSimulation.name : ''}
                                        onChange={handleSelect}
                                    >
                                        {groupedSimulations[selectedGroup]?.length > 0 ? (
                                            groupedSimulations[selectedGroup].map((sim) => (
                                                <MenuItem key={sim.name} value={sim.name}>
                                                    {sim.name}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>No simulations available</MenuItem>
                                        )}
                                    </Select>
                                    <Button variant="contained" color="primary" onClick={handleAddComparison} disabled={!selectedSimulation}>
                                        Add to Comparison
                                    </Button>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Selected Simulations
                                </Typography>
                                <Box style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {selectedSimulations.map((sim) => (
                                        <Chip
                                            key={sim.name}
                                            label={sim.name+" ("+sim.group_id+")"}
                                            onDelete={() => handleRemoveComparison(sim.name)}
                                            color="primary"
                                        />
                                    ))}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <SimulationResults simulationRecords={selectedSimulations} small={true} />
                            </Grid>
                        </>
                    )}
                </Grid>
            </Paper>
        </div>
    );
}
