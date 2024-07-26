import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Button, Paper } from '@mui/material';
import SimulationResults from '../Components/SimulationResults';
import { LoaderContext } from '../Loader';

export default function SimulationSaves() {
    const { isLoading, setisLoading } = useContext(LoaderContext);
    const [selectedSimulation, setSelectedSimulation] = useState(null);
    const [selectedSimulations, setSelectedSimulations] = useState([]);
    const simulations = JSON.parse(localStorage.getItem('simulations')) || [];

    useEffect(() => {
        setisLoading(false);
    }, []);

    const handleSelect = (event) => {
        const name = event.target.value;
        const selected = simulations.find(sim => sim.name === name);
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
                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                    <FormControl margin="normal" style={{ width: "20%" }}>
                        <InputLabel>Select Simulation</InputLabel>
                        <Select
                            value={selectedSimulation ? selectedSimulation.name : ''}
                            onChange={handleSelect}
                        >
                            {simulations.length > 0 ? (
                                simulations.map((sim, index) => (
                                    <MenuItem key={index} value={sim.name}>
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
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <SimulationResults results={selectedSimulations} small={true} />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
