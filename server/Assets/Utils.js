import axios from "axios";
import { calculateSolarRadiationHargreaves, getRecommendation, simulateResult } from "./Calculations.js";
import { simulationResultModel } from "./InputModels.js";



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
    const apiKey = process.env.OPENWEATHER_API_KEY;

    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const { main, weather, sys } = response.data;
    const temperature = main.temp;
    const humidity = main.humidity;
    const description = weather[0].description
    const precipitation = description.includes('rain') ? '5' : '0'
    const radiation = calculateSolarRadiationHargreaves(main.temp_min, main.temp_max, sys.sunrise, sys.sunset)
    const country = sys.country


    return {
        temperature,
        humidity,
        precipitation,
        radiation,
        description,
        country
    }
};





export const simulateRecords = (simulationRecords=[],predictionPeriod=1) => {
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

