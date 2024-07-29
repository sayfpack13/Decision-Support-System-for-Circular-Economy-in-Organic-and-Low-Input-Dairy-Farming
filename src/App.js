
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import Home from "./Routes/Home"
import Simulation from "./Routes/Simulation"
import Header from "./Header"
import Loader from "./Loader"
import Statistics from "./Routes/Statistics"



export default function App() {


    return (
        <BrowserRouter>
            <Loader>
                <Header />
                <Routes>
                    <Route index Component={Home}></Route>
                    <Route path="/simulation" Component={Simulation}></Route>
                    <Route path="/statistics" element={<Statistics />} />
                </Routes>
            </Loader>
        </BrowserRouter>
    )
}