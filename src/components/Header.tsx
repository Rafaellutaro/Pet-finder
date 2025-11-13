import "../assets/css/header.css"
import { FaUserCircle } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { Link } from 'react-router-dom';

function header() {
    return (
        <section>
            <div className="header-container">
                <div className="header-icon">
                </div>
                <div className="header-items">
                    <ul>
                        <nav> <Link to="/Login"><FaUserCircle /></Link></nav>
                        <nav> <Link to="/MyPets"><MdPets /></Link></nav>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default header;