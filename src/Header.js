import React, { useContext, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoaderContext } from "./Loader";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoading, setisLoading } = useContext(LoaderContext);

    const handleNavigation = useCallback((path) => {
        if (location.pathname === path) return;
        setisLoading(true);
        navigate(path);
    }, [location.pathname, navigate, setisLoading]);

    return (
        <div className="header-container">
            <div className="header">
                <h1 className="title">
                    Decision Support System (DSS) for Promoting Circular Economy Practices in Organic and Low-Input Dairy Farming
                </h1>
                <nav className="header-navbar">
                    <ul className="nav">
                        <li
                            onClick={() => handleNavigation("/")}
                            className={location.pathname === "/" ? "nav-item active" : "nav-item"}
                        >
                            <a href="#nav-link" className="nav-link">Home</a>
                        </li>
                        <li
                            onClick={() => handleNavigation("/simulation")}
                            className={location.pathname === "/simulation" ? "nav-item active" : "nav-item"}
                        >
                            <a href="#nav-link" className="nav-link">Simulation</a>
                        </li>
                        <li
                            onClick={() => handleNavigation("/simulation-saves")}
                            className={location.pathname === "/simulation-saves" ? "nav-item active" : "nav-item"}
                        >
                            <a href="#nav-link" className="nav-link">Simulation Saves</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
