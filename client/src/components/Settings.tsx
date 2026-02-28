import { useState } from 'react';
import { useUser } from "../Interfaces/GlobalUser"
import '../assets/css/settings.css';
import SettingsForm from './forms/SettingsForm';
import Loader from './reusable/Loader';
import bannerDFT from "../assets/imgs/bannerDFT.png"

function Settings() {
    const { user } = useUser();
    if (!user) return <Loader/>
    const [activeTab, setActiveTab] = useState("settings");
    const [userProfileImg, setUserProfileImg] = useState(user.profileImg)

    const complete_name = `${user!.name} ${user!.lastName}`

    { userProfileImg ? user.profileImg : setUserProfileImg(bannerDFT) }

    return (
        <div className="settings-page">

            {/* Top Profile Header */}
            <div className="profile-header-settings">
                <div className="profile-left">
                    <img
                        src={userProfileImg}
                        alt="Profile"
                        className="profile-img"
                    />

                    <div className="profile-info">
                        <div className="profile-tags">
                            <span className="tag blue">paçoca</span>
                            <span className="tag green">Member</span>
                        </div>

                        <h2 className="profile-name">{complete_name}</h2>
                    </div>
                </div>

                {/* <button className="edit-btn">✎ Edit</button> */}
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab == "settings" ? "active" : ""}`}
                    onClick={() => setActiveTab("settings")}
                >
                    Settings
                </button>

                <button
                    className={`tab ${activeTab == "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile Details
                </button>
            </div>

            <>
                {/* {activeTab == "settings" && <Settings />} */}
                {activeTab == "profile" && <SettingsForm />}
            </>
        </div>
    );
}

export default Settings;
