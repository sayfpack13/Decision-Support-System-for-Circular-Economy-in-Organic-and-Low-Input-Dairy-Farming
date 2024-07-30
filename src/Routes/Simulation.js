import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Select, MenuItem, TextField, Button, FormControl, InputLabel, Grid, Typography, CircularProgress, Snackbar, Alert, Paper, InputAdornment, Divider } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import SimulationResults from '../Components/SimulationResults';
import { LoaderContext } from '../Components/Loader';
import { coordinatesModel, forageModel, herdModel, simulationRecordModel, soilModel, weatherModel } from '../utils/InputModels';
import mapMarker from "../Assets/marker.png"
import L, { latLng, latLngBounds } from "leaflet"
import { calculateSolarRadiationHargreaves } from '../utils/Calculations';
import FlagIcon from '@mui/icons-material/Flag';
import CloudIcon from '@mui/icons-material/Cloud';
import PetsIcon from '@mui/icons-material/Pets';
import ScaleIcon from '@mui/icons-material/Scale';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AirIcon from '@mui/icons-material/Air';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import WaterIcon from '@mui/icons-material/Water';
import TransgenderIcon from '@mui/icons-material/Transgender';
import SpaIcon from '@mui/icons-material/Spa';
import MarginIcon from '@mui/icons-material/Margin';
import CopyAllIcon from '@mui/icons-material/CopyAll';
import GrassIcon from '@mui/icons-material/Grass';
import OpacityIcon from '@mui/icons-material/Opacity';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import YardIcon from '@mui/icons-material/Yard';
import FenceIcon from '@mui/icons-material/Fence';
import LandscapeIcon from '@mui/icons-material/Landscape';
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import BiotechIcon from '@mui/icons-material/Biotech';

export default function Simulation() {

  // Data Models
  const [isWeatherDataExist, setisWeatherDataExist] = useState(true)
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
  const [simulationName, setsimulationName] = useState("Simulation " + new Date().toISOString().split('T')[0])




  const mapMarkerRef = useRef()
  const customIcon = L.icon({
    iconUrl: mapMarker,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });



  useEffect(() => {
    if (coordinates.lat && coordinates.lon) {
      setisLoading(true)
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
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const { main, weather, sys } = response.data;
      const temperature = main.temp;
      const humidity = main.humidity;
      const description = weather[0].description
      const precipitation = description.includes('rain') ? '5' : '0'; // Simplified assumption
      const radiation = calculateSolarRadiationHargreaves(main.temp_min, main.temp_max, sys.sunrise, sys.sunset)
      const country = sys.country


      setWeather({
        temperature,
        humidity,
        precipitation,
        radiation,
        description,
        country
      });
      setisWeatherDataExist(true)
    } catch (error) {
      setisWeatherDataExist(false)
    } finally {
      mapMarkerRef.current.toggle()
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
    tmp_simulationRecord.group_id = selectedSimulationGroup == "create-new" ? simulationGroup : selectedSimulationGroup

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
              <MapContainer maxBounds={latLngBounds = [[[-90, -180]], [[90, 180]]]} minZoom={3} center={[coordinates.lat, coordinates.lon]} zoom={13} style={{ height: '50vh' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker icon={customIcon} position={[coordinates.lat, coordinates.lon]}>
                  <Popup ref={mapMarkerRef}>{isWeatherDataExist ? "Weather Data available !!" : "No Data available"}</Popup>
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
                    endAdornment: <InputAdornment position="end"><ThermostatIcon />°C</InputAdornment>
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
                    endAdornment: <InputAdornment position="end"><AirIcon />%</InputAdornment>
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
                    endAdornment: <InputAdornment position="end"><WaterDropIcon />mm</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Radiation"
                  variant="outlined"
                  onChange={(e) => setWeather({ ...weather, radiation: e.target.value })}
                  type="number"
                  value={weather.radiation.toFixed(2)}
                  fullWidth
                  InputProps={{
                    endAdornment: <InputAdornment position="end"><CrisisAlertIcon />MJ/m²</InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Description"
                  variant="outlined"
                  type="text"
                  value={weather.description}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: <InputAdornment position="end"><CloudIcon /></InputAdornment>
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Country"
                  variant="outlined"
                  type="text"
                  value={weather.country}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                    endAdornment: <InputAdornment position="end"><FlagIcon /></InputAdornment>
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
                    IconComponent={GrassIcon}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><WaterIcon />%</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Nutrient Content</InputLabel>
                  <Select
                    IconComponent={SpaIcon}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><PetsIcon /></InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Breed</InputLabel>
                  <Select
                    IconComponent={TransgenderIcon}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><ScaleIcon /> kg</InputAdornment> }}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><MarginIcon />days</InputAdornment> }}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><OpacityIcon />liters/day</InputAdornment> }}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><WaterDropIcon />%</InputAdornment> }}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><InvertColorsIcon />%</InputAdornment> }}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><WatchLaterIcon />years</InputAdornment> }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Health Status</InputLabel>
                  <Select
                    IconComponent={MonitorHeartIcon}
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
                    IconComponent={YardIcon}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><FenceIcon />ha</InputAdornment> }}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><LandscapeIcon />ha</InputAdornment> }}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><ShareLocationIcon />%</InputAdornment> }}
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
                  InputProps={{ endAdornment: <InputAdornment position="end"><BiotechIcon />kg/ha</InputAdornment> }}
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
              Run Simulation
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
      <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success" variant='filled' style={{position:"fixed",top:"90%",left:"50%",transform:"translate(-50%, -50%)",fontSize:"25px",display:"flex",alignItems:"center"}}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
