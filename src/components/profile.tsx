// import { useLocation } from 'react-router-dom';
import "../assets/css/Profile.css"
import PetContainer, { PetAddContainer } from "./functions/petFunctions"
import { useUser } from "../Interfaces/GlobalUser"

function ProfilePage() {
    const { user } = useUser();

    if (!user){
        return <div>Loading Data</div>
    }

    const bannerUrl = 'https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg'

    const complete_name = `${user!.name} ${user!.lastName}`

    return (
        <div className="ProfilePage-mainContainer">
            
            {/* --- Fancy Profile Header --- */}
            <div className="profile-header">
                <div className="profile-banner" style={{backgroundImage: `url(${bannerUrl})`}}></div>
                
                <div className="profile-content">
                    <div className="avatar-wrapper">
                        <img
                            className="profile-avatar"
                            src="https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg"
                            alt="profile avatar"
                        />
                    </div>

                    <div className="name-header">
                        <p className="profile-name">{complete_name}</p>
                        <p className="profile-info">{user!.email}</p>
                        <p className="profile-info">{user!.phone}</p>
                    </div>
                </div>
            </div>

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
