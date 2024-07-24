import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoaderContext } from "./Loader";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setisLoading } = useContext(LoaderContext)

    return (
        <div className="header-container">

            <div className="header">
                <h1 className="title">
                    Decision Support System (DSS) for Promoting Circular Economy Practices in Organic and Low-Input Dairy Farming
                </h1>
                <nav className="header-navbar">
                    <ul className="nav">
                        <li
                            onClick={() => {
                                if (location.pathname === "/") {
                                    return
                                }
                                setisLoading(true)
                                navigate("/")
                            }}
                            className={location.pathname === "/" ? "nav-item active" : "nav-item"}
                        >
                            <a href="#nav-link" className="nav-link">Home</a>
                        </li>
                        <li
                            onClick={() => {
                                if (location.pathname === "/simulation") {
                                    return
                                }
                                setisLoading(true)
                                navigate("/simulation")
                            }}
                            className={location.pathname === "/simulation" ? "nav-item active" : "nav-item"}
                        >
                            <a href="#nav-link" className="nav-link">Simulation</a>
                        </li>
                    </ul>
                </nav>
            </div>

            <nav id="navbar" className="navbar navbar-default" role="navigation" style={{ display: location.pathname !== "/simulation" ? "none" : "flex" }}>
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="navbar-collapse">
                    <ul className="nav navbar-nav navbar-left">

                        <li data-toggle="popover" data-placement="right" data-content="Simulation settings">
                            <a href="#settings">
                                <img alt="" className='svg' src='img/settings.svg' height='60' width='60'></img>
                            </a>
                        </li>
                        <li data-toggle="popover" data-placement="right" data-content="Location &amp; weather">
                            <a href="#location">
                                <img alt="" className='svg' src='img/weather.svg' height='60' width='60'></img>
                            </a>
                        </li>
                        <li data-toggle="popover" data-content="Dairy herd" data-placement="right">
                            <a href="#herd">
                                <img alt="" className='svg' src='img/cow.svg' height='60' width='60'></img>
                            </a>
                        </li>
                        <li data-toggle="popover" data-placement="right" data-content="Purchased feedstuff">
                            <a href="#feed">
                                <img alt="" className='svg' src='img/feed.svg' height='60' width='60'></img>
                            </a>
                        </li>
                        <li data-toggle="popover" data-placement="right" data-content="Crop production">
                            <a href="#crop">
                                <img alt="" className='svg' src='img/crop.svg' height='60' width='60'></img>
                            </a>
                        </li>
                        <li data-toggle="popover" data-placement="right" data-content="Grassland &amp; pasture">
                            <a href="#grass">
                                <img alt="" className='svg' src='img/grass.svg' height='60' width='60'></img>
                            </a>
                        </li>

                        <li data-toggle="popover" data-placement="right" data-content="Input summary">
                            <a href="#input-summary">
                                <img alt="" className='svg' src='img/chart.svg' height='60' width='60'></img>
                            </a>
                        </li>

                        <li data-toggle="popover" data-placement="right" data-content="Run simulation">
                            <a href="#run-btn">
                                <img alt="" className='svg' src='img/run.svg' height='60' width='60'></img>
                            </a>
                        </li>



                    </ul>
                </div>
            </nav>
        </div>

    );
}
