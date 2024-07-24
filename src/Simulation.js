
import { useEffect, useState } from "react";


export default function Simulation() {

    const [isSimulated, setisSimulated] = useState(false)



    useEffect(() => {
        setTimeout(() => {
            const hash = window.location.hash;

            if (hash) {
                const id = hash.substring(1);

                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 500)
    }, [])



    const milkData = `
    1;17.3
    2;27.65
    3;28.14
    4;27.69
    5;30.35
    6;29
    7;28.07
    8;28.16
    9;27.2
    10;26.21
    11;26.03
    12;25.6
    13;25.49
    14;24.31
    15;24.31
    16;24.54
    17;24.29
    18;24.42
    19;24.24
    20;24.84
    21;23.43
    22;22.86
    23;22.1
    24;22.4
    25;21.49
    26;20.43
    27;19.7
    28;18.03
    29;18.49
    30;18.2
    31;15.84
    32;13.49
    33;12.67
    34;12.68
    35;13.45
    36;12.89
    37;13.4
    38;14.37
    39;13.7
    40;12.19
    41;11.13
    42;10.47
    `;


    useEffect(() => {
        const scriptUrls = [
            "lib/jquery.min.js",
            "lib/jquery-ui.min.js",
            "lib/bootstrap-3.3.4/js/bootstrap.min.js",
            "lib/bootstrap-select.min.js",
            "lib/leaflet.js",
            "lib/d3.min.js",
            "lib/c3.min.js",
            "lib/simple_statistics.js",
            "lib/spin.js",
            "lib/FileSaver.min.js",
            "lib/jquery.inview.min.js",
            "lib/crop-rotation-ui.js",
            "lib/weather.solar.js",
            "lib/dairy.min.js",
            "lib/pathseg.js",
            "js/index.ui.min.js",
            "js/index.min.js"
        ];

        const loadScriptsSequentially = async () => {
            try {
                for (const src of scriptUrls) {
                    await loadScript(src);
                    console.log(`${src} loaded`);
                }
            } catch (error) {
                console.error(error);
            }
        };


        loadScriptsSequentially();
    }, []);

    const loadScript = (src) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => resolve(src);
            script.onerror = () => reject(new Error(`Error loading ${src}`));
            document.body.appendChild(script);
        });
    };

    return (
        <div className='container'>



            <div className="scroll-area" data-spy="scroll" data-offset="0">


                <div id="settings" className='text col-md-12'>
                    <h2>Simulation Settings</h2>
                    <p></p>
                </div>

                <div className='col-md-6'>

                    <label htmlFor="start-year">Start year</label>
                    <div className="input-group">
                        <select id="start-year" className='form-control parameter-simulation' data-toggle="popover" data-placement="bottom" data-content='Start year of simulation (first harvest).'>

                            <option value="2014">2014</option>
                            <option value="2015">2015</option>
                            <option value="2016">2016</option>
                            <option value="2017">2017</option>
                            <option value="2018">2018</option>
                            <option value="2019">2019</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>

                        </select>
                        <span className="input-group-addon">year</span>
                    </div>

                </div>

                <div className='col-md-6'>

                    <label htmlFor="time-step">Time step</label>
                    <div className="input-group">
                        <select defaultValue={"monthly"} id="time-step" className='form-control parameter-simulation' data-toggle="popover" data-placement="bottom" data-content='Time step for ration formulation.'>
                            <option value="fortnight">fortnight</option>
                            <option value="monthly" >monthly</option>
                        </select>
                        <span className="input-group-addon">-</span>
                    </div>

                </div>

                <div className='col-md-12'>
                    <hr></hr>
                </div>

                <div id="location" className='text col-md-12'>
                    <h2>Location and Weather</h2>
                    <p>Set parameters related to location-specific weather data and soil properties.</p>
                </div>

                <div className='text col-md-12'>
                    <h3>Soil</h3>
                </div>

                <div className='col-md-6'>

                    <label htmlFor="topsoil-texture">Topsoil texture</label>
                    <div className="input-group">
                        <select defaultValue={"sandy clay loam 3"} id="topsoil-texture" className='form-control parameter-soil' data-toggle="popover" data-placement="bottom" data-content='Soil texture class.'>
                            <option value='loamy sand'>loamy sand (sand 80%, clay 5%)</option>
                            <option value='sandy loam 1'>sandy loam (sand 65%, clay 10%)</option>
                            <option value='sandy loam 2'>sandy loam (sand 70%, clay 15%)</option>
                            <option value='sandy loam 3'>sandy loam (sand 55%, clay 5%)</option>
                            <option value='sandy clay loam 1'>sandy clay loam (sand 65%, clay 20%)</option>
                            <option value='sandy clay loam 2'>sandy clay loam (sand 60%, clay 20%)</option>
                            <option value='sandy clay loam 3' >sandy clay loam (sand 50%, clay 20%)</option>
                            <option value='silt loam 1'>silt loam (sand 40%, clay 5%)</option>
                            <option value='silt loam 2'>silt loam (sand 25%, clay 15%)</option>
                            <option value='silt loam 3'>silt loam (sand 10%, clay 20%)</option>
                            <option value='loam 1'>loam (sand 35%, clay 20%)</option>
                            <option value='loam 2'>loam (sand 50%, clay 15%)</option>
                            <option value='clay loam 1'>clay loam (sand 45%, clay 35%)</option>
                            <option value='clay loam 2'>clay loam (sand 25%, clay 40%)</option>
                            <option value='silty clay loam'>silty clay loam (sand 10%, clay 35%)</option>
                            <option value='silty clay'>silty clay (sand 5%, clay 50%)</option>
                            <option value='silt'>silt (sand 5%, clay 5%)</option>
                            <option value='clay 1'>clay (sand 40%, clay 50%)</option>
                            <option value='clay 2'>clay (sand 20%, clay 55%)</option>
                            <option value='clay 3'>clay (sand 5%, clay 60%)</option>
                        </select>
                        <span className="input-group-addon">-</span>
                    </div>

                    <br></br>


                </div>

                <div className='col-md-6'>

                    <label htmlFor="subsoil-texture">Subsoil texture</label>
                    <div className="input-group">
                        <select defaultValue={"sandy clay loam 3"} id="subsoil-texture" className='form-control parameter-soil' data-toggle="popover" data-placement="bottom" data-content='Soil texture class.'>
                            <option value='loamy sand'>loamy sand (sand 80%, clay 5%)</option>
                            <option value='sandy loam 1'>sandy loam (sand 65%, clay 10%)</option>
                            <option value='sandy loam 2'>sandy loam (sand 70%, clay 15%)</option>
                            <option value='sandy loam 3'>sandy loam (sand 55%, clay 5%)</option>
                            <option value='sandy clay loam 1'>sandy clay loam (sand 65%, clay 20%)</option>
                            <option value='sandy clay loam 2'>sandy clay loam (sand 60%, clay 20%)</option>
                            <option value='sandy clay loam 3'>sandy clay loam (sand 50%, clay 20%)</option>
                            <option value='silt loam 1'>silt loam (sand 40%, clay 5%)</option>
                            <option value='silt loam 2'>silt loam (sand 25%, clay 15%)</option>
                            <option value='silt loam 3'>silt loam (sand 10%, clay 20%)</option>
                            <option value='loam 1'>loam (sand 35%, clay 20%)</option>
                            <option value='loam 2'>loam (sand 50%, clay 15%)</option>
                            <option value='clay loam 1'>clay loam (sand 45%, clay 35%)</option>
                            <option value='clay loam 2'>clay loam (sand 25%, clay 40%)</option>
                            <option value='silty clay loam'>silty clay loam (sand 10%, clay 35%)</option>
                            <option value='silty clay'>silty clay (sand 5%, clay 50%)</option>
                            <option value='silt'>silt (sand 5%, clay 5%)</option>
                            <option value='clay 1'>clay (sand 40%, clay 50%)</option>
                            <option value='clay 2'>clay (sand 20%, clay 55%)</option>
                            <option value='clay 3'>clay (sand 5%, clay 60%)</option>
                        </select>
                        <span className="input-group-addon">-</span>
                    </div>

                    <br></br>


                </div>

                <div className='col-md-12'>
                    <br></br>
                    <div id='map' className='col-md-12' data-content="Click on the map to set coordinates and check weather data availability." data-toggle="popover" data-html="true" data-placement="bottom"></div>
                    <br></br>
                </div>

                <div className='col-md-6' style={{ display: "none" }}>
                    <br></br>
                    <label htmlFor='latitude'>Latitude</label>
                    <div className="input-group">
                        <input id='latitude' className="form-control parameter-location" type="number" defaultValue="36" min="25.375" max="75.375" />
                        <span className="input-group-addon">.00</span>
                    </div>

                    <br></br>

                </div>
                <div className='col-md-6' style={{ display: "none" }}>
                    <br></br>

                    <label htmlFor='longitude'>Longitude</label>
                    <div className="input-group">
                        <input id='longitude' className="form-control parameter-location" type="number" defaultValue="9" min="-40.375" max="75.375" />
                        <span className="input-group-addon">.00</span>
                    </div>

                    <br></br>

                </div>



                <div className='text col-md-12'>
                    <hr></hr>
                </div>


                <div id="herd" className='text col-md-12'>
                    <h2>Dairy Herd</h2>
                    <p>Define herd characteristics including breed, weight, calving intervals, and milk production specifics.</p>

                    <h3>Cow</h3>
                </div>


                <div className='col-md-6'>

                    <label htmlFor="is-dual-purpose">Dual purpose breed</label>
                    <div className="input-group">
                        <select defaultValue={"No"} id="is-dual-purpose" className='form-control parameter-herd' data-toggle="popover" data-placement="bottom" data-content='Are your cows a dual purpose breed?'>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <span className="input-group-addon">-</span>
                    </div>

                    <br></br>

                    <label htmlFor="mature-bodyweight">Mature body weight</label>
                    <div className="input-group">
                        <input id="mature-bodyweight" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="650" min='450' max='850' data-content='Body weight of mature cow' />
                        <span className="input-group-addon">kg</span>
                    </div>

                    <br></br>

                    <label htmlFor="age-first-calving">Age 1st calving</label>
                    <div className="input-group">
                        <input id="age-first-calving" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="24" min='24' max='28' data-content='Age of first calving in month' />
                        <span className="input-group-addon">month</span>
                    </div>

                    <br></br>

                    <label htmlFor="weight-first-calving">Body weight 1st calving</label>
                    <div className="input-group">
                        <input id="weight-first-calving" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="85" min='75' max='90' data-content='Body weight of heifer at 1st calving as % of body weight of mature cow' />
                        <span className="input-group-addon">%</span>
                    </div>

                    <br></br>

                    <label htmlFor="milk-fat">Milk fat</label>
                    <div className="input-group">
                        <input id="milk-fat" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="4.2" min='3' max='6' data-content='Average milk fat' />
                        <span className="input-group-addon">%</span>
                    </div>

                    <br></br>

                    <label htmlFor="milk-protein">Milk protein</label>
                    <div className="input-group">
                        <input id="milk-protein" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="3.4" min='3' max='5' data-content='Average milk protein' />
                        <span className="input-group-addon">%</span>
                    </div>

                    <br></br>

                </div>


                <div className='col-md-6'>

                    <label htmlFor="milk-yield-data">Milk yield data, csv (week;kg)</label>
                    <div>
                        <textarea id="milk-yield-data" rows="17" className='form-control parameter-herd' style={{ width: "99%", height: "100%" }} data-toggle="popover" data-placement="bottom" data-content='If available paste a semicolon seperated list of week&kg pairs of a typical lactation of an average, mature cow into the textbox. Otherwise choose a yield level below.' defaultValue={milkData}></textarea>
                    </div>

                    <br></br>

                    <label htmlFor="milk-yield">Milk yield</label>
                    <div className="input-group">
                        <select defaultValue={"data"} id="milk-yield" className='form-control parameter-herd' data-toggle="popover" data-placement="bottom" data-content='Predefined milk yield data'>
                            <option value="data" >data</option>
                            <option value="6500">~ 6500</option>
                            <option value="7500">~ 7500</option>
                            <option value="8500">~ 8500</option>
                            <option value="9500">~ 9500</option>
                        </select>
                        <span className="input-group-addon">kg</span>
                    </div>

                    <br></br>

                </div>

                <div className='text col-md-12'>
                    <h3>Herd</h3>
                </div>

                <div className='col-md-6'>

                    <label htmlFor="calving-interval">Calving interval</label>
                    <div className="input-group">
                        <input id="calving-interval" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="13" min='12' max='15' data-content='Month inbetween calvings' />
                        <span className="input-group-addon">month</span>
                    </div>

                    <br></br>


                    <label htmlFor="young-stock-cull-rate">Young stock culled</label>
                    <div className="input-group">
                        <input id="young-stock-cull-rate" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="15" min='1' max='20' data-content='Rate of young stock that does not make it till 1st parity' />
                        <span className="input-group-addon">%</span>
                    </div>

                    <br></br>

                    <label htmlFor="no-groups">Number of groups</label>
                    <div className="input-group">
                        <input id="no-groups" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="2" min='1' max='3' data-content='Number of groups w/o dry groups' />
                        <span className="input-group-addon">#</span>
                    </div>

                    <br></br>

                </div>


                <div className='col-md-6'>

                    <label htmlFor="herd-size">Herd size</label>
                    <div className="input-group">
                        <input id="herd-size" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="30" min='20' max='250' data-content='Total number of cows w/o young stock' />
                        <span className="input-group-addon">#</span>
                    </div>

                    <br></br>

                    <label htmlFor="replacement-rate">Replacement rate</label>
                    <div className="input-group">
                        <input id="replacement-rate" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="30" min='15' max='40' data-content='Annual herd replacement' />
                        <span className="input-group-addon">%</span>
                    </div>

                    <br></br>

                    <label htmlFor="dry-periode">Dry period</label>
                    <div className="input-group">
                        <input id="dry-periode" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-herd' defaultValue="8" min='4' max='10' data-content='Length of dry period in weeks' />
                        <span className="input-group-addon">weeks</span>
                    </div>

                    <br></br>

                </div>

                <div className='text col-md-12'>
                    <h3>Ration</h3>
                    <p>Evaluate and adjust the nutritional composition of the herd's diet, including the use of supplementary feedstuff like barley, maize, and soybean meal.</p>
                </div>

                <div className='col-md-6'>

                    <label htmlFor="eval-system">Evaluation system</label>
                    <div className="input-group">
                        <select id="eval-system" data-toggle="popover" data-placement="bottom" className='form-control parameter-feed' data-content='Energy evaluation system used for herd requirements and feedstuff' >
                            <option value="de">German NEL</option>
                            <option value="fi">Finnish ME</option>
                            <option value="fr">French UFL</option>
                            <option value="gb">British ME</option>
                        </select>
                        <span className="input-group-addon"></span>
                    </div>

                    <br></br>

                    <label htmlFor="straw-max">Maximum straw in diet</label>
                    <div className="input-group">
                        <input id="straw-max" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-feed' defaultValue="1" min='0' max='5' data-content='Maximum straw in diet.' />
                        <span className="input-group-addon">kilograms dry matter</span>
                    </div>

                    <br></br>

                    <label htmlFor="straw-type">Available straw</label>
                    <div className="input-group">
                        <select id="straw-type" data-toggle="popover" data-placement="bottom" className='form-control parameter-feed' data-content='Select the straw that is available for feeding (no limits on availability assumed)' >
                            <option value="wheat">wheat</option>
                            <option value="oats">oats</option>
                            <option value="barley">barley</option>
                        </select>
                        <span className="input-group-addon"></span>
                    </div>

                    <br></br>

                </div>

                <div className='col-md-6'>

                    <label htmlFor="concentrate-share">Maximum concentrate in diet</label>
                    <div className="input-group">
                        <input id="concentrate-share" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-feed' defaultValue="30" min='0' max='50' data-content='Maximum concentrate share in diet in % of total dry matter intake' />
                        <span className="input-group-addon">%</span>
                    </div>

                    <br></br>

                    <label htmlFor="rnb-ub">Ruminal nitrogen balance upper bound</label>
                    <div className="input-group">
                        <select defaultValue={"50"} id="rnb-ub" data-toggle="popover" data-placement="bottom" className='form-control parameter-feed' data-content='Upper bound of the ruminal nitrogen balance (RNB) - part of the German protein system' >
                            <option value="Infinity">Infinity</option>
                            <option value="50" >50</option>
                            <option value="0">0</option>
                        </select>
                        <span className="input-group-addon">g N</span>
                    </div>

                    <br></br>

                    <label htmlFor="rnb-lb">Ruminal nitrogen balance lower bound</label>
                    <div defaultValue={"-10"} className="input-group">
                        <select id="rnb-lb" data-toggle="popover" data-placement="bottom" className='form-control parameter-feed' data-content='Lower bound of the ruminal nitrogen balance (RNB) - part of the German protein system' >
                            <option value="-Infinity">-Infinity</option>
                            <option value="-10" >-10</option>
                            <option value="0">0</option>
                        </select>
                        <span className="input-group-addon">g N</span>
                    </div>

                    <br></br>

                </div>

                <div className='text col-md-12'>
                    <hr></hr>
                </div>

                <div id="feed" className='text col-md-12'>
                    <h2>Purchased / Produced Supplementary Feedstuff</h2>
                    <p></p>
                    <br></br>
                </div>


                <div className='col-md-6'>
                    <div className="panel-group" id="feed-accordion-1" role="tablist" aria-multiselectable="true">

                    </div>
                </div>


                <div className='col-md-6'>
                    <div className="panel-group" id="feed-accordion-2" role="tablist" aria-multiselectable="true">

                    </div>
                </div>

                <div className='col-md-12'>
                    <hr></hr>
                </div>

                <div id="crop" className='text col-md-12'>
                    <h2>Crop and Forage Production</h2>
                    <p>Manage total arable and grassland areas, specify crop rotations, and monitor nitrogen inputs for sustainable production.</p>
                </div>

                <div className='col-md-6'>

                    <label htmlFor="arable-area">Total arable area</label>
                    <div className="input-group">
                        <input id="arable-area" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="70" min='1' max='500' data-content='Total arable area' />
                        <span className="input-group-addon">hectares</span>
                    </div>

                    <br></br>

                    <label htmlFor="grassland-area">Total permanent grassland area</label>
                    <div className="input-group">
                        <input id="grassland-area" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-grassland' defaultValue="50" min='1' max='500' data-content='Total permanent grassland area' />
                        <span className="input-group-addon">hectares</span>
                    </div>

                    <br></br>

                    <label htmlFor="grassland-legume-share">Permanent grassland legume share</label>
                    <div className="input-group">
                        <input id="grassland-legume-share" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-grassland' defaultValue="20" min='1' max='50' data-content='Share of legumes in permanent grassland sward' />
                        <span className="input-group-addon">%</span>
                    </div>

                    <br></br>

                </div>

                <div className='col-md-6'>

                    <label htmlFor="cut-threshhold">Grassland cut threshold</label>
                    <div className="input-group">
                        <input id="cut-threshhold" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-grassland' defaultValue="1500" min='1000' max='3500' data-content='The minimum acceptable dry matter yield per hectares and cut before any harvest is executed (arable and permanent grassland).'
                        />
                        <span className="input-group-addon">kilograms dry matter / hectares</span>
                    </div>

                    <br></br>

                    <label htmlFor="hay-share">Grassland hay share</label>
                    <div className="input-group">
                        <input id="hay-share" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-grassland' defaultValue="10" min='1' max='100' data-content='Share of hay from permanent and arable grassland in % hectares after the first cut.'></input>
                        <span className="input-group-addon">%</span>
                    </div>

                    <br></br>

                    <label htmlFor="grassland-N-input">Yearly nitrogen input on permanent grassland</label>
                    <div className="input-group">
                        <input id="grassland-N-input" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-grassland' defaultValue="80" min='0' max='150' data-content='Average yearly mineral or organic nitrogen input on grassland' />
                        <span className="input-group-addon">kg of nitrogen / hectares</span>
                    </div>

                    <br></br>

                </div>

                <div className='text col-md-12'>
                    <h3>Crop rotation</h3>
                    <p>Drag and drop crops into the rotation, connect them and edit their properties. Only forages (maize silage and grass-legume) will be used in the diet calculations. Add the amout of concentrates available at <a href="#feed">purchased feeds.</a></p>
                </div>

                <div id='crop-rotation' className='col-md-12'></div>

                <div className='col-md-12'>
                    <h3>Advanced model settings</h3>
                    <p></p>
                </div>

                <div className='col-md-6'>
                    <div className="panel-group" id="simulation-crop-accordition-1" role="tablist" aria-multiselectable="true">

                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingOne">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#simulation-crop-accordition-1" href="#wheat" aria-expanded="false" aria-controls="wheat">
                                        Wheat
                                    </a>
                                </h4>
                            </div>
                            <div id="wheat" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                                <div className="panel-body">
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Emergence to double ridge</span>
                                        <input id="wheat-emergence-to-double-ridge" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="284" min='200' max='300' data-content='Temperature sum from emergence to double ridge' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Double ridge to flowering</span>
                                        <input id="wheat-double-ridge-to-flowering" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="380" min='300' max='450' data-content='Temperature sum from double ridge to flowering' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Flowering to begin grain
                                            filling</span>
                                        <input id="wheat-flowering-to-begin-grain-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="200" min='150' max='250' data-content='Temperature sum from flowering to begin grain filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Grain filling</span>
                                        <input id="wheat-grain-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="420" min='350' max='500' data-content='Temperature sum till end of grain filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingOne">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#simulation-crop-accordition-1" href="#barley" aria-expanded="false" aria-controls="barley">
                                        Barley
                                    </a>
                                </h4>
                            </div>
                            <div id="barley" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                                <div className="panel-body">
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Emergence to double ridge</span>
                                        <input id="barley-emergence-to-double-ridge" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="284" min='200' max='300' data-content='Temperature sum from emergence to double ridge' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Double ridge to flowering</span>
                                        <input id="barley-double-ridge-to-flowering" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="300" min='250' max='350' data-content='Temperature sum from double ridge to flowering' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Flowering to begin grain
                                            filling</span>
                                        <input id="barley-flowering-to-begin-grain-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="120" min='100' max='150' data-content='Temperature sum from flowering to begin grain filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Grain filling</span>
                                        <input id="barley-grain-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="260" min='200' max='300' data-content='Temperature sum till end of grain filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingOne">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#simulation-crop-accordition-1" href="#rye" aria-expanded="false" aria-controls="rye">
                                        Rye
                                    </a>
                                </h4>
                            </div>
                            <div id="rye" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                                <div className="panel-body">
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Emergence to double ridge</span>
                                        <input id="rye-emergence-to-double-ridge" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="284" min='200' max='300' data-content='Temperature sum from emergence to double ridge'></input>
                                        <span className="input-group-addon" >°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Double ridge to flowering</span>
                                        <input id="rye-double-ridge-to-flowering" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="200" min='150' max='250' data-content='Temperature sum from double ridge to flowering'></input>
                                        <span className="input-group-addon" >°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Flowering to begin grain
                                            filling</span>
                                        <input id="rye-flowering-to-begin-grain-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="400" min='300' max='500' data-content='Temperature sum from flowering to begin grain filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Grain filling</span>
                                        <input id="rye-grain-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="350" min='300' max='400' data-content='Temperature sum till end of grain filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className='col-md-6'>
                    <div className="panel-group" id="simulation-crop-accordition-2" role="tablist" aria-multiselectable="true">

                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingOne">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#simulation-crop-accordition-2" href="#oats" aria-expanded="false" aria-controls="oats">
                                        Oats
                                    </a>
                                </h4>
                            </div>
                            <div id="oats" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                                <div className="panel-body">
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Emergence to double ridge</span>
                                        <input id="oats-emergence-to-double-ridge" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="300" min='200' max='400' data-content='Temperature sum from emergence to double ridge' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Double ridge to flowering</span>
                                        <input id="oats-double-ridge-to-flowering" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="420" min='300' max='500' data-content='Temperature sum from double ridge to flowering' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Flowering to begin grain
                                            filling</span>
                                        <input id="oats-flowering-to-begin-grain-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="200" min='150' max='250' data-content='Temperature sum from flowering to begin grain filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Grain filling</span>
                                        <input id="oats-grain-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="200" min='150' max='250' data-content='Temperature sum till end of grain filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingOne">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#simulation-crop-accordition-2" href="#maize" aria-expanded="false" aria-controls="maize">
                                        Maize
                                    </a>
                                </h4>
                            </div>
                            <div id="maize" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                                <div className="panel-body">
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Emergence to shooting</span>
                                        <input id="maize-emergence-to-shooting" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="284" min='100' max='350' data-content='Temperature sum from emergence to shooting' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Shooting to tasseling</span>
                                        <input id="maize-shooting-to-tasseling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="170" min='100' max='250' data-content='Temperature sum from shooting to tasseling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Tasseling to flowering</span>
                                        <input id="maize-tasseling-to-flowering" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="210" min='100' max='300' data-content='Temperature sum from tasseling to flowering' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Flowering to corn filling</span>
                                        <input id="maize-flowering-to-corn-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="160" min='100' max='300' data-content='Temperature sum from flowering to corn filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                    <br />
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Corn filling</span>
                                        <input id="maize-corn-filling" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="300" min='100' max='500' data-content='Temperature sum corn filling' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="panel panel-default">
                            <div className="panel-heading" role="tab" id="headingOne">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" data-parent="#simulation-crop-accordition-2" href="#grassland" aria-expanded="false" aria-controls="grass">
                                        Grass
                                    </a>
                                </h4>
                            </div>
                            <div id="grassland" className="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                                <div className="panel-body">
                                    <div className="input-group">
                                        <span className="input-group-addon long-input-desc">Flowering</span>
                                        <input id="grass-flowering" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-crop' defaultValue="500" min='250' max='750' data-content='Temperature sum till flowering' />
                                        <span className="input-group-addon">°C</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


                <div id="grass" className='text col-md-12'>
                    <h2>Pasture</h2>
                    <p></p>
                </div>

                <div className='col-md-6'>

                    <label htmlFor="pasture-share">Pasture share</label>
                    <div className="input-group">
                        <input id="pasture-share" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-grassland' defaultValue="50" min='1' max='100' data-content='Pasture share of grassland area' />
                        <span className="input-group-addon">%</span>
                    </div>

                    <br></br>

                    <label htmlFor="time-at-pasture">Time at pasture</label>
                    <div className="input-group">
                        <input id="time-at-pasture" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-grassland' defaultValue="6" min='1' max='18' data-content='Hours grazing per day.' />
                        <span className="input-group-addon">h</span>
                    </div>

                    <br></br>




                </div>


                <div className='col-md-6'>


                    <label htmlFor="grazing-start">Month grazing starts</label>
                    <div className="input-group">
                        <input id="grazing-start" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-grassland' defaultValue="4" min='3' max='5' data-content='When does grazing on average start.' />
                        <span className="input-group-addon">#</span>
                    </div>

                    <br></br>

                    <label htmlFor="grazing-end">Month grazing ends</label>
                    <div className="input-group">
                        <input id="grazing-end" type='number' data-toggle="popover" data-placement="bottom" className='form-control parameter-grassland' defaultValue="10" min='8' max='11' data-content='When does grazing on average end.' />
                        <span className="input-group-addon">#</span>
                    </div>

                </div>

                <div className='col-md-12'>
                    <hr></hr>
                </div>

                <hr></hr>
                <div id="input-summary" className='col-md-12'>
                    <h2>Input Summary</h2>
                </div>

                <div id="weather-charts" className='chart-main col-md-12'>
                    <h3>Location and weather</h3>
                    <div>
                        <div id='weather-chart-1' className='chart'></div>
                    </div>
                    <div>
                        <div id='weather-chart-2'></div>
                    </div>
                </div>

                <div className='col-md-12'>
                    <hr></hr>
                </div>

                <div id="dairy-charts" className='chart-main col-md-12'>
                    <h3>Dairy herd</h3>
                    <h4>Milk yield</h4>
                    <div>
                        <div id='dairy-chart-1'></div>
                    </div>
                    <h4>Distribution of parities</h4>
                    <div>
                        <div id='dairy-chart-2'></div>
                    </div>
                    <h4>Daily energy and protein requirements</h4>
                    <div>
                        <div id='dairy-chart-3'></div>
                    </div>
                </div>

                <div className='col-md-12'>
                    <hr></hr>
                </div>

                <div id="crop-charts" className='chart-main col-md-12'>
                    <h3>Crops and grassland</h3>
                    <div>
                        <div id='arable-chart-1' className='chart col-md-6'></div>
                        <div id='area-chart-1' className='chart col-md-6'></div>
                    </div>
                </div>

                <div className='col-md-12'>
                    <hr></hr>
                </div>



                <button onClick={() => {
                    setisSimulated(true)
                }} className="run-simulation" id="run-btn">
                    {isSimulated ? "Run Simulation Again" : "Run Simulation"} <img className='svg' src='img/run.svg' height='60' width='60'></img>
                </button>


                <div className="results" hidden={!isSimulated}>

                    <div id="output-summary" className='col-md-12'>
                        <h2>Results (Output)</h2>
                        <p>Obtain detailed outputs on arable and grassland yields, assess water and nitrogen deficits, and review feedstuff surplus calculations.</p>
                    </div>

                    <div className='chart-main col-md-12'>
                        <h4>Yields arable</h4>
                        <p>Averaged if a crop appears twice or more in a rotation</p>
                        <div className='form-group'>
                            <select id='result-yield-select' className="selectpicker" data-width="fit" data-size="5">
                            </select>
                        </div>
                        <div>
                            <div id='yield-chart' className='chart'></div>
                        </div>
                    </div>

                    <div className='chart-main col-md-12'>
                        <h4>Water-/ nitrogen deficits and irrigation on arable land</h4>
                        <p>Averaged over 10 days</p>
                        <div className='form-group'>
                            <select id='result-water-select' className="selectpicker" data-width="fit" data-size="5">
                            </select>
                        </div>
                        <div>
                            <div id='water-chart' className='chart'></div>
                        </div>
                    </div>

                    <div className='chart-main col-md-12'>
                        <h4>Yields permanent grassland</h4>
                        <p></p>
                        <div>
                            <div id='grassland-yield-chart' className='chart'></div>
                        </div>
                    </div>

                    <div className='chart-main col-md-12'>
                        <h4>Dry matter intake from pasture</h4>
                        <p>Averaged over groups and periods</p>
                        <div>
                            <div id='intake-chart' className='chart'></div>
                        </div>
                    </div>

                    <div id='diet-charts' className='chart-main col-md-12'></div>


                    <div className='chart-main col-md-12'>
                        <h4>Feedstuff surplus</h4>
                        <p>Total produced (year - 1) minus total consumed (year)</p>
                        <div>
                            <div id='feed-surplus-chart' className='chart'></div>
                        </div>
                    </div>


                    <div className='col-md-12' style={{ minHeight: "100px" }}></div>






                    <div id='progress-dlg' className='modal' tabIndex='-1' role='dialog'>
                        <div className='modal-dialog'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span
                                        aria-hidden='true'>&times;</span></button>
                                    <h4 className='modal-title'>Progress</h4>
                                </div>
                                <div className='modal-body'>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id='error-dlg' className='modal' tabIndex='-1' role='dialog'>
                        <div className='modal-dialog'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span
                                        aria-hidden='true'>&times;</span></button>
                                    <h4 className='modal-title'>Error</h4>
                                </div>
                                <div className='modal-body'>
                                    <p>An unexpected error occured. Please download your configuration file <a id='download-error' href="#">here</a> and send it to <a href="mailto:jbachinger@zalf.de?Subject=solid-dss" target="_top">jbachinger@zalf.de</a>. This will help
                                        us to reproduce and hopefully fix the error.
                                    </p>
                                    <p>Please also copy information about the error and your browser into the email:</p>
                                    <pre id='environment'></pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}