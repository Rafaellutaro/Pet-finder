import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import supabase from "../../../backEnd/client/SupabaseClient";
import { useUser } from "../../Interfaces/GlobalUser";
import useRedirect from "../reusable/Redirect";
import { cepSearch } from "../functions/userFunctions";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetSchema as schema } from "../../Interfaces/zodSchema";
import {catBreed, dogBreeds, ageRanges, petType} from "../../Interfaces/usefulPetInterface"

export default function RegisterPet() {
    //meu deus se eu soubesse o quanto mais de boa é usar o react-hook-form em vez de usar o reducer e criar o proprio form antes velho, que porcaria.
    // tive que alterar todos os forms, mas pelo menos agora eu consigo emplementar a validação de dados com o zod que parece muito melhor do que eu fazer sozinho.
    // por que eu não pesquisei antes meu deus, aff.
    //=================================================================================
    //VIDEO THAT I USED TO UNDERSTAND THIS: https://www.youtube.com/watch?v=cc_xmawJ8Kg
    //=================================================================================

    const { user } = useUser();
    const profileRedirect = useRedirect("Profile");

    const userAddresses = user?.addresses || [];

    const allAddress = user?.addresses || [];
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>(allAddress[0]);

    type FormFields = z.infer<typeof schema>

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<FormFields>({
        resolver: zodResolver(schema),
    });

    const type = watch("type")

    const PetBreedComponentChange = (type: string) => {
        if (!type){
            return <div>loading</div>
        }

        console.log(type)

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

    // Watch CEP for auto-fill
    const cep = watch("cep");
    useEffect(() => {
        if (cep) {
            cepSearch(setValue, cep);
        }
    }, [cep]);

    // Enable/Disable new address form
    useEffect(() => {
        if (selectedAddress == "new") {
            setIsAddingNewAddress(true);
        } else {
            setIsAddingNewAddress(false);
        }
    }, [selectedAddress]);

    useEffect(() => {
        setSelectedAddress(allAddress[0])
        console.log(selectedAddress)
    }, [user]);

    if (!user) return <div>Loading Data</div>

    // FORM SUBMIT
    const onSubmit = async (data: any) => {
        try {
            // Upload image to Supabase
            const file = data.image[0];
            const fileName = `${Date.now()}_${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from("pets")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from("pets")
                .getPublicUrl(fileName);

            const imageUrl = urlData.publicUrl;

            // Build address payload
            let addressToUse = null;

            if (isAddingNewAddress) {
                addressToUse = {
                    cep: data.cep,
                    street: data.street,
                    neighborhood: data.neighborhood,
                    city: data.city,
                    state: data.region,
                };
            } else {
                addressToUse = selectedAddress;
            }

            // Final payload
            const payload = {
                userId: user!.id,
                imageUrl,
                petData: {
                    name: data.name,
                    breed: data.breed,
                    type: data.type,
                    age: data.age,
                    details: data.details,
                },
                address: addressToUse
            };

            //Send to API
            const res = await fetch("http://localhost:3000/pets/insert", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const apiResult = await res.json();
            console.log("API result:", apiResult);

            profileRedirect();
        } catch (e) {
            console.log("Error submitting pet:", e);
        }
    };

    return (
        <section className="registerCommon-section">
            <div className="common-container">
                <form onSubmit={handleSubmit(onSubmit)}>

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
                            <select id="" {...register("type", {required: true})}>
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

                            {PetBreedComponentChange(type)}
                        </div>

                        <div className="form-group">
                            <label>Idade Aproximada:</label>
                            <select  id="petAge" {...register("age", {required: true})}>
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

                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Enviando..." : "Enviar"}
                    </button>
                </form>
            </div>
        </section>
    );
}
