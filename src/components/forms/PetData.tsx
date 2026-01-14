import type { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormWatch } from "react-hook-form";
import { useUser } from "../../Interfaces/GlobalUser";
import type { FormFields } from "../../Interfaces/zodSchema";
import { catBreed, dogBreeds, ageRanges, petType } from "../../Interfaces/usefulPetInterface"
import { useEffect } from "react";

type petDataForm = {
    register: UseFormRegister<FormFields>;
    errors: FieldErrors<FormFields>;
    watch: UseFormWatch<FormFields>;
    handleSubmit: UseFormHandleSubmit<FormFields>;
    onContinue: () => void;
    isSubmitting: boolean;
    setSelectedAddress: React.Dispatch<any>
    setIsAddingNewAddress: React.Dispatch<React.SetStateAction<boolean>>
    allAddress: any[]
    selectedAddress: any
    isAddingNewAddress: boolean

}

const PetBreedComponentChange = (type: string, register: UseFormRegister<FormFields>) => {
        if (!type) {
            return <div>loading</div>
        }

        switch (type) {
            case "Cachorro":
                return (
                    <select id="petBreed" {...register("breed", { required: true })}>
                        <option value={JSON.stringify('undefined')}>escolha a raça do pet</option>
                        {dogBreeds.map((pet, i) => (
                            <option key={i} value={pet.name}>
                                {pet.name}
                            </option>
                        ))}
                    </select>
                )
            case "Gato":
                return (
                    <select id="petBreed" {...register("breed", { required: true })}>
                        <option value={JSON.stringify('undefined')}>escolha a raça do pet</option>
                        {catBreed.map((pet, i) => (
                            <option key={i} value={pet.name}>
                                {pet.name}
                            </option>
                        ))}
                    </select>
                )
            default:
                return <div>Selecione um tipo primeiro</div>
        }
    }

export default function PetData({register, errors, watch, handleSubmit, onContinue, isSubmitting, allAddress, setSelectedAddress, setIsAddingNewAddress, selectedAddress, isAddingNewAddress}: petDataForm) {
    const { user } = useUser();
    const type: any = watch("type")
    const userAddresses = user?.addresses || [];

    useEffect(() => {
        setSelectedAddress(allAddress[0])
    }, [user]);

    // Enable/Disable new address form
    useEffect(() => {
        if (selectedAddress == "new") {
            setIsAddingNewAddress(true);
        } else {
            setIsAddingNewAddress(false);
        }
    }, [selectedAddress]);

    return (
        <section className="registerPet-section">
            <div className="Pet-container">
                <form onSubmit={handleSubmit(onContinue)}>

                    <h1>Dados do Pet</h1>

                    {/* PET FIELDS */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nome:</label>
                            <input {...register("name", { required: true })} placeholder="Nome" />
                            {errors.name && <p className="error">{errors.name.message}</p>}
                        </div>

                        <div className="form-group">
                            <label>Tipo:</label>
                            <select id="" {...register("type", { required: true })}>
                                <option value={JSON.stringify('undefined')}>escolhar o tipo do pet</option>
                                {petType.map((type, i) => (
                                    <option key={i} value={type.type}>
                                        {type.type}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Raça:</label>

                            {PetBreedComponentChange(type, register)}
                        </div>

                        <div className="form-group">
                            <label>Idade Aproximada:</label>
                            <select id="petAge" {...register("age", { required: true })}>
                                <option value={JSON.stringify('undefined')}>escolhar a idade aproximada</option>
                                {ageRanges.map((age, i) => (
                                    <option key={i} value={JSON.stringify(age.age)}>
                                        {age.age}
                                    </option>
                                ))}
                                <option value={JSON.stringify("20+")}>acima dos 20</option>
                            </select>

                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label >Gênero: </label>
                            <select id="petGender" {...register("gender", { required: true })}>
                                <option value={JSON.stringify('undefined')}>escolha o gênero</option>
                                <option value="male">Macho</option>
                                <option value="female">Femea</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label >Onde vive: </label>
                            <select id="petWayOfLiving" {...register("wayOfLife", { required: true })}>
                                <option value={JSON.stringify('undefined')}>escolha onde vive</option>
                                <option value="indoors">Dentro de casa</option>
                                <option value="outdoors">Fora de casa</option>
                                <option value="both">Ambos</option>
                            </select>
                        </div>
                    </div>
                    {/* 
                        adulteros é de fuder kskskskksksksksksk, vou manter, gostei.
                    */}
                    <div className="form-row">
                        <div className="form-group full">
                            <label>Detalhes:</label>
                            <textarea {...register("details", { required: true })} rows={6} placeholder="comportamento, se é amigavel com crianças, audulteros etc...." />
                            {errors.details && <p className="error">{errors.details.message}</p>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Imagem:</label>
                            <input type="file" accept="image/*" {...register("image", { required: true })} />
                            {errors.image && <p className="error">{errors.image.message}</p>}
                        </div>
                    </div>

                    {/* ADDRESS SELECT */}
                    <h2>Endereço do Pet</h2>

                    <div className="form-row">
                        <div className="form-group full">
                            <label>Usar endereço existente:</label>

                            <select
                                defaultValue={JSON.stringify(allAddress[0])}
                                onChange={(e) => {
                                    if (e.target.value == "new") {
                                        setSelectedAddress(e.target.value)
                                    } else {
                                        setSelectedAddress(JSON.parse(e.target.value))
                                    }
                                }}
                            >
                                {userAddresses.map((addr: any, i: number) => (
                                    <option key={i} value={JSON.stringify(addr)}>
                                        {`${addr.street}, ${addr.city} - ${addr.state}`}
                                    </option>
                                ))}

                                <option value="new">+ Cadastrar novo endereço</option>
                            </select>
                        </div>
                    </div>

                    {/* NEW ADDRESS FIELDS */}
                    {isAddingNewAddress && (
                        <div className="new-address-form">
                            <h3>Novo Endereço</h3>

                            <input
                                maxLength={8}
                                placeholder="CEP"
                                {...register("cep")}
                            />

                            <input placeholder="Rua" readOnly {...register("street")} />
                            <input placeholder="Bairro" readOnly {...register("neighborhood")} />
                            <input placeholder="Cidade" readOnly {...register("city")} />
                            <input placeholder="Estado" readOnly {...register("region")} />

                            {errors.cep && <p className="error">{errors.cep.message}</p>}
                        </div>
                    )}

                    <button className="registerPetBtn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Avançando..." : "Avançar"}
                    </button>
                </form>
            </div>
        </section>
    )
}