
import { BrowserRouter, Route, Routes } from "react-router-dom"
import "./App.css"
import Home from "./Home"
import Simulation from "./Simulation"
import Header from "./Header"
import Loader from "./Loader"



export default function App() {


    return (
        <BrowserRouter>
            <Loader>
                <Header />
                <Routes>
                    <Route index Component={Home}></Route>
                    <Route path="/simulation" Component={Simulation}></Route>
                </Routes>
            </Loader>
        </BrowserRouter>
    )
}