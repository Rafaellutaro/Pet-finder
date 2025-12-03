import "../assets/css/header.css"
import { FaUserCircle } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaShieldDog } from "react-icons/fa6";
import { useUser } from '../Interfaces/GlobalUser';
import { IoSettingsOutline } from "react-icons/io5";

function header() {
    const {loggedIn} = useUser();
    let link = '';
    let linkSettings = '';

    if (loggedIn == true){
        link = "/Profile"
        linkSettings = "/Settings"
    } else{
        link = "/Login"
        linkSettings = "/Login"
    }

    return (
            <div className="header-container">
                <div className="header-icon">
                    <Link to="/"><FaShieldDog /></Link>
                </div>
                <div className="header-items">
                    <ul>
                        <nav> <Link to={link}><FaUserCircle /></Link></nav>
                        <nav> <Link to="/MyPets"><MdPets /></Link></nav>
                        <nav> <Link to={linkSettings}><IoSettingsOutline /></Link></nav>
                    </ul>
                </div>
            </div>
    )
}

export default header;