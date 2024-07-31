import { createContext, useEffect, useState } from "react";



export const LoaderContext = createContext("loader")


export default function Loader({ children }) {
    const [isLoading, setisLoading] = useState(true)

    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
    }, [isLoading])

    return (
        <LoaderContext.Provider value={{ isLoading, setisLoading }}>
            {isLoading &&
                <div className="loader">
                    <img alt="" src="/img/loader.gif"></img>
                </div>}
            {children}
        </LoaderContext.Provider>
    )
}