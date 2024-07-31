import { simulationRecordModel, simulationResultModel } from "./InputModels.js";

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

// Updated calculation functions
export const calculateForageYield = (days, weather, soilParams, forageData) => {
    const { temperature, humidity, precipitation, radiation } = weather;
    const soilRetention = parseFloat(soilParams.waterRetention) || 0.2; // FAO-56
    const growthRate = calculateGrowthRate(weather, soilParams);

    const arableArea = parseFloat(forageData.arableArea) || 1; // in hectares
    const grasslandArea = parseFloat(forageData.grasslandArea) || 1; // in hectares

    // update needed for forcast weather data
    const temperatures = Array.isArray(temperature) ? temperature : Array(days).fill(temperature);
    const humidities = Array.isArray(humidity) ? humidity : Array(days).fill(humidity);
    const precipitations = Array.isArray(precipitation) ? precipitation : Array(days).fill(precipitation);
    const radiations = Array.isArray(radiation) ? radiation : Array(days).fill(radiation);

    return Array.from({ length: days }, (_, i) => {
        const temp = temperatures[i];
        const hum = humidities[i];
        const precip = precipitations[i];
        const rad = radiations[i];

        // Calculate daily forage yield based on cumulative factors
        const tempEffect = (temp > BASE_TEMP && temp < MAX_TEMP) ? TEMP_FACTOR * (temp - BASE_TEMP) : 0;
        const humidityEffect = HUMIDITY_FACTOR * (100 - hum);
        const precipitationEffect = 0.1 * precip; // Example effect of precipitation
        const radiationEffect = RADIATION_FACTOR * rad;

        const dailyYield = (arableArea + grasslandArea) * (tempEffect + humidityEffect + precipitationEffect + radiationEffect - soilRetention) * Math.pow(growthRate, i + 1);

        return dailyYield; // in kilograms
    });
};


export const calculateFeedNeeds = (days, herdProperties) => {
    const milkProductionPerCow = parseFloat(herdProperties.milkProduction) || 20;
    const herdSize = parseInt(herdProperties.herdSize) || 50;
    const weight = parseFloat(herdProperties.weight) || 450;
    const fatContent = parseFloat(herdProperties.fatContent) || 3.8;
    const proteinContent = parseFloat(herdProperties.proteinContent) || 3.2;
    const ageFactor = herdProperties.age > 5 ? 0.9 : 1;

    const breedFactor = {
        'Holstein': 1.2,
        'Jersey': 1.1,
        'Guernsey': 1.05,
        'Ayrshire': 1
    }[herdProperties.breed] || 1;

    const healthFactor = herdProperties.healthStatus === 'Sick' ? 1.3 :
        herdProperties.healthStatus === 'Recovering' ? 1.1 : 1;
    const supplementFactor = herdProperties.feedSupplement === 'Protein Supplement' ? 1.2 :
        herdProperties.feedSupplement === 'Vitamin Supplement' ? 1.05 : 1;

    // Incorporate weight, fatContent, and proteinContent into energy and protein needs
    const energyPerCow = (milkProductionPerCow * 0.3 * (weight / 450) * fatContent / 3.8 * ageFactor * healthFactor * supplementFactor * breedFactor);
    const proteinPerCow = (milkProductionPerCow * 0.15 * weight / 450 * proteinContent / 3.2 * ageFactor * healthFactor * supplementFactor * breedFactor);

    return Array.from({ length: days }, () => ({
        energy: (energyPerCow * herdSize), // Kilograms
        protein: (proteinPerCow * herdSize), // Kilograms
    }));
};

export const calculateGrowthRate = (weather, soilParams) => {
    const { temperature, radiation } = weather;
    const { waterRetention, nutrientContent, soilType } = soilParams;

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

    // Adjust growth rate based on soil type (example)
    if (soilType === 'Peat') {
        growthRate += 0.02;
    } else if (soilType === 'Clay Loam') {
        growthRate -= 0.02;
    }

    return growthRate;
};



export const getRecommendation = (simulationResult) => {
    const {
        simulationRecords,
        meanForageSurplus,
        meanForageProduction,
        meanFeedNeeds
    } = simulationResult;

    let recommendation = '';

    // Aggregate data from simulation records
    const aggregatedData = {
        highTemp: false,
        highHumidity: false,
        lowRadiation: false,
        lowWaterRetention: false,
        lowNutrients: false,
        healthIssues: false,
        proteinSupplement: false,
        breedSpecific: {}
    };

    simulationRecords.forEach(record => {
        const { weather, soilParams, herdProperties } = record;

        if (weather) {
            if (weather.temperature > 30) aggregatedData.highTemp = true;
            if (weather.humidity > 80) aggregatedData.highHumidity = true;
            if (weather.radiation < 10) aggregatedData.lowRadiation = true;
        }

        if (soilParams) {
            if (soilParams.waterRetention < 0.2) aggregatedData.lowWaterRetention = true;
            if (soilParams.nutrientContent === 'Low') aggregatedData.lowNutrients = true;
        }

        if (herdProperties) {
            if (herdProperties.healthStatus === 'Sick') aggregatedData.healthIssues = true;
            if (herdProperties.feedSupplement === 'Protein Supplement') aggregatedData.proteinSupplement = true;

            if (!aggregatedData.breedSpecific[herdProperties.breed]) {
                aggregatedData.breedSpecific[herdProperties.breed] = {
                    count: 0
                };
            }
            aggregatedData.breedSpecific[herdProperties.breed].count += 1;
        }
    });

    // Provide recommendations based on aggregated data
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

    // Weather conditions
    if (aggregatedData.highTemp) recommendation += 'Consider shade or irrigation for high temperatures. ';
    if (aggregatedData.highHumidity) recommendation += 'Improve ventilation to reduce disease risk. ';
    if (aggregatedData.lowRadiation) recommendation += 'Adjust planting strategy for low radiation. ';

    // Soil parameters
    if (aggregatedData.lowWaterRetention) recommendation += 'Improve soil moisture management. ';
    if (aggregatedData.lowNutrients) recommendation += 'Apply additional fertilizers. ';

    // Herd management
    if (aggregatedData.healthIssues) recommendation += 'Address health issues immediately. ';
    if (aggregatedData.proteinSupplement) recommendation += 'Ensure sufficient protein in the diet. ';
    Object.keys(aggregatedData.breedSpecific).forEach(breed => {
        const count = aggregatedData.breedSpecific[breed].count;
        if (count > 0) {
            if (breed === 'Holstein') recommendation += 'Ensure high energy feed for Holsteins. ';
            if (breed === 'Jersey') recommendation += 'Balance feed for Jersey’s high butterfat milk. ';
        }
    });

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
