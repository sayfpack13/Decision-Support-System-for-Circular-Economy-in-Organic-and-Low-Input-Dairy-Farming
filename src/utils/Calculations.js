import { simulationRecordModel, simulationResultModel } from "./InputModels";

// Constants for the Hargreaves-Samani Model
const K = 0.0023; // Empirical constant for solar radiation
const BASE_TEMP = 10; // Base temperature for growth in Celsius
const MAX_TEMP = 30; // Maximum temperature for optimal growth in Celsius
const TEMP_FACTOR = 0.5; // Temperature sensitivity factor
const HUMIDITY_FACTOR = 0.3; // Humidity sensitivity factor
const RADIATION_FACTOR = 0.2; // Radiation sensitivity factor


export const calculateSolarRadiationHargreaves = (tempMin, tempMax, sunrise, sunset) => {
    tempMin -= tempMax === tempMin ? 10 : 0;

    const daylightDurationHours = Math.abs(sunset - sunrise) / 3600;

    const tempMean = (tempMax + tempMin) / 2;

    return K * Math.pow((tempMax - tempMin), 0.5) * (tempMean + 17.8) * daylightDurationHours;
};


export const calculateForageYield = (days, weather, soilParams, forageData) => {
    const { temperature, humidity, radiation } = weather;
    const soilRetention = parseFloat(soilParams.waterRetention) || 0.2; // FAO-56
    const growthRate = calculateGrowthRate(weather, soilParams);

    const arableArea = parseFloat(forageData.arableArea) || 1; // in hectares

    // Ensure weather parameters are arrays for daily values
    const temperatures = Array.isArray(temperature) ? temperature : Array(days).fill(temperature);
    const humidities = Array.isArray(humidity) ? humidity : Array(days).fill(humidity);
    const radiations = Array.isArray(radiation) ? radiation : Array(days).fill(radiation);

    return Array.from({ length: days }, (_, i) => {
        const temp = temperatures[i];
        const hum = humidities[i];
        const rad = radiations[i];

        // Calculate daily forage yield based on cumulative factors
        const tempEffect = (temp > BASE_TEMP && temp < MAX_TEMP) ? TEMP_FACTOR * (temp - BASE_TEMP) : 0;
        const humidityEffect = HUMIDITY_FACTOR * (100 - hum);
        const radiationEffect = RADIATION_FACTOR * rad;

        const dailyYield = arableArea * (tempEffect + humidityEffect + radiationEffect - soilRetention) * Math.pow(growthRate, i + 1);

        return dailyYield; // in kilograms
    });
};

export const calculateFeedNeeds = (days, herdProperties) => {
    const milkProductionPerCow = parseFloat(herdProperties.milkProduction) || 20;
    const herdSize = parseInt(herdProperties.herdSize) || 50;
    const ageFactor = herdProperties.age > 5 ? 0.9 : 1;
    const healthFactor = herdProperties.healthStatus === 'Sick' ? 1.2 : 1;
    const supplementFactor = herdProperties.feedSupplements === 'Protein Supplement' ? 0.9 : 1;

    const energyPerCow = milkProductionPerCow * 0.3 * ageFactor * healthFactor * supplementFactor;
    const proteinPerCow = milkProductionPerCow * 0.15 * ageFactor * healthFactor * supplementFactor;

    return Array.from({ length: days }, () => ({
        energy: (energyPerCow * herdSize), // Kilograms
        protein: (proteinPerCow * herdSize), // Kilograms
    }));
};

export const calculateGrowthRate = (weather, soilParams) => {
    const { temperature, radiation } = weather;
    const { waterRetention, nutrientContent } = soilParams;

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


export const getRecommendation = (simulationResult) => {
    const { 
        meanForageSurplus, 
        meanForageProduction, 
        meanFeedNeeds, 
        simulationRecords 
    } = simulationResult;

    let recommendation = '';

    // Forage surplus or deficit
    if (meanForageSurplus > 0) {
        recommendation += `Surplus of ${meanForageSurplus.toFixed(2)} kg. `;
        recommendation += 'Consider storing excess forage or optimizing nitrogen input. ';
        if (meanForageProduction > meanFeedNeeds) {
            recommendation += 'Evaluate increasing herd size or feed storage. ';
        }
    } else if (meanForageSurplus < 0) {
        recommendation += `Deficit of ${Math.abs(meanForageSurplus).toFixed(2)} kg. `;
        recommendation += 'Increase nitrogen, adjust crop rotation, or purchase additional feed. ';
        if (meanFeedNeeds > meanForageProduction) {
            recommendation += 'Review feeding strategy or consider alternative forage crops. ';
        }
    } else {
        recommendation += 'Forage production matches herd needs. Continue current practices. ';
    }

    // Aggregate weather and soil recommendations from all records
    let hasHighTemp = false, hasHighHumidity = false, hasLowRadiation = false;
    let hasLowWaterRetention = false, hasLowNutrients = false;

    simulationRecords.forEach(record => {
        const { weather, soilParams } = record;
        if (weather) {
            if (weather.temperature > 30) hasHighTemp = true;
            if (weather.humidity > 80) hasHighHumidity = true;
            if (weather.radiation < 10) hasLowRadiation = true;
        }
        if (soilParams) {
            if (soilParams.waterRetention < 0.2) hasLowWaterRetention = true;
            if (soilParams.nutrientContent === 'Low') hasLowNutrients = true;
        }
    });

    // Weather conditions
    if (hasHighTemp) recommendation += 'Consider shade or irrigation for high temperatures. ';
    if (hasHighHumidity) recommendation += 'Improve ventilation to reduce disease risk. ';
    if (hasLowRadiation) recommendation += 'Adjust planting strategy for low radiation. ';

    // Soil parameters
    if (hasLowWaterRetention) recommendation += 'Improve soil moisture management. ';
    if (hasLowNutrients) recommendation += 'Apply additional fertilizers. ';

    return recommendation;
};


export const simulateResult = (simulationRecord = simulationRecordModel(), predictionPeriod = 1) => {
    const forageYield = calculateForageYield(predictionPeriod, simulationRecord.weather, simulationRecord.soilParams, simulationRecord.forageData);
    const feedNeeds = calculateFeedNeeds(predictionPeriod, simulationRecord.herdProperties);

    
    const startDate = simulationRecord.date;
    const dates = Array.from({ length: predictionPeriod }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        return date.toISOString().replace('T', ' ').split('.')[0];
    });

    // Calculate daily totals and surplus
    const dailyTotals = forageYield.map((yieldValue, index) => {
        const dailyForageProduction = parseFloat(yieldValue);
        const dailyFeedNeeds = parseFloat(feedNeeds[index]?.energy || 0);

        return {
            dailyForageProduction,
            dailyFeedNeeds,
            dailyForageSurplus: (dailyForageProduction - dailyFeedNeeds)
        };
    });

    // Calculate means
    let meanForageProduction = 0;
    let meanFeedNeeds = 0;
    let meanForageSurplus = 0;
    dailyTotals.forEach((dailyValue) => {
        meanForageProduction += dailyValue.dailyForageProduction;
        meanFeedNeeds += dailyValue.dailyFeedNeeds;
        meanForageSurplus += dailyValue.dailyForageSurplus;
    });

    meanForageProduction /= dailyTotals.length;
    meanFeedNeeds /= dailyTotals.length;
    meanForageSurplus /= dailyTotals.length;



    const simulationRecords = Array.from({ length: predictionPeriod }, () => simulationRecord);





    const simulateResult = simulationResultModel(
        simulationRecords,
        simulationRecord.group_id,
        dates,
        forageYield,
        feedNeeds.map(need => need.energy),
        dailyTotals.map(day => day.dailyForageProduction),
        dailyTotals.map(day => day.dailyFeedNeeds),
        dailyTotals.map(day => day.dailyForageSurplus),
        meanForageProduction,
        meanFeedNeeds,
        meanForageSurplus,
        ""
    );

    simulateResult.recommendation = getRecommendation(simulateResult)

    return simulateResult
};
