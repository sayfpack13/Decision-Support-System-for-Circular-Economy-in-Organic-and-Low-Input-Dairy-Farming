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


## How It Works

### Step 1: Gathering Data

**Environmental Data:**
- **Climate Data:** Temperature, Humidity, Precipitation, Daylength, Radiation
- **Soil Quality Data:** Topsoil and subsoil texture (e.g., sandy loam, clay loam) relevant to water retention and nutrient availability for forage crops.

**Farm Data:**
- **Herd Information:** Breed, weight, calving intervals, milk production (daily/weekly), number of animals per parity, milk fat & protein content.
- **Feedstuff Composition:** Amounts & composition (dry matter, organic matter, digestibility) of various feedstuffs (e.g., barley, soybean meal).
- **Crop & Forage Production:** Arable & permanent grassland area, legume share in permanent grassland, grass cutting threshold & hay share, yearly nitrogen input on permanent grassland, crop rotation plan.

### Step 2: Data Modeling
[Download "DSS simulation input data example.xlsx"](https://docs.google.com/spreadsheets/d/1GGAgBEdtJUZDVZxy8Yvl_wksV2Yx1_31/edit?usp=sharing&ouid=117590588496306833108&rtpof=true&sd=true)

[Download "DSS Simulation Parameters.xlsx"](https://docs.google.com/spreadsheets/d/11xDL4vAugby7FB6GDOCe2ufpFYg4nslk/edit?usp=sharing&ouid=117590588496306833108&rtpof=true&sd=true)

- **Forage Growth Model:**
   - **Purpose:** Estimates forage yield over time using weather data, soil properties, and crop rotation plans.
   - **Parameters:**
      - **Weather Data:** Temperature, Precipitation, Radiation, Daylength.
      - **Soil Properties:** Soil type (e.g., sandy loam, clay loam), water retention capacity, nutrient content.
      - **Crop Rotation Plans:** Types of crops, planting and harvesting dates, rotation cycles.
   - **Process:** Simulates daily growth based on environmental conditions and management practices.
   - **Implementation:**
      - **public\js\pasture-worker.min.js** Handles the simulation of forage growth on grassland and pasture areas.
      - **public\js\arable-worker.min.js** Manages the simulation of forage and crop growth on arable land.
      - **public\js\grassland-worker.min.js** Manages the simulation of forage growth specifically on grassland areas.
      - **public\lib\weather.solar.js** Calculates solar radiation and daylength based on latitude and temperature. Essential for accurate modeling of forage growth dependent on sunlight.
      - **public\lib\simple_statistics.js** A simple, literate statistics system used for various statistical calculations such as linear regression, R-squared, Bayesian Classifier, harmonic mean, and geometric mean. This is used to support data analysis and model validation within the DSS.


- **Herd Nutritional Needs Model:**
   - **Purpose:** Calculates the feed required by the dairy herd based on breed, weight, milk production, and physiological stage.
   - **Parameters:**
      - **Breed Specifications:** Average weight, milk yield, calving interval.
      - **Physiological Stage:** Growth, lactation, maintenance.
      - **Nutrient Requirements:** Energy (ME), protein (CP), fiber (NDF), minerals.
   - **Process:** Determines daily feed intake and nutritional needs based on herd parameters and production goals.
   - **Implementation:** 
      - **public\js\index.min.js** Contains the main simulation logic, integrating the forage growth models, herd nutritional needs model, and other necessary computations to provide a comprehensive analysis of the forage supply and demand balance.


- **Feed Ration Optimization Model (Future scope):**
   - **Purpose:** Analyzes real-time data on feed prices and animal performance for cost-effective ration adjustments (future application).
   - **Parameters:**
      - **Feed Prices:** Real-time data on market prices for various feedstuffs.
      - **Animal Performance Data:** Milk yield, growth rates, health indicators.
      - **Cost-Effectiveness:** Optimization algorithms to balance cost and nutritional adequacy.
   - **Process:** Uses optimization algorithms to suggest cost-effective feeding strategies.
   - **Implementation:** Future scope, planned as an enhancement to the current model.

### Step 3: Applying Models and Showing Results

- **Simulate Forage Production:** Use historical and forecasted weather data to estimate future forage yield.
- **Analyze Feed Needs:** Calculate the feed requirements for the dairy herd.
- **Identify Potential Shortages/Surpluses:** Compare predicted forage production with feed needs to highlight imbalances.
- **Optimize Feeding Strategies:** Adjust ration composition, pasture management, and purchased feed to balance forage supply and demand. Present results visually with charts and graphs.