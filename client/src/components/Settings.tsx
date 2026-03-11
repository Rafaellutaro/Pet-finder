import { useState } from 'react';
import { useUser } from "../Interfaces/GlobalUser"
import '../assets/css/settings.css';
import SettingsForm from './forms/SettingsForm';
import Loader from './reusable/Loader';
import bannerDFT from "../assets/imgs/bannerDFT.png"
import inDev from "../assets/imgs/inDevelopment.png"
import { WarningPopUp } from './reusable/PopUps';
import resendApiPrivate from './reusable/resendApi';

function Settings() {
    const { user, token, verifyToken, setToken } = useUser();
    if (!user) return <Loader />
    const [activeTab, setActiveTab] = useState("update");
    const [userProfileImg, setUserProfileImg] = useState(user.profileImg)
    const [open, setopen] = useState(false)

    const complete_name = `${user!.name} ${user!.lastName}`

    { userProfileImg ? user.profileImg : setUserProfileImg(bannerDFT) }

    const logOff = async () => {
        try {
            const response = await resendApiPrivate({
                apiUrl: `${import.meta.env.VITE_SERVER_URL}/users/logOff`,
                options: { method: "POST", credentials: "include" },
                token: String(token),
                verifyToken,
            });

            if (!response?.ok) return

            setToken(null)
        } catch (e) {
            console.log(e)
        }
    }

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
                            <span className="tag blue">Usuário</span>
                            {/* <span className="tag green">Member</span> */}
                        </div>

                        <h2 className="profile-name">{complete_name}</h2>
                    </div>
                </div>

                <button className="edit-btn">✎ Edit</button>
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
                    className={`tab ${activeTab == "update" ? "active" : ""}`}
                    onClick={() => setActiveTab("update")}
                >
                    Atualizar Dados
                </button>

                <button
                    className={`tab ${activeTab == "logOff" ? "active" : ""}`}
                    onClick={() => {
                        setActiveTab("logOff");
                        setopen(true);
                    }}
                >
                    Deslogar
                </button>
            </div>

            <>
                {activeTab == "settings" && <img src={inDev} className='inDevPhoto' />}
                {activeTab == "update" && <SettingsForm />}
                {activeTab == "logOff" && <WarningPopUp
                    open={open}
                    title='Deseja sair da sua conta?'
                    details='Você será desconectado desta sessão e precisará fazer login novamente para acessar sua conta.'
                    cancelText='Cancelar'
                    acceptText='Sair'
                    onAccept={logOff}
                    onCancel={() => {setopen(false); setActiveTab("update")}}
                    onClose={() => {setopen(false); setActiveTab("update")}} />}
            </>
        </div>
    );
}

export default Settings;
