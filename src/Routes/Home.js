import { useContext, useEffect } from "react"
import { LoaderContext } from "../Loader"

export default function Home() {
    const {  setisLoading } = useContext(LoaderContext)
    useEffect(() => {

        setTimeout(()=>{
            setisLoading(false)
        },500)
    }, [setisLoading])

    return (
        <div className='container'>

            <h3>Decision Support System (DSS) for Promoting Circular Economy Practices in Organic and Low-Input Dairy Farming</h3>
            <p>
                This decision support system helps you to estimate the long-term balance of forage supply grown on arable & grassland and demand from your dairy herd and identify potential shortages and overconsumption. Before you run the simulation
                you should go through these steps:
            </p>

            <h2>Usage:</h2>

            <ul>
                <li>
                    Set your
                    <a href="/simulation#location"><img alt="" className='svg' src='img/weather.svg' height='30' width='30'></img>location</a>
                    and edit soil parameters.
                </li>
                <li>
                    Set the properties of your
                    <a href="/simulation#herd"><img alt="" className='svg' src='img/cow.svg' height='30' width='30'></img>dairy</a> herd.
                </li>
                <li>
                    Edit your rotations if you produce forage
                    <a href="/simulation#crop"><img alt="" className='svg' src='img/crop.svg' height='30' width='30'></img>crops</a> on arable land.
                </li>
                <li>
                    Set
                    <a href="/simulation#crop"><img alt="" className='svg' src='img/grass.svg' height='30' width='30'></img>grassland and pasture
                    </a> availability.
                </li>
                <li>
                    Check your inputs
                    <a href="/simulation#input-summary"><img alt="" className='svg' src='img/chart.svg' height='30' width='30'></img>here</a>
                    and finally
                    <a id='run-link' href="/simulation#"><img alt="" className='svg' src='img/run.svg' height='30' width='30'></img>run</a> the simulation.
                </li>
                <li>
                    View results <a href="/simulation#output-summary">here</a>, adjust simulation parameters and run the simulation again if necessary.
                </li>
            </ul>




            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">DSS Requirements</h3>
                </div>
                <div className="panel-body">
                    <h4>DSS Simulation data example:</h4>
                    <ul>
                        <li><a href="https://docs.google.com/spreadsheets/d/1GGAgBEdtJUZDVZxy8Yvl_wksV2Yx1_31/edit?usp=sharing&ouid=117590588496306833108&rtpof=true&sd=true">Download "DSS simulation input data example.xlsx"</a></li>
                    </ul>
                    <h4>DSS ML models parameters:</h4>
                    <ul>
                        <li><a href="https://docs.google.com/spreadsheets/d/11xDL4vAugby7FB6GDOCe2ufpFYg4nslk/edit?usp=sharing&ouid=117590588496306833108&rtpof=true&sd=true">Download "DSS Simulation Parameters.xlsx"</a></li>
                    </ul>
                </div>
            </div>


            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Step 1: Gathering Data</h3>
                </div>
                <div className="panel-body">
                    <h4>Environmental Data:</h4>
                    <ul>
                        <li><strong>Climate Data:</strong> Temperature, Humidity, Precipitation, Daylength, Radiation</li>
                        <li><strong>Soil Quality Data:</strong> Topsoil and subsoil texture (e.g., sandy loam, clay loam) relevant to water retention and nutrient availability for forage crops.</li>
                    </ul>
                    <h4>Farm Data:</h4>
                    <ul>
                        <li><strong>Herd Information:</strong> Breed, weight, calving intervals, milk production (daily/weekly), number of animals per parity, milk fat & protein content.</li>
                        <li><strong>Feedstuff Composition:</strong> Amounts & composition (dry matter, organic matter, digestibility) of various feedstuffs (e.g., barley, soybean meal).</li>
                        <li><strong>Crop & Forage Production:</strong> Arable & permanent grassland area, legume share in permanent grassland, grass cutting threshold & hay share, yearly nitrogen input on permanent grassland, crop rotation plan.</li>
                    </ul>
                </div>
            </div>

            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Step 2: Data Modeling (integrated Machine Learning models)</h3>
                </div>
                <div className="panel-body">
                    <h4>Forage Growth Model:</h4>
                    <ul>
                        <li><strong>Purpose:</strong> Estimates forage yield over time using weather data, soil properties, and crop rotation plans.</li>
                        <li><strong>Parameters:</strong>
                            <ul>
                                <li><strong>Weather Data:</strong> Temperature, Precipitation, Radiation, Daylength.</li>
                                <li><strong>Soil Properties:</strong> Soil type (e.g., sandy loam, clay loam), water retention capacity, nutrient content.</li>
                                <li><strong>Crop Rotation Plans:</strong> Types of crops, planting and harvesting dates, rotation cycles.</li>
                            </ul>
                        </li>
                        <li><strong>Process:</strong> Simulates daily growth based on environmental conditions and management practices.</li>
                        <li><strong>Implementation:</strong>
                            <ul>
                                <li><strong>public\js\pasture-worker.min.js:</strong> Handles the simulation of forage growth on grassland and pasture areas.</li>
                                <li><strong>public\js\arable-worker.min.js:</strong> Manages the simulation of forage and crop growth on arable land.</li>
                                <li><strong>public\js\grassland-worker.min.js:</strong> Manages the simulation of forage growth specifically on grassland areas.</li>
                                <li><strong>public\lib\weather.solar.js:</strong> Calculates solar radiation and daylength based on latitude and temperature. Essential for accurate modeling of forage growth dependent on sunlight.</li>
                                <li><strong>public\lib\simple_statistics.js:</strong> A simple, literate statistics system used for various statistical calculations such as linear regression, R-squared, Bayesian Classifier, harmonic mean, and geometric mean. This is used to support data analysis and model validation within the DSS.</li>
                            </ul>
                        </li>
                    </ul>

                    <h4>Herd Nutritional Needs Model:</h4>
                    <ul>
                        <li><strong>Purpose:</strong> Calculates the feed required by the dairy herd based on breed, weight, milk production, and physiological stage.</li>
                        <li><strong>Parameters:</strong>
                            <ul>
                                <li><strong>Breed Specifications:</strong> Average weight, milk yield, calving interval.</li>
                                <li><strong>Physiological Stage:</strong> Growth, lactation, maintenance.</li>
                                <li><strong>Nutrient Requirements:</strong> Energy (ME), protein (CP), fiber (NDF), minerals.</li>
                            </ul>
                        </li>
                        <li><strong>Process:</strong> Determines daily feed intake and nutritional needs based on herd parameters and production goals.</li>
                        <li><strong>Implementation:</strong>
                            <ul>
                                <li><strong>public\js\index.min.js:</strong> Contains the main simulation logic, integrating the forage growth models, herd nutritional needs model, and other necessary computations to provide a comprehensive analysis of the forage supply and demand balance.</li>
                            </ul>
                        </li>
                    </ul>

                    <h4>Feed Ration Optimization Model (Future scope):</h4>
                    <ul>
                        <li><strong>Purpose:</strong> Analyzes real-time data on feed prices and animal performance for cost-effective ration adjustments (future application).</li>
                        <li><strong>Parameters:</strong>
                            <ul>
                                <li><strong>Feed Prices:</strong> Real-time data on market prices for various feedstuffs.</li>
                                <li><strong>Animal Performance Data:</strong> Milk yield, growth rates, health indicators.</li>
                                <li><strong>Cost-Effectiveness:</strong> Optimization algorithms to balance cost and nutritional adequacy.</li>
                            </ul>
                        </li>
                        <li><strong>Process:</strong> Uses optimization algorithms to suggest cost-effective feeding strategies.</li>
                        <li><strong>Implementation:</strong> Future scope, planned as an enhancement to the current model.</li>
                    </ul>
                </div>
            </div>

            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Step 3: Applying Models and Showing Results</h3>
                </div>
                <div className="panel-body">
                    <ul>
                        <li><strong>Simulate Forage Production:</strong> Use historical and forecasted weather data to estimate future forage yield.</li>
                        <li><strong>Analyze Feed Needs:</strong> Calculate the feed requirements for the dairy herd.</li>
                        <li><strong>Identify Potential Shortages/Surpluses:</strong> Compare predicted forage production with feed needs to highlight imbalances.</li>
                        <li><strong>Optimize Feeding Strategies:</strong> Adjust ration composition, pasture management, and purchased feed to balance forage supply and demand. Present results visually with charts and graphs.</li>
                    </ul>
                </div>
            </div>
            <p>
                Overall, by aligning the data collection, modeling, and results presentation with the specific needs of organic and low-input dairy farming, this DSS can provide valuable insights to optimize forage production, feed management, and ultimately, herd health and profitability.
            </p>



        </div>
    )
}
