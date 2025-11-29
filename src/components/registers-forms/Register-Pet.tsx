import { useReducer } from 'react';
import '../../assets/css/RegisterCommon.css'
import supabase from '../../../backEnd/client/SupabaseClient';
import { useUser } from "../../Interfaces/GlobalUser"

function reducer(state: any, action: any) {
    switch (action.type) {
        //Pet Data
        case 'addName':
            return {
                ...state,
                name: action.payload
            }
        case 'addType':
            return {
                ...state,
                type: action.payload
            }
        case 'addBreed':
            return {
                ...state,
                breed: action.payload
            }
        case 'addAge':
            return {
                ...state,
                age: action.payload
            }
        case 'addDetails':
            return {
                ...state,
                details: action.payload
            }
        case 'addImage':
            return {
                ...state,
                image: action.payload
            }
        default:
            return state

    }
}

const initialState = {
    //personal data
    name: '',
    breed: '',
    type: '',
    age: '',
    details: '',
    image: '',
};

function RegisterPet() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const { user } = useUser();

    const RegisterPet = async (e: any) => {
        e.preventDefault();
        console.log(state);

        const { name, type, breed, age, details, image } = state;

        const petData = { name, breed, type, age, details, image };

        try {
            const img = image[0]
            const fileName = image[0].name

            console.log('img', img)
            console.log("fileName", fileName)
            const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('pets')
                .upload(fileName, img, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error(uploadError);
                throw uploadError;
            }

            const { data: urlData } = supabase.storage
                .from("pets")
                .getPublicUrl(fileName);

            const imageUrl = urlData.publicUrl;
            const userId = user?.id

            const allPetData = {
                petData,
                userId,
                imageUrl
            }

            console.log('all pet data', allPetData)

            const sendRes = await fetch('http://localhost:3000/pets/insert', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(allPetData)
            })
            const data = await sendRes.json();

            console.log("all pet Data", data);





        } catch (e) {
            console.log(e)
        }
    }

    return (
        <section className='registerCommon-section'>
            <div className="common-container">

                <form onSubmit={RegisterPet}>

                    <div className="personal-data-title">
                        <h1>Dados do Pet</h1>
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
                                <label>tipo:</label>
                                <input
                                    type="text"
                                    value={state.type}
                                    placeholder="tipo"
                                    onChange={(e) =>
                                        dispatch({ type: "addType", payload: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Raça:</label>
                                <input
                                    type="text"
                                    value={state.breed}
                                    placeholder="Raça"
                                    onChange={(e) =>
                                        dispatch({ type: "addBreed", payload: e.target.value })
                                    }
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Idade:</label>
                                <input
                                    type="text"
                                    value={state.age}
                                    placeholder="Idade"
                                    onChange={(e) =>
                                        dispatch({ type: "addAge", payload: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Detalhes:</label>
                                <textarea
                                    value={state.details}
                                    placeholder="Detalhes"
                                    onChange={(e) =>
                                        dispatch({ type: "addDetails", payload: e.target.value })
                                    }
                                    required
                                    rows={8}
                                    cols={50}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Imagem:</label>
                                <input
                                    type="file"
                                    placeholder="arquivo"
                                    accept="image/*"
                                    onChange={(e) =>
                                        dispatch({ type: "addImage", payload: e.target.files })
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <button type='submit'>Enviar</button>
                </form>


            </div>
        </section>
    )
}



export default RegisterPet;