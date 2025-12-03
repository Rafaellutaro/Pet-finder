import { useEffect, useState } from 'react';
import { useUser } from "../Interfaces/GlobalUser"
import '../assets/css/settings.css';

function ProfileDetails() {
    const { user } = useUser();
    const allAddress = user?.addresses
    const [address, setAddress] = useState('');

    console.log(allAddress)

    useEffect(() => {
        if (!address) {
            const initialAddress = allAddress![0]
            setAddress(JSON.stringify(initialAddress))
        }

        console.log("endereço", address)
    }, [address])

    if (!user) {
        return <div>Loading Data</div>
    }

    const complete_name = `${user!.name} ${user!.lastName}`

    return (
        <div className="details-container">

            <div className="details-grid">

                {/* LEFT COLUMN */}
                <div className="details-column">
                    <h3>Informações Pessoais</h3>
                    <div className="field">
                        <label>Nome Completo: {complete_name}</label>
                        <input type="text" placeholder="Inalteravel" readOnly />
                    </div>

                    <div className="field">
                        <label>Email: {user!.email}</label>
                        <input type="text" placeholder="novoemail@gmail.com" />
                    </div>
                    
                    <h3>Segurança</h3>
                    <div className="field">
                        <label>Alterar Senha: </label>
                        <input type="text" placeholder="senha atual" />
                        <input type="text" placeholder="Nova Senha" />
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="details-column">
                    <h3>Endereço</h3>
                    <div className="field">
                        <label>Telephone: {user!.phone}</label>
                        <input type="tel" placeholder="(00) 0000-0000" />
                    </div>

                    <div className="field">
                        <label>Selecione o endereço: </label>
                        <select name="selectedAddr" id="selectedAddr" onChange={(e) => setAddress(e.target.value)} defaultValue={address}>

                            <>
                                {allAddress!.map((addr: any, i: number) => (
                                    <option key={i} value={JSON.stringify(addr)}>{`${addr.street} | ${addr.neighborhood} | ${addr.city} | ${addr.state}`}

                                    </option>
                                ))}
                            </>
                        </select>
                    </div>

                    <div className="field">
                        <label>Novo Endereço:</label>

                        <div className="address-grid">
                            <input type="text" placeholder="CEP" maxLength={8} />
                            <input type="text" placeholder="Rua" readOnly />

                            <input type="text" placeholder="Bairro" readOnly />
                            <input type="text" placeholder="Cidade" readOnly />

                            <input type="text" placeholder="Estado" readOnly className="full" />
                        </div>
                    </div>
                </div>

            </div>

            <p>Dica: Apenas os campos preenchidos alteram.</p>

            <button className="save-btn">Salvar</button>
        </div>
    )
}

function Settings() {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("settings");

    if (!user) {
        return <div>Loading Data</div>
    }

    const complete_name = `${user!.name} ${user!.lastName}`

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
                {activeTab === "profile" && <ProfileDetails />}
            </>
        </div>
    );
}

export default Settings;
