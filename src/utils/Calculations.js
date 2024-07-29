import { simulationRecordModel, simulationResultModel } from "./InputModels";

// https://www.intechopen.com/chapters/62830
export const calculateForageYield = (days, weather, soilParams, forageData) => {
    const { temperature, humidity, radiation } = weather;
    const soilRetention = parseFloat(soilParams.waterRetention) || 0.2;
    const growthRate = calculateGrowthRate(weather, soilParams);

    return Array.from({ length: days }, (_, i) => (
        ((parseFloat(forageData.arableArea) || 1) * (0.5 * (temperature - 10) + (0.3 * (100 - humidity)) + (0.2 * radiation) - soilRetention) * Math.pow(growthRate, i + 1))
    ).toFixed(2)); // Return in kilograms
};

// https://www.intechopen.com/chapters/62830
export const calculateFeedNeeds = (days, herdProperties) => {
    const milkProductionPerCow = parseFloat(herdProperties.milkProduction) || 20;
    const herdSize = parseInt(herdProperties.herdSize) || 50;
    const ageFactor = herdProperties.age > 5 ? 0.9 : 1;
    const healthFactor = herdProperties.healthStatus === 'Sick' ? 1.2 : 1;
    const supplementFactor = herdProperties.feedSupplements === 'Protein Supplement' ? 0.9 : 1;

    const energyPerCow = milkProductionPerCow * 0.3 * ageFactor * healthFactor * supplementFactor;
    const proteinPerCow = milkProductionPerCow * 0.15 * ageFactor * healthFactor * supplementFactor;

    return Array.from({ length: days }, () => ({
        energy: (energyPerCow * herdSize).toFixed(2), // Kilograms
        protein: (proteinPerCow * herdSize).toFixed(2), // Kilograms
    }));
};





export const calculateGrowthRate = (weather, soilParams) => {
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
            dailyForageProduction: dailyForageProduction.toFixed(2),
            dailyFeedNeeds: dailyFeedNeeds.toFixed(2),
            dailyForageSurplus: (dailyForageProduction - dailyFeedNeeds).toFixed(2)
        };
    });



    // Generate recommendations for each day
    const recommendations = dailyTotals.map((day) => {
        if (day.dailyForageSurplus > 0) {
            return 'You have a surplus of forage. Consider storing excess forage or reducing nitrogen input.';
        } else if (day.dailyForageSurplus < 0) {
            return 'You have a deficit of forage. Consider increasing nitrogen input, adjusting crop rotation, or purchasing additional feed.';
        } else {
            return 'Your forage production matches your herd\'s needs. Maintain your current management practices.';
        }
    });

    const simulationRecords = Array.from({ length: predictionPeriod }, (_, i) => simulationRecord);

    return simulationResultModel(
        simulationRecords,
        simulationRecord.group_id,
        dates,
        forageYield,
        feedNeeds.map(need => need.energy),
        dailyTotals.map(day => day.dailyForageProduction),
        dailyTotals.map(day => day.dailyFeedNeeds),
        dailyTotals.map(day => day.dailyForageSurplus),
        recommendations
    );
};


