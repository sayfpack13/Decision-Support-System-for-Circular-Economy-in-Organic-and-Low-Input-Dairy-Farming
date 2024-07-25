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


        </div>
    )
}
