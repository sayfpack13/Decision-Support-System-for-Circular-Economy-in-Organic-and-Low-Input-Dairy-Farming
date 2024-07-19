import React, { useState } from 'react';
import Simulation from './Simulation';
import Introduction from './Introduction';
import "./App.css"



export default function App() {

    const [isIntroduction, setisIntroduction] = useState(true)
    const [isSimulation, setisSimulation] = useState(false)


    return (
        <>
            <div className="header">

                <h4 className='title'>Decision Support System (DSS) for Promoting Circular Economy Practices in Organic and Low-Input Dairy Farming</h4>
                <nav className="header-navbar">
                    <ul className="nav navbar-nav navbar-left">
                        <li onClick={() => { setisIntroduction(true); setisSimulation(false) }} className={isIntroduction ? "active" : ""} data-toggle="popover" data-placement="right"
                        >
                            <a>
                                Home
                            </a>
                        </li>


                        <li onClick={() => { setisIntroduction(false); setisSimulation(true) }} className={isSimulation ? "active" : ""} data-toggle="popover" data-placement="right"
                        >
                            <a>
                                Simulation
                            </a>
                        </li>
                    </ul>
                </nav>

            </div>

            <div className='container'>
                {isIntroduction && <Introduction />}
                {isSimulation && <Simulation />}
            </div>
        </>
    )
}