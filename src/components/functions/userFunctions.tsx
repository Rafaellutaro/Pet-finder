import { useReducer } from "react"

export function cepLookUp(initial: {}) {
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
            case 'addPassword':
                return {
                    ...state,
                    password: action.payload
                }
            case 'addNewPassword':
                return {
                    ...state,
                    newPassword: action.payload
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
                    region: action.payload
                }
            default:
                return state

        }
    }
    const initialState = {
        initial
    };

    const [state, dispatch] = useReducer(reducer, initialState.initial);

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('state', state)

        if (state.cep.length < 9) {
            dispatch({ type: 'addStreet', payload: '' })
            dispatch({ type: 'addNeighborhood', payload: '' })
            dispatch({ type: 'addCity', payload: '' })
            dispatch({ type: 'addState', payload: '' })
        }

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

    return { handleCepChange, state, dispatch }
}