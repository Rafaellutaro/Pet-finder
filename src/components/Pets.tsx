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
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

function Pets() {
    const [PetData, setPetData] = useState<any>({})
    let [currentPage, setCurrentPage] = useState<number>(1)

    const user = useUser()

    const [searchParams, setSearchParams] = useSearchParams();
    const params = Object.fromEntries(searchParams.entries())

    let lastPage: number = 1
    const range = 4

    useEffect(() => {
        const order = searchParams.get("orderDirection")
        const pageLimit = searchParams.get("limit")
        let pageFromUrl = Number(searchParams.get("page")) || 1;

        if (!order && !pageLimit || !currentPage) {
            updateParams({ orderDirection: "asc", limit: "10", page: "1" }, setSearchParams)
            return
        }

        setCurrentPage(pageFromUrl)

        console.log("aqui", pageFromUrl)

        getAllPetsPublic(params.uf!, params.type!, undefined!, params.age!, params.limit, params.orderDirection, pageFromUrl, setPetData);
    }, [user, searchParams, lastPage]);

    const totalItems = PetData?.pagination?.totalItems

    lastPage = PetData?.pagination?.totalPages

    useEffect(() => {
        if (!lastPage || !currentPage) return;

        if (currentPage > lastPage) {
            updateParams({ page: lastPage.toString() },setSearchParams);
        }

    }, [currentPage, lastPage])

    if (!PetData?.data) return <div>loading data</div>

    const startPage = Math.max(currentPage - range, 1);
    const endPage = Math.min(currentPage + range, lastPage);

    const pages = [];

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

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
                        <select name="order" id="order" onChange={(e) => updateParams({ orderDirection: e.target.value }, setSearchParams)}>
                            <option value="asc">A-Z</option>
                            <option value="desc">Z-A</option>
                        </select>
                    </div>

                    <div className="show">
                        <h2>exibir</h2>
                        <select name="show" id="show" onChange={(e) => updateParams({ limit: e.target.value }, setSearchParams)}>
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

                {/* negocio chatinho em, mais dificil do que eu esperava */}

                <div className="pagination">
                    <MdOutlineKeyboardDoubleArrowLeft onClick={() => updateParams({ page: "1" }, setSearchParams)} />
                    <FaArrowLeft onClick={() => {
                        const prevPage = Math.max(currentPage - 1, 1)
                        updateParams({ page: prevPage.toString() }, setSearchParams)
                    }} />

                    {pages.map(page => (
                        <button key={page} onClick={() => updateParams({ page: page.toString() }, setSearchParams)} className={page == currentPage ? "active" : ""}>{page}</button>
                    ))}

                    <FaArrowRight onClick={() => {
                        const nextPage = Math.min(currentPage + 1, lastPage)
                        updateParams({ page: nextPage.toString() }, setSearchParams);
                    }} />
                    <MdOutlineKeyboardDoubleArrowRight onClick={() => updateParams({ page: lastPage.toString() }, setSearchParams)} />

                    <button onClick={() => console.log("current: ", currentPage, "last: ", lastPage)}>trocar</button> {/* button for testing purpose, its stupid, i know.  */}
                </div>

            </div>
        </div>
    )
}

export default Pets