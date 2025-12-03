import { useEffect, useReducer, useState } from 'react';
import { useUser } from "../Interfaces/GlobalUser"
import '../assets/css/settings.css';
import { cepLookUp } from './functions/userFunctions';

function ProfileDetails() {
    const { user } = useUser();
    const allAddress = user?.addresses
    const [address, setAddress] = useState<any>(null);

    const initial = {
        //personal data
        email: '',
        //security
        password: '',
        newPassword: '',
        // location
        phone: '',
        cep: '',
        street: '',
        neighborhood: '',
        city: '',
        region: '',
    }

    const { handleCepChange, state, dispatch } = cepLookUp(initial)


    console.log(allAddress)

    useEffect(() => {
        if (!address) {
            const initialAddress = allAddress![0]
            setAddress((initialAddress))
        }

        console.log("endereço", address)
    }, [address])

    if (!user) {
        return <div>Loading Data</div>
    }

    const complete_name = `${user!.name} ${user!.lastName}`

    const submitForm = (e: any) => {
        // i will probably need to insert the form stuff here, dont forget it!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // i will give you a dorito afterwards
        // im talking to myself, im going insane at this point
        e.preventDefault();

        console.log("alldata", state)
        console.log('oldAddress', address)

    }

    return (
        <div className="details-container">
            <div className="details-grid">
                <form onSubmit={submitForm} className='profile-form'>

                    {/* LEFT COLUMN */}
                    <div className="details-column">
                        <h3>Informações Pessoais</h3>
                        <div className="field">
                            <label>Nome Completo: {complete_name}</label>
                            <input type="text" placeholder="Inalteravel" readOnly />
                        </div>

                        <div className="field">
                            <label>Email: {user!.email}</label>
                            <input type="text" placeholder="novoemail@gmail.com" value={state.email} onChange={(e) => dispatch({ type: "addEmail", payload: e.target.value })} />
                        </div>

                        <h3>Segurança</h3>
                        <div className="field">
                            <label>Alterar Senha: </label>
                            <input type="text" placeholder="senha atual" value={state.password} onChange={(e) => dispatch({ type: "addPassword", payload: e.target.value })} />
                            <input type="text" placeholder="Nova Senha" value={state.newPassword} onChange={(e) => dispatch({ type: "addNewPassword", payload: e.target.value })} />
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="details-column">
                        <h3>Endereço</h3>
                        <div className="field">
                            <label>Telephone: {user!.phone}</label>
                            <input type="tel" placeholder="(00) 0000-0000" value={state.phone} onChange={(e) => dispatch({ type: "addPhone", payload: e.target.value })} />
                        </div>

                        <div className="field">
                            <label>Selecione o endereço: </label>
                            <select name="selectedAddr" id="selectedAddr" onChange={(e) => setAddress(JSON.parse(e.target.value))} defaultValue={address}>

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
                                <input type="text" placeholder="CEP" maxLength={8} value={state.cep} onChange={handleCepChange} />
                                <input type="text" placeholder="Rua" readOnly value={state.street} />

                                <input type="text" placeholder="Bairro" readOnly value={state.neighborhood} />
                                <input type="text" placeholder="Cidade" readOnly value={state.city} />

                                <input type="text" placeholder="Estado" readOnly className="full" value={state.region} />
                            </div>
                        </div>
                    </div>
                    <button className="save-btn">Salvar</button>
                </form>
            </div>
            <p>Dica: Apenas os campos preenchidos alteram.</p>


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
