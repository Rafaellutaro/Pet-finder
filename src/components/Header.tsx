import "../assets/css/header.css"
import { FaUserCircle } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaShieldDog } from "react-icons/fa6";
import { useUser } from '../Interfaces/GlobalUser';
import { IoSettingsOutline } from "react-icons/io5";

function header() {
    const { loggedIn, user } = useUser();
    const link = loggedIn ? "Profile" : "Login";

    return (
        <div className="header-container">
            <div className="header-icon">
                <Link to="/"><FaShieldDog /></Link>
            </div>
            <div className="header-items">
                <ul>
                    {loggedIn == true ? <div className="user-avatar">
                        <nav> <Link to={link}>{user?.profileImg ? <img src={user?.profileImg} alt="User profile" /> : <FaUserCircle className="userIcon"/>}</Link></nav>
                    </div> : loggedIn == false ? <div className="user-avatar">
                        <nav> <Link to={link}><FaUserCircle className="userIcon"/></Link></nav>
                    </div> : ""}

                    <nav> <Link to="/Pets"><MdPets /></Link></nav>
                    <nav> <Link to={"/Settings"}><IoSettingsOutline /></Link></nav>
                </ul>
            </div>
        </div>
    )
}

export default header;