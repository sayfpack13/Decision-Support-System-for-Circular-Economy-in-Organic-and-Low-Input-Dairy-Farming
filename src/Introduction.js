export default function Introduction() {
    return (
        <>
            <h3>Decision Support System (DSS) for Promoting Circular Economy Practices in Organic and Low-Input Dairy Farming</h3>
            <p>
                This decision support system helps you to estimate the long-term balance of forage supply grown on arable & grassland and demand from your dairy herd and identify potential shortages and overconsumption. Before you run the simulation
                you should go through these steps:
            </p>

            <h2>Usage:</h2>
            <p>This decision support system helps you to estimate the longterm balance of forage supply grown on arable & grassland and demand from your dairy herd and identify potential shortages and overconsumption. Before you run the simulation
                you should go through these steps:</p>
            <ul>
                <li>
                    Set your
                    <a href="#location"><img className='svg' src='img/weather.svg' height='30' width='30'></img>location</a>
                    and edit soil parameters.
                </li>
                <li>
                    Set the properties of your
                    <a href="#herd"><img className='svg' src='img/cow.svg' height='30' width='30'></img>dairy</a> herd.
                </li>
                <li>
                    Edit your rotations if you produce forage
                    <a href="#crop"><img className='svg' src='img/crop.svg' height='30' width='30'></img>crops</a> on arable land.
                </li>
                <li>
                    Set
                    <a href="#crop"><img className='svg' src='img/grass.svg' height='30' width='30'></img>grassland and pasture
                    </a> availability.
                </li>
                <li>
                    Check your inputs
                    <a href="#input-summary"><img className='svg' src='img/chart.svg' height='30' width='30'></img>here</a>
                    and finally
                    <a id='run-link' href="#"><img className='svg' src='img/run.svg' height='30' width='30'></img>run</a> the simulation.
                </li>
                <li>
                    View results <a href="#output-summary">here</a>, adjust simulation parameters and run the simulation again if necessary.
                </li>
            </ul>
            <p>Please find additional help and more background information on our <a href="https://github.com/zalf-lse/solid-dss/wiki">Wiki pages.</a></p>


            <h2>How it works:</h2>
            <h3>Step 1: Gathering Data</h3>
            <p>Environmental Data:</p>
            <ul>
                <li>Climate Data: Temperature, Precipitation, Daylength, Radiation</li>
                <li>Soil Quality Data: Focus on topsoil and subsoil texture (e.g., sandy loam, clay loam) relevant to water retention and nutrient availability for forage crops.</li>
            </ul>
            <p>Farm Data:</p>
            <ul>
                <li>Herd Information: Breed, weight, calving intervals, milk production (daily/weekly), number of animals per parity (e.g., primiparous, multiparous), milk fat & protein content.</li>
                <li>Feedstuff Composition: Amounts & composition (dry matter, organic matter, digestibility) of various feedstuffs used on the farm (e.g., barley, soybean meal).</li>
                <li>Crop & Forage Production: Total arable & permanent grassland area, legume share in permanent grassland, grass cutting threshold & hay share, yearly nitrogen input on permanent grassland, crop rotation plan.</li>
            </ul>

            <h3>Step 2: Data Modeling</h3>
            <p>Forage Growth Model: This model would use weather data, soil properties, and crop rotation plans to estimate forage yield over time.</p>
            <p>Herd Nutritional Needs Model: This model would calculate the amount of feed required by the dairy herd based on breed, weight, milk production, and physiological stage. Established formulas are used for this purpose.</p>
            <p>Feed Ration Optimization Model (Optional): A future application of machine learning could analyze real-time data on feed prices and animal performance to suggest the most cost-effective ration adjustments.</p>

            <h3>Step 3: Applying Models and Showing Results</h3>
            <p>Simulate Forage Production: Run the forage growth model using historical and forecasted weather data to estimate future forage yield.</p>
            <p>Analyze Feed Needs: Use the herd nutritional needs model to calculate the feed requirements for the dairy herd.</p>
            <p>Identify Potential Shortages/Surpluses: Compare predicted forage production with feed needs to highlight potential imbalances.</p>
            <p>Optimize Feeding Strategies: Allow users to adjust factors like ration composition, pasture management, and purchased feed to achieve a balance between forage supply and demand. Present results visually with charts and graphs.</p>

            <h3>Step 4: System Development Requirements (not planned)</h3>
            <p>
                The system development requirements remain similar to the general example, but with a focus on the specific needs of organic and low-input dairy farmers.
            </p>
            <ul>
                <li>Frontend (React.JS): Retrieve results from the DSS models and present them visually (e.g., charts showing forage production vs. feed needs).</li>
                <li>Backend (Node.js/Express): Develop a RESTful API to retrieve data from the database, apply the DSS models, and send recommendations back to the frontend.</li>
                <li>Database (MongoDB): Store and manage farm data, historical simulations, and user settings.</li>
            </ul>
            <p>
                Overall, by aligning the data collection, modeling, and results presentation with the specific needs of organic and low-input dairy farming, this DSS can provide valuable insights to optimize forage production, feed management, and ultimately, herd health and profitability.
            </p>
        </>
    )
}
