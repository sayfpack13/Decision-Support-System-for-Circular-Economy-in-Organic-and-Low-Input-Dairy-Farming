import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { fetchWeatherData, sendResponse, simulateRecords } from "./Assets/Utils.js"



dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.listen(1000, () => {
    console.log("Server Started");
})



app.get("/fetchWeatherData", async (req, res) => {
    try {
        const { lat, lon } = req.query
        sendResponse(res, await fetchWeatherData(lat, lon))
    } catch (error) {
        sendResponse(res, "Cannot fetch current weather data !!", false)
    }
})





app.post("/simulateRecords", async (req, res) => {
    try {
        const { simulationRecords,predictionPeriod } = req.body

        sendResponse(res, await simulateRecords(simulationRecords,predictionPeriod))
    } catch (error) {
        console.log(error);
        sendResponse(res, "Error simulating results !!", false)
    }
})