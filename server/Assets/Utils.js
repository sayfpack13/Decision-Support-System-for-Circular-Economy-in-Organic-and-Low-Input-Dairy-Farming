import axios from "axios";
import { calculateSolarRadiationHargreaves } from "./Calculations";



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