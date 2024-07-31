import express from "express"
import cors from "cors"
import dotenv from "dotenv"


dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.listen(1000, () => {
    console.log("Server Started");
})




app.get("/fetchWeatherData", (req, res) => {
    try {
        const { lat, lon } = req.query
        sendResponse(res, fetchWeatherData(lat, lon))
    } catch (error) {
        sendResponse(res, "Cannot fetch current weather data !!", false)
    }
})