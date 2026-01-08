import { PetContainerPublicApi } from "./functions/petFunctions"
import "../assets/css/Pets.css"
import { TiThListOutline } from "react-icons/ti"
import { TiThLargeOutline } from "react-icons/ti"
import { StateSelectNoApi } from "./reusable/StateSelection"
import { useEffect, useState } from "react"
import { useUser } from "../Interfaces/GlobalUser"
import { getAllPetsPublic } from "./functions/petFunctions"
import { useSearchParams } from 'react-router-dom';
import updateParams from "./reusable/setParams"

function Pets() {
    const [PetData, setPetData] = useState<any>({})

    const user = useUser()

    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams.entries())

    useEffect(() => {
        const order = searchParams.get("orderDirection")
        const pageLimit = searchParams.get("limit")

        if (!order && !pageLimit) {
            updateParams({orderDirection: "asc", limit: "10"}, setSearchParams)
        }

        getAllPetsPublic(params.uf!, params.type!, undefined!, params.age!, params.limit, params.orderDirection, setPetData);
        

    }, [user, searchParams]);

    if (!PetData.data) return <div>loading data</div>

    const totalItems = PetData.pagination.totalItems

    return (
        <div className="box-container">
            <div className="left-container">
                <h1>Categorias</h1>

                <StateSelectNoApi setSearchParams={setSearchParams} />

            </div>

            <div className="right-container">
                <div className="right-container-header">

                    <div className="order">
                        <h2>Ordernar</h2>
                        <select name="order" id="order" onChange={(e) => updateParams({orderDirection: e.target.value}, setSearchParams)}>
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                        </select>
                    </div>

                    <div className="show">
                        <h2>exibir</h2>
                        <select name="show" id="show" onChange={(e) => updateParams({limit: e.target.value}, setSearchParams)}>
                            <option value="10">10 por pagina</option>
                            <option value="30">30 por pagina</option>
                            <option value="50">50 por pagina</option>
                        </select>
                    </div>

                    <div className="total-amount">
                        <h2>Total de Pets encontrados: {totalItems}</h2>
                    </div>

                    {/* icons */}
                    <div className="icons">
                        <TiThListOutline />
                        <TiThLargeOutline />
                    </div>
                </div>

                <div className="pets-container-allpets">
                    {/* fetch get api to all pets based on params */}


                    <PetContainerPublicApi petData={PetData} /> {/* this is the correct container, bug free for now :) */}

                </div>
            </div>
        </div>
    )
}

export default Pets