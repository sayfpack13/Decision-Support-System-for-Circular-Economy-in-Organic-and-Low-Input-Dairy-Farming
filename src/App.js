
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import Home from "./Home"
import Simulation from "./Simulation"
import Header from "./Header"



export default function App() {


    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route index Component={Home}></Route>
                <Route path="/simulation" Component={Simulation}></Route>
            </Routes>
        </BrowserRouter>
    )
}