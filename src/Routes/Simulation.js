import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Select, MenuItem, TextField, Button, FormControl, InputLabel, Grid, Typography, CircularProgress, Snackbar, Alert, Paper, InputAdornment, Divider } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import SimulationResults from '../Components/SimulationResults';
import { LoaderContext } from '../Loader';
import { useNavigate } from 'react-router-dom';
import { coordinatesModel, forageModel, herdModel, simulationRecordModel, soilModel, weatherModel } from '../utils/InputModels';


export default function Simulation() {
  const navigate = useNavigate();

  // Data Models
  const [coordinates, setCoordinates] = useState(coordinatesModel(null, null));
  const [weather, setWeather] = useState(weatherModel());
  const [soilParams, setSoilParams] = useState(soilModel);
  const [herdProperties, setHerdProperties] = useState(herdModel());
  const [forageData, setForageData] = useState(forageModel());


  const { isLoading, setisLoading } = useContext(LoaderContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedSimulationGroup, setselectedSimulationGroup] = useState('');
  const [simulationGroups, setsimulationGroups] = useState([]);

  const [simulationRecord, setsimulationRecord] = useState(simulationRecordModel())
  const simulationRecords = useMemo(() => [simulationRecord], [simulationRecord]);
  const [isSimulated, setisSimulated] = useState(false)
  const [simulationGroup, setsimulationGroup] = useState('');
  const [simulationName, setsimulationName] = useState("Simulation "+new Date().toISOString().split('T')[0])




  useEffect(() => {
    if (coordinates.lat && coordinates.lon) {
      fetchWeatherData(coordinates.lat, coordinates.lon);
    }
  }, [coordinates]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lon: longitude });
        },
        (error) => {
          alert('Error getting location. Please enter it manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    // Fetch groups from local storage
    const simulations = JSON.parse(localStorage.getItem('simulations')) || [];
    const existingGroups = [...new Set(simulations.map(sim => sim.group_id))];
    setsimulationGroups(existingGroups);
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Replace with your API key
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const { main, weather } = response.data;
      const temperature = main.temp;
      const humidity = main.humidity;
      const description = weather[0].description
      const precipitation = description.includes('rain') ? '5' : '0'; // Simplified assumption
      const radiation = 15; // Placeholder value, actual value needs a different source

      setWeather({
        temperature,
        humidity,
        precipitation,
        radiation,
        description
      });
    } catch (error) {
      console.error("Error fetching weather data", error);
      alert('Error fetching weather data. Please try again.');
    } finally {
      setisLoading(false);
    }
  };




  const handleSubmit = () => {
    const simulations = JSON.parse(localStorage.getItem('simulations')) || [];

    const record = simulationRecordModel(
      simulations.length,
      simulationRecord.group_id,
      simulationRecord.name,
      new Date().toISOString().replace('T', ' ').split('.')[0],
      coordinates,
      weather,
      soilParams,
      herdProperties,
      forageData
    )
    setsimulationRecord(record)
    setisSimulated(true)
  };



  const handleSave = () => {
    const tmp_simulationRecord = simulationRecord
    tmp_simulationRecord.name = simulationName
    tmp_simulationRecord.group_id = selectedSimulationGroup =="create-new" ? simulationGroup : selectedSimulationGroup

    const simulations = JSON.parse(localStorage.getItem('simulations')) || [];
    localStorage.setItem('simulations', JSON.stringify([...simulations, tmp_simulationRecord]));


    setSnackbarMessage('Simulation saved successfully!');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const Map = ({ setCoordinates }) => {
    useMapEvents({
      click(e) {
        setCoordinates({ lat: e.latlng.lat, lon: e.latlng.lng });
      },
    });
    return null;
  };





  return (
    <div className='container' >
      <Paper elevation={3} style={{ padding: 5 }}>
        <Typography variant="h5" gutterBottom>
          Simulation Parameters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Select Location</Typography>
            {coordinates.lat && coordinates.lon && (
              <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={13} style={{ height: '50vh' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[coordinates.lat, coordinates.lon]}>
                  <Popup>Selected Location</Popup>
                </Marker>
                <Map setCoordinates={setCoordinates} />
              </MapContainer>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Weather Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Temperature"
                  variant="outlined"
                  onChange={(e) => setWeather({ ...weather, temperature: e.target.value })}
                  type="number"
                  value={weather.temperature}
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">°C</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Humidity"
                  variant="outlined"
                  onChange={(e) => setWeather({ ...weather, humidity: e.target.value })}
                  type="number"
                  value={weather.humidity}
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Precipitation"
                  variant="outlined"
                  onChange={(e) => setWeather({ ...weather, precipitation: e.target.value })}
                  type="number"
                  value={weather.precipitation}
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">mm</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Radiation"
                  variant="outlined"
                  onChange={(e) => setWeather({ ...weather, radiation: e.target.value })}
                  type="number"
                  value={weather.radiation}
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">MJ/m²</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Description"
                  variant="outlined"
                  onChange={(e) => setWeather({ ...weather, description: e.target.value })}
                  type="text"
                  value={weather.description}
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Now</InputAdornment>
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Soil Parameters</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Soil Type</InputLabel>
                  <Select
                    value={soilParams.soilType}
                    onChange={(e) => setSoilParams({ ...soilParams, soilType: e.target.value })}
                    label="Soil Type"
                  >
                    {soilModel().soilTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Water Retention"
                  variant="outlined"
                  value={soilParams.waterRetention}
                  onChange={(e) => setSoilParams({ ...soilParams, waterRetention: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Nutrient Content</InputLabel>
                  <Select
                    value={soilParams.nutrientContent}
                    onChange={(e) => setSoilParams({ ...soilParams, nutrientContent: e.target.value })}
                    label="Nutrient Content"
                  >
                    {soilModel().nutrientContents.map((content) => (
                      <MenuItem key={content} value={content}>
                        {content}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Herd Properties</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Herd Size"
                  variant="outlined"
                  value={herdProperties.herdSize}
                  onChange={(e) => setHerdProperties({ ...herdProperties, herdSize: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">head</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Breed</InputLabel>
                  <Select
                    value={herdProperties.breed}
                    onChange={(e) => setHerdProperties({ ...herdProperties, breed: e.target.value })}
                    label="Breed"
                  >
                    {herdModel().breeds.map((breed) => (
                      <MenuItem key={breed} value={breed}>
                        {breed}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Weight"
                  variant="outlined"
                  value={herdProperties.weight}
                  onChange={(e) => setHerdProperties({ ...herdProperties, weight: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Calving Interval"
                  variant="outlined"
                  value={herdProperties.calvingInterval}
                  onChange={(e) => setHerdProperties({ ...herdProperties, calvingInterval: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">days</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Milk Production"
                  variant="outlined"
                  value={herdProperties.milkProduction}
                  onChange={(e) => setHerdProperties({ ...herdProperties, milkProduction: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">liters/day</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Fat Content"
                  variant="outlined"
                  value={herdProperties.fatContent}
                  onChange={(e) => setHerdProperties({ ...herdProperties, fatContent: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Protein Content"
                  variant="outlined"
                  value={herdProperties.proteinContent}
                  onChange={(e) => setHerdProperties({ ...herdProperties, proteinContent: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  label="Age"
                  variant="outlined"
                  value={herdProperties.age}
                  onChange={(e) => setHerdProperties({ ...herdProperties, age: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">years</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Health Status</InputLabel>
                  <Select
                    value={herdProperties.healthStatus}
                    onChange={(e) => setHerdProperties({ ...herdProperties, healthStatus: e.target.value })}
                    label="Health Status"
                  >
                    {herdModel().healthStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Feed Supplements</InputLabel>
                  <Select
                    value={herdProperties.feedSupplement}
                    onChange={(e) => setHerdProperties({ ...herdProperties, feedSupplement: e.target.value })}
                    label="Feed Supplements"
                  >
                    {herdModel().feedSupplements.map((supplement) => (
                      <MenuItem key={supplement} value={supplement}>
                        {supplement}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Forage Data</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Arable Area"
                  variant="outlined"
                  value={forageData.arableArea}
                  onChange={(e) => setForageData({ ...forageData, arableArea: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">ha</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Grassland Area"
                  variant="outlined"
                  value={forageData.grasslandArea}
                  onChange={(e) => setForageData({ ...forageData, grasslandArea: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">ha</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Legume Share"
                  variant="outlined"
                  value={forageData.legumeShare}
                  onChange={(e) => setForageData({ ...forageData, legumeShare: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Nitrogen Input"
                  variant="outlined"
                  value={forageData.nitrogenInput}
                  onChange={(e) => setForageData({ ...forageData, nitrogenInput: e.target.value })}
                  type="number"
                  InputProps={{ endAdornment: <InputAdornment position="end">kg/ha</InputAdornment> }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Simulate
            </Button>
            {isSimulated && (
              <Grid item xs={6} sm={3} style={{ marginTop: 10 }}>
                <Typography variant="subtitle1">Save Simulation Settings</Typography>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Group</InputLabel>
                  <Select
                    value={selectedSimulationGroup}
                    onChange={(e) => {
                      setselectedSimulationGroup(e.target.value)
                    }}
                    label="Group"
                  >
                    {simulationGroups.map((group) => (
                      <MenuItem key={group} value={group}>
                        {group}
                      </MenuItem>
                    ))}
                    <MenuItem value="create-new">Create New Group</MenuItem>
                  </Select>
                </FormControl>
                {selectedSimulationGroup === 'create-new' && (
                  <TextField
                    label="New Group Name"
                    variant="outlined"
                    value={simulationGroup}
                    onChange={(e) => {
                      setsimulationGroup(e.target.value)
                    }}
                    fullWidth
                    style={{ marginTop: 16 }}
                  />
                )}
                <TextField
                  label="Simulation Name"
                  variant="outlined"
                  value={simulationName}
                  onChange={(e) => {
                    setsimulationName(e.target.value)
                  }}
                  fullWidth
                  style={{ marginTop: 16 }}
                />
                <Button variant="contained" color="secondary" disabled={!selectedSimulationGroup || (!simulationGroup && selectedSimulationGroup === "create-new")} onClick={handleSave} style={{ marginTop: 5 }}>
                  Save Simulation
                </Button>
              </Grid>
            )}


          </Grid>
        </Grid>
      </Paper>
      {isSimulated && <SimulationResults simulationRecords={simulationRecords} small={false} />}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
