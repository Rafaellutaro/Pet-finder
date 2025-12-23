import PetContainer from "./functions/petFunctions"
import "../assets/css/Pets.css"
import { TiThListOutline } from "react-icons/ti"
import { TiThLargeOutline } from "react-icons/ti"

function Pets() {
    return (
        <div className="box-container">
            <div className="left-container">
                <h1>Categorias</h1>

                <div className="state-category">
                    <select name="state" id="state">
                        <option value="">colocar estados aqui</option>
                    </select>
                </div>

                <div className="city-category">
                    <select name="city" id="city">
                        <option value="">Colocar todas as cidades aqui</option>
                    </select>
                </div>
            </div>

            <div className="right-container">
                <div className="right-container-header">

                    <div className="order">
                        <h2>Ordernar</h2>
                        <select name="order" id="order">
                            <option value="">mais recentes etc...</option>
                        </select>
                    </div>

                    <div className="show">
                        <h2>exibir</h2>
                        <select name="show" id="show">
                            <option value="">20 por pagina</option>
                            <option value="">40 por pagina etc....</option>
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


                    <PetContainer /> {/* using Pet container as a example, i need to create the correct api */}

                </div>
            </div>
        </div>
    )
}

export default Pets