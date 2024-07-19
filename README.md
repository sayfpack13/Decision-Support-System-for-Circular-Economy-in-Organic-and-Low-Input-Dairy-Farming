# Decision Support System (DSS) for Promoting Circular Economy Practices in Organic and Low-Input Dairy Farming

## Overview

The Decision Support System (DSS) is designed to help organic and low-input dairy farmers estimate the long-term balance between forage supply from arable and grassland and the demand from their dairy herd. It identifies potential shortages and overconsumption to optimize forage production and feed management. 

## Getting Started

Before running the simulation, follow these steps:

1. **Set Location and Edit Soil Parameters**
   - Define your farm's location and adjust soil parameters to reflect local conditions.

2. **Set Dairy Herd Properties**
   - Input details about your dairy herd, including breed, weight, calving intervals, milk production, and other relevant metrics.

3. **Edit Crop Rotations**
   - If you grow forage crops on arable land, specify your crop rotation plans.

4. **Set Grassland and Pasture Availability**
   - Enter information about the availability of grassland and pasture on your farm.

5. **Check Inputs and Run the Simulation**
   - Review all the inputs for accuracy and run the simulation to estimate forage supply and demand balance.

6. **View Results and Adjust Parameters**
   - Analyze the results, adjust simulation parameters if needed, and run the simulation again to refine outcomes.

For additional help and background information, please refer to our [Wiki pages](#).

## How It Works

### Step 1: Gathering Data

**Environmental Data:**
- **Climate Data:** Temperature, Precipitation, Daylength, Radiation
- **Soil Quality Data:** Topsoil and subsoil texture (e.g., sandy loam, clay loam) relevant to water retention and nutrient availability for forage crops.

**Farm Data:**
- **Herd Information:** Breed, weight, calving intervals, milk production (daily/weekly), number of animals per parity, milk fat & protein content.
- **Feedstuff Composition:** Amounts & composition (dry matter, organic matter, digestibility) of various feedstuffs (e.g., barley, soybean meal).
- **Crop & Forage Production:** Arable & permanent grassland area, legume share in permanent grassland, grass cutting threshold & hay share, yearly nitrogen input on permanent grassland, crop rotation plan.

### Step 2: Data Modeling

- **Forage Growth Model:** Estimates forage yield over time using weather data, soil properties, and crop rotation plans.
- **Herd Nutritional Needs Model:** Calculates the feed required by the dairy herd based on breed, weight, milk production, and physiological stage.
- **Feed Ration Optimization Model (Optional):** Analyzes real-time data on feed prices and animal performance for cost-effective ration adjustments (future application).

### Step 3: Applying Models and Showing Results

- **Simulate Forage Production:** Use historical and forecasted weather data to estimate future forage yield.
- **Analyze Feed Needs:** Calculate the feed requirements for the dairy herd.
- **Identify Potential Shortages/Surpluses:** Compare predicted forage production with feed needs to highlight imbalances.
- **Optimize Feeding Strategies:** Adjust ration composition, pasture management, and purchased feed to balance forage supply and demand. Present results visually with charts and graphs.

### Step 4: System Development Requirements (Not Planned)

- **Frontend (React.JS):** Retrieve results from the DSS models and present them visually (e.g., charts showing forage production vs. feed needs).
- **Backend (Node.js/Express):** Develop a RESTful API to retrieve data from the database, apply DSS models, and send recommendations to the frontend.
- **Database (MongoDB):** Store and manage farm data, historical simulations, and user settings.