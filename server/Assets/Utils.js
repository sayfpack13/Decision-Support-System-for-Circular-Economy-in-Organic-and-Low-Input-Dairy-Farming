import axios from "axios";
import { calculateSolarRadiationHargreaves, getRecommendation, simulateResult } from "./Calculations.js";
import { simulationResultModel, WeatherForcastListModel, WeatherForcastModel, weatherModel } from "./InputModels.js";
import { openWeatherAPIKey } from "./Constants.js";



export const sendResponse = (res, data, success = true) => {
    try {
        res.status(success ? 200 : 500).json({
            data,
            success
        })
    } catch (error) {
        // already sent ?
    }
}

export const fetchWeatherData = async (lat, lon) => {

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}&units=metric`);
    const { main, weather, sys } = response.data;
    const weatherData = weatherModel()

    weatherData.temperature = main.temp
    weatherData.humidity = main.humidity
    weatherData.description = weather[0].description
    weatherData.precipitation = weatherData.description.toLowerCase().includes('rain') ? '5' : '0'
    weatherData.radiation = calculateSolarRadiationHargreaves(main.temp_min, main.temp_max, sys.sunrise, sys.sunset)
    weatherData.country = sys.country


    return weatherData
};



// Call 5 day / 3 hour forecast data
export const fetchForcastWeatherData = async (lat, lon) => {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await axios.get(`api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherAPIKey}&units=metric`);
    const { list, city } = response.data
    const weatherForcastList = WeatherForcastListModel([])

    weatherForcastList.country = city.country



    list.forEach(weatherData => {
        const {dt, main, weather } = weatherData
        const weatherForcastData=WeatherForcastModel()

        weatherForcastData.timestamp=dt
        weatherForcastData.temperature=main.temperature
        weatherForcastData.humidity=main.humidity
        weatherForcastData.description=weather.description
        weatherForcastData.precipitation=weatherForcastData.description.toLowerCase().includes('rain') ? '5' : '0'
        weatherForcastData.radiation=calculateSolarRadiationHargreaves(main.temp_min,main.temp_max,city.sunrise,city.sunset)


        weatherForcastList.weatherDataList.push(weatherForcastData)
    })

    return weatherForcastList
}



export const simulateRecords = (simulationRecords = [], predictionPeriod = 1) => {
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

    return newSimulationResults
}

