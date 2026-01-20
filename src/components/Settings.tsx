import { useEffect, useReducer, useState } from 'react';
import { useUser } from "../Interfaces/GlobalUser"
import '../assets/css/settings.css';
import SettingsForm from './forms/SettingsForm';
import Loader from './reusable/Loader';

function Settings() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("settings");

    const complete_name = `${user!.name} ${user!.lastName}`

    if (!user) return <Loader />;

    return (
        <div className="settings-page">

            {/* Top Profile Header */}
            <div className="profile-header-settings">
                <div className="profile-left">
                    <img
                        src="https://llfkhrdruddwcscedwyu.supabase.co/storage/v1/object/public/pets/1764766820159_1207881.jpg"
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

                <button className="edit-btn">✎ Edit</button>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === "settings" ? "active" : ""}`}
                    onClick={() => setActiveTab("settings")}
                >
                    Settings
                </button>

                <button
                    className={`tab ${activeTab === "profile" ? "active" : ""}`}
                    onClick={() => setActiveTab("profile")}
                >
                    Profile Details
                </button>
            </div>

            <>
                {/* {activeTab === "settings" && <Settings />} */}
                {activeTab === "profile" && <SettingsForm />}
            </>
        </div>
    );
}

export default Settings;
