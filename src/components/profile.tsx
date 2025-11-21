// import { useLocation } from 'react-router-dom';
import "../assets/css/Profile.css"
import PetContainer, { PetAddContainer } from "./petFunctions"
import { useUser } from "../Interfaces/GlobalUser"

function ProfilePage() {
    // const location = useLocation();
    // const { data } = location.state;
    // console.log(data);

    const { user } = useUser();

    console.log("hook data", user)

    const complete_name = `${user!.name} ${user!.lastName}`

    return (
        <div className="ProfilePage-mainContainer">
            <div className="profile-header">
                <img src="" alt="" />

                <div className="name-header">
                    <p>{complete_name}</p>
                    <p>{user!.email}</p>
                    <p>{user!.phone}</p>
                </div>
            </div>

            <div className="details">
                <div className="pet-grid">
                    <PetAddContainer />
                    <PetContainer />
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;