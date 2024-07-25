import React, { useState, useEffect, useContext } from 'react';
import { Select, MenuItem, TextField, Button, FormControl, InputLabel, Grid, Typography, CircularProgress, Snackbar, Alert, Paper, InputAdornment } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import SimulationResults from '../Components/SimulationResults';
import { LoaderContext } from '../Loader';
import { useNavigate } from 'react-router-dom';


export default function Simulation() {
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState({ lat: null, lon: null });
  const [weather, setWeather] = useState({
    temperature: '',
    humidity: '',
    precipitation: '',
    radiation: ''
  });
  const [soilParams, setSoilParams] = useState({
    soilType: 'Sandy Loam',
    waterRetention: '0.2',
    nutrientContent: 'Low',
  });
  const [herdProperties, setHerdProperties] = useState({
    breed: 'Holstein',
    weight: '500',
    calvingInterval: '365',
    milkProduction: '25',
    fatContent: '4.0',
    proteinContent: '3.5',
  });
  const [forageData, setForageData] = useState({
    arableArea: '10',
    grasslandArea: '20',
    legumeShare: '30',
    nitrogenInput: '100',
  });
  const { isLoading, setisLoading } = useContext(LoaderContext);
  const [result, setResult] = useState(null);
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [predictionPeriod, setPredictionPeriod] = useState(7); // Default to 7 days

  const soilTypes = ['Sandy Loam', 'Clay Loam', 'Silt Loam', 'Peat'];
  const breeds = ['Holstein', 'Jersey', 'Guernsey', 'Ayrshire'];
  const nutrientContents = ['Low', 'Medium', 'High'];
  const predictionPeriods = [7, 14, 30]; // Prediction period options in days

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

  const fetchWeatherData = async (lat, lon) => {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY; // Replace with your API key
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const { main, weather } = response.data;
      const temperature = main.temp;
      const humidity = main.humidity;
      const precipitation = weather[0].description.includes('rain') ? '5' : '0'; // Simplified assumption
      const radiation = 15; // Placeholder value, actual value needs a different source

      setWeather({
        temperature,
        humidity,
        precipitation,
        radiation,
      });
    } catch (error) {
      console.error("Error fetching weather data", error);
      alert('Error fetching weather data. Please try again.');
    } finally {
      setisLoading(false);
    }
  };

  const calculateForageYield = (days) => {
    const { temperature, humidity, radiation } = weather;
    const soilRetention = parseFloat(soilParams.waterRetention) || 0.2; // Example value
    const growthRate = calculateGrowthRate(weather, soilParams); // Function to calculate a more refined growth rate

    // Calculate forage yield for each day
    return Array.from({ length: days }, (_, i) => (
      (parseFloat(forageData.arableArea) || 1) * (0.5 * (temperature - 10) + (0.3 * (100 - humidity)) + (0.2 * radiation) - soilRetention) * Math.pow(growthRate, i + 1)
    ).toFixed(2));
  };

  const calculateFeedNeeds = (days) => {
    const milkProduction = parseFloat(herdProperties.milkProduction) || 20; // liters per day
    const energy = milkProduction * 0.3; // MJ/day
    const protein = milkProduction * 0.15; // kg/day

    // Calculate feed needs for each day
    return Array.from({ length: days }, () => ({
      energy: energy.toFixed(2),
      protein: protein.toFixed(2),
    }));
  };

  const calculateGrowthRate = (weather, soilParams) => {
    const { temperature, radiation } = weather;
    const { waterRetention, nutrientContent } = soilParams;

    // Example refined growth rate calculation
    let growthRate = 1.05; // Base growth rate

    // Adjust growth rate based on temperature
    if (temperature > 20 && temperature < 30) {
      growthRate += 0.01;
    } else if (temperature < 10 || temperature > 35) {
      growthRate -= 0.01;
    }

    // Adjust growth rate based on radiation
    if (radiation > 20) {
      growthRate += 0.01;
    } else if (radiation < 10) {
      growthRate -= 0.01;
    }

    // Adjust growth rate based on soil water retention
    if (waterRetention > 0.3) {
      growthRate += 0.01;
    } else if (waterRetention < 0.1) {
      growthRate -= 0.01;
    }

    // Adjust growth rate based on soil nutrient content
    if (nutrientContent === 'High') {
      growthRate += 0.01;
    } else if (nutrientContent === 'Low') {
      growthRate -= 0.01;
    }

    return growthRate;
  };

  const handleSubmit = () => {
    const forageYield = calculateForageYield(predictionPeriod);
    const feedNeeds = calculateFeedNeeds(predictionPeriod);

    const startDate = new Date();
    const dates = Array.from({ length: predictionPeriod }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });

    const totalForageProduction = forageYield.reduce((a, b) => parseFloat(a) + parseFloat(b), 0).toFixed(2);
    const totalFeedNeeds = feedNeeds.reduce((a, b) => parseFloat(a) + parseFloat(b.energy), 0).toFixed(2);
    const forageSurplus = (totalForageProduction - totalFeedNeeds).toFixed(2);

    let recommendations = '';
    if (forageSurplus > 0) {
      recommendations = 'You have a surplus of forage. Consider storing excess forage or reducing nitrogen input.';
    } else if (forageSurplus < 0) {
      recommendations = 'You have a deficit of forage. Consider increasing nitrogen input, adjusting crop rotation, or purchasing additional feed.';
    } else {
      recommendations = 'Your forage production matches your herd\'s needs. Maintain your current management practices.';
    }

    const result = {
      name: `Simulation ${new Date().toISOString().replace('T', ' ').split('.')[0]}`,
      date: new Date().toISOString().replace('T', ' ').split('.')[0],
      dates,
      forageProduction: forageYield,
      feedNeeds: feedNeeds.map(need => need.energy),
      totalForageProduction,
      totalFeedNeeds,
      forageSurplus,
      recommendations,
    };

    setResult(result);
  };

  const handleSave = () => {
    // Save to local storage or a backend service
    const simulations = JSON.parse(localStorage.getItem('simulations')) || [];
    simulations.push(result);
    localStorage.setItem('simulations', JSON.stringify(simulations));

    setSavedSimulations(simulations); // Update the state with the new simulation

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
              <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={13} style={{ height: '300px' }}>
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
                    {soilTypes.map((type) => (
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
                    {nutrientContents.map((content) => (
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
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Breed</InputLabel>
                  <Select
                    value={herdProperties.breed}
                    onChange={(e) => setHerdProperties({ ...herdProperties, breed: e.target.value })}
                    label="Breed"
                  >
                    {breeds.map((breed) => (
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
          <Grid item xs={12} style={{display:"flex",justifyContent:"center"}}>
            <FormControl variant="outlined" style={{width:"20%"}}>
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
          <Grid item xs={12} style={{display:"flex",justifyContent:"center"}}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Simulate
            </Button>
            {result && (
              <Button variant="contained" color="secondary" onClick={handleSave} style={{ marginLeft: 16 }}>
                Save Simulation
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>
      {result && <SimulationResults result={result} small={false}/>}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
