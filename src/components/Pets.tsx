import { PetContainerPublicApi } from "./functions/petFunctions"
import "../assets/css/Pets.css"
import { TiThListOutline } from "react-icons/ti"
import { TiThLargeOutline } from "react-icons/ti"
import {StateSelectNoApi} from "./reusable/StateSelection"
import { useEffect, useState } from "react"
import { useUser } from "../Interfaces/GlobalUser"
import { getAllPetsPublic } from "./functions/petFunctions"

function Pets() {
    const [selectedOrigin, setSelectedOrigin] = useState()
    const [PetData, setPetData] = useState<any>({})
    const [selectedBreed, setSelectedBreed] = useState()
    const [selectedAge, setSelectedAge] = useState()
    const [selectedPageLimit, setSelectedPageLimit] = useState("")
    const [selectedOrder, setSelectedOrder] = useState("")

    const user = useUser()

    useEffect(() => {
        setSelectedOrder("asc")
        setSelectedPageLimit("10")

      getAllPetsPublic(selectedOrigin!, selectedBreed!, selectedAge!, selectedPageLimit, selectedOrder, setPetData);
    
  }, [user, selectedOrigin, selectedBreed, selectedAge, selectedPageLimit, selectedOrder]);

    return (
        <div className="box-container">
            <div className="left-container">
                <h1>Categorias</h1>

                    <StateSelectNoApi setSelectedOrigin={setSelectedOrigin} setSelectedBreed={setSelectedBreed} setSelectedAge={setSelectedAge}/>
                
            </div>

            <div className="right-container">
                <div className="right-container-header">

                    <div className="order">
                        <h2>Ordernar</h2>
                        <select name="order" id="order" onChange={(e) => setSelectedOrder(e.target.value)}>
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                        </select>
                    </div>

                    <div className="show">
                        <h2>exibir</h2>
                        <select name="show" id="show" onChange={(e) => setSelectedPageLimit(e.target.value)}>
                            <option value="10">10 por pagina</option>
                            <option value="30">30 por pagina</option>
                            <option value="50">50 por pagina</option>
                        </select>
                    </div>

                    <div className="total-amount">
                        <h2>valor total de produtos achados/ usar uma variavel</h2>
                    </div>

                    {/* icons */}
                    <div className="icons">
                        <TiThListOutline />
                        <TiThLargeOutline />
                    </div>
                </div>

                <div className="pets-container-allpets">
                    {/* fetch get api to all pets based on params */}


                    <PetContainerPublicApi petData={PetData} /> {/* using Pet container as a example, i need to create the correct api */}

                </div>
            </div>
        </div>
    )
}

export default Pets