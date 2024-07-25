import React from 'react';
import { Line, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Paper, Typography, Grid, Box } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function SimulationResults({ result, small }) {
  const { dates, forageProduction, feedNeeds, totalForageProduction, totalFeedNeeds, forageSurplus, recommendations } = result;

  const dataForage = {
    labels: dates,
    datasets: [
      {
        label: 'Forage Production (tons)',
        data: forageProduction,
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  const dataFeedNeeds = {
    labels: dates,
    datasets: [
      {
        label: 'Feed Needs (tons)',
        data: feedNeeds,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderWidth: 1,
      },
    ],
  };

  const dataComparison = {
    labels: ['Total Forage Production', 'Total Feed Needs'],
    datasets: [
      {
        data: [totalForageProduction, totalFeedNeeds],
        backgroundColor: ['blue', 'red'],
      },
    ],
  };

  const dataSurplus = {
    labels: ['Forage Surplus'],
    datasets: [
      {
        data: [forageSurplus],
        backgroundColor: ['green'],
      },
    ],
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

  return (
    <Paper elevation={3} style={{ padding: 16 }}>
      <Typography variant="h5" gutterBottom>
        Simulation Results
      </Typography>
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
        <Grid item xs={12} md={small ? 12 : 4}>
          <Box mb={2}>
            <Typography variant="h6">Comparison of Total Forage Production and Total Feed Needs</Typography>
          </Box>
          <Doughnut data={dataComparison} />
        </Grid>
        <Grid item xs={12} md={small ? 12 : 4}>
          <Box mb={2}>
            <Typography variant="h6">Forage Surplus</Typography>
          </Box>
          <Pie data={dataSurplus} />
        </Grid>
      </Grid>
      <Box mt={4}>
        <Typography variant="h6">Detailed Results</Typography>
        <Typography variant="body1"><strong>Total Forage Production:</strong> {totalForageProduction} tons</Typography>
        <Typography variant="body1"><strong>Total Feed Needs:</strong> {totalFeedNeeds} tons</Typography>
        <Typography variant="body1"><strong>Forage Surplus/Deficit:</strong> {forageSurplus} tons</Typography>
        <Typography variant="body1"><strong>Recommendations:</strong> {recommendations}</Typography>
      </Box>
    </Paper>
  );
}
