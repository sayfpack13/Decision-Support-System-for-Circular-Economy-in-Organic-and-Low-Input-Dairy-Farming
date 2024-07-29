import React, { useContext, useEffect, useState } from 'react';
import {
    Box, Typography, FormControl, InputLabel, Select, MenuItem, Grid, Button, Paper,
    Collapse, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel,
    IconButton, Toolbar, AppBar, Divider, TablePagination, TextField, Checkbox, Chip,
    InputBase
} from '@mui/material';
import { LoaderContext } from '../Loader';
import SimulationResults from '../Components/SimulationResults';
import { Menu as MenuIcon, MenuOpen as MenuOpenIcon, Close as CloseIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { simulationRecordModel } from '../utils/InputModels';


export default function Statistics() {
    const { isLoading, setisLoading } = useContext(LoaderContext);
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [selectedSimulations, setSelectedSimulations] = useState([]);
    const [confirmedSimulations, setConfirmedSimulations] = useState([]);
    const [simulationGroups, setSimulationGroups] = useState([]);
    const [groupedSimulations, setGroupedSimulations] = useState({});
    const [dateFilterStart, setDateFilterStart] = useState('');
    const [dateFilterEnd, setDateFilterEnd] = useState('');
    const [isSettingsOpen, setisSettingsOpen] = useState(true);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('name');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setsearchTerm] = useState("")

    const isSelected = (id) => selectedSimulations.includes(id);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        const simulations = JSON.parse(localStorage.getItem('simulations')) || [];
        const groups = [...new Set(simulations.map(sim => sim.group_id))];
        setSimulationGroups(groups);

        const grouped = simulations.reduce((acc, sim) => {
            (acc[sim.group_id] = acc[sim.group_id] || []).push(sim);
            return acc;
        }, {});

        setGroupedSimulations(grouped);
        setisLoading(false);
    }, [setisLoading]);

    const handleGroupSelect = (event) => {
        setSelectedGroup(event.target.value);
    };

    const handleSelectSimulation = (id) => {
        setSelectedSimulations(prev =>
            prev.includes(id) ? prev.filter(selected => selected !== id) : [...prev, id]
        );
    };

    const handleConfirmComparison = () => {
        setConfirmedSimulations(getSimulations().filter(sim => selectedSimulations.includes(sim.id)));
    };

    const handleClearSelections = () => {
        setSelectedSimulations([]);
        setConfirmedSimulations([]);
    };

    const getSimulations = () => {
        let sims = []


        for (let a = 0; a < simulationGroups.length; a++) {
            sims = sims.concat(groupedSimulations[simulationGroups[a]])
        }
        return sims
    }



    const filteredSimulations = () => {
        if (!selectedGroup) return [];
        const sims = selectedGroup == "all" ? getSimulations() : groupedSimulations[selectedGroup] || [];
        return sims.filter(sim => {
            const simDate = new Date(sim.date);
            const startDate = dateFilterStart ? new Date(dateFilterStart) : new Date(-8640000000000000); // Min possible date
            const endDate = dateFilterEnd ? new Date(dateFilterEnd) : new Date(8640000000000000); // Max possible date
            return simDate >= startDate && simDate <= endDate;
        }).filter(sim => sim.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedSimulations = () => {
        const getValue = (obj, path) => {
            return path.split('.').reduce((value, key) => value && value[key], obj);
        };

        return filteredSimulations().sort((a, b) => {
            const valueA = getValue(a, orderBy);
            const valueB = getValue(b, orderBy);

            if (order === 'asc') {
                return valueA < valueB ? -1 : (valueA > valueB ? 1 : 0);
            } else {
                return valueA > valueB ? -1 : (valueA < valueB ? 1 : 0);
            }
        });
    };


    const getSelectedSimulation = (id) => {
        const sim = getSimulations().filter(sim => sim.id == id)[0]

        return sim
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <div className='container'>
            <AppBar position='relative' style={{ backgroundColor: "#2c3e50" }}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => {
                            setisSettingsOpen(!isSettingsOpen);
                        }}
                    >
                        {isSettingsOpen ? <MenuOpenIcon /> : <MenuIcon />}
                    </IconButton>
                    <Typography variant="h5" component="div">
                        Statistics
                    </Typography>
                </Toolbar>
            </AppBar>

            <div className='statistics'>
                <div className={isSettingsOpen ? "statistics-drawer open" : "statistics-drawer"}>
                    <div className='statistics-drawer-header'>
                        <Typography variant="h5" component="div">
                            Settings
                        </Typography>

                        <IconButton onClick={() => setisSettingsOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <Divider />


                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <FormControl margin="normal" style={{ width: "30%" }}>
                            <InputLabel>Select Group</InputLabel>
                            <Select value={selectedGroup} onChange={handleGroupSelect}>
                                <MenuItem value={"all"}>
                                    All Groups
                                </MenuItem>
                                {simulationGroups.length > 0 ? (
                                    simulationGroups.map((group, index) => (
                                        <MenuItem key={index} value={group}>
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


                            <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                                <Paper component="form">
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search Simulations"
                                        value={searchTerm}
                                        onChange={(e) => setsearchTerm(e.target.value)}
                                    />
                                    <IconButton sx={{ p: '10px' }}>
                                        <SearchIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                    Selected Simulations
                                </Typography>
                                <Box style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {selectedSimulations.map((id, index) => (
                                        <Chip
                                            key={index}
                                            label={getSelectedSimulation(id).name}
                                            onDelete={() => handleSelectSimulation(id)}
                                            color="primary"
                                        />
                                    ))}
                                </Box>
                            </Grid>


                            <Paper>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        indeterminate={selectedSimulations.length > 0 && selectedSimulations.length < filteredSimulations().length}
                                                        checked={filteredSimulations().length > 0 && selectedSimulations.length === filteredSimulations().length}
                                                        onChange={(event) => {
                                                            if (event.target.checked) {
                                                                setSelectedSimulations(filteredSimulations().map((sim) => sim.id));
                                                            } else {
                                                                setSelectedSimulations([]);
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'name'}
                                                        direction={orderBy === 'name' ? order : 'asc'}
                                                        onClick={(event) => handleRequestSort(event, 'name')}
                                                    >
                                                        Name
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'date'}
                                                        direction={orderBy === 'date' ? order : 'asc'}
                                                        onClick={(event) => handleRequestSort(event, 'date')}
                                                    >
                                                        Date
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'date'}
                                                        direction={orderBy === 'weather.temperature' ? order : 'asc'}
                                                        onClick={(event) => handleRequestSort(event, 'weather.temperature')}
                                                    >
                                                        Temperature
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={orderBy === 'date'}
                                                        direction={orderBy === 'herdProperties.herdSize' ? order : 'asc'}
                                                        onClick={(event) => handleRequestSort(event, 'herdProperties.herdSize')}
                                                    >
                                                        Herd Size
                                                    </TableSortLabel>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sortedSimulations().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((sim, index) => {
                                                const isItemSelected = isSelected(sim.id);
                                                return (
                                                    <React.Fragment key={index}>
                                                        <TableRow
                                                            hover
                                                            onClick={() => handleSelectSimulation(sim.id)}
                                                            role="checkbox"
                                                            aria-checked={isItemSelected}
                                                            tabIndex={-1}
                                                            selected={isItemSelected}
                                                        >
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={isItemSelected}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{sim.name}</TableCell>
                                                            <TableCell>{sim.date}</TableCell>
                                                            <TableCell>{sim.weather.temperature + " °C"}</TableCell>
                                                            <TableCell>{sim.herdProperties.herdSize}</TableCell>
                                                        </TableRow>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25]}
                                    component="div"
                                    count={filteredSimulations().length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleConfirmComparison}
                                        disabled={selectedSimulations.length === 0}
                                    >
                                        Confirm Comparison
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleClearSelections}
                                        disabled={selectedSimulations.length===0}
                                    >
                                        Clear Selections
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    )}

                </div>

                <div className={isSettingsOpen ? "statistics-body open" : "statistics-body"}>
                    <SimulationResults simulationRecords={confirmedSimulations} small={true} />
                </div>
            </div>
        </div>
    );
}