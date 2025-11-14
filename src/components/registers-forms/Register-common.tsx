import { useReducer } from 'react';
import '../../assets/css/RegisterCommon.css'

function reducer(state: any, action: any) {
    switch (action.type) {
        //personal Data
        case 'addName':
            return {
                ...state,
                name: action.payload
            }
        case 'addLastName':
            return {
                ...state,
                lastName: action.payload
            }
        case 'addEmail':
            return {
                ...state,
                email: action.payload
            }
        case 'addPhone':
            return {
                ...state,
                phone: action.payload
            }
        // Localization
        case 'addCep':
            return {
                ...state,
                cep: action.payload
            }
        case 'addStreet':
            return {
                ...state,
                street: action.payload
            }
        case 'addNeighborhood':
            return {
                ...state,
                neighborhood: action.payload
            }
        case 'addCity':
            return {
                ...state,
                city: action.payload
            }
        case 'addState':
            return {
                ...state,
                state: action.payload
            }
        default:
            return state

    }
}

const initialState = {
    //personal data
    name: '',
    lastName: '',
    email: '',
    phone: '',
    // location
    cep: '',
    street: '',
    neighborhood: '',
    city: '',
    state: '',
};

function RegisterCommon() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawCep = e.target.value.replace(/\D/g, "");
        dispatch({ type: 'addCep', payload: rawCep })

        if (rawCep.length === 8) {
            const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
            const data = await res.json();

            if (!data.erro) {
                dispatch({ type: 'addStreet', payload: data.logradouro })
                dispatch({ type: 'addNeighborhood', payload: data.bairro })
                dispatch({ type: 'addCity', payload: data.localidade })
                dispatch({ type: 'addState', payload: data.uf })
            }
        }
    };

    const commonRegister = (e: any) => {
        e.preventDefault();
        console.log(state);
    }

    return (
        <section className='registerCommon-section'>
            <div className="common-container">

                <form onSubmit={commonRegister}>

                    <div className="personal-data-title">
                        <h1>Dados Pessoais</h1>
                    </div>

                    <div className="personal-data-container">

                        <div className="form-row">
                            <div className="form-group">
                                <label>Nome:</label>
                                <input
                                    type="text"
                                    value={state.name}
                                    placeholder="Nome"
                                    onChange={(e) =>
                                        dispatch({ type: "addName", payload: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Sobrenome:</label>
                                <input
                                    type="text"
                                    value={state.lastName}
                                    placeholder="Sobrenome"
                                    onChange={(e) =>
                                        dispatch({ type: "addLastName", payload: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={state.email}
                                    placeholder="Email"
                                    onChange={(e) =>
                                        dispatch({ type: "addEmail", payload: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Telefone:</label>
                                <input
                                    type="text"
                                    value={state.phone}
                                    placeholder="Telefone"
                                    onChange={(e) =>
                                        dispatch({ type: "addPhone", payload: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                    </div>


                    <div className="personal-data-title">
                        <h1>Endereço</h1>
                    </div>

                    <div className="location-data-container">

                        <div className="form-row">
                            <div className="form-group">
                                <label>CEP:</label>
                                <input
                                    type="text"
                                    value={state.cep}
                                    placeholder="CEP"
                                    onChange={handleCepChange}
                                    maxLength={8}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Rua:</label>
                                <input type="text" value={state.street} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Bairro:</label>
                                <input type="text" value={state.neighborhood} readOnly />
                            </div>

                            <div className="form-group">
                                <label>Cidade:</label>
                                <input type="text" value={state.city} readOnly />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Estado:</label>
                                <input type="text" value={state.state} readOnly />
                            </div>
                        </div>

                    </div>

                    <button type='submit'>Enviar</button>
                </form>


            </div>
        </section>
    )
}



export default RegisterCommon;