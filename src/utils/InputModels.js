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
    description = "rain",
    country="TN"
) => {
    return {
        temperature,
        humidity,
        precipitation,
        radiation,
        description,
        country
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
    weight = 650,
    calvingInterval = 365,
    milkProduction = 25,
    fatContent = 3.8,
    proteinContent = 3.2,
    age = 3,
    healthStatus = healthStatuses[0],
    feedSupplement = feedSupplements[0],
    herdSize = 10
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
    dailyForageProduction = [],
    dailyFeedNeeds = [],
    dailyForageSurplus = [],
    meanForageProduction=0,
    meanFeedNeeds=0,
    meanForageSurplus=0,
    recommendation = ""
) => {
    return {
        simulationRecords,
        group_id,
        dates,
        forageYield,
        feedNeeds,
        dailyForageProduction,
        dailyFeedNeeds,
        dailyForageSurplus,
        meanForageProduction,
        meanFeedNeeds,
        meanForageSurplus,
        recommendation
    }
}