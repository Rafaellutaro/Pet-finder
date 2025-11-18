import "../assets/css/header.css"
import { FaUserCircle } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaShieldDog } from "react-icons/fa6";

function header() {
    return (
            <div className="header-container">
                <div className="header-icon">
                    <Link to="/"><FaShieldDog /></Link>
                </div>
                <div className="header-items">
                    <ul>
                        <nav> <Link to="/Login"><FaUserCircle /></Link></nav>
                        <nav> <Link to="/MyPets"><MdPets /></Link></nav>
                    </ul>
                </div>
            </div>
    )
}

export default header;