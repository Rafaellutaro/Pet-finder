import { GiDogHouse } from "react-icons/gi";
import { FaPerson } from "react-icons/fa6";
import "../assets/css/Menu.css"
import { Link } from "react-router-dom";

function Register() {
        return (
            <section>
                <div className="Menu-Container">

                    <Link to="/Register-Comum" className="normal-person-container">
                        <div className="normal-person">
                            <div className="img">
                                <FaPerson />
                            </div>
                            <div className="title">
                                <h1>Pessoa Comum</h1>
                            </div>
                        </div>
                    </Link>

                    <Link to="/Register-Shelter" className="shelter-container">
                        <div className="shelter">
                            <div className="img">
                                <GiDogHouse />
                            </div>
                            <div className="title">
                                <h1>Canil</h1>
                            </div>
                        </div>
                    </Link>

                </div>
            </section>
        )

}

export default Register;