export const coordinatesModel = (
    lat = 40,
    lon = 40
) => {
    return {
        lat,
        lon
    };
};


export const weatherModel = (
    temperature = 20,
    humidity = 20,
    precipitation = 5,
    radiation = 15,
    description = "rain"
) => {
    return {
        temperature,
        humidity,
        precipitation,
        radiation,
        description
    }
}


const soilTypes = ['Sandy Loam', 'Clay Loam', 'Silt Loam', 'Peat'];
const nutrientContents = ['Low', 'Medium', 'High'];

export const soilModel = (
    soilType = soilTypes[0],
    waterRetention = 0.2,
    nutrientContent = nutrientContents[0]
) => {



    return {
        soilTypes,
        nutrientContents,

        soilType,
        waterRetention,
        nutrientContent
    }
}



const healthStatuses = ['Healthy', 'Sick', 'Recovering'];
const feedSupplements = ['None', 'Grain', 'Protein Supplement', 'Vitamin Supplement'];
const breeds = ['Holstein', 'Jersey', 'Guernsey', 'Ayrshire'];

export const herdModel = (
    breed = breeds[0],
    weight = 500,
    calvingInterval = 365,
    milkProduction = 25,
    fatContent = 4.0,
    proteinContent = 3.5,
    age = 3,
    healthStatus = healthStatuses[0],
    feedSupplement = feedSupplements[0],
    herdSize = 50
) => {

    return {
        healthStatuses,
        feedSupplements,
        breeds,

        breed,
        weight,
        calvingInterval,
        milkProduction,
        fatContent,
        proteinContent,
        age,
        healthStatus,
        feedSupplement,
        herdSize
    }
}




export const forageModel = (
    arableArea = 10,
    grasslandArea = 20,
    legumeShare = 30,
    nitrogenInput = 100,
) => {

    return {
        arableArea,
        grasslandArea,
        legumeShare,
        nitrogenInput,
    }
}






export const simulationRecordModel = (
    id = 0,
    group_id = "farm 1",
    name = `Simulation ${new Date().toISOString().replace('T', ' ').split('.')[0]}`,
    date = new Date().toISOString().replace('T', ' ').split('.')[0],
    coordinates = coordinatesModel(),
    weather = weatherModel(),
    soilParams = soilModel(),
    herdProperties = herdModel(),
    forageData = forageModel()
) => {
    return {
        id,
        group_id,
        name,
        date,
        coordinates,
        weather,
        soilParams,
        herdProperties,
        forageData
    }
}



export const simulationResultModel = (
    simulationRecords=[],
    group_id="farm 1",
    dates = [],
    forageYield = [],
    feedNeeds = [],
    totalForageProduction = [],
    totalFeedNeeds = [],
    forageSurplus = [],
    recommendations = []
) => {
    return {
        simulationRecords,
        group_id,
        dates,
        forageYield,
        feedNeeds,
        totalForageProduction,
        totalFeedNeeds,
        forageSurplus,
        recommendations
    }
}