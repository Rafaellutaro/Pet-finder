// import { useLocation } from 'react-router-dom';
import PetContainer, { PetAddContainer } from "./functions/petFunctions"
import { useUser } from "../Interfaces/GlobalUser"
import FancyHeader from "./reusable/fancyProfileHeader";
import "../assets/css/addPetProfile.css"

function ProfilePage() {
    const { user } = useUser();

    if (!user){
        return <div>Loading Data</div>
    }

    return (
        <div className="ProfilePage-mainContainer">
            
            <FancyHeader user={user} />

            {/* PETS */}
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
