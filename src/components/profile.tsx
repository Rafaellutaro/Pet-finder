import { useLocation } from 'react-router-dom';
import "../assets/css/Profile.css"
import PetContainer, { PetAddContainer} from "./petFunctions"

function ProfilePage() {
    const location = useLocation();
    const { data } = location.state;
    console.log(data);

    const complete_name = `${data.name} ${data.lastName}`

    return (
            <div className="ProfilePage-mainContainer">
                <div className="profile-header">
                    <img src="" alt="" />

                    <div className="name-header">
                        <p>{complete_name}</p>
                        <p>{data.email}</p>
                        <p>{data.phone}</p>
                    </div>
                </div>

                <div className="details">
                    <div className="pet-grid">
                        <PetAddContainer />
                        <PetContainer />
                        <PetContainer />
                        <PetContainer />
                        <PetContainer />
                    </div>
                </div>
            </div>
    )
}

export default ProfilePage;